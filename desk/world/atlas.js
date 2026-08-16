"use strict";
/* The World Atlas of Places */
(function () {
  var SETS = [
    { id: "all", label: "All the world", kind: "place" },
    { id: "europe", label: "Europe", kind: "place" },
    { id: "americas", label: "Americas", kind: "place" },
    { id: "africa", label: "Africa", kind: "place" },
    { id: "asia", label: "Asia", kind: "place" },
    { id: "oceania", label: "Oceania", kind: "place" },
    { id: "us", label: "United States", kind: "place" },
    { id: "landmarks", label: "Landmarks", kind: "game" },
    { id: "capitals", label: "Capitals", kind: "game" },
    { id: "flags", label: "Flags", kind: "game" },
    { id: "nature", label: "Nature", kind: "game" },
    { id: "birthplaces", label: "People", kind: "game" },
    { id: "mixed", label: "Mixed bag", kind: "game" }
  ];
  var SET_ROT = {
    all: [20, -12], europe: [-15, -50], americas: [80, -10],
    africa: [-20, -2], asia: [-90, -30], oceania: [-140, 20], us: [97, -38], capitals: [20, -12], landmarks: [20, -12], flags: [20, -12], nature: [20, -12], birthplaces: [20, -12], mixed: [20, -12]
  };

  var LANDMARKS = [
    { wiki: "Eiffel_Tower", name: "Eiffel Tower", iso: "250" },
    { wiki: "Taj_Mahal", name: "Taj Mahal", iso: "356" },
    { wiki: "Statue_of_Liberty", name: "Statue of Liberty", iso: "840" },
    { wiki: "Christ_the_Redeemer_(statue)", name: "Christ the Redeemer", iso: "076" },
    { wiki: "Big_Ben", name: "Big Ben", iso: "826" },
    { wiki: "Colosseum", name: "Colosseum", iso: "380" },
    { wiki: "Machu_Picchu", name: "Machu Picchu", iso: "604" },
    { wiki: "Sydney_Opera_House", name: "Sydney Opera House", iso: "036" },
    { wiki: "Great_Wall_of_China", name: "Great Wall", iso: "156" },
    { wiki: "Petra", name: "Petra", iso: "400" },
    { wiki: "Great_Pyramid_of_Giza", name: "Great Pyramid of Giza", iso: "818" },
    { wiki: "Mount_Fuji", name: "Mount Fuji", iso: "392" },
    { wiki: "Angkor_Wat", name: "Angkor Wat", iso: "116" },
    { wiki: "Parthenon", name: "Parthenon", iso: "300" },
    { wiki: "Sagrada_Família", name: "Sagrada Família", iso: "724" },
    { wiki: "Neuschwanstein_Castle", name: "Neuschwanstein Castle", iso: "276" },
    { wiki: "Saint_Basil's_Cathedral", name: "Saint Basil's Cathedral", iso: "643" },
    { wiki: "Burj_Khalifa", name: "Burj Khalifa", iso: "784" },
    { wiki: "Golden_Gate_Bridge", name: "Golden Gate Bridge", iso: "840" },
    { wiki: "Chichen_Itza", name: "Chichen Itza", iso: "484" },
    { wiki: "Moai", name: "Moai of Easter Island", iso: "152" },
    { wiki: "Table_Mountain", name: "Table Mountain", iso: "710" },
    { wiki: "CN_Tower", name: "CN Tower", iso: "124" },
    { wiki: "Hagia_Sophia", name: "Hagia Sophia", iso: "792" },
    { wiki: "Leaning_Tower_of_Pisa", name: "Leaning Tower of Pisa", iso: "380" },
    { wiki: "Atomium", name: "Atomium", iso: "056" },
    { wiki: "Uluru", name: "Uluru", iso: "036" },
    { wiki: "Ha_Long_Bay", name: "Ha Long Bay", iso: "704" },
    { wiki: "Petronas_Towers", name: "Petronas Towers", iso: "458" },
    { wiki: "Charles_Bridge", name: "Charles Bridge", iso: "203" },
    { wiki: "Alhambra", name: "Alhambra", iso: "724" },
    { wiki: "Grand_Canyon", name: "Grand Canyon", iso: "840" },
    { wiki: "Mount_Kilimanjaro", name: "Kilimanjaro", iso: "834" },
    { wiki: "Gyeongbokgung", name: "Gyeongbokgung", iso: "410" },
    { wiki: "Forbidden_City", name: "Forbidden City", iso: "156" },
    { wiki: "Fushimi_Inari-taisha", name: "Fushimi Inari", iso: "392" },
    { wiki: "Stonehenge", name: "Stonehenge", iso: "826" },
    { wiki: "Louvre", name: "Louvre", iso: "250" },
    { wiki: "Brandenburg_Gate", name: "Brandenburg Gate", iso: "276" },
    { wiki: "Marina_Bay_Sands", name: "Marina Bay Sands", iso: "702" },
    { wiki: "Zakouma_National_Park", name: "Zakouma National Park", iso: "148" },
    { wiki: "Lakes_of_Ounianga", name: "Lakes of Ounianga", iso: "148" },
    { wiki: "Ennedi_Plateau", name: "Ennedi Plateau", iso: "148" }
  ];

  var NATURE = [
    { wiki: "Amazon_River", name: "Amazon River", iso: "076" },
    { wiki: "Nile", name: "Nile", iso: "818" },
    { wiki: "Mississippi_River", name: "Mississippi River", iso: "840" },
    { wiki: "Yangtze", name: "Yangtze", iso: "156" },
    { wiki: "Ganges", name: "Ganges", iso: "356" },
    { wiki: "Mount_Everest", name: "Mount Everest", iso: "524" },
    { wiki: "K2", name: "K2", iso: "586" },
    { wiki: "Matterhorn", name: "Matterhorn", iso: "756" },
    { wiki: "Mount_Kilimanjaro", name: "Kilimanjaro", iso: "834" },
    { wiki: "Denali", name: "Denali", iso: "840" },
    { wiki: "Mont_Blanc", name: "Mont Blanc", iso: "250" },
    { wiki: "Aconcagua", name: "Aconcagua", iso: "032" },
    { wiki: "Sahara", name: "Sahara", iso: "012" },
    { wiki: "Gobi_Desert", name: "Gobi Desert", iso: "496" },
    { wiki: "Atacama_Desert", name: "Atacama Desert", iso: "152" },
    { wiki: "Kalahari_Desert", name: "Kalahari Desert", iso: "072" },
    { wiki: "Victoria_Falls", name: "Victoria Falls", iso: "894" },
    { wiki: "Niagara_Falls", name: "Niagara Falls", iso: "124" },
    { wiki: "Angel_Falls", name: "Angel Falls", iso: "862" },
    { wiki: "Iguazu_Falls", name: "Iguazu Falls", iso: "032" },
    { wiki: "Great_Barrier_Reef", name: "Great Barrier Reef", iso: "036" },
    { wiki: "Yellowstone_National_Park", name: "Yellowstone", iso: "840" },
    { wiki: "Milford_Sound", name: "Milford Sound", iso: "554" },
    { wiki: "Dead_Sea", name: "Dead Sea", iso: "400" },
    { wiki: "Lake_Baikal", name: "Lake Baikal", iso: "643" },
    { wiki: "Serengeti", name: "Serengeti", iso: "834" },
    { wiki: "Okavango_Delta", name: "Okavango Delta", iso: "072" },
    { wiki: "Galápagos_Islands", name: "Galápagos Islands", iso: "218" },
    { wiki: "Salar_de_Uyuni", name: "Salar de Uyuni", iso: "068" },
    { wiki: "Mount_Vesuvius", name: "Mount Vesuvius", iso: "380" },
    { wiki: "Mount_Etna", name: "Mount Etna", iso: "380" },
    { wiki: "Rocky_Mountains", name: "Rocky Mountains", iso: "840" }
  ];

  var BIRTHS = [
    { wiki: "Albert_Einstein", name: "Albert Einstein", iso: "276", years: "1879–1955", known: "physicist" },
    { wiki: "Napoleon", name: "Napoleon", iso: "250", years: "1769–1821", known: "emperor of France" },
    { wiki: "Cleopatra", name: "Cleopatra", iso: "818", years: "69–30 BC", known: "last pharaoh of Egypt" },
    { wiki: "Nelson_Mandela", name: "Nelson Mandela", iso: "710", years: "1918–2013", known: "South African president" },
    { wiki: "William_Shakespeare", name: "William Shakespeare", iso: "826", years: "1564–1616", known: "playwright" },
    { wiki: "Mahatma_Gandhi", name: "Mahatma Gandhi", iso: "356", years: "1869–1948", known: "independence leader" },
    { wiki: "Wolfgang_Amadeus_Mozart", name: "Mozart", iso: "040", years: "1756–1791", known: "composer" },
    { wiki: "Ludwig_van_Beethoven", name: "Beethoven", iso: "276", years: "1770–1827", known: "composer" },
    { wiki: "Abraham_Lincoln", name: "Abraham Lincoln", iso: "840", years: "1809–1865", known: "U.S. president" },
    { wiki: "Winston_Churchill", name: "Winston Churchill", iso: "826", years: "1874–1965", known: "British prime minister" },
    { wiki: "Marie_Curie", name: "Marie Curie", iso: "616", years: "1867–1934", known: "scientist" },
    { wiki: "Galileo_Galilei", name: "Galileo", iso: "380", years: "1564–1642", known: "astronomer" },
    { wiki: "Isaac_Newton", name: "Isaac Newton", iso: "826", years: "1643–1727", known: "scientist" },
    { wiki: "Leonardo_da_Vinci", name: "Leonardo da Vinci", iso: "380", years: "1452–1519", known: "artist and inventor" },
    { wiki: "George_Washington", name: "George Washington", iso: "840", years: "1732–1799", known: "first U.S. president" },
    { wiki: "Pablo_Picasso", name: "Pablo Picasso", iso: "724", years: "1881–1973", known: "painter" },
    { wiki: "Vincent_van_Gogh", name: "Vincent van Gogh", iso: "528", years: "1853–1890", known: "painter" },
    { wiki: "Frida_Kahlo", name: "Frida Kahlo", iso: "484", years: "1907–1954", known: "painter" },
    { wiki: "Simón_Bolívar", name: "Simón Bolívar", iso: "862", years: "1783–1830", known: "South American liberator" },
    { wiki: "Pelé", name: "Pelé", iso: "076", years: "1940–2022", known: "footballer" },
    { wiki: "Lionel_Messi", name: "Lionel Messi", iso: "032", years: "1987–", known: "footballer" },
    { wiki: "Ada_Lovelace", name: "Ada Lovelace", iso: "826", years: "1815–1852", known: "mathematician" },
    { wiki: "Alan_Turing", name: "Alan Turing", iso: "826", years: "1912–1954", known: "computer scientist" },
    { wiki: "Yuri_Gagarin", name: "Yuri Gagarin", iso: "643", years: "1934–1968", known: "first person in space" },
    { wiki: "Amelia_Earhart", name: "Amelia Earhart", iso: "840", years: "1897–1937", known: "aviator" },
    { wiki: "Anne_Frank", name: "Anne Frank", iso: "276", years: "1929–1945", known: "diarist" },
    { wiki: "Florence_Nightingale", name: "Florence Nightingale", iso: "380", years: "1820–1910", known: "nurse, born in Florence" },
    { wiki: "Christopher_Columbus", name: "Christopher Columbus", iso: "380", years: "1451–1506", known: "explorer, born in Genoa" },
    { wiki: "Ferdinand_Magellan", name: "Ferdinand Magellan", iso: "620", years: "1480–1521", known: "explorer" },
    { wiki: "Genghis_Khan", name: "Genghis Khan", iso: "496", years: "c. 1162–1227", known: "Mongol emperor" },
    { wiki: "Confucius", name: "Confucius", iso: "156", years: "551–479 BC", known: "philosopher" },
    { wiki: "Kofi_Annan", name: "Kofi Annan", iso: "288", years: "1938–2018", known: "UN secretary-general" },
    { wiki: "Gabriel_García_Márquez", name: "Gabriel García Márquez", iso: "170", years: "1927–2014", known: "writer" },
    { wiki: "Frédéric_Chopin", name: "Frédéric Chopin", iso: "616", years: "1810–1849", known: "composer" },
    { wiki: "Edvard_Grieg", name: "Edvard Grieg", iso: "578", years: "1843–1907", known: "composer" },
    { wiki: "Akira_Kurosawa", name: "Akira Kurosawa", iso: "392", years: "1910–1998", known: "filmmaker" },
    { wiki: "Jane_Austen", name: "Jane Austen", iso: "826", years: "1775–1817", known: "novelist" },
    { wiki: "Leo_Tolstoy", name: "Leo Tolstoy", iso: "643", years: "1828–1910", known: "novelist" }
  ];
  function playKind() { return (setId === "mixed" && clueKind) ? clueKind : setId; }
  function isWikiSet() {
    var k = playKind();
    return k === "landmarks" || k === "nature" || k === "birthplaces";
  }
  function wikiList() {
    if (setId === "nature") return NATURE;
    if (setId === "birthplaces") return BIRTHS;
    return LANDMARKS;
  }
  function mixedPool() {
    var pool = [], i, f, x;
    function add(list, kind) {
      for (i = 0; i < list.length; i++) {
        x = list[i];
        pool.push({ kind: kind, wiki: x.wiki, name: x.name, iso: x.iso, years: x.years, known: x.known });
      }
    }
    add(LANDMARKS, "landmarks");
    add(NATURE, "nature");
    add(BIRTHS, "birthplaces");
    for (i = 0; i < world.length; i++) {
      f = world[i];
      if (capitalOf(f)) pool.push({ kind: "capitals", iso: padId(fid(f)), name: capitalOf(f) });
      if (iso2Of(f)) pool.push({ kind: "flags", iso: padId(fid(f)), name: niceName(f) });
    }
    return pool;
  }
  function wikiByKey(wiki) {
    var lists = [wikiList(), LANDMARKS, NATURE, BIRTHS];
    var i, j, list;
    for (i = 0; i < lists.length; i++) {
      list = lists[i];
      for (j = 0; j < list.length; j++) if (list[j].wiki === wiki) return list[j];
    }
    return null;
  }
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
  var REGION_BY_ID = {
    "008":"europe","040":"europe","056":"europe","070":"europe","100":"europe","112":"europe",
    "191":"europe","196":"europe","203":"europe","208":"europe","233":"europe","246":"europe",
    "250":"europe","276":"europe","300":"europe","348":"europe","352":"europe","372":"europe",
    "380":"europe","428":"europe","440":"europe","442":"europe","498":"europe","499":"europe",
    "528":"europe","578":"europe","616":"europe","620":"europe","642":"europe","643":"europe",
    "688":"europe","703":"europe","705":"europe","724":"europe","752":"europe","756":"europe",
    "804":"europe","807":"europe","826":"europe",
    "032":"americas","044":"americas","068":"americas","076":"americas","084":"americas",
    "124":"americas","152":"americas","170":"americas","188":"americas","192":"americas",
    "214":"americas","218":"americas","222":"americas","238":"americas","304":"americas",
    "320":"americas","328":"americas","332":"americas","340":"americas","388":"americas",
    "484":"americas","558":"americas","591":"americas","600":"americas","604":"americas",
    "630":"americas","740":"americas","780":"americas","840":"americas","858":"americas",
    "862":"americas",
    "012":"africa","024":"africa","072":"africa","108":"africa","120":"africa","140":"africa",
    "148":"africa","178":"africa","180":"africa","204":"africa","226":"africa","231":"africa",
    "232":"africa","262":"africa","266":"africa","270":"africa","288":"africa","324":"africa",
    "384":"africa","404":"africa","426":"africa","430":"africa","434":"africa","450":"africa",
    "454":"africa","466":"africa","478":"africa","504":"africa","508":"africa","516":"africa",
    "562":"africa","566":"africa","624":"africa","646":"africa","686":"africa","694":"africa",
    "706":"africa","710":"africa","716":"africa","728":"africa","729":"africa","732":"africa",
    "748":"africa","768":"africa","788":"africa","800":"africa","818":"africa","834":"africa",
    "854":"africa","894":"africa",
    "004":"asia","031":"asia","050":"asia","051":"asia","064":"asia","096":"asia","104":"asia",
    "116":"asia","144":"asia","156":"asia","158":"asia","268":"asia","275":"asia","356":"asia",
    "360":"asia","364":"asia","368":"asia","376":"asia","392":"asia","398":"asia","400":"asia",
    "408":"asia","410":"asia","414":"asia","417":"asia","418":"asia","422":"asia","458":"asia",
    "496":"asia","512":"asia","524":"asia","586":"asia","608":"asia","626":"asia","634":"asia",
    "682":"asia","702":"asia","704":"asia","760":"asia","762":"asia","764":"asia","784":"asia",
    "792":"asia","795":"asia","860":"asia","887":"asia",
    "036":"oceania","090":"oceania","242":"oceania","540":"oceania","548":"oceania",
    "554":"oceania","598":"oceania"
  };
  var REGION_BY_NAME = { "Kosovo":"europe","Somaliland":"africa","N. Cyprus":"europe","Northern Cyprus":"europe" };
  var SKIP_IDS = { "010":1, "260":1 };
  var SKIP_NAMES = { "Antarctica":1, "Fr. S. Antarctic Lands":1 };
  var SKIP_FIPS = { "60":1, "66":1, "69":1, "72":1, "78":1, "11":1 };
  var US_AREA = {
    "09":"Northeast","23":"Northeast","25":"Northeast","33":"Northeast","44":"Northeast","50":"Northeast",
    "34":"Northeast","36":"Northeast","42":"Northeast",
    "17":"Midwest","18":"Midwest","26":"Midwest","39":"Midwest","55":"Midwest",
    "19":"Midwest","20":"Midwest","27":"Midwest","29":"Midwest","31":"Midwest","38":"Midwest","46":"Midwest",
    "10":"South","12":"South","13":"South","24":"South","37":"South","45":"South","51":"South",
    "01":"South","21":"South","28":"South","47":"South","05":"South","22":"South","40":"South","48":"South",
    "54":"South",
    "04":"West","08":"West","16":"West","30":"West","32":"West","35":"West","49":"West","56":"West",
    "02":"West","06":"West","15":"West","41":"West","53":"West"
  };
  var SHARE = "https://tinyurl.com/the-world-by-mark";
  function ratingFor(n) {
    if (n >= 10) return "World Master";
    if (n >= 8) return "Navigator";
    if (n >= 6) return "Explorer";
    if (n >= 4) return "Traveler";
    if (n >= 1) return "Getting started";
    return "Keep looking";
  }
  function cleanName(s) {
    return String(s || "").replace(/\s+/g, " ").trim().slice(0, 24);
  }
  function storeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function storeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function loadJSON(k, fallback) {
    var raw = storeGet(k);
    if (!raw) return fallback;
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  }
  var learned = loadJSON("atlas.learned", {});
  var bests = loadJSON("atlas.best", {});
  (function () { var k; for (k in bests) if ((bests[k] || 0) > 10) delete bests[k]; })();
  var muted = storeGet("atlas.muted") !== "0";
  var seenHow = !!storeGet("atlas.howto");
  function saveLearned() { storeSet("atlas.learned", JSON.stringify(learned)); }
  function saveBests() { storeSet("atlas.best", JSON.stringify(bests)); }
  function padId(id) { return id == null ? "" : String(id).padStart(3, "0"); }
  function fid(f) {
    if (f.id != null && f.id !== "") return String(f.id);
    return (f.properties && f.properties.name) || "";
  }
  function rawName(f) { return (f.properties && f.properties.name) || "Unknown"; }
  function niceName(f) { var n = rawName(f); return NICE[n] || n; }
  function regionOf(f) {
    var id = padId(f.id);
    if (REGION_BY_ID[id]) return REGION_BY_ID[id];
    var n = rawName(f);
    if (REGION_BY_NAME[n]) return REGION_BY_NAME[n];
    var c = f.__c;
    if (!c) return "asia";
    var lon = c[0], lat = c[1];
    if (lat < -60) return "skip";
    if (lon < -25) return "americas";
    if (lon > 110 && lat < 20 && lat > -50) return "oceania";
    if (lat > 36 && lon > -25 && lon < 42) return "europe";
    if (lat < 37 && lon > -20 && lon < 52) return "africa";
    return "asia";
  }
  function isSkip(f) { return !!(SKIP_IDS[padId(f.id)] || SKIP_NAMES[rawName(f)]); }
  function learnedCount() {
    var n = 0, k;
    for (k in learned) if (learned[k]) n++;
    return n;
  }
  function markLearned(f) { learned[fid(f)] = 1; saveLearned(); }

  function factOf(f) {
    if (!f) return null;
    if (setId === "us") return (window.US_FACTS || {})[String(f.id).padStart(2, "0")] || null;
    var id = padId(f.id);
    var w = window.WORLD_FACTS || {};
    if (w[id]) return w[id];
    var n = rawName(f);
    var by = window.WORLD_FACTS_NAME || {};
    return by[n] || by[niceName(f)] || null;
  }
  function capitalOf(f) {
    var x = factOf(f);
    return x && x.capital ? x.capital : "";
  }
  function iso2Of(f) {
    var x = factOf(f);
    return x && x.iso2 ? x.iso2 : "";
  }
  function promptName(f) {
    if (!f) return "—";
    if (isWikiSet() && landmark) return landmark.name;
    if (playKind() === "flags" && mode === "quiz" && !locked) return "This flag";
    if (playKind() === "capitals") return (landmark && landmark.name) || capitalOf(f) || niceName(f);
    return niceName(f);
  }
  function kmBetween(a, b) {
    if (!a || !b || !window.d3) return null;
    try {
      var km = d3.geoDistance(a, b) * 6371;
      if (!isFinite(km)) return null;
      return Math.round(km);
    } catch (e) { return null; }
  }
  function kmLabel(km) {
    if (km == null) return "";
    if (km < 1) return "right on it";
    if (km < 20) return "about " + km + " km off";
    var n = km >= 1000 ? (Math.round(km / 50) * 50) : km;
    return "about " + n.toLocaleString("en-US") + " km off";
  }
  function showFlag(f, reveal) {
    var img = document.getElementById("placeFlag");
    if (!img) return;
    var hide = !f;
    if (mode === "quiz" && !reveal && !locked && (playKind() === "capitals" || isWikiSet())) hide = true;
    var iso = f ? iso2Of(f) : "";
    if (hide || !iso) { img.classList.add("hidden"); img.removeAttribute("src"); return; }
    img.alt = "";
    img.classList.toggle("big", playKind() === "flags" && mode === "quiz");
    img.src = "https://flagcdn.com/" + (playKind() === "flags" ? "w160" : "w80") + "/" + iso + ".png";
    img.classList.remove("hidden");
  }
  function showFact(f, reveal) {
    var el = document.getElementById("placeFact");
    if (!el) return;
    el.classList.remove("cardish");
    el.innerHTML = "";
    if (playKind() === "birthplaces" && landmark && mode === "quiz") {
      var bits = [];
      if (landmark.years) bits.push(landmark.years);
      if (landmark.known) bits.push(landmark.known);
      if (locked) bits.push(niceName(f));
      el.textContent = bits.join(" · ");
      el.classList.remove("hidden");
      return;
    }
    if (!f || !(reveal || locked || mode === "explore")) { el.classList.add("hidden"); el.textContent = ""; return; }
    var cap = capitalOf(f);
    if (!cap || playKind() === "capitals") { el.classList.add("hidden"); el.textContent = ""; return; }
    el.textContent = "Capital · " + cap;
    el.classList.remove("hidden");
  }

  var EXPLORE_TOPICS = [
    { id: "overview", label: "Overview" },
    { id: "capital", label: "Capital" },
    { id: "people", label: "People" },
    { id: "food", label: "Food" },
    { id: "history", label: "History" },
    { id: "landmarks", label: "Landmarks" },
    { id: "nature", label: "Nature" }
  ];
  function topicLabel(id) {
    var i;
    for (i = 0; i < EXPLORE_TOPICS.length; i++) if (EXPLORE_TOPICS[i].id === id) return EXPLORE_TOPICS[i].label;
    return "Explore";
  }
  function clipText(s, n) {
    s = String(s || "").replace(/\s+/g, " ").trim();
    if (!s) return "";
    var out = [], start = 0, i, ch;
    for (i = 0; i < s.length && out.length < n; i++) {
      ch = s.charAt(i);
      if ((ch === "." || ch === "!" || ch === "?") && (i + 1 >= s.length || s.charAt(i + 1) === " ")) {
        var bit = s.slice(start, i + 1).trim();
        if (bit) out.push(bit);
        start = i + 1;
      }
    }
    if (!out.length) return s.length > 280 ? s.slice(0, 277) + "\u2026" : s;
    return out.join(" ");
  }
  function photoLooksBad(hit) {
    if (!hit || !hit.photo) return !hit;
    var s = String(hit.photo + " " + (hit.title || "") + " " + (hit.text || "")).toLowerCase();
    return /visa|passport|document.?scan|ordinaire|entry.?permit|boarding.?pass|id.?card|postage.?stamp/.test(s);
  }
  function fetchWiki(title, done) {
    if (!title) { done(null); return; }
    fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(title))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j.extract || j.type === "disambiguation") { done(null); return; }
        done({
          text: clipText(j.extract, 3),
          photo: (j.thumbnail && j.thumbnail.source) || "",
          title: j.title
        });
      })
      .catch(function () { done(null); });
  }
  function pickCleanPhoto(title, done) {
    fetch("https://en.wikipedia.org/api/rest_v1/page/media-list/" + encodeURIComponent(title))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var items = (j && j.items) || [], i, it, src, label;
        for (i = 0; i < items.length; i++) {
          it = items[i];
          if (it.type && it.type !== "image") continue;
          label = String(it.title || it.caption || "");
          src = "";
          if (it.srcset && it.srcset.length) src = it.srcset[0].src;
          if (!src && it.original && it.original.source) src = it.original.source;
          if (!src) continue;
          if (photoLooksBad({ photo: src, title: label, text: "" })) continue;
          done(src);
          return;
        }
        done("");
      })
      .catch(function () { done(""); });
  }
  function fetchWikiClean(title, done) {
    fetchWiki(title, function (hit) {
      if (!hit) { done(null); return; }
      if (!photoLooksBad(hit)) { done(hit); return; }
      pickCleanPhoto(title, function (url) {
        hit.photo = url || "";
        done(hit);
      });
    });
  }
  function tryWiki(titles, done) {
    var i = 0;
    function next() {
      if (i >= titles.length) { done(null); return; }
      fetchWikiClean(titles[i++], function (hit) { if (hit) done(hit); else next(); });
    }
    next();
  }
  function listByIso(list, f) {
    var iso = padId(fid(f)), out = [], i;
    for (i = 0; i < list.length; i++) if (padId(list[i].iso) === iso) out.push(list[i]);
    return out;
  }
  function hideSubjects() {
    var box = document.getElementById("subjects");
    if (box) box.classList.add("hidden");
  }
  function paintSubjectOn() {
    var box = document.getElementById("subjects");
    if (!box) return;
    var chips = box.querySelectorAll(".chip"), i;
    for (i = 0; i < chips.length; i++) {
      chips[i].classList.toggle("on", chips[i].getAttribute("data-topic") === exploreTopic);
    }
  }
  function buildSubjects() {
    var box = document.getElementById("subjects");
    if (!box) return;
    if (mode !== "explore" || !exploreFeat) { hideSubjects(); return; }
    box.classList.remove("hidden");
    if (box.getAttribute("data-ready") === "1") { paintSubjectOn(); return; }
    box.innerHTML = "";
    EXPLORE_TOPICS.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (t.id === exploreTopic ? " on" : "");
      b.setAttribute("data-topic", t.id);
      b.textContent = t.label;
      box.appendChild(b);
    });
    box.setAttribute("data-ready", "1");
    box.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest(".chip") : null;
      if (!b) return;
      e.preventDefault();
      e.stopPropagation();
      var id = b.getAttribute("data-topic");
      if (!id || id === exploreTopic) return;
      exploreTopic = id;
      exploreDish = 0;
      paintSubjectOn();
      loadExploreTopic();
    });
  }

  function foodsOf(f) {
    var pack = window.COUNTRY_FOODS || {};
    var id = padId(fid(f));
    if (pack[id] && pack[id].length) return pack[id];
    var n = niceName(f);
    if (pack[n] && pack[n].length) return pack[n];
    if (setId === "us" && pack["840"]) return pack["840"];
    return [];
  }
  function mergeRecipeTable(rows) {
    if (!rows || !rows.length) return "";
    var narrow = (window.innerWidth || 400) < 520;
    var i, r, c, html, span, k, cols = 0;
    if (narrow) {
      html = '<div class="recipe-stack">';
      for (i = 0; i < rows.length; i++) {
        r = rows[i];
        html += "<div class='recipe-row'><div class='ing'>" + escapeHtml(r.ing) + "</div><div class='acts'>";
        for (c = 0; c < (r.cells || []).length; c++) {
          if (r.cells[c]) html += "<div class='act'>" + escapeHtml(r.cells[c]) + "</div>";
        }
        html += "</div></div>";
      }
      html += "</div>";
      return html;
    }
    for (i = 0; i < rows.length; i++) cols = Math.max(cols, (rows[i].cells || []).length);
    var skip = [];
    for (i = 0; i < rows.length; i++) skip[i] = [];
    html = '<div class="recipe-wrap"><table class="recipe">';
    for (i = 0; i < rows.length; i++) {
      r = rows[i];
      html += "<tr><td class='ing'>" + escapeHtml(r.ing) + "</td>";
      for (c = 0; c < cols; c++) {
        if (skip[i][c]) continue;
        var val = (r.cells && r.cells[c]) || "";
        span = 1;
        for (k = i + 1; k < rows.length; k++) {
          var nv = (rows[k].cells && rows[k].cells[c]) || "";
          if (nv && val && nv === val) { span++; skip[k][c] = 1; }
          else break;
        }
        var cls = span > 1 ? "act merge" : "act";
        html += "<td class='" + cls + "'";
        if (span > 1) html += " rowspan='" + span + "'";
        html += ">" + escapeHtml(val) + "</td>";
      }
      html += "</tr>";
    }
    html += "</table></div>";
    return html;
  }
  function escapeHtml(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function renderFoodCard(f) {
    var dishes = foodsOf(f);
    var names = dishes.map(function (d) { return d.name; });
    renderFactCard("Food", names.length ? names : ["No dishes on file yet."]);
    var box = document.getElementById("placeFact");
    if (!box) return;
    var picks = document.createElement("div");
    picks.className = "dish-picks";
    picks.id = "dishPicks";
    dishes.forEach(function (d, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (exploreDish === i ? " on" : "");
      b.textContent = d.name;
      b.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        exploreDish = i;
        renderFoodCard(f);
      });
      picks.appendChild(b);
    });
    box.appendChild(picks);
    if (dishes[exploreDish]) {
      var wrap = document.createElement("div");
      wrap.id = "recipeBox";
      wrap.innerHTML = mergeRecipeTable(dishes[exploreDish].rows);
      box.appendChild(wrap);
      var wiki = dishes[exploreDish].wiki;
      if (wiki) {
        fetchWikiClean(wiki.replace(/_/g, " "), function (hit) {
          if (exploreTopic !== "food" || exploreFeat !== f) return;
          if (hit && hit.photo && !photoLooksBad(hit)) showExplorePhotoUrl(hit.photo, dishes[exploreDish].name);
          else showExplorePhotoUrl("", "");
        });
      }
    }
  }
  function splitSentences(s) {
    s = String(s || "").replace(/\s+/g, " ").trim();
    if (!s) return [];
    var out = [], start = 0, i, ch;
    for (i = 0; i < s.length && out.length < 4; i++) {
      ch = s.charAt(i);
      if ((ch === "." || ch === "!" || ch === "?") && (i + 1 >= s.length || s.charAt(i + 1) === " ")) {
        var bit = s.slice(start, i + 1).trim();
        if (bit && bit.length > 2) out.push(bit.replace(/\.$/, ""));
        start = i + 1;
      }
    }
    if (!out.length && s) out.push(s.length > 140 ? s.slice(0, 137) + "\u2026" : s);
    return out;
  }
  function setExploreCard(on) {
    var plate = document.getElementById("plate");
    var hud = document.getElementById("hud");
    var dock = document.getElementById("homeDock");
    var home = document.getElementById("homeBtn");
    if (plate) {
      plate.classList.toggle("explore-card", !!on);
      plate.classList.toggle("explore-sheet", mode === "explore" && !!on);
      plate.classList.toggle("explore-slim", mode === "explore" && !on);
    }
    if (hud) hud.classList.toggle("explore-hud", mode === "explore");
    if (mode === "explore") {
      if (dock) dock.classList.add("hidden");
      if (home) home.classList.remove("hidden");
    } else {
      if (dock) dock.classList.remove("hidden");
      if (home) home.classList.add("hidden");
    }
  }
  function pulseKnown() {
    var el = document.getElementById("meta");
    if (!el) return;
    el.classList.remove("pop");
    void el.offsetWidth;
    el.classList.add("pop");
    setTimeout(function () { el.classList.remove("pop"); }, 700);
  }
  function renderFactCard(title, bits) {
    var el = document.getElementById("placeFact");
    if (!el) return;
    el.classList.add("cardish");
    el.classList.remove("hidden");
    el.innerHTML = "";
    var h = document.createElement("div");
    h.className = "fact-title";
    h.textContent = title;
    el.appendChild(h);
    var ul = document.createElement("ul");
    ul.className = "fact-list";
    if (!bits || !bits.length) bits = ["Nothing short on this yet."];
    var i, li, seen = {};
    for (i = 0; i < bits.length && ul.childNodes.length < 4; i++) {
      var t = String(bits[i] || "").replace(/\s+/g, " ").trim();
      if (!t || seen[t]) continue;
      seen[t] = 1;
      li = document.createElement("li");
      li.textContent = t;
      ul.appendChild(li);
    }
    el.appendChild(ul);
  }
  function showExplorePhotoUrl(url, alt) {
    var img = document.getElementById("lmPhoto");
    if (!img) return;
    if (!url) {
      img.classList.add("hidden");
      img.removeAttribute("src");
      img.alt = "";
      return;
    }
    img.alt = alt || "";
    img.classList.remove("hidden");
    img.src = url;
  }
  function applyExploreHit(hit, extra) {
    var bits = [];
    if (extra) {
      if (Object.prototype.toString.call(extra) === "[object Array]") bits = extra.slice();
      else bits = splitSentences(extra);
    }
    if (hit && hit.text) bits = bits.concat(splitSentences(hit.text));
    renderFactCard(topicLabel(exploreTopic), bits);
    if (hit && hit.photo && photoLooksBad(hit)) hit.photo = "";
    showExplorePhotoUrl(hit && hit.photo, (hit && hit.title) || "");
  }
  function loadExploreTopic() {
    var f = exploreFeat;
    if (mode !== "explore" || !f) { hideSubjects(); return; }
    var topic = exploreTopic || "overview";
    var key = padId(fid(f)) + ":" + topic;
    var req = ++exploreReq;
    var name = niceName(f);
    var cached = exploreCache[key];
    showExplorePhotoUrl("", "");
    if (cached) { applyExploreHit(cached.hit, cached.extra); return; }
    var el = document.getElementById("placeFact");
    if (el) renderFactCard(topicLabel(topic), ["Looking it up\u2026"]);
    function finish(hit, extra) {
      if (req !== exploreReq || exploreFeat !== f || exploreTopic !== topic) return;
      exploreCache[key] = { hit: hit, extra: extra || "" };
      applyExploreHit(hit, extra);
    }
    if (topic === "overview") {
      tryWiki([name], function (hit) { finish(hit, ""); });
      return;
    }
    if (topic === "capital") {
      var cap = capitalOf(f);
      var extra = cap ? (cap + " is the capital.") : "";
      if (!cap) { finish(null, "No capital on file for this place."); return; }
      tryWiki([cap], function (hit) { finish(hit, extra); });
      return;
    }
    if (topic === "people") {
      var folks = listByIso(BIRTHS, f).slice(0, 4);
      if (folks.length) {
        extra = folks.map(function (x) { return x.known ? (x.name + " · " + x.known) : x.name; });
        fetchWikiClean(folks[0].wiki.replace(/_/g, " "), function (hit) { finish({ photo: hit && hit.photo, title: hit && hit.title, text: "" }, extra); });
        return;
      }
      tryWiki(["Culture of " + name], function (hit) { finish(hit, ""); });
      return;
    }
    if (topic === "food") {
      exploreDish = 0;
      showExplorePhotoUrl("", "");
      renderFoodCard(f);
      return;
    }
    if (topic === "history") {
      tryWiki(["History of " + name], function (hit) { finish(hit, ""); });
      return;
    }
    if (topic === "landmarks") {
      var marks = listByIso(LANDMARKS, f).slice(0, 4);
      if (marks.length) {
        extra = marks.map(function (x) { return x.name; });
        fetchWikiClean(marks[0].wiki.replace(/_/g, " "), function (hit) { finish({ photo: hit && hit.photo, title: hit && hit.title, text: "" }, extra); });
        return;
      }
      tryWiki(["Landmarks of " + name, name + " landmarks"], function (hit) { finish(hit, ""); });
      return;
    }
    if (topic === "nature") {
      var nat = listByIso(NATURE, f).slice(0, 4);
      if (nat.length) {
        extra = nat.map(function (x) { return x.name; });
        fetchWiki(nat[0].wiki.replace(/_/g, " "), function (hit) { finish({ photo: hit && hit.photo, title: hit && hit.title, text: "" }, extra); });
        return;
      }
      tryWiki(["Geography of " + name, "Wildlife of " + name], function (hit) { finish(hit, ""); });
      return;
    }
  }
  function holdExplore() {
    exploreHold = true;
    idleT = 0;
    if (map) { try { map.stop(); } catch (e) {} }
  }
  function featArea(f) {
    try { return Math.abs(d3.geoArea(f)); } catch (e) { return 1; }
  }
  function pickCountry(e) {
    if (!e || !e.lngLat) return null;
    var pt = [e.lngLat.lng, e.lngLat.lat];
    var src = playFeatures();
    var found = [], i;
    for (i = 0; i < src.length; i++) {
      try { if (d3.geoContains(src[i], pt)) found.push(src[i]); } catch (err) {}
    }
    if (found.length) {
      found.sort(function (a, b) { return featArea(a) - featArea(b); });
      return found[0];
    }
    return null;
  }
  function holdOnCountry(f) {
    holdExplore();
    camArm = Date.now() + 400;
    if (!map || !f || !f.__c) return;
    var z = Math.max(map.getZoom(), setId === "us" ? 3.1 : 2.4);
    var pad = { top: 12, bottom: Math.round((window.innerHeight || 700) * 0.42), left: 10, right: 64 };
    try {
      map.jumpTo({ center: [f.__c[0], f.__c[1]], zoom: z, padding: pad });
    } catch (e) {
      goTo(f.__c[0], f.__c[1], 400);
    }
  }
  function clearExplore() {
    exploreFeat = null;
    exploreHold = false;
    exploreTopic = "overview";
    exploreDish = 0;
    hideSubjects();
    hideLandmarkPhoto();
    var rw = document.getElementById("recipeBox");
    if (rw) rw.innerHTML = "";
  }
  function hideLandmarkPhoto() {
    var img = document.getElementById("lmPhoto");
    if (!img) return;
    img.classList.add("hidden");
    img.removeAttribute("src");
    img.alt = "";
  }
  function showLandmarkPhoto(lm) {
    var img = document.getElementById("lmPhoto");
    if (!img) return;
    if (!lm) { hideLandmarkPhoto(); return; }
    img.alt = lm.name;
    img.classList.remove("hidden");
    fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(lm.wiki.replace(/_/g, " ")))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j.thumbnail || !j.thumbnail.source) return;
        img.src = j.thumbnail.source;
      })
      .catch(function () {});
  }
  function titleCase(s) {
    if (s === "us") return "United States";
    if (s === "capitals") return "Capitals";
    if (s === "landmarks") return "Landmarks";
    if (s === "flags") return "Flags";
    if (s === "nature") return "Nature";
    if (s === "birthplaces") return "People";
    if (s === "mixed") return "Mixed bag";
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function setLabel() {
    for (var i = 0; i < SETS.length; i++) if (SETS[i].id === setId) return SETS[i].label;
    return "";
  }

  var actx = null;
  function ensureAudio() {
    if (muted) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!actx) actx = new AC();
    if (actx.state === "suspended") actx.resume();
  }
  function tone(freq, dur, gain) {
    if (muted || !actx) return;
    try {
      var o = actx.createOscillator();
      var g = actx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(gain || 0.035, actx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
      o.connect(g); g.connect(actx.destination);
      o.start(); o.stop(actx.currentTime + dur);
    } catch (e) {}
  }
  function sfx(kind) {
    if (muted) return;
    ensureAudio();
    if (kind === "ok") { tone(523, 0.1, 0.03); setTimeout(function () { tone(784, 0.14, 0.03); }, 70); }
    else if (kind === "miss") tone(196, 0.22, 0.025);
    else if (kind === "tap") tone(420, 0.04, 0.018);
    else if (kind === "hint") tone(330, 0.1, 0.02);
  }
  function speak(text) {
    if (muted) return;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95; u.pitch = 1; u.volume = 0.65;
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  var map = null, starMarker = null, starNode = null;
  var world = [], states = [];
  var mapReady = false, dataReady = false, playReady = false;
  var reduced = false;
  var mode = "explore", setId = "all", screen = "title";
  var score = 0, streak = 0, qIndex = 0, qTotal = 0, deck = [], target = null, correctCount = 0, playerName = "";
  var locked = false, teach = null, flash = null, hintOn = false, hintT = 0, guessesLeft = 3, landmark = null, clueKind = null, missedIds = {};
  var toastT = 0, pulseT = 0, exploreFeat = null, hoverId = null, idleT = 0, exploreHold = false, exploreTopic = "overview", exploreReq = 0, exploreCache = {}, exploreArm = 0, exploreDish = 0, tap0 = null, camArm = 0;
  var hlIds = [];

  try { reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  function playFeatures() { return setId === "us" ? states : world; }
  function quizPool() {
    var src = playFeatures();
    if (setId === "capitals") {
      return src.filter(function (f) { return !!capitalOf(f); });
    }
    if (setId === "flags") {
      return src.filter(function (f) { return !!iso2Of(f); });
    }
    if (setId === "all" || setId === "us") return src.slice();
    return src.filter(function (f) { return regionOf(f) === setId; });
  }
  function findByFid(id) {
    if (id == null || id === "") return null;
    var sid = String(id);
    var pad = padId(id);
    var src = playFeatures();
    for (var i = 0; i < src.length; i++) {
      var k = fid(src[i]);
      if (k === sid || padId(k) === pad) return src[i];
    }
    return null;
  }
  function landmarkByWiki(wiki) {
    for (var i = 0; i < LANDMARKS.length; i++) if (LANDMARKS[i].wiki === wiki) return LANDMARKS[i];
    return null;
  }
  function matchFeat(ml) {
    if (!ml) return null;
    var id = ml.id != null && ml.id !== "" ? String(ml.id) : "";
    if (!id && ml.properties) id = String(ml.properties.id || ml.properties.name || "");
    return findByFid(id);
  }
  function playCollection() {
    return { type: "FeatureCollection", features: playFeatures() };
  }
  function emptyFC() { return { type: "FeatureCollection", features: [] }; }

  function goTo(lon, lat, ms) {
    if (!map) return;
    idleT = 0;
    map.easeTo({
      center: [lon, lat],
      duration: ms || 800,
      zoom: Math.max(map.getZoom(), setId === "us" ? 3.1 : 2.1)
    });
  }
  function lookAtSet() {
    var sr = SET_ROT[setId] || SET_ROT.all;
    goTo(-sr[0], -sr[1], 1000);
  }
  function setMapInteractive(on) {
    if (!map) return;
    var keys = ["dragPan", "scrollZoom", "boxZoom", "doubleClickZoom", "touchZoomRotate", "touchPitch", "keyboard", "dragRotate"];
    for (var i = 0; i < keys.length; i++) {
      var h = map[keys[i]];
      if (!h) continue;
      if (on) h.enable(); else h.disable();
    }
  }
  function makeStarEl() {
    var el = document.createElement("div");
    el.className = "star-mark";
    el.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="#ffe44a" stroke="#fff8e8" stroke-width="1.35" stroke-linejoin="round" d="M12 2.2l2.7 6.4 7 .7-5.3 4.7 1.6 6.9L12 17.4 5.99 20.9l1.61-6.9L2.3 9.3l7-.7z"/></svg>';
    starNode = el;
    return el;
  }
  function hideStar() {
    if (starMarker) {
      starMarker.remove();
      starMarker = null;
    }
    starNode = null;
  }
  function showStar(ll) {
    hideStar();
    if (!map || !ll) return;
    starMarker = new maplibregl.Marker({ element: makeStarEl(), anchor: "center" })
      .setLngLat(ll)
      .addTo(map);
  }
  function setArrow(fromLL, toLL) {
    if (!map || !map.getSource("arrow")) return;
    if (!fromLL || !toLL || !window.d3) {
      map.getSource("arrow").setData(emptyFC());
      return;
    }
    var interp = d3.geoInterpolate(fromLL, toLL);
    var coords = [];
    for (var i = 0; i <= 32; i++) coords.push(interp(i / 32));
    map.getSource("arrow").setData({
      type: "FeatureCollection",
      features: [{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coords } }]
    });
  }
  function clearArrow() {
    if (map && map.getSource("arrow")) map.getSource("arrow").setData(emptyFC());
  }
  function syncHl() {
    if (!map || !playReady) return;
    var i, id;
    for (i = 0; i < hlIds.length; i++) {
      try { map.setFeatureState({ source: "play", id: hlIds[i] }, { hl: null }); } catch (e) {}
    }
    hlIds = [];
    function paint(f, kind) {
      if (!f || !kind) return;
      id = fid(f);
      if (!id) return;
      hlIds.push(id);
      try { map.setFeatureState({ source: "play", id: id }, { hl: kind }); } catch (e) {}
    }
    if (hintOn && target) {
      var src = playFeatures();
      if (setId === "us") {
        var area = US_AREA[String(target.id).padStart(2, "0")];
        for (i = 0; i < src.length; i++) {
          if (US_AREA[String(src[i].id).padStart(2, "0")] === area) paint(src[i], "gold");
        }
      } else {
        var rg = regionOf(target);
        for (i = 0; i < src.length; i++) if (regionOf(src[i]) === rg) paint(src[i], "gold");
      }
    }
    if (exploreFeat) paint(exploreFeat, "cream");
    if (hoverId && mode !== "explore") paint(findByFid(hoverId), "cream");
    if (flash) paint(findByFid(flash.id), flash.ok ? "sage" : "rose");
    if (teach && teach.wrong) paint(teach.wrong, "rose");
    if (teach && teach.right) paint(teach.right, teach.hit ? "sage" : "gold");
  }
  function refreshPlay() {
    if (!map || !map.getSource("play")) return;
    map.getSource("play").setData(playCollection());
    syncHl();
  }
  function addPlayLayers() {
    if (!map || playReady || !mapReady || !dataReady) return;
    map.addSource("play", {
      type: "geojson",
      data: playCollection(),
      promoteId: "id"
    });
    map.addLayer({
      id: "play-fill",
      type: "fill",
      source: "play",
      paint: { "fill-color": "#000", "fill-opacity": 0.01 }
    });
    map.addLayer({
      id: "play-hl",
      type: "fill",
      source: "play",
      paint: {
        "fill-color": [
          "match", ["coalesce", ["feature-state", "hl"], "none"],
          "sage", "#7d9a74",
          "rose", "#b56a64",
          "gold", "#e8c37a",
          "cream", "#efe4c4",
          "rgba(0,0,0,0)"
        ],
        "fill-opacity": [
          "match", ["coalesce", ["feature-state", "hl"], "none"],
          "sage", 0.62,
          "rose", 0.55,
          "gold", 0.4,
          "cream", 0.42,
          0
        ]
      }
    });
    map.addLayer({
      id: "play-line",
      type: "line",
      source: "play",
      paint: {
        "line-color": "rgba(243,234,214,0.88)",
        "line-width": 1.1
      }
    });
    map.addLayer({
      id: "play-sel",
      type: "line",
      source: "play",
      paint: {
        "line-color": [
          "match", ["coalesce", ["feature-state", "hl"], "none"],
          "cream", "#ffe44a",
          "sage", "#d8f0c8",
          "gold", "#e8c37a",
          "rose", "#f0b0aa",
          "rgba(0,0,0,0)"
        ],
        "line-width": [
          "match", ["coalesce", ["feature-state", "hl"], "none"],
          "cream", 3.4,
          "sage", 2.8,
          "gold", 2.6,
          "rose", 2.6,
          0
        ]
      }
    });
    map.addSource("arrow", { type: "geojson", data: emptyFC() });
    map.addLayer({
      id: "arrow-line",
      type: "line",
      source: "arrow",
      paint: {
        "line-color": "#ffe44a",
        "line-width": 2.4,
        "line-opacity": 0.92
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
  function onMapClick(e) {
    if (screen !== "play" || !playReady) return;
    if (mode !== "explore" && locked) return;
    var lngLat = [e.lngLat.lng, e.lngLat.lat];
    if (mode === "explore") {
      if (Date.now() < exploreArm || Date.now() < camArm) return;
      if (tap0 && e.point && (Math.abs(e.point.x - tap0.x) > 12 || Math.abs(e.point.y - tap0.y) > 12)) return;
      holdExplore();
      var f = pickCountry(e);
      if (!f) {
        if (!exploreFeat) exploreHold = false;
        return;
      }
      exploreFeat = f;
      exploreTopic = "overview";
      hoverId = fid(f);
      var wasNew = !learned[fid(f)];
      markLearned(f);
      sfx("tap");
      speak(niceName(f));
      holdOnCountry(f);
      updatePlate();
      syncHl();
      if (wasNew) pulseKnown();
      loadExploreTopic();
      return;
    }
    var f = pickCountry(e);
    if (!target) return;
    if (!f) { miss(null, lngLat); return; }
    if (fid(f) === fid(target)) correct(f);
    else miss(f, lngLat);
  }
  function onMapMove(e) {
    if (!playReady || screen !== "play" || locked) return;
    if (mode === "explore") return;
    var hits = map.queryRenderedFeatures(e.point, { layers: ["play-fill"] });
    var f = hits.length ? matchFeat(hits[0]) : null;
    var id = f ? fid(f) : null;
    if (id !== hoverId) {
      hoverId = id;
      try { map.getCanvas().style.cursor = id ? "pointer" : ""; } catch (err) {}
      syncHl();
    }
  }
  function maybeIdleSpin() {
    if (!map || reduced) return;
    if (exploreHold) return;
    if (!(screen === "title" || (screen === "play" && mode === "explore" && !exploreFeat))) return;
    if (map.isMoving()) return;
    var c = map.getCenter();
    map.easeTo({
      center: [c.lng + 25, c.lat],
      duration: 16000,
      easing: function (t) { return t; }
    });
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
        sky: {
          "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 1, 5, 1, 7, 0]
        }
      },
      center: [-20, 12],
      zoom: 1.2,
      minZoom: 0.55,
      maxZoom: 6.2,
      pitch: 0,
      maxPitch: 35,
      attributionControl: true,
      renderWorldCopies: false,
      antialias: true,
      failIfMajorPerformanceCaveat: false
    });
    map.on("load", function () {
      mapReady = true;
      setMapInteractive(false);
      addPlayLayers();
      maybeHideLoad();
      idleT = 0;
    });
    map.on("error", function () {});
    map.on("click", onMapClick);
    map.on("mousedown", function (e) { if (e && e.point) tap0 = { x: e.point.x, y: e.point.y }; idleT = 0; });
    map.on("touchstart", function (e) { if (e && e.point) tap0 = { x: e.point.x, y: e.point.y }; idleT = 0; });
    map.on("dragstart", function () { idleT = 0; });
    map.on("mousemove", onMapMove);
    map.on("mouseout", function () {
      if (hoverId) { hoverId = null; syncHl(); }
    });
  }

  function showToast(t, ms) {
    var el = document.getElementById("toast");
    el.textContent = t;
    el.style.opacity = 1;
    toastT = (ms || 1400) / 1000;
  }
  function refreshMute() {
    var b = document.getElementById("muteBtn");
    b.textContent = "\u266a";
    b.style.opacity = muted ? 0.45 : 1;
    b.setAttribute("aria-label", muted ? "Sound is off" : "Sound is on");
  }
  function updatePlate() {
    var k = document.getElementById("kicker");
    var n = document.getElementById("placeName");
    var m = document.getElementById("meta");
    var hint = document.getElementById("hintBtn");
    if (mode === "explore") {
      k.textContent = "Explore";
      n.textContent = exploreFeat ? niceName(exploreFeat) : "Tap a country";
      m.textContent = exploreFeat
        ? ("Places known · " + learnedCount() + " · " + titleCase(regionOf(exploreFeat)))
        : ("Places known · " + learnedCount());
      hint.classList.add("hidden");
      showFlag(exploreFeat, true);
      buildSubjects();
      setExploreCard(!!exploreFeat);
      if (!exploreFeat) {
        hideSubjects();
        hideLandmarkPhoto();
        var pf = document.getElementById("placeFact");
        if (pf) { pf.classList.remove("cardish"); pf.innerHTML = ""; pf.classList.add("hidden"); }
      }
    } else {
      setExploreCard(false);
      hideSubjects();
      k.textContent = (locked && teach && teach.hit)
        ? "That's right"
        : (playKind() === "birthplaces" ? "Where were they born"
          : ((playKind() === "landmarks" || playKind() === "nature" || playKind() === "capitals" || playKind() === "flags")
          ? "Which country"
          : (target ? (qIndex + " of " + qTotal + " · " + setLabel()) : "Quiz")));
      n.textContent = target ? promptName(target) : "—";
      var tries = guessesLeft === 1 ? "1 try left" : (guessesLeft + " tries left");
      m.textContent = (target ? (qIndex + " of " + qTotal + " · ") : "") + correctCount + " right  ·  " + tries;
      hint.textContent = setId === "us" ? "Hint · region" : "Hint · continent";
      hint.classList.toggle("hidden", !target || locked);
      var next = document.getElementById("nextBtn");
      if (next) next.classList.toggle("hidden", !(locked && teach));
      showFlag(target, locked);
      showFact(target, locked);
      if (isWikiSet() && landmark) showLandmarkPhoto(landmark);
      else hideLandmarkPhoto();
    }
    syncHl();
  }
  function refreshTitleKnown() {
    var best = 0, k;
    for (k in bests) if ((bests[k] || 0) > best) best = bests[k];
    var el = document.getElementById("titleKnown");
    if (!el) return;
    if (best) el.textContent = "Your rating: " + best + " / 10, " + ratingFor(best);
    else el.textContent = "Ten countries. Keep your rating.";
  }

  function readName() {
    var el = document.getElementById("playerName");
    playerName = cleanName(el && el.value);
    if (playerName) storeSet("atlas.name", playerName);
    return playerName;
  }
  function fillName() {
    playerName = cleanName(storeGet("atlas.name") || "");
    var el = document.getElementById("playerName");
    if (el && playerName) el.value = playerName;
  }
  function inviteFriends() {
    var text = "Play The World by Mark with me. Ten countries. Put your name on the board.";
    if (navigator.share) {
      navigator.share({ title: "The World by Mark", text: text, url: SHARE }).catch(function () {});
      return;
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SHARE).then(function () {
          showToast("Link copied. Send it to a friend.", 2200);
        });
        return;
      }
    } catch (e) {}
    window.prompt("Copy this link", SHARE);
  }
  function boardRows(records) {
    var best = {}, i, r, d, name, n;
    for (i = 0; i < records.length; i++) {
      r = records[i] || {};
      d = r.data || r;
      name = cleanName(d.name);
      n = Number(d.correct);
      if (!name || isNaN(n)) continue;
      if (!best[name] || n > best[name].correct) best[name] = { name: name, correct: n, rating: d.rating || ratingFor(n) };
    }
    return Object.keys(best).map(function (k) { return best[k]; })
      .sort(function (a, b) { return b.correct - a.correct || a.name.localeCompare(b.name); })
      .slice(0, 12);
  }
  function paintBoard(id, rows) {
    var el = document.getElementById(id);
    if (!el) return;
    if (!rows.length) {
      el.innerHTML = "<h3>Friends</h3><div class=\"empty\">No friends on the board yet. Invite someone.</div>";
      return;
    }
    var html = "<h3>Friends</h3>";
    for (var i = 0; i < rows.length; i++) {
      html += "<div class=\"rowl\"><span>" + (i + 1) + "</span><span>" + rows[i].name +
        "</span><span class=\"rate\">" + rows[i].correct + " · " + rows[i].rating + "</span></div>";
    }
    el.innerHTML = html;
  }
  var boardCache = [];
  function localBoard() { return loadJSON("atlas.board", []); }
  function saveLocalBoard(rows) { storeSet("atlas.board", JSON.stringify(rows)); }
  function mergeLocal(rec) {
    var rows = localBoard();
    rows.push(rec);
    saveLocalBoard(rows);
    return rows;
  }
  function renderBoard(id) {
    paintBoard(id || "titleBoard", boardRows(boardCache.length ? boardCache : localBoard()));
  }
  function loadBoard() {
    fetch("./.herenow/data/scores?limit=100", { headers: { "Accept": "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error("board"); return r.json(); })
      .then(function (j) {
        boardCache = (j && j.records) ? j.records : [];
        renderBoard("titleBoard");
        renderBoard("endBoard");
      })
      .catch(function () {
        boardCache = localBoard();
        renderBoard("titleBoard");
        renderBoard("endBoard");
      });
  }
  function postScore(name, correct, rating, set) {
    if (!name) return;
    var rec = { name: name, correct: correct, rating: rating, set: set || "all" };
    mergeLocal({ data: rec });
    fetch("./.herenow/data/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(rec)
    }).then(function (r) {
      if (r.ok) return r.json();
      return fetch("./.herenow/data/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ data: rec })
      }).then(function (r2) { return r2.ok ? r2.json() : null; });
    }).then(function () { loadBoard(); }).catch(function () { renderBoard("endBoard"); });
  }
  function clearResume() { try { localStorage.removeItem("atlas.resume"); } catch (e) {} refreshResumeBtn(); }
  function hasResume() { return !!loadJSON("atlas.resume", null); }
  function refreshResumeBtn() {
    var b = document.getElementById("resumeBtn");
    if (!b) return;
    b.classList.toggle("hidden", !hasResume());
  }
  function saveResume() {
    if (mode !== "quiz" || screen !== "play" || !target) { clearResume(); return; }
    var deckIds;
    if (setId === "mixed") {
      deckIds = deck.slice();
    } else if (isWikiSet()) {
      deckIds = deck.map(function (x) { return x.wiki; });
    } else {
      deckIds = deck.map(function (f) { return fid(f); });
    }
    storeSet("atlas.resume", JSON.stringify({
      setId: setId,
      score: score,
      streak: streak,
      correctCount: correctCount,
      qIndex: qIndex,
      qTotal: qTotal,
      guessesLeft: guessesLeft,
      missedIds: Object.keys(missedIds),
      locked: locked,
      hold: !!(locked && teach),
      hit: !!(teach && teach.hit),
      targetId: setId === "mixed" ? landmark : (isWikiSet() ? (landmark && landmark.wiki) : fid(target)),
      clueKind: clueKind,
      deckIds: deckIds,
      name: playerName
    }));
    refreshResumeBtn();
  }
  function restoreQuiz() {
    var snap = loadJSON("atlas.resume", null);
    if (!snap) { startQuiz(); return; }
    setId = snap.setId || "all";
    playerName = cleanName(snap.name || playerName);
    score = snap.score || 0;
    streak = snap.streak || 0;
    correctCount = snap.correctCount || 0;
    qIndex = Math.max(0, (snap.qIndex || 1) - 1);
    qTotal = snap.qTotal || 10;
    guessesLeft = snap.guessesLeft == null ? 3 : snap.guessesLeft;
    missedIds = {};
    (snap.missedIds || []).forEach(function (id) { missedIds[id] = true; });
    hintOn = false;
    if (snap.setId === "mixed") {
      deck = snap.deckIds || [];
      landmark = snap.targetId || null;
      clueKind = (landmark && landmark.kind) || snap.clueKind || null;
      target = landmark ? findByFid(landmark.iso) : null;
    } else if (snap.setId === "landmarks" || snap.setId === "nature" || snap.setId === "birthplaces") {
      clueKind = snap.setId;
      deck = (snap.deckIds || []).map(wikiByKey).filter(Boolean);
      landmark = wikiByKey(snap.targetId);
      target = landmark ? findByFid(landmark.iso) : null;
    } else {
      clueKind = snap.setId;
      landmark = null;
      deck = (snap.deckIds || []).map(findByFid).filter(Boolean);
      target = findByFid(snap.targetId);
    }
    if (!target) { startQuiz(); return; }
    qIndex = snap.qIndex || 1;
    if (snap.hold) {
      locked = true;
      teach = { hit: !!snap.hit, right: target, toLonLat: target.__c || [0, 0], t: 0 };
      if (snap.hit && target.__c) showStar(target.__c);
    } else {
      locked = false;
      teach = null;
    }
    updatePlate();
    syncHl();
  }
  function enterPlay(nextMode, resume) {
    readName();
    if (nextMode === "quiz" && !playerName) {
      showToast("Put your name on first.", 1800);
      var inp = document.getElementById("playerName");
      if (inp) inp.focus();
      return;
    }
    mode = nextMode;
    screen = "play";
    document.getElementById("title").classList.add("hidden");
    document.getElementById("end").classList.add("hidden");
    document.getElementById("hud").classList.remove("hidden");
    setMapInteractive(true);
    refreshPlay();
    lookAtSet();
    if (mode === "quiz") {
      if (resume) restoreQuiz();
      else { clearResume(); startQuiz(); }
    } else { locked = false; target = null; landmark = null; clearExplore(); exploreArm = Date.now() + 1600; updatePlate(); }
    if (!seenHow) openHow(true);
    else document.getElementById("howto").classList.add("hidden");
  }
  function startQuiz() {
    clueKind = null;
    if (setId === "mixed") deck = shuffle(mixedPool()).slice(0, 10);
    else if (isWikiSet()) deck = shuffle(wikiList().slice()).slice(0, 10);
    else deck = shuffle(quizPool()).slice(0, 10);
    qTotal = deck.length;
    qIndex = 0;
    score = 0;
    correctCount = 0;
    streak = 0;
    hintOn = false;
    landmark = null;
    nextQ();
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = (Math.random() * (i + 1)) | 0;
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function nextQ() {
    teach = null;
    flash = null;
    hintOn = false;
    locked = false;
    guessesLeft = 3;
    missedIds = {};
    hoverId = null;
    toastT = 0;
    hideStar();
    clearArrow();
    var toastEl = document.getElementById("toast");
    if (toastEl) toastEl.style.opacity = 0;
    var next = document.getElementById("nextBtn");
    if (next) next.classList.add("hidden");
    if (!deck.length) { finishQuiz(); return; }
    if (setId === "mixed") {
      landmark = deck.pop();
      clueKind = landmark && landmark.kind;
      target = landmark ? findByFid(landmark.iso) : null;
      if (!target) { nextQ(); return; }
    } else if (isWikiSet()) {
      landmark = deck.pop();
      clueKind = setId;
      target = landmark ? findByFid(landmark.iso) : null;
      if (!target) { nextQ(); return; }
    } else {
      landmark = null;
      clueKind = setId;
      target = deck.pop();
    }
    qIndex += 1;
    updatePlate();
    syncHl();
    var k = playKind();
    var line;
    if (k === "birthplaces") line = "Where was " + promptName(target) + " born";
    else if (k === "landmarks" || k === "nature") line = "Which country is " + promptName(target);
    else if (k === "capitals") line = "Which country is " + promptName(target) + " the capital of";
    else if (k === "flags") line = "Which country is this flag";
    else line = "Find " + promptName(target);
    speak(line);
  }
  function finishQuiz() {
    screen = "end";
    target = null;
    locked = true;
    hideStar();
    clearArrow();
    setMapInteractive(false);
    var rate = ratingFor(correctCount);
    var prev = bests[setId] || 0;
    if (correctCount > prev) { bests[setId] = correctCount; saveBests(); }
    document.getElementById("hud").classList.add("hidden");
    document.getElementById("end").classList.remove("hidden");
    document.getElementById("endName").textContent = playerName || "Done";
    document.getElementById("endScore").textContent = correctCount + " / 10";
    document.getElementById("endLine").textContent = rate;
    var best = bests[setId] || correctCount;
    document.getElementById("endKnown").textContent = (correctCount >= prev && prev)
      ? "Your best. " + ratingFor(best) + "."
      : ("Your best is " + best + " / 10, " + ratingFor(best) + ".");
    postScore(playerName, correctCount, rate, setId);
    renderBoard("endBoard");
    clearResume();
  }
  function correct(f) {
    locked = true;
    hintOn = false;
    score += 100 + 10 * streak;
    correctCount += 1;
    streak += 1;
    markLearned(f);
    flash = { id: fid(f), ok: true, t: 0 };
    teach = { hit: true, right: f, toLonLat: f.__c || [0, 0], t: 0 };
    pulseT = 0;
    if (f.__c) {
      goTo(f.__c[0], f.__c[1], 700);
      showStar(f.__c);
    }
    sfx("ok");
    showToast("That's right. " + niceName(f) + ".", 80000);
    speak("That's right. " + niceName(f));
    updatePlate();
    syncHl();
  }
  function miss(f, lngLat) {
    var key = f ? fid(f) : "__water__";
    if (missedIds[key]) {
      sfx("tap");
      showToast(f
        ? ("You already tried " + niceName(f) + ". Pick a different country.")
        : "You already tried the water. Tap a country.", 1800);
      return;
    }
    missedIds[key] = true;
    guessesLeft -= 1;
    streak = 0;
    sfx("miss");
    if (f) flash = { id: fid(f), ok: false, t: 0 };
    if (guessesLeft > 0) {
      var left = guessesLeft === 1 ? "One try left." : "Two tries left.";
      var far = kmLabel(kmBetween(lngLat, target && target.__c));
      showToast(far ? ("Not that. " + far + ". " + left) : ("Not that. " + left), 1800);
      updatePlate();
      syncHl();
      return;
    }
    locked = true;
    hintOn = false;
    var fromLL = lngLat || (target.__c || [0, 0]);
    teach = {
      wrong: f,
      right: target,
      fromLonLat: fromLL,
      toLonLat: target.__c || [0, 0],
      t: 0
    };
    pulseT = 0;
    if (target.__c) goTo(target.__c[0], target.__c[1], 800);
    setArrow(fromLL, target.__c || [0, 0]);
    var cap = capitalOf(target);
    showToast("That is " + niceName(target) + (cap ? (", capital " + cap) : "") + ". Look, then Next.", 3000);
    speak("That is " + niceName(target) + (cap ? ", capital " + cap : ""));
    updatePlate();
    syncHl();
  }
  function useHint() {
    if (mode !== "quiz" || !target || locked || hintOn) return;
    hintOn = true;
    hintT = 0;
    score = Math.max(0, score - 25);
    sfx("hint");
    updatePlate();
    syncHl();
    var label = (setId === "us")
      ? (US_AREA[String(target.id).padStart(2, "0")] || "this region")
      : titleCase(regionOf(target));
    showToast("Look toward " + label + ".", 1400);
    setTimeout(function () { hintOn = false; syncHl(); }, 1600);
  }
  function openHow(first) {
    document.getElementById("howto").classList.remove("hidden");
    document.getElementById("howtoGo").textContent = first ? "Begin" : "Close";
  }
  function closeHow() {
    document.getElementById("howto").classList.add("hidden");
    seenHow = true;
    storeSet("atlas.howto", "1");
    exploreArm = Date.now() + 900;
  }
  function goHome() {
    if (screen === "play" && mode === "quiz" && target) saveResume();
    screen = "title";
    mode = "explore";
    target = null;
    landmark = null;
    teach = null;
    flash = null;
    locked = false;
    clearExplore();
    hoverId = null;
    hideStar();
    clearArrow();
    setMapInteractive(false);
    document.getElementById("hud").classList.add("hidden");
    document.getElementById("end").classList.add("hidden");
    document.getElementById("howto").classList.add("hidden");
    document.getElementById("title").classList.remove("hidden");
    refreshTitleKnown();
    refreshResumeBtn();
    syncHl();
  }
  function buildChips() {
    var box = document.getElementById("setChips");
    box.innerHTML = "";
    function addChip(s) {
      var b = document.createElement("button");
      b.className = "chip" + (s.id === setId ? " on" : "");
      b.textContent = s.label;
      b.addEventListener("click", function (e) {
        e.preventDefault();
        setId = s.id;
        Array.prototype.forEach.call(box.querySelectorAll(".chip"), function (c) { c.classList.remove("on"); });
        b.classList.add("on");
        refreshPlay();
        lookAtSet();
      });
      box.appendChild(b);
    }
    var head = document.createElement("div");
    head.className = "chip-head";
    head.textContent = "Places";
    box.appendChild(head);
    SETS.forEach(function (s) { if (s.kind !== "game") addChip(s); });
    head = document.createElement("div");
    head.className = "chip-head";
    head.textContent = "Games";
    box.appendChild(head);
    SETS.forEach(function (s) { if (s.kind === "game") addChip(s); });
  }
  function bind(id, fn) {
    var el = document.getElementById(id);
    el.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); fn(e); });
  }
  function wire() {
    bind("exploreBtn", function () { ensureAudio(); enterPlay("explore"); });
    bind("quizBtn", function () { ensureAudio(); enterPlay("quiz"); });
    bind("resumeBtn", function () { ensureAudio(); enterPlay("quiz", true); });
    bind("homeDock", goHome);
    bind("inviteBtn", inviteFriends);
    bind("endInvite", inviteFriends);
    bind("howtoGo", closeHow);
    bind("helpBtn", function () { openHow(false); });
    bind("homeBtn", goHome);
    bind("endHome", goHome);
    bind("endAgain", function () {
      document.getElementById("end").classList.add("hidden");
      enterPlay("quiz");
    });
    bind("zoomIn", function () { if (map) map.zoomIn({ duration: 280 }); idleT = 0; });
    bind("zoomOut", function () { if (map) map.zoomOut({ duration: 280 }); idleT = 0; });
    bind("hintBtn", useHint);
    bind("nextBtn", function () { if (locked && teach) nextQ(); });
    bind("muteBtn", function () {
      muted = !muted;
      storeSet("atlas.muted", muted ? "1" : "0");
      refreshMute();
      if (!muted) { ensureAudio(); sfx("tap"); }
      else { try { speechSynthesis.cancel(); } catch (e) {} }
    });
    var plateEl = document.getElementById("plate");
    if (plateEl) {
      function keepPlateScroll(e) { e.stopPropagation(); }
      ["touchstart", "touchmove", "touchend", "pointerdown", "pointermove", "wheel"].forEach(function (ev) {
        plateEl.addEventListener(ev, keepPlateScroll, { passive: true });
      });
    }
    window.addEventListener("keydown", function (e) {
      if (!map) return;
      if (e.key === "+" || e.key === "=") { map.zoomIn({ duration: 220 }); idleT = 0; }
      if (e.key === "-" || e.key === "_") { map.zoomOut({ duration: 220 }); idleT = 0; }
      if (e.key === "h" || e.key === "H") useHint();
      if (e.key === "Escape") goHome();
      if ((e.key === "Enter" || e.key === " ") && locked && teach) nextQ();
      if (e.key === "ArrowLeft") { map.panBy([-72, 0]); idleT = 0; }
      if (e.key === "ArrowRight") { map.panBy([72, 0]); idleT = 0; }
      if (e.key === "ArrowUp") { map.panBy([0, -56]); idleT = 0; }
      if (e.key === "ArrowDown") { map.panBy([0, 56]); idleT = 0; }
    });
  }
  var last = 0;
  function frame(now) {
    if (!last) last = now;
    var dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    pulseT += dt;
    if (hintOn) hintT += dt;
    if (flash) {
      flash.t += dt;
      if (flash.t > 0.7 && !(locked && teach && teach.hit)) { flash = null; syncHl(); }
    }
    if (teach) teach.t += dt;
    if (toastT > 0) {
      toastT -= dt;
      if (toastT <= 0) document.getElementById("toast").style.opacity = 0;
    }
    if (starNode && teach && teach.hit) {
      var s = 1 + 0.1 * Math.sin(pulseT * 5);
      starNode.style.transform = "scale(" + s + ")";
    }
    if (map && !reduced && (screen === "title" || (screen === "play" && mode === "explore" && !exploreHold && !exploreFeat))) {
      if (map.isMoving()) idleT = 0;
      else {
        idleT += dt;
        if (idleT > 1.1) {
          idleT = 0;
          maybeIdleSpin();
        }
      }
    }
    requestAnimationFrame(frame);
  }
  function prep(feats, kind) {
    var out = [];
    for (var i = 0; i < feats.length; i++) {
      var f = feats[i];
      if (kind === "state") {
        if (SKIP_FIPS[String(f.id)]) continue;
      } else if (isSkip(f)) continue;
      try { f.__c = d3.geoCentroid(f); } catch (e) { f.__c = [0, 0]; }
      f.id = fid(f);
      if (!f.properties) f.properties = {};
      f.properties.id = f.id;
      out.push(f);
    }
    return out;
  }
  function boot() {
    buildChips();
    fillName();
    refreshTitleKnown();
    refreshResumeBtn();
    refreshMute();
    loadBoard();
    wire();
    var nameEl = document.getElementById("playerName");
    if (nameEl) nameEl.addEventListener("change", readName);
    makeMap();
    requestAnimationFrame(frame);
    loadMaps();
  }
  function cdnNpm() { return "https://unpkg.com/"; }
  function loadMaps() {
    var h = cdnNpm();
    Promise.all([
      fetch(h + "world-atlas@2/countries-50m.json").then(function (r) { if (!r.ok) throw new Error("map"); return r.json(); }),
      fetch(h + "us-atlas@3/states-10m.json").then(function (r) { if (!r.ok) throw new Error("us"); return r.json(); })
    ]).then(function (pair) {
      world = prep(topojson.feature(pair[0], pair[0].objects.countries).features, "country");
      states = prep(topojson.feature(pair[1], pair[1].objects.states).features, "state");
      dataReady = true;
      addPlayLayers();
      maybeHideLoad();
    }).catch(function () {
      document.getElementById("loadmsg").textContent = "The atlas could not unfold.";
    });
  }
  function waitLibs() {
    if (window.maplibregl && window.d3 && window.topojson) { boot(); return; }
    var n = 0;
    var t = setInterval(function () {
      n += 1;
      if (window.maplibregl && window.d3 && window.topojson) { clearInterval(t); boot(); }
      else if (n > 80) {
        clearInterval(t);
        document.getElementById("loadmsg").textContent = "The atlas could not unfold.";
      }
    }, 100);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", waitLibs);
  else waitLibs();
})();
