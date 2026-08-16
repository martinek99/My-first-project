"use strict";
/* Home-kitchen cook cards: times, heat, and the engineering grid. */
(function (root) {
  function S(serves, prep, cook, heat, done, gear) {
    return { serves: serves, prep: prep, cook: cook, heat: heat, done: done, gear: gear };
  }
  function R(ing, cells) { return { ing: ing, cells: cells }; }
  function pack(spec, rows, note) { return { spec: spec, rows: rows, note: note || "" }; }

  function lower(s) { return String(s || "").toLowerCase(); }
  function ings(d) {
    var list = (d.shop && d.shop.length) ? d.shop.slice() : (d.rows || []).map(function (r) { return r.ing; });
    if (!list.length) list = [d.name || "main ingredient"];
    return list;
  }
  function findIng(list, re, fallback) {
    var i;
    for (i = 0; i < list.length; i++) if (re.test(lower(list[i]))) return list[i];
    return fallback;
  }
  function restIngs(list, used) {
    var out = [], i;
    for (i = 0; i < list.length; i++) if (used.indexOf(list[i]) < 0) out.push(list[i]);
    return out;
  }
  function padCells(cells, n) {
    var out = cells.slice();
    while (out.length < n) out.push("");
    return out;
  }
  function flow(rows, shared) {
    var i, r, n = 0;
    for (i = 0; i < rows.length; i++) n = Math.max(n, rows[i].cells.length);
    n += shared.length;
    for (i = 0; i < rows.length; i++) {
      r = rows[i];
      r.cells = padCells(r.cells, n - shared.length).concat(shared);
    }
    return rows;
  }
  function dummyRows(rows) {
    if (!rows || !rows.length) return true;
    return rows.every(function (r) {
      return lower((r.cells || []).join(",")) === "prep,cook,serve";
    });
  }
  function textOf(rows) {
    return (rows || []).map(function (r) { return (r.ing || "") + " " + (r.cells || []).join(" "); }).join(" ");
  }
  function specFromRows(rows, course) {
    var t = textOf(rows);
    var temps = t.match(/\d{2,3}\s*°\s*F/ig) || [];
    var mins = (t.match(/(\d+)\s*min/ig) || []).map(function (x) { return parseInt(x, 10); });
    var cookMin = mins.length ? Math.max.apply(null, mins) : 0;
    var heat = temps.length ? temps.filter(function (v, i, a) { return a.indexOf(v) === i; }).join(" · ") : "";
    if (!heat) {
      if (/grill|charcoal|broil/i.test(t)) heat = "Grill or broiler 450–500°F";
      else if (/fry|oil/i.test(t)) heat = "Oil 350°F";
      else if (/bake|roast|oven/i.test(t)) heat = "Oven 375°F";
      else if (/steam/i.test(t)) heat = "Steam 212°F";
      else if (/simmer|boil|poach/i.test(t)) heat = "Stovetop simmer 190°F, or a boil 212°F";
      else if (course === "drink") heat = "Kettle 200°F, or serve at 38–42°F";
      else if (course === "dessert" && /chill|cold|ice/i.test(t)) heat = "Fridge 38°F or freezer 0°F";
      else if (/layer|pour|spread|toss|slice|plate/i.test(t) && !/cook|fry|bake|simmer/i.test(t)) heat = "No heat, or a 350°F oven if you want it warm";
      else heat = "Stovetop medium · 350°F pan";
    }
    if (!cookMin) {
      if (/bake|roast|simmer|braise/i.test(t)) cookMin = 35;
      else if (/steam|fry|grill|sear/i.test(t)) cookMin = 15;
      else if (course === "drink") cookMin = 5;
      else if (course === "dessert") cookMin = 30;
      else cookMin = 20;
    }
    var done = "";
    if (/165/.test(t)) done = "165°F in the thickest part";
    else if (/145/.test(t)) done = "145°F in the center, rest 3 min";
    else if (/130|135/.test(t)) done = "130–135°F for medium-rare, rest 5 min";
    else if (/crisp|brown|set|thick/i.test(t)) done = "Color and texture on the card. Salt at the end.";
    else done = "Taste. Salt at the end. If there is meat, 165°F chicken / 145°F fish / 135°F steak.";
    return S("2–4 plates", "15 min", cookMin + " min", heat, done, "Pot or pan, board, spoon, thermometer if there is meat");
  }

  function methodSoup(list) {
    var veg = findIng(list, /veg|onion|carrot|celery|tomato|fennel|pepper|leek/, list[0]);
    var stock = findIng(list, /stock|broth|water|coconut|milk/, "4 cups stock");
    var extra = restIngs(list, [veg, stock]);
    var rows = [
      R(veg, ["chop", "sweat 8 min in 1 Tbsp oil"]),
      R(stock, ["", "pour, simmer 25 min"])
    ];
    extra.forEach(function (ing) { rows.push(R(ing, ["ready", "add last 8 min"])); });
    return pack(
      S("4 bowls", "15 min", "35 min", "Stovetop, medium · gentle simmer 190°F", "Vegetables tender, tastes seasoned", "Pot, ladle, knife"),
      flow(rows, ["taste + salt", "serve hot"]),
      "A home soup. If it is thin, simmer uncovered 10 more minutes."
    );
  }
  function methodStew(list) {
    var meat = findIng(list, /meat|beef|lamb|pork|chicken|goat|duck|veal|fish|shrimp|sausage|andouille/, list[0]);
    var arom = findIng(list, /onion|carrot|celery|garlic|pepper|tomato|chili/, list[1] || "1 onion, chopped");
    var liq = findIng(list, /stock|wine|broth|coconut|tomato|beer|water/, "2 cups stock");
    var extra = restIngs(list, [meat, arom, liq]);
    var rows = [
      R(meat, ["dry + salt", "brown 8 min, 400°F pan"]),
      R(arom, ["chop", "soften 6 min in the fat"]),
      R(liq, ["", "deglaze, simmer 45–70 min"])
    ];
    extra.forEach(function (ing) { rows.push(R(ing, ["ready", "in with the liquid"])); });
    return pack(
      S("4 plates", "20 min", "1 hr 10 min", "Stovetop brown, then cover at a low simmer 190°F. Oven 325°F if you prefer.", "Meat yields to a fork. Sauce coats a spoon.", "Dutch oven, board, tongs"),
      flow(rows, ["skim + salt", "rest 10 min"]),
      "Cheap cuts want time, not high heat. If it is tough, give it 20 more minutes."
    );
  }
  function methodRoast(list) {
    var bird = findIng(list, /chicken|duck|turkey|hen/, "");
    var meat = bird || findIng(list, /beef|lamb|pork|goat|meat|steak/, list[0]);
    var salt = findIng(list, /salt|rub/, "1½ tsp kosher salt");
    var extra = restIngs(list, [meat, salt]);
    var rows = [
      R(meat, ["pat dry", "salt all over", "hot 425°F 20 min"]),
      R(salt, ["", "salt all over", "hot 425°F 20 min"])
    ];
    extra.forEach(function (ing) { rows.push(R(ing, ["prep", "around the roast", "hot 425°F 20 min"])); });
    var done = bird ? "165°F in the thigh, juices clear, rest 15 min" : "135°F medium-rare / 145°F pork, rest 10 min";
    return pack(
      S("4 plates", "20 min", bird ? "1 hr 15 min" : "50 min", "Oven 425°F then 375°F", done, "Roasting pan, thermometer, board"),
      flow(rows, ["finish 375°F 35–55 min", "rest 10–15 min"]),
      "Trust the thermometer more than the clock. Tent with foil while it rests."
    );
  }
  function methodGrill(list) {
    var meat = findIng(list, /meat|beef|steak|chicken|pork|lamb|fish|shrimp|sausage|picanha|ribs/, list[0]);
    var extra = restIngs(list, [meat]);
    var rows = [R(meat, ["room temp 20 min", "oil + salt", "grill 450–500°F"])];
    extra.forEach(function (ing) { rows.push(R(ing, ["ready", "oil + salt", "grill 450–500°F"])); });
    return pack(
      S("4 plates", "20 min", "12–18 min", "Grill or broiler 450–500°F. Lid closed for thick cuts.", "Chicken 165°F · fish 145°F · steak 130–135°F then rest 5 min", "Grill or cast-iron, tongs, thermometer"),
      flow(rows, ["flip once", "rest 5 min"]),
      "Do not press the meat. If you have no grill, a screaming-hot skillet does the same job."
    );
  }
  function methodFry(list) {
    var main = list[0];
    var extra = list.slice(1);
    var rows = [R(main, ["pat dry", "coat or batter", "fry 350°F"])];
    extra.forEach(function (ing) {
      if (/oil|fat/.test(lower(ing))) rows.push(R(ing, ["", "heat to 350°F", "fry 350°F"]));
      else rows.push(R(ing, ["ready", "with the main", "fry 350°F"]));
    });
    return pack(
      S("4 plates", "20 min", "15 min", "Oil 350°F. If it smokes hard, it is too hot.", "Deep gold, 3–5 min. Drain on a rack.", "Heavy pot, thermometer, spider or slotted spoon"),
      flow(rows, ["drain", "salt at once"]),
      "Work in batches. Crowding drops the oil under 325°F and the crust goes soggy."
    );
  }
  function methodRice(list) {
    var rice = findIng(list, /rice|grain|couscous|quinoa/, list[0]);
    var liq = findIng(list, /water|stock|coconut|broth/, "2 cups water");
    var extra = restIngs(list, [rice, liq]);
    var rows = [
      R(rice, ["rinse", "toast 1 min optional"]),
      R(liq, ["measure 2:1", "boil, then lid"])
    ];
    extra.forEach(function (ing) { rows.push(R(ing, ["ready", "in with the water"])); });
    return pack(
      S("4 sides", "5 min", "18 min + 10 rest", "Boil, then lowest simmer, lid on. No peeking.", "Steam holes on top, grains tender", "Pot with a tight lid"),
      flow(rows, ["simmer 18 min", "rest off heat 10 min", "fluff"]),
      "White rice is 18 minutes. Brown rice is 40. Couscous is 5 minutes under a towel."
    );
  }
  function methodBread(list) {
    var flour = findIng(list, /flour|dough|masa|cornmeal/, list[0]);
    var extra = restIngs(list, [flour]);
    var rows = [R(flour, ["mix + 1 tsp salt", "knead 8 min", "rise 60–90 min"])];
    extra.forEach(function (ing) { rows.push(R(ing, ["add", "knead 8 min", "rise 60–90 min"])); });
    return pack(
      S("1 loaf or 8 pieces", "20 min", "25–40 min plus rise", "Oven 450°F. Stone or steel if you have one. Steam pan optional.", "200°F inside, or a hollow knock on the bottom", "Bowl, sheet or skillet"),
      flow(rows, ["shape", "bake 450°F 20–35 min"]),
      "Dough should feel alive, not glue. If it is dry, wet your hands and keep going."
    );
  }
  function methodRaw(list) {
    var rows = list.map(function (ing, i) {
      return R(ing, i === 0 ? ["chop or mash", "season"] : ["prep", "fold in"]);
    });
    return pack(
      S("4 plates", "15 min", "0 min", "No heat. Chill 30 min if you have time.", "Tastes bright. Salt and acid in balance.", "Board, bowl, knife"),
      flow(rows, ["taste lime/salt", "serve cold"]),
      "Raw food is only as good as the salt and the acid. Taste twice."
    );
  }
  function methodSalad(list) {
    var rows = list.map(function (ing, i) {
      return R(ing, i === 0 ? ["wash + dry", "toss"] : ["prep", "toss"]);
    });
    return pack(
      S("4 plates", "12 min", "0 min", "No heat", "Leaves glossy, not drowned", "Bowl, tongs"),
      flow(rows, ["3:1 oil to vinegar", "salt last"]),
      "Dress at the table so the leaves stay crisp."
    );
  }
  function methodEggs(list) {
    var eggs = findIng(list, /egg/, "4 eggs");
    var extra = restIngs(list, [eggs]);
    var rows = [R(eggs, ["beat with pinch of salt", "butter, medium-low"])];
    extra.forEach(function (ing) { rows.push(R(ing, ["chop", "in at the end"])); });
    return pack(
      S("2 plates", "5 min", "4 min", "Skillet, medium-low. Butter just foaming, not brown.", "Just set, still glossy", "Nonstick or well-seasoned pan"),
      flow(rows, ["fold 3 min", "off heat 30 sec"]),
      "High heat makes rubber. Pull it early."
    );
  }
  function methodNoodles(list) {
    var nood = findIng(list, /noodle|pasta|spaghetti|udon|ramen|lasagna/, list[0]);
    var extra = restIngs(list, [nood]);
    var rows = [R(nood, ["salted boil 212°F", "cook shy of done"])];
    extra.forEach(function (ing) { rows.push(R(ing, ["ready", "sauce in a wide pan"])); });
    return pack(
      S("4 plates", "10 min", "12 min", "Rolling boil for the noodles. Sauce at a lively simmer.", "Noodle has a little chew. Sauce clings.", "Pot, wide skillet"),
      flow(rows, ["toss with ½ cup pasta water", "serve at once"]),
      "Save the starchy water. That is how a sauce becomes a sauce."
    );
  }
  function methodBakeSweet(list) {
    var rows = list.map(function (ing, i) {
      return R(ing, i === 0 ? ["measure", "mix"] : ["ready", "mix"]);
    });
    return pack(
      S("8 pieces", "20 min", "30–40 min", "Oven 350°F, center rack. Light-colored pan if you have one.", "A toothpick comes out with a few crumbs. Edges pull from the pan.", "Bowl, pan, oven"),
      flow(rows, ["into the pan", "bake 350°F 30–40 min", "cool 20 min"]),
      "Hot sugar burns. Cool before you cut."
    );
  }
  function methodCustard(list) {
    var rows = list.map(function (ing, i) {
      return R(ing, i === 0 ? ["warm, do not boil", "whisk"] : ["ready", "whisk"]);
    });
    return pack(
      S("4 cups", "15 min", "35 min plus chill", "Oven 325°F in a water bath, or stovetop just under a simmer 180°F", "Wobble in the center. 175–180°F. It finishes as it cools.", "Ramekins, roasting pan, kettle"),
      flow(rows, ["strain", "bake 325°F 30–40 min", "chill 2 hr"]),
      "If it boils, it curdles. Low and slow."
    );
  }
  function methodHotDrink(list) {
    var leaf = findIng(list, /tea|coffee|espresso|matcha|chai|cocoa|chocolate/, list[0]);
    var extra = restIngs(list, [leaf]);
    var tea = /tea|chai|matcha/.test(lower(leaf + " " + (list.join(" "))));
    var rows = [R(leaf, [tea ? "1 tsp per cup" : "2 Tbsp per 6 oz", tea ? "water 200°F" : "water 200–205°F"])];
    extra.forEach(function (ing) { rows.push(R(ing, ["ready", tea ? "steep 4 min" : "brew 4 min"])); });
    return pack(
      S("2 cups", "2 min", "5 min", tea ? "Kettle 200°F. Boiling water bruises green tea — 175°F for that." : "Kettle just off boil, 200–205°F", tea ? "Color in the cup, not bitter" : "Dark, not scorched", "Kettle, mug, strainer or press"),
      flow(rows, [tea ? "steep 3–5 min" : "brew 4 min", "sip"]),
      "Coffee after food. Tea anytime. Do not boil the milk unless the recipe is chai."
    );
  }
  function methodColdDrink(list) {
    var rows = list.map(function (ing, i) {
      return R(ing, i === 0 ? ["chill 38–42°F", "measure"] : ["chill", "build in the glass"]);
    });
    return pack(
      S("2 glasses", "5 min", "0 min", "No stove. Fridge 38°F. Ice from the freezer.", "Cold, not watery", "Glass, jigger or a tablespoon"),
      flow(rows, ["stir or shake 15 sec", "serve at once"]),
      "This is the drink. Eat after. Do not make every sip a second cocktail."
    );
  }
  function methodSide(list) {
    var rows = list.map(function (ing, i) {
      return R(ing, i === 0 ? ["prep", "hot pan or 425°F oven"] : ["prep", "with the first"]);
    });
    return pack(
      S("4 sides", "10 min", "20–30 min", "Skillet medium-high, or oven 425°F", "Tender with a little color", "Skillet or sheet pan"),
      flow(rows, ["cook 12–25 min", "salt + fat", "serve hot"]),
      "Sides want salt and a little fat. Taste before they leave the pan."
    );
  }
  function methodFruit(list) {
    var rows = list.map(function (ing, i) {
      return R(ing, i === 0 ? ["ripe, room temp", "cut"] : ["ready", "with the fruit"]);
    });
    return pack(
      S("4 plates", "8 min", "0 min", "No heat, unless you want a 5-minute sauté", "Smells sweet at the stem", "Board, knife"),
      flow(rows, ["lime or sugar if needed", "serve"]),
      "The best dessert is often a knife and a ripe piece of fruit."
    );
  }
  function methodCheese(list) {
    var rows = list.map(function (ing, i) {
      return R(ing, i === 0 ? ["out 30 min", "plate"] : ["ready", "around the cheese"]);
    });
    return pack(
      S("4 plates", "5 min", "0 min", "No heat. Cheese at 65°F room temp, not fridge-cold.", "Aroma, not ice-hard", "Board, knife"),
      flow(rows, ["bread + fruit", "serve"]),
      "Cold cheese has no taste. Give it half an hour on the counter."
    );
  }
  function methodBeans(list) {
    var beans = findIng(list, /bean|lentil|chick|dal|hominy/, list[0]);
    var extra = restIngs(list, [beans]);
    var rows = [R(beans, ["soak if dry, or rinse", "cover with water"])];
    extra.forEach(function (ing) { rows.push(R(ing, ["chop", "in after the simmer starts"])); });
    return pack(
      S("4 plates", "15 min", "35–90 min", "Gentle simmer 190°F, lid ajar. No hard boil.", "Creamy inside, skins intact", "Pot, spoon"),
      flow(rows, ["simmer until tender", "salt late", "stew down"]),
      "Salt at the end so the skins do not stay tough. Canned beans need 15 minutes, not 90."
    );
  }
  function methodGreens(list) {
    var rows = list.map(function (ing, i) {
      return R(ing, i === 0 ? ["wash well", "hot oil 30 sec"] : ["prep", "in the pan"]);
    });
    return pack(
      S("4 sides", "8 min", "6 min", "Skillet high for a stir-fry, medium for a pot of greens", "Wilted, still green, not army drab", "Wide skillet or pot"),
      flow(rows, ["2–6 min", "salt + acid"]),
      "Greens cook faster than you think. Pull them while they still look alive."
    );
  }
  function methodPizza(list) {
    var dough = findIng(list, /dough|flour/, "pizza dough");
    var extra = restIngs(list, [dough]);
    var rows = [R(dough, ["1 hr rise if raw", "stretch thin"])];
    extra.forEach(function (ing) { rows.push(R(ing, ["ready", "on the dough, go light"])); });
    return pack(
      S("2 pizzas", "20 min plus dough time", "8–12 min", "Oven 500–550°F. Steel or stone. Bottom rack.", "Bottom leopard-spotted, cheese bubbling, 3–5 min on steel", "Steel or inverted sheet, peel or parchment"),
      flow(rows, ["launch", "bake 500°F 8–12 min"]),
      "Less topping than you think. Water is the enemy of a crisp bottom."
    );
  }
  function methodDumpling(list) {
    var wrap = findIng(list, /wrapper|pastry|dough|wonton|gyoza/, list[0]);
    var fill = findIng(list, /pork|beef|chicken|veg|cabbage|potato|shrimp/, list[1] || "filling");
    var extra = restIngs(list, [wrap, fill]);
    var rows = [
      R(wrap, ["keep covered", "fill 1 tsp each"]),
      R(fill, ["season", "fill 1 tsp each"])
    ];
    extra.forEach(function (ing) { rows.push(R(ing, ["ready", "with the filling"])); });
    return pack(
      S("24 pieces / 4 plates", "30 min", "8–12 min", "Steam 212°F 8 min, or skillet medium then ¼ cup water to steam, or oil 350°F to fry", "Wrapper translucent or gold. Filling 165°F if meat.", "Board, steamer or skillet with lid"),
      flow(rows, ["seal well", "steam 8 min or fry 350°F 3 min + steam 5"]),
      "Do not overfill. A leak in the pot is a dumpling you cannot save."
    );
  }

  var NAMED = {
    "roast chicken": methodRoast,
    "coq au vin": function (list) {
      return pack(
        S("4 plates", "25 min", "1 hr 20 min", "Brown on the stove, then covered oven 325°F", "Chicken 165°F, sauce glossy", "Dutch oven"),
        [
          R(findIng(list, /chicken/, "1 chicken, 8 pieces"), ["dry + salt", "brown 8 min", "oven 325°F 70 min"]),
          R(findIng(list, /wine/, "2½ cups red wine"), ["", "reduce 5 min", "oven 325°F 70 min"]),
          R(findIng(list, /lardon|bacon/, "4 oz lardons"), ["render", "with the bird", "oven 325°F 70 min"]),
          R(findIng(list, /mushroom/, "8 oz mushrooms"), ["", "in for last 25 min", "oven 325°F 70 min"]),
          R(findIng(list, /onion/, "12 pearl onions"), ["", "in for last 25 min", "oven 325°F 70 min"])
        ],
        "Cook with a wine you would drink. Rest 10 minutes. Skim the fat."
      );
    },
    "cassoulet": function (list) {
      return pack(
        S("6 plates", "30 min", "3 hr", "Oven 300°F, uncovered at the end to brown the top", "Beans creamy, crust dark, duck 165°F", "Deep earthenware or Dutch oven"),
        flow([
          R(findIng(list, /bean/, "1 lb white beans, soaked"), ["simmer 45 min"]),
          R(findIng(list, /duck/, "4 duck legs confit"), ["nestle in"]),
          R(findIng(list, /sausage/, "12 oz sausage"), ["brown, nestle in"]),
          R(findIng(list, /garlic/, "6 garlic cloves"), ["in the pot"])
        ], ["oven 300°F 2 hr", "brown top 20 min"]),
        "A Sunday pot. Do not stir the crust to death. Break it once, let it form again."
      );
    },
    "steak frites": function (list) {
      return pack(
        S("2 plates", "20 min", "20 min", "Steak: cast-iron 450°F. Fries: oil 325°F then 375°F", "Steak 130–135°F medium-rare, rest 5 min. Fries deep gold.", "Cast-iron, pot for fries, thermometer"),
        [
          R(findIng(list, /steak/, "2 steaks, 1¼ in thick"), ["room temp 20 min", "salt", "sear 2 min/side", "butter baste 1 min", "rest 5 min"]),
          R(findIng(list, /potato/, "2 lb potatoes"), ["cut ¼ in", "rinse + dry", "fry 325°F 4 min", "fry 375°F 2 min", "salt"]),
          R(findIng(list, /butter/, "2 Tbsp butter"), ["", "", "", "baste the steak", ""]),
          R(findIng(list, /shallot/, "1 shallot, optional sauce"), ["", "mince", "", "in the butter", ""])
        ],
        "Two fries, two temperatures. The first cook is pale on purpose."
      );
    },
    "pizza margherita": methodPizza,
    "butter chicken": function (list) {
      return pack(
        S("4 plates", "20 min plus marinade", "35 min", "Skillet medium. Sauce at a gentle simmer, never a hard boil.", "Chicken 165°F. Sauce orange and glossy.", "Bowl, wide skillet"),
        [
          R(findIng(list, /chicken/, "1½ lb chicken thighs"), ["yogurt + spice 30 min", "sear 4 min/side", "simmer in sauce 12 min"]),
          R(findIng(list, /tomato/, "1 cup tomato puree"), ["", "cook out 8 min", "simmer in sauce 12 min"]),
          R(findIng(list, /butter/, "4 Tbsp butter"), ["", "melt in", "simmer in sauce 12 min"]),
          R(findIng(list, /cream/, "½ cup cream"), ["", "", "off heat, stir in"]),
          R(findIng(list, /masala|spice/, "2 tsp garam masala"), ["in the marinade", "in the sauce", "simmer in sauce 12 min"])
        ],
        "If the sauce splits, it boiled. Pull it down and stir in a spoon of cream."
      );
    },
    "fried chicken": function (list) {
      return pack(
        S("4 plates", "20 min plus soak", "25 min", "Oil 325°F to set, then 350°F to finish. Or one pot at 340°F.", "165°F at the bone. Crust deep gold.", "Dutch oven, thermometer, rack"),
        [
          R(findIng(list, /chicken/, "3 lb chicken pieces"), ["buttermilk 4 hr", "dredge", "fry 340°F 12–16 min"]),
          R(findIng(list, /buttermilk/, "2 cups buttermilk"), ["soak", "", ""]),
          R(findIng(list, /flour/, "2 cups flour + salt"), ["", "dredge", ""]),
          R(findIng(list, /oil/, "2 qt frying oil"), ["", "heat 340°F", "hold 340°F"])
        ],
        "Do not stack pieces. Rest on a rack, not paper, so the crust stays loud."
      );
    },
    "cheeseburger": function (list) {
      return pack(
        S("4 burgers", "15 min", "8 min", "Griddle or skillet 400°F", "160°F if you want USDA done. 140°F pink if you trust your beef. Cheese melted.", "Cast-iron or griddle, spatula"),
        [
          R(findIng(list, /beef/, "1½ lb ground beef, 4 balls"), ["do not overwork", "smash 30 sec", "flip + cheese 1 min"]),
          R(findIng(list, /bun/, "4 buns"), ["", "toast in the fat", "toast in the fat"]),
          R(findIng(list, /cheese/, "4 slices cheese"), ["", "", "on the patty"]),
          R(findIng(list, /pickle/, "pickles"), ["", "", "on the bun"])
        ],
        "Salt only as it hits the pan. A fat smash makes the crust."
      );
    },
    "picanha": function (list) {
      return pack(
        S("4 plates", "15 min", "20 min", "Grill or broiler 450–500°F. Fat cap up first.", "130–135°F medium-rare, rest 10 min. Slice against the grain.", "Grill, thermometer, sharp knife"),
        [
          R(findIng(list, /picanha|steak|beef/, "1 picanha, fat cap on"), ["room temp 30 min", "coarse salt only", "grill fat-side 8 min", "flip 6–8 min", "rest 10 min"])
        ],
        "Do not trim the cap. That is the whole point."
      );
    },
    "sushi": function (list) {
      return pack(
        S("4 plates", "40 min", "20 min rice", "Rice: boil then lowest simmer. Fish: no heat. Hands: vinegar water.", "Rice glossy, not mushy. Fish cold and clean-smelling.", "Pot, hangiri or tray, sharp wet knife"),
        [
          R(findIng(list, /rice/, "2 cups sushi rice"), ["rinse until clear", "1:1.1 water, simmer 18 min", "rest 10 min", "fold vinegar, fan"]),
          R(findIng(list, /fish/, "¾ lb very fresh fish"), ["keep 38°F", "", "", "slice last"]),
          R(findIng(list, /nori/, "nori sheets"), ["", "", "", "wrap or skip"]),
          R(findIng(list, /wasabi|soy/, "wasabi + soy"), ["", "", "", "on the side"])
        ],
        "If you cannot smell the sea and nothing else, do not serve the fish raw. Cook it."
      );
    },
    "ramen": function (list) {
      return pack(
        S("4 bowls", "20 min", "15 min if the broth is ready", "Broth at a simmer 190°F. Noodles in a rolling boil 212°F.", "Noodles springy. Broth steaming.", "Two pots, ladle"),
        [
          R(findIng(list, /broth/, "8 cups broth"), ["heat to a simmer", "keep 190°F", "into the bowls"]),
          R(findIng(list, /noodle/, "4 ramen portions"), ["", "boil 2–3 min", "into the bowls"]),
          R(findIng(list, /pork|chashu|egg/, "chashu + egg"), ["warm in broth 2 min", "", "on top"]),
          R(findIng(list, /scallion/, "scallions"), ["slice", "", "on top"])
        ],
        "The noodles wait for no one. Broth in first, noodles last, eat at once."
      );
    },
    "tempura": function (list) {
      return pack(
        S("4 plates", "20 min", "15 min", "Oil 360°F. Batter ice-cold. Do not overmix — lumps are correct.", "Pale gold, 1–2 min. Drain on a rack.", "Pot, chopsticks, thermometer"),
        flow([
          R(findIng(list, /shrimp|veg/, "shrimp + vegetables"), ["dry well"]),
          R(findIng(list, /flour|batter/, "1 cup ice-cold tempura batter"), ["mix 10 sec"]),
          R(findIng(list, /oil/, "2 qt oil"), ["360°F"])
        ], ["dip + fry 90 sec", "salt"]),
        "A thick batter is a pancake. Keep it thin and cold."
      );
    },
    "peking duck": function (list) {
      return pack(
        S("4–6 plates", "30 min plus overnight dry", "1 hr 15 min", "Oven 375°F then 425°F to crisp the skin", "Skin shatters. Breast 155–160°F, rest 15 min.", "Rack over a pan, thermometer"),
        [
          R(findIng(list, /duck/, "1 whole duck"), ["scald + dry overnight", "roast 375°F 50 min", "crisp 425°F 15 min", "rest 15 min"]),
          R(findIng(list, /pancake/, "12 pancakes"), ["", "steam 3 min", "steam 3 min", "serve"]),
          R(findIng(list, /scallion|cucumber|hoisin/, "scallion, cucumber, hoisin"), ["julienne", "", "", "on the table"])
        ],
        "Dry skin is the whole game. A wet duck will never crisp."
      );
    },
    "taco": methodGrill,
    "guacamole": methodRaw,
    "ceviche": function (list) {
      return pack(
        S("4 plates", "20 min", "20 min cure, no stove", "No heat. Fridge 38°F while it cures.", "Fish turns opaque from the lime, 15–25 min. Do not leave it for hours.", "Glass or ceramic bowl — not aluminum"),
        [
          R(findIng(list, /fish/, "1 lb very fresh firm fish"), ["dice ½ in", "cover with lime", "cure 20 min, 38°F"]),
          R(findIng(list, /lime/, "¾ cup lime juice"), ["", "pour on", "cure 20 min, 38°F"]),
          R(findIng(list, /onion/, "½ red onion"), ["slice thin", "in with the fish", "cure 20 min, 38°F"]),
          R(findIng(list, /chili|cilantro/, "chili + cilantro"), ["", "", "fold in at the end"])
        ],
        "This is a cure, not a stew. If the fish smells like anything but the ocean, do not make it."
      );
    },
    "risotto": function (list) {
      return pack(
        S("4 plates", "10 min", "22 min", "Wide pan, medium. Broth stays at a simmer in a second pot.", "Rice tender with a little bite. It should flow, not sit in a heap.", "Wide pan, ladle"),
        [
          R(findIng(list, /rice/, "1½ cups arborio"), ["toast 1 min", "add broth 1 ladle at a time", "22 min total"]),
          R(findIng(list, /stock|broth/, "5 cups hot stock"), ["keep 190°F", "add broth 1 ladle at a time", "22 min total"]),
          R(findIng(list, /onion|shallot/, "1 shallot"), ["soften 4 min", "with the rice", "22 min total"]),
          R(findIng(list, /butter|parmigiano|cheese/, "2 Tbsp butter + cheese"), ["", "", "off heat, beat in"])
        ],
        "Stir often. If it goes dry before 18 minutes, your heat is too high."
      );
    },
    "bread": methodBread,
    "a loaf of bread": methodBread,
    "flatbread": methodBread,
    "naan": function (list) {
      return pack(
        S("8 breads", "20 min plus rise", "16 min", "Cast-iron or steel 500°F. Or a 500°F oven.", "Puffed, blistered, 60–90 seconds a side", "Bowl, screaming-hot skillet"),
        flow([
          R(findIng(list, /flour/, "3 cups flour"), ["mix"]),
          R(findIng(list, /yogurt/, "½ cup yogurt"), ["mix"]),
          R(findIng(list, /yeast/, "1 tsp yeast"), ["mix"]),
          R(findIng(list, /ghee|oil|butter/, "ghee"), ["brush after"])
        ], ["rise 60 min", "roll thin", "cook 500°F 90 sec/side"]),
        "If it does not puff, the pan was not hot enough."
      );
    },
    "crème brûlée": methodCustard,
    "creme brulee": methodCustard,
    "flan": methodCustard,
    "key lime pie": function (list) {
      return pack(
        S("8 slices", "20 min", "15 min plus chill", "Oven 350°F for the crust, 325°F for the fill", "Center just set. Chill 3 hours.", "9-inch pie tin"),
        [
          R(findIng(list, /crust|graham/, "graham crust"), ["press in", "bake 350°F 8 min", "cool"]),
          R(findIng(list, /lime/, "½ cup key lime juice"), ["whisk", "pour", "bake 325°F 15 min"]),
          R(findIng(list, /milk|condensed/, "1 can condensed milk"), ["whisk", "pour", "bake 325°F 15 min"]),
          R(findIng(list, /egg/, "4 egg yolks"), ["whisk", "pour", "bake 325°F 15 min"])
        ],
        "It finishes in the fridge. If you bake it until it looks done, you went too far."
      );
    },
    "old fashioned": methodColdDrink,
    "negroni": methodColdDrink,
    "margarita": methodColdDrink,
    "espresso": methodHotDrink,
    "masala chai": function (list) {
      return pack(
        S("2 cups", "5 min", "8 min", "Stovetop. Milk and water together, just to a boil, then down.", "Spiced, not scorched. Tea is bitter if you boil it for 20 minutes.", "Small pot"),
        [
          R(findIng(list, /tea/, "2 tsp black tea"), ["", "in after the boil", "steep 3 min"]),
          R(findIng(list, /milk/, "1 cup milk + 1 cup water"), ["combine", "bring just to a boil", "steep 3 min"]),
          R(findIng(list, /ginger/, "6 slices ginger"), ["in the pot", "bring just to a boil", "steep 3 min"]),
          R(findIng(list, /cardamom/, "4 cardamom pods"), ["crack", "bring just to a boil", "steep 3 min"])
        ],
        "Strain into the cups. Sugar in the cup, not the pot, so each person decides."
      );
    }
  };

  function namedKey(d) {
    return lower(d.name || "").replace(/['’]/g, "").replace(/\s+/g, " ").trim();
  }

  function classify(d) {
    var n = lower((d.name || "") + " " + (d.wiki || "") + " " + (d.course || "") + " " + ings(d).join(" "));
    if (NAMED[namedKey(d)]) return "named";
    if (/pizza/.test(n)) return "pizza";
    if (/ceviche|poisson cru|kinilaw|kokoda/.test(n)) return "ceviche";
    if (/dumpling|gyoza|jiaozi|wonton|samosa|empanada|momos|mandu|bao/.test(n)) return "dumpling";
    if (/risotto/.test(n)) return "risotto";
    if (/salad|slaw|tabbouleh|fattoush|caprese|sunomono|smørre|smorrebrod/.test(n)) return "salad";
    if (d.course === "drink" || ((/wine|beer|coffee|espresso|chai|sake|soju|rum|gin|vodka|cocktail|spritz|lassi|horchata|agua |soda|punch|cider|kölsch|kolsch|champagne|prosecco|cava|sherry|matcha/.test(n) || /\btea\b/.test(n)) && !/salad|soup|chicken|beef|pork|fish|cake|leaf salad/.test(n))) {
      return /tea|coffee|espresso|chai|matcha|cocoa|chocolate drink|café|cafe/.test(n) ? "hotDrink" : "coldDrink";
    }
    if (/fruit|mango|papaya|pineapple|berry|date|açaí|acai/.test(n) && (d.course === "dessert" || d.course === "drink")) return "fruit";
    if (/cheese plate|cheese$|queso/.test(n) && d.course !== "main") return "cheese";
    if (/salad|slaw|tabbouleh|fattoush|caprese|sunomono/.test(n)) return "salad";
    if (/guacamole|salsa|pico|relish|raita|herb and lime|pickles|pickle|olive/.test(n)) return "raw";
    if (/soup|chowder|pho|gazpacho|consomme|bisque|mohinga/.test(n)) return /gazpacho/.test(n) ? "raw" : "soup";
    if (/stew|curry|gumbo|chili|tagine|cassoulet|pozole|chili|feijoada|bourguignon|goulash|dal|chole|moqueca|vatapá|vatapa|peanut stew|okra stew|bean stew/.test(n)) return "stew";
    if (/lentil|bean|chickpea|hominy/.test(n) && d.course !== "dessert") return "beans";
    if (/ramen|udon|noodle|pasta|spaghetti|cacio|lasagne|lasagna/.test(n)) return "noodles";
    if (/rice|biryani|pilaf|pilau|congee|xôi|xoi/.test(n)) return "rice";
    if (/egg|omelette|omelet|tamagoyaki|quiche/.test(n)) return "eggs";
    if (/green|collard|spinach|sukuma|couve|palak|stir-fried greens|greens in/.test(n)) return "greens";
    if (/fry|fried|fritter|tempura|wing|churro|pakora|croquette|coxinha|karaage|tonkatsu|churro|tater|plantain/.test(n)) return "fry";
    if (/grill|asado|barbecue|bbq|yakitori|brochette|kebab|steak|picanha|ribs|elote|yakitori/.test(n)) return "grill";
    if (/roast|gratin|bake|enchi|tamale|confit|meatloaf|shepherd|cottage pie/.test(n)) return "roast";
    if (/ugali|fufu|nshima|nsima|sadza|gozo|boule|funge|xima|pap /.test(n)) return "starch";
    if (/bread|naan|focaccia|loaf|scone|arepa|tortilla|injera/.test(n)) return "bread";
    if (/flan|custard|brûlée|brulee|pudding|kheer|panna|quindim|tres leches/.test(n)) return "custard";
    if (d.course === "dessert") return /fruit|ice cream|gelato|sorbet/.test(n) ? "fruit" : "bakeSweet";
    if (d.course === "side") return "side";
    if (d.course === "starter") return "soup";
    return "stew";
  }

  var METHODS = {
    soup: methodSoup,
    stew: methodStew,
    roast: methodRoast,
    grill: methodGrill,
    fry: methodFry,
    rice: methodRice,
    bread: methodBread,
    raw: methodRaw,
    salad: methodSalad,
    eggs: methodEggs,
    noodles: methodNoodles,
    bakeSweet: methodBakeSweet,
    custard: methodCustard,
    hotDrink: methodHotDrink,
    coldDrink: methodColdDrink,
    side: methodSide,
    fruit: methodFruit,
    cheese: methodCheese,
    beans: methodBeans,
    greens: methodGreens,
    pizza: methodPizza,
    dumpling: methodDumpling,
    ceviche: function (list) { return NAMED.ceviche(list); },
    risotto: function (list) { return NAMED.risotto(list); },
    starch: function (list) {
      var meal = findIng(list, /maize|cassava|meal|flour|ugali|fufu/, list[0]);
      var extra = restIngs(list, [meal]);
      var rows = [R(meal, ["whisk into boiling water 212°F", "cook 8–12 min, stir hard"])];
      extra.forEach(function (ing) { rows.push(R(ing, ["ready", "with the pot"])); });
      return pack(
        S("4 sides", "5 min", "12 min", "Rolling boil 212°F, then medium, keep stirring", "Stiff enough to pinch. Pulls from the pot.", "Heavy pot, wooden spoon"),
        flow(rows, ["rest 3 min", "pinch and scoop"]),
        "This is the spoon for the stew. If it is loose, cook 3 more minutes."
      );
    }
  };

  function buildCard(d) {
    var key = namedKey(d);
    var list = ings(d);
    if (NAMED[key]) return NAMED[key](list);
    var kind = classify(d);
    if (kind === "named") return NAMED[key](list);
    var fn = METHODS[kind] || methodStew;
    return fn(list);
  }

  function cookCard(d) {
    if (!dummyRows(d.rows) && d.rows && d.rows.length) {
      return pack(specFromRows(d.rows, d.course), d.rows, "Home-kitchen card from the World file. Times are on the grid.");
    }
    return buildCard(d);
  }

  function escapeHtml(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function mergeRecipeTable(rows) {
    if (!rows || !rows.length) return "";
    var narrow = (root.innerWidth || 400) < 560;
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

  function specHtml(spec) {
    if (!spec) return "";
    return "<div class='spec'>" +
      "<div><b>Serves</b>" + escapeHtml(spec.serves) + "</div>" +
      "<div><b>Prep</b>" + escapeHtml(spec.prep) + "</div>" +
      "<div><b>Cook</b>" + escapeHtml(spec.cook) + "</div>" +
      "<div><b>Heat</b>" + escapeHtml(spec.heat) + "</div>" +
      "<div class='wide'><b>Done when</b>" + escapeHtml(spec.done) + "</div>" +
      "<div class='wide'><b>Gear</b>" + escapeHtml(spec.gear) + "</div>" +
      "</div>";
  }

  function cardHtml(d) {
    var card = cookCard(d);
    return "<div class='cookcard'>" +
      "<div class='cookhead'>Cook card</div>" +
      specHtml(card.spec) +
      "<p class='readcard'>Left column is what you buy. Across is the order of work. A shared box means those things cook together.</p>" +
      mergeRecipeTable(card.rows) +
      (card.note ? "<p class='cooknote'>" + escapeHtml(card.note) + "</p>" : "") +
      "</div>";
  }

  function cardText(d) {
    var card = cookCard(d);
    var s = card.spec || {};
    var lines = [d.name || "Dish", ""];
    lines.push("Serves " + (s.serves || ""));
    lines.push("Prep " + (s.prep || "") + " · Cook " + (s.cook || ""));
    lines.push("Heat: " + (s.heat || ""));
    lines.push("Done when: " + (s.done || ""));
    lines.push("Gear: " + (s.gear || ""));
    lines.push("");
    (card.rows || []).forEach(function (r) {
      lines.push("• " + r.ing + " — " + (r.cells || []).filter(Boolean).join(" → "));
    });
    if (card.note) { lines.push(""); lines.push(card.note); }
    return lines.join("\n");
  }

  root.dinnerCook = {
    card: cookCard,
    html: cardHtml,
    text: cardText,
    table: mergeRecipeTable
  };
})(typeof window !== "undefined" ? window : global);
