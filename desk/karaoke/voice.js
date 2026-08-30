(function () {
  "use strict";

  var RANGE_KEY = "desk-voice-range-v1";
  var SCORE_KEY = "desk-voice-scores-v1";
  var NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  var GREEN = 25;
  var YELLOW = 55;
  var HOLD_HIT = 0.6;
  var DEFAULT_LO = 45; /* A2 — comfortable low for many men */
  var DEFAULT_HI = 64; /* E4 */
  var DEMO = /(?:\?|&)demo=1(?:&|$)/.test(location.search) || location.hash === "#demo";

  var state = {
    mode: "hub",
    running: false,
    stream: null,
    ctx: null,
    analyser: null,
    source: null,
    buf: null,
    last: { freq: null, midi: null, cents: 0, rms: 0, voiced: false },
    targetMidi: 60,
    trail: [],
    raf: 0,
    song: null,
    songNotes: [],
    songT0: 0,
    demoFreq: 0,
    wantWarmup: false,
    inWarmup: false
  };

  var scores = loadScores();
  var range = loadRange();

  function $(id) { return document.getElementById(id); }
  function show(id) {
    ["hub", "play", "pick", "result"].forEach(function (p) {
      $(p).classList.toggle("on", p === id);
    });
    window.scrollTo(0, 0);
  }
  function midiToHz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function hzToMidi(f) { return 69 + 12 * Math.log2(f / 440); }
  function midiName(m) {
    if (m == null || !isFinite(m)) return "—";
    var r = Math.round(m);
    return NAMES[((r % 12) + 12) % 12] + (Math.floor(r / 12) - 1);
  }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function now() { return (state.ctx && state.ctx.currentTime) || 0; }

  function loadRange() {
    try {
      var r = JSON.parse(localStorage.getItem(RANGE_KEY) || "null");
      if (r && isFinite(r.min) && isFinite(r.max) && r.max - r.min >= 3) return r;
    } catch (e) {}
    return null;
  }
  function saveRange(r) {
    range = r;
    localStorage.setItem(RANGE_KEY, JSON.stringify(r));
    paintHub();
  }
  function loadScores() {
    try {
      var s = JSON.parse(localStorage.getItem(SCORE_KEY) || "{}");
      return {
        hitStreak: s.hitStreak || 0,
        holdBest: s.holdBest || 0,
        challenge: s.challenge || 0,
        karaokeBest: s.karaokeBest || 0,
        karaokeSong: s.karaokeSong || ""
      };
    } catch (e) {
      return { hitStreak: 0, holdBest: 0, challenge: 0, karaokeBest: 0, karaokeSong: "" };
    }
  }
  function saveScores() {
    localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
    paintHub();
  }
  function lo() { return range ? range.min : DEFAULT_LO; }
  function hi() { return range ? range.max : DEFAULT_HI; }
  function inRangeNotes() {
    var a = Math.ceil(lo());
    var b = Math.floor(hi());
    var out = [];
    for (var i = a; i <= b; i++) out.push(i);
    return out.length ? out : [57, 60, 62, 64];
  }
  function randomInRange() {
    var notes = inRangeNotes();
    return notes[Math.floor(Math.random() * notes.length)];
  }
  function transposeToRange(notes) {
    var min = Infinity, max = -Infinity, i;
    for (i = 0; i < notes.length; i++) {
      if (notes[i].midi < min) min = notes[i].midi;
      if (notes[i].midi > max) max = notes[i].midi;
    }
    var span = max - min;
    var room = hi() - lo();
    var shift = 0;
    if (span <= room) {
      var mid = (min + max) / 2;
      var want = (lo() + hi()) / 2;
      shift = Math.round(want - mid);
      if (min + shift < lo()) shift = Math.round(lo() - min);
      if (max + shift > hi()) shift = Math.round(hi() - max);
    } else {
      shift = Math.round(lo() - min);
    }
    return notes.map(function (n) {
      return { midi: n.midi + shift, beats: n.beats, lyric: n.lyric };
    });
  }

  function paintHub() {
    $("hubRange").textContent = range
      ? midiName(range.min) + " to " + midiName(range.max)
      : "not set — tap Range finder";
    $("hubHit").textContent = String(scores.hitStreak);
    $("hubHold").textContent = (scores.holdBest || 0).toFixed(1) + "s";
    $("hubChallenge").textContent = String(scores.challenge);
    $("hubKaraoke").textContent = scores.karaokeBest
      ? scores.karaokeBest + " · " + (scores.karaokeSong || "song")
      : "—";
  }

  /* ---- pitch ---- */
  function detectPitch(buf, sampleRate) {
    var SIZE = buf.length;
    var rms = 0;
    var i;
    for (i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.012) return { freq: null, rms: rms };

    var minP = Math.floor(sampleRate / 900);
    var maxP = Math.floor(sampleRate / 70);
    var half = Math.floor(SIZE / 2);
    if (maxP > half) maxP = half;
    var bestOff = -1;
    var bestCorr = 0;
    var last = 1;
    var found = false;
    var prev = 0, cur = 0, next = 0;

    for (var off = minP; off < maxP; off++) {
      var corr = 0;
      for (i = 0; i < half; i++) corr += Math.abs(buf[i] - buf[i + off]);
      corr = 1 - corr / half;
      if (corr > 0.88 && corr > last) {
        found = true;
        if (corr > bestCorr) {
          bestCorr = corr;
          bestOff = off;
          prev = last;
          cur = corr;
        }
      } else if (found) {
        next = corr;
        break;
      }
      last = corr;
    }
    if (bestOff < 1 || bestCorr < 0.01) return { freq: null, rms: rms };
    var shift = 0;
    var den = 2 * cur - prev - next;
    if (den) shift = (next - prev) / den;
    var freq = sampleRate / (bestOff + shift);
    if (freq < 70 || freq > 1100) return { freq: null, rms: rms };
    return { freq: freq, rms: rms };
  }

  function centsVs(midi, target) {
    if (midi == null || target == null) return 0;
    var nearest = target;
    var d = midi - target;
    while (d > 6) { nearest += 12; d = midi - nearest; }
    while (d < -6) { nearest -= 12; d = midi - nearest; }
    return (midi - nearest) * 100;
  }

  function zone(cents) {
    var a = Math.abs(cents);
    if (a <= GREEN) return "ok";
    if (a <= YELLOW) return "near";
    return cents < 0 ? "low" : "high";
  }

  /* ---- audio ---- */
  function audioCtx() {
    if (state.ctx && state.ctx.state !== "closed") return state.ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    state.ctx = new AC();
    return state.ctx;
  }

  function beep(midi, dur, gain) {
    var ctx = audioCtx();
    var t = ctx.currentTime;
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = midiToHz(midi);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain || 0.22, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.45));
    o.connect(g); g.connect(ctx.destination);
    o.start(t);
    o.stop(t + (dur || 0.45) + 0.02);
  }

  function padNote(midi, start, dur, gain) {
    var ctx = audioCtx();
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = "triangle";
    o.frequency.value = midiToHz(midi);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(gain || 0.12, start + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(start);
    o.stop(start + dur + 0.02);
  }

  function playBacking(notes, bpm) {
    var ctx = audioCtx();
    var beat = 60 / bpm;
    var t = ctx.currentTime + 0.12;
    notes.forEach(function (n) {
      var dur = n.beats * beat;
      padNote(n.midi, t, Math.max(0.12, dur * 0.92), 0.11);
      padNote(n.midi - 12, t, Math.max(0.12, dur * 0.92), 0.05);
      t += dur;
    });
  }

  async function startMic() {
    $("playWarn").hidden = true;
    $("micWarn").hidden = true;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      failMic("This browser cannot open the microphone.");
      return false;
    }
    try {
      var ctx = audioCtx();
      if (ctx.state === "suspended") await ctx.resume();
      if (!state.stream) {
        state.stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            channelCount: 1
          }
        });
      }
      if (state.source) {
        try { state.source.disconnect(); } catch (e) {}
      }
      state.source = ctx.createMediaStreamSource(state.stream);
      state.analyser = ctx.createAnalyser();
      state.analyser.fftSize = 2048;
      state.analyser.smoothingTimeConstant = 0;
      state.source.connect(state.analyser);
      state.buf = new Float32Array(state.analyser.fftSize);
      return true;
    } catch (err) {
      var name = (err && err.name) || "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        failMic("Microphone permission was denied. On iPhone: Settings → Safari → Microphone, then reload this page and tap Start again.");
      } else if (name === "NotFoundError") {
        failMic("No microphone was found on this device.");
      } else {
        failMic("Could not open the microphone. " + (err && err.message ? err.message : "Try Safari, then tap Start."));
      }
      return false;
    }
  }

  function failMic(msg) {
    var w = $("playWarn");
    w.hidden = false;
    w.textContent = msg;
    var h = $("micWarn");
    h.hidden = false;
    h.textContent = msg;
    setCue("quiet", "Mic is off");
  }

  function stopMicKeep() { /* keep stream for next Start on same visit */ }

  function closeMic() {
    if (state.stream) {
      state.stream.getTracks().forEach(function (t) { t.stop(); });
      state.stream = null;
    }
    if (state.source) {
      try { state.source.disconnect(); } catch (e) {}
      state.source = null;
    }
    state.analyser = null;
  }

  function sampleVoice() {
    if (DEMO && state.running && state.targetMidi != null) {
      var wobble = (Math.sin(performance.now() / 180) * 8);
      var freq = midiToHz(state.targetMidi) * Math.pow(2, wobble / 1200);
      if (state.demoFreq) freq = state.demoFreq;
      var midi = hzToMidi(freq);
      state.last = {
        freq: freq,
        midi: midi,
        cents: centsVs(midi, state.targetMidi),
        rms: 0.08,
        voiced: true
      };
      return state.last;
    }
    if (!state.analyser) {
      state.last = { freq: null, midi: null, cents: 0, rms: 0, voiced: false };
      return state.last;
    }
    state.analyser.getFloatTimeDomainData(state.buf);
    var p = detectPitch(state.buf, audioCtx().sampleRate);
    var midi = p.freq ? hzToMidi(p.freq) : null;
    state.last = {
      freq: p.freq,
      midi: midi,
      cents: p.freq ? centsVs(midi, state.targetMidi) : 0,
      rms: p.rms,
      voiced: !!p.freq
    };
    return state.last;
  }

  /* ---- highway ---- */
  var trail = [];
  function drawHighway() {
    var c = $("highway");
    var ctx = c.getContext("2d");
    var w = c.width, h = c.height;
    ctx.fillStyle = "#0a1220";
    ctx.fillRect(0, 0, w, h);

    var mid = h / 2;
    ctx.fillStyle = "rgba(47,158,90,0.22)";
    ctx.fillRect(0, mid - (GREEN / 120) * (h / 2), w, (GREEN / 60) * h / 2);
    ctx.fillStyle = "rgba(212,160,23,0.12)";
    ctx.fillRect(0, mid - (YELLOW / 120) * (h / 2), w, (YELLOW / 60) * h / 2);

    ctx.strokeStyle = "#e8c37a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, mid);
    ctx.lineTo(w, mid);
    ctx.stroke();

    trail.push(state.last.voiced ? state.last.cents : null);
    if (trail.length > 90) trail.shift();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#fff8ee";
    ctx.beginPath();
    var started = false;
    for (var i = 0; i < trail.length; i++) {
      var cents = trail[i];
      if (cents == null) { started = false; continue; }
      var x = (i / 90) * w;
      var y = mid - clamp(cents, -120, 120) / 120 * (h / 2);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    if (state.last.voiced) {
      var zx = w - 28;
      var zy = mid - clamp(state.last.cents, -120, 120) / 120 * (h / 2);
      var z = zone(state.last.cents);
      ctx.fillStyle = z === "ok" ? "#2f9e5a" : z === "near" ? "#d4a017" : "#c81e1e";
      ctx.beginPath();
      ctx.arc(zx, zy, 11, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function setCue(kind, text) {
    var el = $("cue");
    el.className = "cue " + kind;
    el.textContent = text;
  }
  function paintVoice() {
    var v = state.last;
    $("targetName").textContent = midiName(state.targetMidi);
    $("youName").textContent = v.voiced ? midiName(v.midi) : "—";
    $("youName").style.color = !v.voiced ? "#cbbfa6"
      : zone(v.cents) === "ok" ? "#b8f0c8"
      : zone(v.cents) === "near" ? "#ffe08a"
      : "#ffb0a8";
    if (!state.running) return;
    if (!v.voiced) setCue("quiet", "I cannot hear a pitch yet. Hum a little clearer.");
    else if (zone(v.cents) === "ok") setCue("ok", "Got it");
    else if (v.cents < 0) setCue("low", "A little higher");
    else setCue("high", "A little lower");
  }

  /* ---- modes ---- */
  var session = {};

  function resetSession() {
    session = {
      streak: 0,
      bestStreak: 0,
      hold: 0,
      holdBest: 0,
      holdNeed: 2,
      greenFor: 0,
      lastT: 0,
      hits: 0,
      tries: 0,
      combo: 1,
      score: 0,
      accSum: 0,
      accN: 0,
      bestNote: null,
      bestNoteCents: 999,
      tasksLeft: 10,
      deadline: 0,
      warmup: false,
      rangePhase: "low",
      lows: [],
      highs: [],
      songIdx: 0,
      noteScores: []
    };
    trail = [];
  }

  function setStats(left, right) {
    $("statLeft").innerHTML = left;
    $("statRight").innerHTML = right;
  }

  function openPlay(mode, title, help, tag) {
    state.mode = mode;
    $("playTitle").textContent = title;
    $("playHelp").textContent = help;
    $("playTag").textContent = tag;
    $("startBtn").classList.remove("hidden");
    $("stopBtn").classList.add("hidden");
    $("holdBarWrap").hidden = mode !== "hold" && mode !== "challenge" && mode !== "range";
    $("lyricBox").hidden = mode !== "karaoke";
    $("challengeOpts").hidden = mode !== "challenge";
    $("holdBar").style.width = "0%";
    setCue("idle", "Tap Start. Safari will ask for the mic.");
    $("targetName").textContent = "—";
    $("youName").textContent = "—";
    show("play");
  }

  function stopRun() {
    state.running = false;
    if (state.raf) cancelAnimationFrame(state.raf);
    state.raf = 0;
    $("startBtn").classList.remove("hidden");
    $("stopBtn").classList.add("hidden");
    stopMicKeep();
  }

  function finish(kind, score, extra, isBest) {
    stopRun();
    $("resultTag").textContent = kind;
    $("resultTitle").textContent = extra.title || "Score";
    $("resultScore").textContent = extra.big != null ? extra.big : String(score);
    $("newBest").classList.toggle("hidden", !isBest);
    $("resultBox").innerHTML = extra.html || "";
    show("result");
  }

  async function begin() {
    resetSession();
    var ok = await startMic();
    if (!ok && !DEMO) return;
    state.running = true;
    $("startBtn").classList.add("hidden");
    $("stopBtn").classList.remove("hidden");
    session.lastT = performance.now();
    if (state.mode === "hit") beginHit();
    else if (state.mode === "hold") beginHold();
    else if (state.mode === "challenge") beginChallenge(state.wantWarmup);
    else if (state.mode === "range") beginRange();
    else if (state.mode === "karaoke") beginKaraoke();
    loop();
  }

  function loop() {
    if (!state.running) return;
    sampleVoice();
    paintVoice();
    drawHighway();
    var t = performance.now();
    var dt = Math.min(0.08, (t - session.lastT) / 1000);
    session.lastT = t;
    if (state.mode === "hit") tickHit(dt);
    else if (state.mode === "hold") tickHold(dt);
    else if (state.mode === "challenge") tickChallenge(dt);
    else if (state.mode === "range") tickRange(dt);
    else if (state.mode === "karaoke") tickKaraoke(dt);
    state.raf = requestAnimationFrame(loop);
  }

  /* Hit the note */
  function beginHit() {
    nextHitNote(true);
  }
  function nextHitNote(first) {
    session.greenFor = 0;
    state.targetMidi = first && range ? Math.round((lo() + hi()) / 2) : randomInRange();
    beep(state.targetMidi, 0.42, 0.24);
    setTimeout(function () { /* silence so they can hear themselves */ }, 450);
    setStats("Streak <b>" + session.streak + "</b>", "Best <b>" + Math.max(session.bestStreak, scores.hitStreak) + "</b>");
  }
  function tickHit(dt) {
    var v = state.last;
    if (v.voiced && zone(v.cents) === "ok") session.greenFor += dt;
    else session.greenFor = 0;
    $("holdBarWrap").hidden = false;
    $("holdBar").style.width = Math.min(100, (session.greenFor / HOLD_HIT) * 100) + "%";
    if (session.greenFor >= HOLD_HIT) {
      session.streak += 1;
      session.bestStreak = Math.max(session.bestStreak, session.streak);
      if (session.streak > scores.hitStreak) {
        scores.hitStreak = session.streak;
        saveScores();
      }
      nextHitNote(false);
    }
  }

  /* Hold it */
  function beginHold() {
    session.holdNeed = 2;
    session.hold = 0;
    session.holdBest = 0;
    session.jumpAfter = false;
    state.targetMidi = randomInRange();
    beep(state.targetMidi, 0.4, 0.22);
    setStats("Hold <b>0.0s</b>", "Need <b>" + session.holdNeed.toFixed(0) + "s</b>");
  }
  function tickHold(dt) {
    var v = state.last;
    if (v.voiced && zone(v.cents) === "ok") session.hold += dt;
    else if (v.voiced && zone(v.cents) === "near") session.hold += dt * 0.15;
    else session.hold = Math.max(0, session.hold - dt * 0.35);
    session.holdBest = Math.max(session.holdBest, session.hold);
    $("holdBar").style.width = Math.min(100, (session.hold / session.holdNeed) * 100) + "%";
    setStats("Hold <b>" + session.hold.toFixed(1) + "s</b>", "Best <b>" + session.holdBest.toFixed(1) + "s</b>");
    if (session.hold >= session.holdNeed) {
      if (session.holdBest > scores.holdBest) {
        scores.holdBest = Math.round(session.holdBest * 10) / 10;
        saveScores();
      }
      session.hold = 0;
      if (!session.jumpAfter && session.holdNeed >= 3) {
        session.jumpAfter = true;
        var jump = Math.random() < 0.5 ? 4 : 7;
        var next = clamp(state.targetMidi + (Math.random() < 0.5 ? -jump : jump), lo(), hi());
        state.targetMidi = next;
        session.holdNeed = 2;
        beep(state.targetMidi, 0.4, 0.22);
      } else {
        session.jumpAfter = false;
        session.holdNeed = Math.min(6, session.holdNeed + 1);
        state.targetMidi = randomInRange();
        beep(state.targetMidi, 0.4, 0.22);
      }
    }
  }

  /* Challenge */
  var challengeTask = { kind: "match", need: HOLD_HIT };
  function beginChallenge(withWarmup) {
    state.inWarmup = !!withWarmup;
    state.wantWarmup = false;
    session.deadline = performance.now() + 30000;
    session.tasksLeft = state.inWarmup ? 99 : 10;
    session.combo = 1;
    session.score = 0;
    session.hits = 0;
    session.tries = 0;
    if (state.inWarmup) {
      $("playTitle").textContent = "Warm-up";
      $("playHelp").textContent = "Easy matching. Challenge starts when the 30 seconds are up.";
    }
    nextChallengeTask();
  }
  function nextChallengeTask() {
    if (!state.inWarmup && session.tasksLeft <= 0) {
      endChallenge();
      return;
    }
    if (performance.now() >= session.deadline) {
      if (state.inWarmup) {
        state.inWarmup = false;
        session.deadline = performance.now() + 30000;
        session.tasksLeft = 10;
        session.combo = 1;
        session.score = 0;
        session.hits = 0;
        session.tries = 0;
        $("playTitle").textContent = "Challenge";
        $("playHelp").textContent = "Thirty seconds. Mix of match and short holds. Combos multiply the score.";
        setCue("ok", "Warm-up done. Challenge now.");
      } else {
        endChallenge();
        return;
      }
    }
    session.tasksLeft -= 1;
    session.tries += 1;
    session.greenFor = 0;
    session.hold = 0;
    var match = state.inWarmup || Math.random() < 0.55;
    challengeTask = match
      ? { kind: "match", need: state.inWarmup ? 0.5 : HOLD_HIT }
      : { kind: "hold", need: state.inWarmup ? 1.0 : 1.3 };
    state.targetMidi = randomInRange();
    beep(state.targetMidi, 0.38, 0.22);
    updateChallengeStats();
  }
  function updateChallengeStats() {
    var left = Math.max(0, (session.deadline - performance.now()) / 1000);
    setStats(
      (challengeTask.kind === "hold" ? "Hold it" : "Match") + " · combo <b>x" + session.combo + "</b>",
      left.toFixed(0) + "s · <b>" + session.score + "</b>"
    );
  }
  function tickChallenge(dt) {
    if (performance.now() >= session.deadline) { endChallenge(); return; }
    var v = state.last;
    var inGreen = v.voiced && zone(v.cents) === "ok";
    if (v.voiced) {
      session.accN += 1;
      session.accSum += Math.abs(v.cents);
      if (Math.abs(v.cents) < session.bestNoteCents) {
        session.bestNoteCents = Math.abs(v.cents);
        session.bestNote = midiName(state.targetMidi);
      }
    }
    if (challengeTask.kind === "match") {
      session.greenFor = inGreen ? session.greenFor + dt : 0;
      $("holdBar").style.width = Math.min(100, (session.greenFor / challengeTask.need) * 100) + "%";
      if (session.greenFor >= challengeTask.need) succeedChallenge(100);
    } else {
      if (inGreen) session.hold += dt;
      else session.hold = Math.max(0, session.hold - dt * 0.4);
      $("holdBar").style.width = Math.min(100, (session.hold / challengeTask.need) * 100) + "%";
      if (session.hold >= challengeTask.need) succeedChallenge(150);
    }
    updateChallengeStats();
  }
  function succeedChallenge(base) {
    session.hits += 1;
    session.score += Math.round(base * session.combo);
    session.combo = Math.min(5, session.combo + 1);
    nextChallengeTask();
  }
  function endChallenge() {
    if (!state.running) return;
    var acc = session.accN ? Math.max(0, 100 - session.accSum / session.accN * 0.55) : 0;
    acc = Math.round(clamp(acc, 0, 100));
    var best = session.score > scores.challenge;
    if (best) {
      scores.challenge = session.score;
      saveScores();
    }
    finish("Challenge", session.score, {
      title: "Challenge",
      big: session.score,
      html: "<p>Accuracy about <b>" + acc + "%</b></p>" +
        "<p>Hits <b>" + session.hits + "</b> of " + session.tries + "</p>" +
        "<p>Best note <b>" + (session.bestNote || "—") + "</b></p>" +
        "<p>Combo peaked at <b>x" + session.combo + "</b></p>"
    }, best);
  }

  /* Range */
  function beginRange() {
    session.rangePhase = "low";
    session.lows = [];
    session.highs = [];
    session.phaseT = 0;
    state.targetMidi = 50;
    beep(50, 0.35, 0.16);
    setCue("idle", "Hum your lowest comfortable note.");
    setStats("Low note", "Keep humming");
    $("holdBar").style.width = "0%";
  }
  function tickRange(dt) {
    session.phaseT += dt;
    var v = state.last;
    if (v.voiced) {
      if (session.rangePhase === "low") session.lows.push(v.midi);
      else session.highs.push(v.midi);
    }
    var need = 3.2;
    $("holdBar").style.width = Math.min(100, (session.phaseT / need) * 100) + "%";
    if (session.rangePhase === "low" && session.phaseT >= need) {
      session.rangePhase = "high";
      session.phaseT = 0;
      state.targetMidi = 64;
      beep(64, 0.35, 0.16);
      setCue("high", "Now your highest comfortable note.");
      setStats("High note", "Keep humming");
    } else if (session.rangePhase === "high" && session.phaseT >= need) {
      var loN = percentile(session.lows, 0.15);
      var hiN = percentile(session.highs, 0.85);
      if (loN == null || hiN == null || hiN - loN < 3) {
        failMic("I did not catch a clear low and high. Try again in a quieter room.");
        stopRun();
        return;
      }
      if (hiN < loN) { var tmp = loN; loN = hiN; hiN = tmp; }
      loN = Math.round(loN);
      hiN = Math.round(hiN);
      saveRange({ min: loN, max: hiN, at: Date.now() });
      finish("Range", 0, {
        title: "Your range",
        big: midiName(loN) + "–" + midiName(hiN),
        html: "<p>Saved on this phone. Hit the note and karaoke will stay in this window.</p>"
      }, false);
    }
  }
  function percentile(arr, p) {
    if (!arr.length) return null;
    var a = arr.slice().sort(function (x, y) { return x - y; });
    return a[Math.floor((a.length - 1) * p)];
  }

  /* Karaoke */
  function beginKaraoke() {
    var raw = state.song.notes;
    state.songNotes = transposeToRange(raw);
    state.songT0 = performance.now() + 250;
    session.songIdx = 0;
    session.noteScores = [];
    session.noteSamples = [];
    state.targetMidi = state.songNotes[0].midi;
    playBacking(state.songNotes, state.song.bpm);
    $("lyricBox").hidden = false;
    updateLyric(0);
  }
  function songElapsed() {
    return (performance.now() - state.songT0) / 1000;
  }
  function noteWindows() {
    var beat = 60 / state.song.bpm;
    var t = 0;
    return state.songNotes.map(function (n) {
      var w = { midi: n.midi, lyric: n.lyric, start: t, end: t + n.beats * beat };
      t = w.end;
      return w;
    });
  }
  function updateLyric(i) {
    var notes = state.songNotes;
    var cur = [];
    var j = i;
    while (j < notes.length && cur.length < 4) {
      if (notes[j].lyric) cur.push(notes[j].lyric);
      j++;
    }
    $("lyricNow").textContent = cur.join(" ") || "Hmm";
    var nxt = [];
    while (j < notes.length && nxt.length < 4) {
      if (notes[j].lyric) nxt.push(notes[j].lyric);
      j++;
    }
    $("lyricNext").textContent = nxt.length ? "Next: " + nxt.join(" ") : "";
  }
  function tickKaraoke(dt) {
    var wins = noteWindows();
    var t = songElapsed();
    var idx = wins.length - 1;
    var i;
    for (i = 0; i < wins.length; i++) {
      if (t >= wins[i].start && t < wins[i].end) { idx = i; break; }
      if (t < wins[i].start) { idx = Math.max(0, i - 1); break; }
    }
    if (t >= wins[wins.length - 1].end + 0.35) {
      endKaraoke();
      return;
    }
    if (idx !== session.songIdx) {
      flushNoteScore(session.songIdx, session.noteSamples);
      session.noteSamples = [];
      session.songIdx = idx;
      updateLyric(idx);
    }
    var w = wins[idx];
    state.targetMidi = w.midi;
    var v = state.last;
    if (v.voiced) session.noteSamples.push(Math.abs(v.cents));
    else session.noteSamples.push(null);
    var live = liveKaraokeScore();
    setStats("Score <b>" + live + "</b>", (idx + 1) + " / " + wins.length);
  }
  function flushNoteScore(idx, samples) {
    var voiced = samples.filter(function (x) { return x != null; });
    var pts;
    if (!voiced.length) pts = 55; /* rest / breath — do not nuke the score */
    else {
      var avg = voiced.reduce(function (a, b) { return a + b; }, 0) / voiced.length;
      pts = clamp(100 - Math.max(0, avg - 18) * 0.72, 0, 100);
    }
    session.noteScores[idx] = pts;
  }
  function liveKaraokeScore() {
    var arr = session.noteScores.filter(function (x) { return x != null; });
    if (!arr.length) return 0;
    return Math.round(arr.reduce(function (a, b) { return a + b; }, 0) / arr.length);
  }
  function endKaraoke() {
    if (!state.running) return;
    flushNoteScore(session.songIdx, session.noteSamples);
    var score = liveKaraokeScore();
    var best = score > (scores.karaokeBest || 0);
    if (best) {
      scores.karaokeBest = score;
      scores.karaokeSong = state.song.title;
      saveScores();
    }
    finish("Karaoke", score, {
      title: state.song.title,
      big: score,
      html: "<p>" + state.song.credit + "</p>" +
        "<p>Pitch vs the melody, 0–100. A little generous on purpose.</p>"
    }, best);
  }

  /* ---- nav ---- */
  function goHub() {
    stopRun();
    state.mode = "hub";
    show("hub");
    paintHub();
  }

  document.querySelectorAll(".mode").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var go = btn.getAttribute("data-go");
      if (go === "karaoke") {
        renderSongs();
        show("pick");
        return;
      }
      if (go === "range") {
        openPlay("range", "Range finder", "Hum low for a few seconds, then high. We store only min and max on this phone.", "First run");
        return;
      }
      if (go === "hit") {
        openPlay("hit", "Hit the note", "A short beep, then silence. Hold the green about half a second.", "Pitch match");
        return;
      }
      if (go === "hold") {
        openPlay("hold", "Hold it", "The bar fills only while you are in tune. Then a longer hold, then a jump.", "Sustain");
        return;
      }
      if (go === "challenge") {
        state.wantWarmup = false;
        openPlay("challenge", "Challenge", "Thirty seconds. Mix of match and short holds. Combos multiply the score.", "Round");
      }
    });
  });

  $("startBtn").addEventListener("click", begin);
  $("stopBtn").addEventListener("click", function () {
    if (state.mode === "challenge") endChallenge();
    else if (state.mode === "karaoke") endKaraoke();
    else if (state.mode === "hold") {
      var best = session.holdBest > scores.holdBest;
      if (best) { scores.holdBest = Math.round(session.holdBest * 10) / 10; saveScores(); }
      finish("Hold it", session.holdBest, {
        title: "Longest clean hold",
        big: session.holdBest.toFixed(1) + "s",
        html: "<p>All-time on this phone: <b>" + scores.holdBest.toFixed(1) + "s</b></p>"
      }, best);
    } else if (state.mode === "hit") {
      var hb = session.bestStreak > 0 && session.bestStreak >= scores.hitStreak;
      finish("Hit the note", session.bestStreak, {
        title: "Streak",
        big: session.bestStreak,
        html: "<p>Best on this phone: <b>" + scores.hitStreak + "</b></p>"
      }, hb);
    } else {
      goHub();
    }
  });
  $("backBtn").addEventListener("click", goHub);
  $("pickBack").addEventListener("click", goHub);
  $("resultHub").addEventListener("click", goHub);
  $("againBtn").addEventListener("click", function () {
    if (state.mode === "karaoke") {
      openPlay("karaoke", state.song.title, state.song.credit, "Karaoke");
      return;
    }
    if (state.mode === "range") {
      openPlay("range", "Range finder", "Hum low, then high.", "First run");
      return;
    }
    openPlay(state.mode, $("playTitle").textContent, $("playHelp").textContent, $("playTag").textContent);
  });
  $("warmBtn").addEventListener("click", function () {
    state.wantWarmup = true;
    $("playHelp").textContent = "Warm-up is on. Start for 30 seconds of easy matching, then the scored challenge.";
    $("warmBtn").textContent = "Warm-up armed";
  });

  function renderSongs() {
    var box = $("songList");
    box.innerHTML = "";
    (window.VOICE_SONGS || []).forEach(function (s) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "song";
      b.innerHTML = "<h3></h3><p></p>";
      b.querySelector("h3").textContent = s.title;
      b.querySelector("p").textContent = s.credit;
      b.addEventListener("click", function () {
        state.song = s;
        openPlay("karaoke", s.title, s.credit, "Karaoke");
      });
      box.appendChild(b);
    });
  }

  if (!range) {
    $("micWarn").hidden = false;
    $("micWarn").textContent = "First time here? Tap Range finder so we do not ask for notes you cannot hit. You can skip it — we will use a middle singing range.";
  }
  paintHub();
  if (DEMO) {
    $("micWarn").hidden = false;
    $("micWarn").textContent = "Demo singer is on (this page was opened with ?demo=1). It pretends to sing in tune so you can see scoring without a mic.";
  }

  window.addEventListener("pagehide", function () {
    if (state.ctx && state.ctx.state !== "closed") {
      /* keep — iOS may suspend */
    }
  });
})();
