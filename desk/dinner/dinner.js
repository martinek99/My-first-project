"use strict";
(function () {
  var NICE = {
    "United States of America": "United States",
    "Dem. Rep. Congo": "Democratic Republic of the Congo",
    "Dominican Rep.": "Dominican Republic",
    "Bosnia and Herz.": "Bosnia and Herzegovina",
    "Central African Rep.": "Central African Republic",
    "Eq. Guinea": "Equatorial Guinea",
    "S. Sudan": "South Sudan",
    "Solomon Is.": "Solomon Islands",
    "Falkland Is.": "Falkland Islands",
    "W. Sahara": "Western Sahara",
    "Macedonia": "North Macedonia",
    "N. Cyprus": "Northern Cyprus",
    "eSwatini": "Eswatini"
  };
  var SKIP_IDS = { "010": 1, "260": 1 };
  var SKIP_NAMES = { "Antarctica": 1, "Fr. S. Antarctic Lands": 1 };
  var COURSES = [
    { id: "all", label: "All" },
    { id: "starter", label: "Starter" },
    { id: "main", label: "Main" },
    { id: "side", label: "Side" },
    { id: "dessert", label: "Dessert" },
    { id: "drink", label: "Drink" }
  ];
  var SLOTS = [
    { id: "starter", label: "Starter" },
    { id: "main", label: "Main" },
    { id: "side", label: "Side" },
    { id: "dessert", label: "Dessert" },
    { id: "drink", label: "Drink" }
  ];
  var SHARE = (function () {
    try { return location.origin + location.pathname; } catch (e) { return "https://whimsy-violet-dhgk.here.now/dinner/"; }
  })();

  var map, world = [], mapReady = false, dataReady = false, playReady = false;
  var feat = null, filter = "all", meal = {}, hoverId = null, tap0 = null, toastT = 0;
  var photoCache = {};

  function padId(id) { return id == null ? "" : String(id).padStart(3, "0"); }
  function fid(f) {
    if (f.id != null && f.id !== "") return String(f.id);
    return (f.properties && f.properties.name) || "";
  }
  function rawName(f) { return (f.properties && f.properties.name) || "Unknown"; }
  function niceName(f) { var n = rawName(f); return NICE[n] || n; }
  function isSkip(f) { return !!(SKIP_IDS[padId(f.id)] || SKIP_NAMES[rawName(f)]); }
  function factOf(f) {
    if (!f) return null;
    var id = padId(f.id);
    var w = window.WORLD_FACTS || {};
    if (w[id]) return w[id];
    var by = window.WORLD_FACTS_NAME || {};
    return by[rawName(f)] || by[niceName(f)] || null;
  }
  function iso2Of(f) {
    var x = factOf(f);
    return x && x.iso2 ? x.iso2 : "";
  }
  function foodsOf(f) {
    var pack = window.DINNER_FOODS || {};
    var id = padId(fid(f));
    if (pack[id] && pack[id].length) return pack[id];
    var n = niceName(f);
    if (pack[n] && pack[n].length) return pack[n];
    return [];
  }
  function escapeHtml(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function showToast(t, ms) {
    var el = document.getElementById("toast");
    el.textContent = t;
    el.style.opacity = 1;
    toastT = (ms || 1600) / 1000;
  }
  function emptyFC() { return { type: "FeatureCollection", features: [] }; }

  function showFlag(f) {
    var img = document.getElementById("placeFlag");
    var iso = f ? iso2Of(f) : "";
    if (!iso) { img.classList.add("hidden"); img.removeAttribute("src"); return; }
    img.src = "https://flagcdn.com/w80/" + iso + ".png";
    img.classList.remove("hidden");
  }

  function keepPlateScroll(e) { e.stopPropagation(); }
  function wireScrollLock(el) {
    if (!el || el._locked) return;
    el._locked = 1;
    ["touchstart", "touchmove", "touchend", "pointerdown", "pointermove", "wheel"].forEach(function (ev) {
      el.addEventListener(ev, keepPlateScroll, { passive: true });
    });
  }

  function setPlateMode(open) {
    var plate = document.getElementById("plate");
    var globe = document.getElementById("globeBtn");
    plate.classList.toggle("slim", !open);
    if (globe) globe.classList.toggle("hidden", !feat);
    if (open) plate.scrollTop = 0;
  }
  function putAwaySheet() {
    closeDetail();
    document.getElementById("planner").classList.add("hidden");
    feat = null;
    filter = "all";
    paintCountry();
    syncHl();
    showToast("Globe is free. Tap another country.", 1800);
  }

  function paintFilters() {
    var box = document.getElementById("filters");
    box.innerHTML = "";
    box.classList.toggle("hidden", !feat);
    COURSES.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (filter === c.id ? " on" : "");
      b.textContent = c.label;
      b.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        filter = c.id;
        paintCountry();
      });
      box.appendChild(b);
    });
  }

  function paintCountry() {
    var n = document.getElementById("placeName");
    var m = document.getElementById("meta");
    var grid = document.getElementById("grid");
    showFlag(feat);
    if (!feat) {
      n.textContent = "Tap a country";
      m.textContent = "Twenty dishes. Build a meal.";
      grid.innerHTML = "";
      document.getElementById("filters").classList.add("hidden");
      setPlateMode(false);
      return;
    }
    var dishes = foodsOf(feat);
    var shown = dishes.filter(function (d) { return filter === "all" || d.course === filter; });
    n.textContent = niceName(feat);
    m.textContent = shown.length + " dishes · swipe the cards";
    paintFilters();
    setPlateMode(true);
    grid.innerHTML = "";
    shown.forEach(function (d, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "dish";
      b.innerHTML = "<div class='course'>" + escapeHtml(d.course) + "</div><p class='dname'>" + escapeHtml(d.name) + "</p>";
      b.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openDetail(d);
      });
      grid.appendChild(b);
    });
  }

  function wikiPhoto(wiki, cb) {
    if (!wiki) { cb(""); return; }
    if (photoCache[wiki] !== undefined) { cb(photoCache[wiki]); return; }
    fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(wiki.replace(/_/g, " ")))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var url = j && j.thumbnail && j.thumbnail.source ? j.thumbnail.source : "";
        photoCache[wiki] = url;
        cb(url);
      })
      .catch(function () { photoCache[wiki] = ""; cb(""); });
  }

  function openDetail(d) {
    var box = document.getElementById("detail");
    var shop = (d.shop && d.shop.length) ? d.shop : ((d.rows || []).map(function (r) { return r.ing; }));
    var wine = d.wine || {};
    var cookHtml = (window.dinnerCook && window.dinnerCook.html) ? window.dinnerCook.html(d) : "";
    box.classList.remove("hidden");
    box.innerHTML = "<div class='sheet' id='detailSheet'>" +
      "<div class='who'>" + escapeHtml(d.course) + " · " + escapeHtml(niceName(feat)) + "</div>" +
      "<h2>" + escapeHtml(d.name) + "</h2>" +
      "<img id='detailPhoto' alt=''>" +
      cookHtml +
      "<p>" + escapeHtml(d.history || "") + "</p>" +
      "<div class='winebox'><b>Wine · or the right cup</b>" + escapeHtml(wine.name || "") +
      "<p style='margin:6px 0 0'>" + escapeHtml(wine.why || "") + "</p></div>" +
      "<b class='who'>Shopping list from this dish</b><ul>" +
      shop.map(function (s) { return "<li>" + escapeHtml(s) + "</li>"; }).join("") +
      "</ul>" +
      (d.wiki ? "<p><a href='https://en.wikipedia.org/wiki/" + encodeURIComponent(d.wiki) + "' target='_blank' rel='noopener'>The longer story on Wikipedia</a></p>" : "") +
      "<div class='row'><button class='btn navy' id='addMeal'>Add to the meal</button></div>" +
      "<div class='row'><button class='btn gold' id='copyShop'>Copy shopping list</button></div>" +
      "<div class='row'><button class='btn gold' id='copyCard'>Copy the cook card</button></div>" +
      "<div class='row'><button class='btn gold' id='closeDetail'>Close</button></div>" +
      "</div>";
    wireScrollLock(document.getElementById("detailSheet"));
    wikiPhoto(d.wiki, function (url) {
      var img = document.getElementById("detailPhoto");
      if (img && url) img.src = url;
      else if (img) img.style.display = "none";
    });
    document.getElementById("addMeal").onclick = function () {
      meal[d.course] = { dish: d, country: niceName(feat) };
      closeDetail();
      openPlanner();
      showToast("On the " + d.course + " plate.", 1400);
    };
    document.getElementById("copyShop").onclick = function () {
      var t = (window.dinnerCook && window.dinnerCook.shopText) ? window.dinnerCook.shopText(d, niceName(feat)) : (shop || []).map(function (s) { return "☐ " + s; }).join("\n");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(function () { showToast("Shopping list copied.", 1600); });
      } else {
        window.prompt("Copy this shopping list", t);
      }
    };
    document.getElementById("copyCard").onclick = function () {
      var t = (window.dinnerCook && window.dinnerCook.text) ? window.dinnerCook.text(d) : d.name;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(function () { showToast("Cook card copied.", 1600); });
      } else {
        window.prompt("Copy this cook card", t);
      }
    };
    document.getElementById("closeDetail").onclick = closeDetail;
    box.onclick = function (e) { if (e.target === box) closeDetail(); };
  }
  function closeDetail() { document.getElementById("detail").classList.add("hidden"); }

  function listText() {
    if (window.dinnerCook && window.dinnerCook.shopTextMany) {
      var parts = [];
      SLOTS.forEach(function (s) {
        if (meal[s.id]) parts.push({ dish: meal[s.id].dish, country: meal[s.id].country, label: s.label + " · " + meal[s.id].dish.name });
      });
      return window.dinnerCook.shopTextMany(parts);
    }
    var lines = ["What's for Dinner — shopping list"], i, s, d, seen = {};
    for (i = 0; i < SLOTS.length; i++) {
      s = SLOTS[i];
      d = meal[s.id];
      if (!d) continue;
      lines.push("");
      lines.push(s.label.toUpperCase() + " · " + d.dish.name + " (" + d.country + ")");
      (d.dish.shop || []).forEach(function (ing) {
        var k = String(ing).toLowerCase();
        if (seen[k]) return;
        seen[k] = 1;
        lines.push("☐ " + ing);
      });
    }
    if (lines.length === 1) lines.push("Nothing on the plates yet.");
    return lines.join("\n");
  }

  function openPlanner() {
    var box = document.getElementById("planner");
    var html = "<h3>Tonight's table</h3><div class='slots'>";
    SLOTS.forEach(function (s) {
      var d = meal[s.id];
      html += "<div class='slot'><b>" + s.label + "</b><span>" +
        (d ? escapeHtml(d.dish.name) + " · " + escapeHtml(d.country) : "Tap a card") +
        "</span><button type='button' data-clear='" + s.id + "'" + (d ? "" : " style='opacity:.35'") + ">Clear</button></div>";
    });
    html += "</div><div class='row'><button class='btn navy' id='copyList'>Copy shopping list</button></div>";
    html += "<div class='row'><button class='btn gold' id='shareList'>Share the list</button></div>";
    html += "<div class='row'><button class='btn gold' id='closePlan'>Close</button></div>";
    html += "<p class='later'>DoorDash and credit cards are coming later. This page will not take a card and it cannot send a driver. Tonight it helps you pick the meal and the list.</p>";
    box.innerHTML = html;
    box.classList.remove("hidden");
    wireScrollLock(box);
    box.querySelectorAll("[data-clear]").forEach(function (b) {
      b.onclick = function () {
        delete meal[b.getAttribute("data-clear")];
        openPlanner();
      };
    });
    document.getElementById("copyList").onclick = function () {
      var t = listText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(function () { showToast("List copied.", 1600); });
      } else {
        window.prompt("Copy this list", t);
      }
    };
    document.getElementById("shareList").onclick = function () {
      var t = listText();
      if (navigator.share) navigator.share({ title: "What's for Dinner", text: t }).catch(function () {});
      else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(function () { showToast("List copied.", 1600); });
      }
    };
    document.getElementById("closePlan").onclick = function () { box.classList.add("hidden"); };
  }

  function openSchool() {
    var box = document.getElementById("school");
    var lessons = window.WINE_SCHOOL || [];
    var html = "<div class='card'><h2>A little wine school</h2><div class='rule'></div>";
    lessons.forEach(function (L) {
      html += "<div class='lesson'><b>" + escapeHtml(L.title) + "</b><span>" + escapeHtml(L.text) + "</span></div>";
    });
    html += "<div class='row'><button class='btn navy' id='closeSchool'>Back to the globe</button></div></div>";
    box.innerHTML = html;
    box.classList.remove("hidden");
    document.getElementById("closeSchool").onclick = function () { box.classList.add("hidden"); };
  }

  function featArea(f) {
    try { return Math.abs(d3.geoArea(f)); } catch (e) { return 1; }
  }
  function pickCountry(e) {
    if (!e || !e.lngLat) return null;
    var pt = [e.lngLat.lng, e.lngLat.lat];
    var found = [], i;
    for (i = 0; i < world.length; i++) {
      try { if (d3.geoContains(world[i], pt)) found.push(world[i]); } catch (err) {}
    }
    if (!found.length) return null;
    found.sort(function (a, b) { return featArea(a) - featArea(b); });
    return found[0];
  }
  function syncHl() {
    if (!map || !playReady) return;
    world.forEach(function (f) {
      var id = fid(f);
      var hl = "none";
      if (feat && fid(feat) === id) hl = "gold";
      else if (hoverId === id) hl = "cream";
      try { map.setFeatureState({ source: "play", id: id }, { hl: hl }); } catch (e) {}
    });
  }
  function holdOnCountry(f) {
    if (!map || !f || !f.__c) return;
    try {
      map.easeTo({ center: [f.__c[0], f.__c[1]], zoom: Math.max(map.getZoom(), 2.4), duration: 700, padding: { top: 40, bottom: 280, left: 20, right: 20 } });
    } catch (e) {}
  }
  function onMapClick(e) {
    if (!playReady) return;
    if (tap0 && e.point && (Math.abs(e.point.x - tap0.x) > 12 || Math.abs(e.point.y - tap0.y) > 12)) return;
    var f = pickCountry(e);
    if (!f) return;
    feat = f;
    filter = "all";
    hoverId = fid(f);
    holdOnCountry(f);
    paintCountry();
    syncHl();
  }

  function addPlayLayers() {
    if (!map || !mapReady || !dataReady || playReady) return;
    map.addSource("play", {
      type: "geojson",
      data: { type: "FeatureCollection", features: world },
      promoteId: "id"
    });
    map.addLayer({
      id: "play-fill",
      type: "fill",
      source: "play",
      paint: {
        "fill-color": [
          "match", ["coalesce", ["feature-state", "hl"], "none"],
          "gold", "#e8c37a",
          "cream", "#efe4c4",
          "rgba(0,0,0,0)"
        ],
        "fill-opacity": [
          "match", ["coalesce", ["feature-state", "hl"], "none"],
          "gold", 0.42,
          "cream", 0.28,
          0
        ]
      }
    });
    map.addLayer({
      id: "play-line",
      type: "line",
      source: "play",
      paint: { "line-color": "rgba(243,234,214,0.55)", "line-width": 0.7 }
    });
    map.addLayer({
      id: "play-sel",
      type: "line",
      source: "play",
      paint: {
        "line-color": [
          "match", ["coalesce", ["feature-state", "hl"], "none"],
          "gold", "#ffe44a",
          "cream", "#efe4c4",
          "rgba(0,0,0,0)"
        ],
        "line-width": [
          "match", ["coalesce", ["feature-state", "hl"], "none"],
          "gold", 2.8,
          "cream", 1.6,
          0
        ]
      }
    });
    playReady = true;
    syncHl();
  }
  function maybeHideLoad() {
    if (mapReady && dataReady) {
      var el = document.getElementById("loadmsg");
      if (el) el.classList.add("hidden");
    }
  }
  function makeMap() {
    map = new maplibregl.Map({
      container: "globe",
      style: {
        version: 8,
        projection: { type: "globe" },
        sources: {
          marble: {
            type: "image",
            url: "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57752/land_shallow_topo_2048.jpg",
            coordinates: [[-180, 85], [180, 85], [180, -85], [-180, -85]]
          },
          esri: {
            type: "raster",
            tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
            tileSize: 256,
            maxzoom: 8,
            attribution: "Tiles © Esri"
          }
        },
        layers: [
          { id: "bg", type: "background", paint: { "background-color": "#070e16" } },
          { id: "marble", type: "raster", source: "marble", paint: { "raster-opacity": 1 } },
          { id: "sat", type: "raster", source: "esri" }
        ],
        sky: { "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 1, 5, 1, 7, 0] }
      },
      center: [-20, 12],
      zoom: 1.2,
      minZoom: 0.55,
      maxZoom: 6.2,
      pitch: 0,
      maxPitch: 35,
      attributionControl: true,
      renderWorldCopies: false,
      antialias: true
    });
    map.on("load", function () {
      mapReady = true;
      addPlayLayers();
      maybeHideLoad();
    });
    map.on("error", function () {});
    map.on("click", onMapClick);
    map.on("mousedown", function (e) { if (e && e.point) tap0 = { x: e.point.x, y: e.point.y }; });
    map.on("touchstart", function (e) { if (e && e.point) tap0 = { x: e.point.x, y: e.point.y }; });
  }
  function prep(feats) {
    var out = [], i, f;
    for (i = 0; i < feats.length; i++) {
      f = feats[i];
      if (isSkip(f)) continue;
      try { f.__c = d3.geoCentroid(f); } catch (e) { f.__c = [0, 0]; }
      f.id = fid(f);
      if (!f.properties) f.properties = {};
      f.properties.id = f.id;
      out.push(f);
    }
    return out;
  }
  function loadMaps() {
    fetch("https://unpkg.com/world-atlas@2/countries-50m.json")
      .then(function (r) { if (!r.ok) throw new Error("map"); return r.json(); })
      .then(function (topo) {
        world = prep(topojson.feature(topo, topo.objects.countries).features);
        dataReady = true;
        addPlayLayers();
        maybeHideLoad();
      })
      .catch(function () {
        document.getElementById("loadmsg").textContent = "The kitchen could not open.";
      });
  }

  function goHome() {
    feat = null;
    filter = "all";
    closeDetail();
    document.getElementById("planner").classList.add("hidden");
    document.getElementById("school").classList.add("hidden");
    document.getElementById("hud").classList.add("hidden");
    document.getElementById("title").classList.remove("hidden");
    paintCountry();
    syncHl();
  }
  function startKitchen() {
    document.getElementById("title").classList.add("hidden");
    document.getElementById("hud").classList.remove("hidden");
    paintCountry();
    if (map) {
      try { map.resize(); } catch (e) {}
    }
  }
  function shareKitchen() {
    if (navigator.share) {
      navigator.share({ title: "What's for Dinner", text: "Spin the globe. Pick tonight's meal.", url: SHARE }).catch(function () {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(SHARE).then(function () { showToast("Link copied.", 1800); });
      return;
    }
    window.prompt("Copy this link", SHARE);
  }

  function wire() {
    document.getElementById("startBtn").addEventListener("click", startKitchen);
    document.getElementById("shareBtn").addEventListener("click", shareKitchen);
    document.getElementById("shareTool").addEventListener("click", shareKitchen);
    document.getElementById("homeBtn").addEventListener("click", goHome);
    document.getElementById("globeBtn").addEventListener("click", putAwaySheet);
    document.getElementById("zoomIn").addEventListener("click", function () { if (map) map.zoomIn({ duration: 280 }); });
    document.getElementById("zoomOut").addEventListener("click", function () { if (map) map.zoomOut({ duration: 280 }); });
    document.getElementById("planBtn").addEventListener("click", openPlanner);
    document.getElementById("schoolBtn").addEventListener("click", openSchool);
    wireScrollLock(document.getElementById("plate"));
    var last = 0;
    function frame(now) {
      if (!last) last = now;
      var dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (toastT > 0) {
        toastT -= dt;
        if (toastT <= 0) document.getElementById("toast").style.opacity = 0;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function boot() {
    wire();
    makeMap();
    loadMaps();
  }
  function waitLibs() {
    if (window.maplibregl && window.d3 && window.topojson) { boot(); return; }
    var n = 0;
    var t = setInterval(function () {
      n += 1;
      if (window.maplibregl && window.d3 && window.topojson) { clearInterval(t); boot(); }
      else if (n > 80) {
        clearInterval(t);
        document.getElementById("loadmsg").textContent = "The kitchen could not open.";
      }
    }, 100);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", waitLibs);
  else waitLibs();
})();
