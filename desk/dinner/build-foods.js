"use strict";
/* Build ~20 dishes per country from The World's kitchen plus regional extras. */
const fs = require("fs");
const path = require("path");

global.window = global;
eval(fs.readFileSync(path.join(__dirname, "../world/foods.js"), "utf8"));
eval(fs.readFileSync(path.join(__dirname, "../world/facts.js"), "utf8"));

const REGION = {
  "008":"europe","040":"europe","056":"europe","070":"europe","100":"europe","112":"europe",
  "191":"europe","196":"europe","203":"europe","208":"europe","233":"europe","246":"europe",
  "250":"europe","276":"europe","300":"europe","348":"europe","352":"europe","372":"europe",
  "380":"europe","428":"europe","440":"europe","442":"europe","498":"europe","499":"europe",
  "528":"europe","578":"europe","616":"europe","620":"europe","642":"europe","643":"europe",
  "688":"europe","703":"europe","705":"europe","724":"europe","752":"europe","756":"europe",
  "804":"europe","807":"europe","826":"europe","336":"europe","438":"europe","470":"europe",
  "032":"americas","044":"americas","068":"americas","076":"americas","084":"americas",
  "124":"americas","152":"americas","170":"americas","188":"americas","192":"americas",
  "214":"americas","218":"americas","222":"americas","304":"americas","320":"americas",
  "328":"americas","332":"americas","340":"americas","388":"americas","484":"americas",
  "558":"americas","591":"americas","600":"americas","604":"americas","630":"americas",
  "740":"americas","780":"americas","840":"americas","858":"americas","862":"americas",
  "028":"americas","052":"americas","060":"americas","212":"americas","308":"americas",
  "662":"americas","670":"americas",
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
  "792":"asia","795":"asia","860":"asia","887":"asia","048":"asia","344":"asia",
  "036":"oceania","090":"oceania","242":"oceania","540":"oceania","548":"oceania",
  "554":"oceania","598":"oceania","016":"oceania","258":"oceania","296":"oceania",
  "520":"oceania","776":"oceania","882":"oceania"
};

function D(name, wiki, course, history, wine, why, shop) {
  shop = Array.isArray(shop) ? shop : [].slice.call(arguments, 6);
  return {
    name: name,
    wiki: wiki,
    course: course,
    history: history,
    wine: { name: wine, why: why },
    shop: shop,
    rows: shop.map(function (ing) { return { ing: ing, cells: ["prep", "cook", "serve"] }; })
  };
}

function guessCourse(name) {
  var n = String(name || "").toLowerCase();
  if (/wine|beer|tea|coffee|juice|lassi|chai|mate|raki|ouzo|vodka|whisky|rum|punch|soda|ayran|horchata|café|cafe|soju|sake|pastis|kir|spritz|negroni|margarita|caipirinha|lassi|kölsch|riesling|cava|sherry|ale|lager|chai|espresso/.test(n)) return "drink";
  if (/cake|pie|tart|cookie|pudding|ice cream|gelato|baklava|halva|flan|sweet|chocolate|donut|strudel|pavlova|lamington|waffle|crêpe|crepe|trdel|luqaim|brownie|churro|tiramisu|kheer|gulab|mooncake|brigadeiro|quindim|panna|profiterole|crème|creme|scone|trifle|crumble|bingsu|mochi|dorayaki|rasgulla|tres leches|key lime|pecan|sticky toffee|eton|bee sting|black forest|vanilla slice|hotteok|chè|che\b/.test(n)) return "dessert";
  if (/salad|soup|dip|mezze|tapa|samosa|empanada|dumpling|spring roll|bruschetta|ceviche|brik|pastizz|bitterbal|lángos|langos|falafel|tabbouleh|fattoush|smørre|gazpacho|wonton|pakora|elote|guacamole|coxinha|gyoza|mandu|pajeon|gỏi|goi|nem |obatzda|scotch egg|ploughman|sunomono|tempura|kimchi$/.test(n)) return "starter";
  if (/rice$|bread|ugali|fufu|nshima|nsima|sadza|funge|injera|arepa|tortilla|fries|slaw|beans|couscous|pap |xima|lefse|soda bread|farofa|coleslaw|cornbread|naan|raita|focaccia|polenta|sauerkraut|spätzle|spaetzle|kimchi|banchan|sticky rice|xôi|xoi|couve|refried|pico |salsa |pumpernickel|yorkshire|roast potato|mushy|semmel|kartoffel/.test(n)) return "side";
  return "main";
}

function guessWine(course, region, name) {
  var n = String(name || "").toLowerCase();
  if (course === "drink") return { name: "Serve as poured", why: "This is the drink. Keep wine for the food around it." };
  if (course === "dessert") return { name: "Late-harvest Riesling or a small sweet wine", why: "Sweet food wants a wine at least as sweet, or the wine tastes thin." };
  if (/spice|chili|jerk|curry|berbere|harissa|kimchi|suya|mole|pad thai|tom yum|gochujang/.test(n)) {
    return { name: "Off-dry Riesling", why: "A little sugar and high acid cool heat without fighting it." };
  }
  if (/fish|shrimp|mussel|ceviche|cod|salmon|tuna|crab|lobster|seafood|octopus|prawn/.test(n)) {
    return { name: "Crisp white — Albariño, Muscadet, or Sauvignon Blanc", why: "Acid and no heavy oak keep fish tasting clean." };
  }
  if (/lamb|beef|steak|asado|kebab|kofta|stew|roast|ribs|picanha/.test(n)) {
    return { name: "Medium red — Grenache, Tempranillo, or Pinot Noir", why: "Fruit and gentle tannin stand up to meat without drying your mouth." };
  }
  if (region === "europe") return { name: "A local table wine, red or white", why: "In Europe the old rule is simple: drink what grew next door." };
  if (region === "africa") return { name: "South African Chenin Blanc or a light red", why: "Chenin’s apple-and-honey note loves spice, stew, and grilled meat." };
  if (region === "asia") return { name: "Riesling, Gewürztraminer, or cold beer", why: "Aromatic whites and beer handle soy, chili, and herbs better than oaky reds." };
  if (region === "americas") return { name: "Malbec, Cabernet, or a bright white", why: "New World fruit loves grill smoke, lime, and chile." };
  return { name: "A dry white or a light red", why: "When in doubt, pick something with acid. Fat and salt love acid." };
}

function shopFromRows(rows) {
  return (rows || []).map(function (r) { return r.ing; }).filter(Boolean);
}

function upgrade(old, region) {
  var course = guessCourse(old.name);
  return {
    name: old.name,
    wiki: old.wiki || "",
    course: course,
    history: "A home dish people actually cook. Wikipedia has the longer story.",
    wine: guessWine(course, region, old.name),
    shop: shopFromRows(old.rows),
    rows: old.rows || []
  };
}

const BANKS = {
  europe: [
    D("A bowl of soup to start","Soup","starter","Most European tables begin with something hot in a bowl. It wakes the stomach.","A local white","Soup and a modest white. No need for a trophy bottle.","seasonal vegetables","stock","bread","butter"),
    D("Cheese plate","Cheese","starter","Cheese is a course, not a snack. A little bread, a little fruit.","The wine from the same hills","Sheep, cow, or goat — drink what grew next door.","2 or 3 cheeses","bread","fruit or honey"),
    D("A green salad","Salad","starter","Oil, vinegar, salt, a leaf. The reset between richer plates.","Sauvignon Blanc","Vinegar and a sharp white are the same idea.","salad greens","olive oil","vinegar","salt"),
    D("Roast chicken","Roast_chicken","main","Sunday in a hundred languages. Salt, heat, time.","Pinot Noir or a village white","Chicken is a bridge. Almost any honest wine works.","whole chicken","salt","lemon","herbs","potato"),
    D("A pot of stew","Stew","main","Cheap cuts, a lid, an afternoon. This is how winter was fed.","Côtes du Rhône or similar","Stew likes a peppery, not-fancy red.","stewing meat","onion","carrot","stock","herbs"),
    D("Grilled fish","Grilled_fish","main","A whole fish, lemon, oil. The coast on a plate.","Albariño or Muscadet","Fish and oak do not get along. Keep the white crisp.","whole fish","lemon","olive oil","salt"),
    D("Mashed potatoes","Mashed_potato","side","Butter is not a rumor. Warm milk, a ricer if you have one.","The roast’s wine","Pair the meat. The mash is the pillow.","potatoes","butter","milk","salt"),
    D("Braised cabbage","Cabbage","side","Winter’s vegetable. Sweet if you give it time.","Riesling","Cabbage and a little sweetness in the glass.","cabbage","butter or oil","onion","caraway or vinegar"),
    D("A loaf of bread","Bread","side","The silent guest at every European table.","The meal’s wine","Bread carries the sauce. Pair the sauce.","flour","yeast","salt","water"),
    D("Fruit tart","Tart","dessert","Fruit, pastry, a little sugar. The bakery window.","Late-harvest Riesling","Fruit dessert likes a wine with fruit and acid.","pastry","seasonal fruit","sugar","butter"),
    D("Custard or pudding","Pudding","dessert","Eggs, milk, and patience. A spoon dessert.","A small sweet wine","Custard and a sip, not a glass.","milk","eggs","sugar","vanilla"),
    D("Coffee after","Coffee","drink","The period at the end of the sentence.","The coffee is the drink","Wine with food. Coffee after.","coffee"),
    D("A glass of the house wine","Wine","drink","The teaching glass is the ordinary one. Taste it like you mean it.","The house wine","This is wine school: look, smell, sip, think.","table wine"),
    D("Olives and almonds","Olive","starter","A bowl while you talk. The Mediterranean opener.","Fino sherry or a dry white","Salt and a dry drink. That is the first lesson.","olives","almonds","olive oil"),
    D("Herb omelette","Omelette","main","Eggs, a pan, whatever is in the garden. Lunch for one or two.","A crisp white","Eggs like acid, not a tannic red.","eggs","butter","herbs","salt"),
    D("Roasted root vegetables","Root_vegetable","side","Carrot, parsnip, beet. High heat, a little oil.","The roast’s wine","Pair the main.","mixed roots","olive oil","salt","herbs"),
    D("Berry compote","Compote","dessert","Summer in a jar. Spoon it on cream or cake.","Moscato or cider","Berries and a little sparkle.","berries","sugar","lemon"),
    D("Sparkling water and wine","Wine","drink","Water on the table is not a slight. It keeps you tasting.","Still or sparkling water plus wine","Alternate sips. That is how you last the meal.","sparkling water","wine")
  ],
  africa: [
    D("Peanut stew","Groundnut_stew","main","West and Central Africa’s pot: groundnuts, tomato, a protein, a starch on the side.","Chenin Blanc","Peanut and chili like a white with body and fruit.","peanut butter or groundnuts","tomato","onion","chicken or greens","chili"),
    D("Grilled meat brochettes","Brochette","main","Street charcoal, a skewer, a pinch of spice. Evening food.","Cinsault or a light red","Smoke and salt like a juicy, not-heavy red.","beef or goat","onion","chili","oil"),
    D("A starch to pinch","Ugali","side","Maize, cassava, or millet cooked stiff. You pinch it. You scoop the stew.","The stew’s wine","Pair the sauce. The starch is the spoon.","maize meal or cassava","water","salt"),
    D("Greens in a pot","Leaf_vegetable","side","Cassava leaf, morogo, sukuma wiki — the green that makes the plate a meal.","Chenin Blanc","Greens and chili like acid.","greens","onion","tomato","oil"),
    D("Fried plantain","Plantain","side","Ripe and sweet, or green and starchy. A golden side.","Beer","Sweet fry and a cold lager.","plantains","oil","salt"),
    D("Bean stew","Bean","main","Beans feed more people than speeches. Tomato, onion, time.","A light red or beer","Beans and a humble drink.","beans","onion","tomato","chili","oil"),
    D("Fish stew with tomato","Fish_stew","main","The coast in a pot. Chili, tomato, a firm fish.","Chenin Blanc","Tomato and fish want a white with acid.","firm fish","tomato","onion","chili","oil"),
    D("Samosas or fried pastry","Samosa","starter","The Indian Ocean and the trade winds left a triangle on the tray.","Beer or off-dry Riesling","Fried spice and bubbles or a little sweetness.","pastry","spiced potato or meat","oil"),
    D("Fresh fruit","Fruit","dessert","Mango, pineapple, papaya. The best dessert is often a knife.","Moscato, optional","Ripe fruit is already sweet. Wine is optional.","ripe fruit","lime"),
    D("Sweet fritters","Fritter","dessert","A market dough, hot oil, sugar.","Sweet tea or a sip of dessert wine","Fried sugar likes tea.","flour","sugar","oil","spice"),
    D("Ginger drink or bissap","Hibiscus_tea","drink","Hibiscus, ginger, or baobab. The everyday cooler.","The drink is the drink","Learn the pot before you chase imported soda.","hibiscus or ginger","sugar","water"),
    D("Sweet tea or coffee","Tea","drink","Hospitality in a glass. Mint in the Maghreb, strong coffee in the Horn.","The tea is the drink","This is the welcome.","tea or coffee","sugar"),
    D("Tomato and onion relish","Relish","side","A raw or cooked chop that wakes grilled meat.","The grill’s wine","Pair the meat.","tomato","onion","chili","lime or vinegar"),
    D("Okra stew","Okra","main","Slippery on purpose. A thickener and a vegetable at once.","Chenin Blanc","Okra and tomato like a fruity white.","okra","tomato","onion","oil","chili"),
    D("Coconut rice or beans","Coconut_rice","side","The Indian Ocean rim: coconut in the pot.","The stew’s wine","Pair the main.","rice or beans","coconut milk","salt"),
    D("Yogurt or fermented milk","Fermented_milk","drink","A cool cup next to spice.","The yogurt is the drink","Fat and cool against chili.","yogurt or fermented milk"),
    D("Roasted peanuts","Peanut","starter","A handful while you wait.","Beer","Salt nuts and a cold drink.","peanuts","salt"),
    D("Honey sweets or dates","Date","dessert","A small sweet after a long stew.","Mint tea","Honey and tea.","dates or honey sweets","tea")
  ],
  asia: [
    D("A soup to start","Soup","starter","Clear or cloudy, the first warmth.","Jasmine tea or a crisp white","A light soup likes a light cup.","stock","scallion","ginger","noodles or tofu"),
    D("Dumplings or filled pastry","Dumpling","starter","A fold, a filling, a steamer or a fryer.","Beer or sake","Salt and dough like bubbles or a grain wine.","wrappers","ground meat or vegetables","ginger","soy"),
    D("A rice plate","Rice","side","The quiet center. Everything else is a guest.","The main’s drink","Pair the sauce, not the rice.","rice","water","salt"),
    D("Stir-fried greens","Leaf_vegetable","side","High heat, garlic, a minute.","The main’s wine","Pair the chili or the soy.","greens","garlic","oil","soy"),
    D("Grilled or roasted meat","Kebab","main","Skewers, a tandoor, a yakitori stick — fire is the shared language.","Pinot Noir or soju","Char and a drink that does not bully the meat.","meat","garlic","soy or spice","oil"),
    D("A coconut or yogurt curry","Curry","main","Spice ground fresh, a pot, a starch.","Off-dry Riesling","Chili and coconut like a little sugar in the white.","protein","onion","spice paste","coconut milk or yogurt"),
    D("Noodle bowl","Noodle","main","Wheat, rice, or buckwheat. Broth or a hot wok.","Beer or Riesling","Noodles and a drink with acid or bubbles.","noodles","broth or sauce","herbs","protein"),
    D("Pickles on the side","Pickle","side","The sour that makes the rich food make sense.","The main’s drink","Pair the main. The pickle is the spark.","vegetables","salt","vinegar or brine"),
    D("Fresh herbs and lime","Herb","side","A pile of leaves. You build each bite.","Sauvignon Blanc","Herbs and lime are a white-wine plate.","herbs","lime","chili"),
    D("Sweet rice or bean dessert","Mochi","dessert","Rice or bean, steamed or iced. Not always a slice of cake.","Green tea","Sweet bean wants bitter tea.","sweet rice or beans","sugar","coconut or tea"),
    D("Seasonal fruit","Fruit","dessert","Mango, lychee, persimmon — the calendar on a plate.","Moscato, optional","Fruit first. Wine if you want it.","ripe fruit"),
    D("Tea","Tea","drink","China invented the leaf. The rest of Asia wrote chapters.","The tea is the drink","Learn the leaf before you chase wine.","tea"),
    D("A short spirit or beer","Beer","drink","Soju, sake, baijiu, lager — the pour you share.","The drink is the drink","Pour for others. That is the lesson.","beer or local spirit"),
    D("Egg dish","Omelette","main","Tamagoyaki, egg curry, a fried egg on rice. The everyday protein.","A crisp white or tea","Eggs like acid or tea, not a heavy red.","eggs","oil","scallion or spice"),
    D("Lentils or beans","Dal","main","The pot that feeds a house. Spice, a tempering of oil.","Grüner Veltliner","Legumes and a peppery white.","lentils or beans","onion","turmeric","oil"),
    D("Flatbread","Flatbread","side","Naan, roti, lavash, scallion pancake. Tear it.","The curry’s wine","Bread carries the sauce.","flour","water","salt","oil or ghee"),
    D("Yogurt cooler","Raita","side","A bowl that puts out the fire.","The yogurt is the cooler","This is the pairing for chili.","yogurt","cucumber or mint","salt"),
    D("Cardamom or coconut sweet","Dessert","dessert","A small square with tea.","Tea or a sip of Muscat","Spice-sweet and tea.","sugar","cardamom or coconut","flour or milk")
  ],
  americas: [
    D("A lime-and-chili starter","Salsa","starter","Raw salsa, guacamole, or a ceviche. Acid first.","Sauvignon Blanc","Lime and a sharp white are cousins.","tomato or tomatillo or avocado","lime","onion","cilantro","chili"),
    D("Corn something","Corn","starter","Elote, arepa, tamale, cornbread. The Americas invented this grain’s fame.","Lager or a bright white","Corn and a cold, simple drink.","corn or masa","salt","lime or butter"),
    D("Beans and rice","Rice_and_beans","side","The pair that built the hemisphere.","Beer or a juicy red","Beans, rice, and a humble glass.","rice","beans","onion","oil"),
    D("Grilled meat","Asado","main","Fire, salt, a crowd. From Texas to Patagonia.","Malbec or Cabernet","Grill smoke and a ripe red.","beef or chicken","salt","charcoal"),
    D("A stew with roots","Stew","main","Yuca, potato, plantain, a pot. The Andes and the Caribbean in one idea.","Grenache or beer","Stew likes a juicy red or a cold beer.","meat","yuca or potato","onion","stock"),
    D("Fried plantain","Plantain","side","Maduros if sweet, tostones if green.","Beer","Sweet or salty fry and a lager.","plantains","oil","salt"),
    D("Cabbage slaw","Coleslaw","side","A cool crunch next to something hot or fried.","Riesling","Vinegar slaw and a little sweetness.","cabbage","lime or vinegar","onion"),
    D("A stuffed pastry","Empanada","starter","A fold you can walk with. Every country names it differently.","Malbec or beer","A hand pie and a juicy drink.","pastry","spiced filling","oil or oven"),
    D("Fresh cheese","Cheese","side","Queso fresco, minas, a salty crumble.","The salsa’s wine","Pair the chile.","fresh cheese","tortillas or bread"),
    D("Flan or milk pudding","Crème_caramel","dessert","Eggs, milk, caramel. Spain sent it; the Americas kept it.","A sip of sweet wine or coffee","Custard and a bitter cup.","eggs","milk","sugar"),
    D("Tropical fruit","Fruit","dessert","Mango, guava, pineapple, passionfruit.","Moscato, optional","The fruit is the dessert.","ripe fruit","lime"),
    D("Coffee","Coffee","drink","The bean’s other home. Small, sweet, or a long American mug.","The coffee is the drink","Wine with food. Coffee after.","coffee","sugar"),
    D("A fruit cooler","Agua_fresca","drink","Fruit, water, a little sugar. The everyday glass.","The cooler is the drink","Learn this before soda.","fruit","water","sugar","lime"),
    D("Hot sauce on the table","Hot_sauce","side","A bottle or a molcajete. You finish the plate.","Off-dry Riesling if the food is fiery","You pair the heat.","hot sauce or fresh chili","lime"),
    D("Roasted squash or potato","Potato","side","The Andes gave the world the potato. Roast it like you mean it.","The stew’s wine","Pair the main.","potato or squash","oil","salt"),
    D("A sandwich or stuffed bread","Sandwich","main","Chivito, cemita, a Cuban, a burger. Bread as a plate.","Beer or a juicy red","A stacked sandwich likes bubbles or fruit.","bread or bun","filling","pickles or slaw"),
    D("Chocolate or cocoa","Chocolate","dessert","The cacao belt. A drink or a square.","A small Pedro Ximénez or coffee","Chocolate likes sweet wine or a bitter cup.","chocolate or cocoa","sugar"),
    D("Rum or a highball","Rum","drink","Cane spirit, ice, lime. The Caribbean lesson.","The rum is the drink","Then eat. Do not make every sip a cocktail.","rum","lime","ice")
  ],
  oceania: [
    D("Coconut fish","Poisson_cru","starter","Lime or coconut, a raw or barely cooked fish. The reef on a plate.","Sauvignon Blanc from Marlborough","Lime, coconut, and a razor-sharp white.","fresh fish","lime","coconut milk","onion"),
    D("Earth-oven meat and roots","Hāngi","main","A pit, hot stones, leaves. A feast, not a Tuesday.","Pinot Noir","Smoke, root, and a cool-climate red.","meat","taro or potato","greens","leaves for wrap"),
    D("Roasted root","Taro","side","Taro, yam, sweet potato. The Pacific starch.","The oven’s wine","Pair the meat.","taro or sweet potato","coconut milk","salt"),
    D("Reef fish on fire","Fish_as_food","main","A whole fish, charcoal, a squeeze of citrus.","Sémillon or Sauvignon Blanc","Fish and a clean white.","reef fish","lime","salt","charcoal"),
    D("Greens in coconut","Palusami","side","Taro leaf and coconut cream. A rich green spoon.","Sauvignon Blanc","Coconut and greens like acid.","taro leaves","coconut milk","onion"),
    D("Tropical fruit","Fruit","dessert","Papaya, pineapple, mango, coconut.","Moscato, optional","The fruit is the dessert.","ripe fruit"),
    D("Coconut sweet","Coconut","dessert","Grated coconut, sugar, a wrap or a bake.","Tea or a sip of Muscat","Coconut and a floral sip.","coconut","sugar"),
    D("Coconut water","Coconut_water","drink","From the fruit.","The coconut is the drink","A market cooler.","coconut water"),
    D("Tea or flat white","Coffee","drink","The British pot or the Australasian coffee.","The cup is the drink","Coffee after. Tea anytime.","tea or coffee","milk"),
    D("A salad of raw fish and herbs","Ceviche","starter","The same idea as ceviche, with island herbs.","Sauvignon Blanc","Raw fish and a sharp white.","fish","lime","herbs","chili"),
    D("Grilled pork","Pork","main","A celebration meat across the islands.","Pinot Noir or beer","Pork and a cool red or a lager.","pork","salt","leaves or rub"),
    D("Breadfruit","Breadfruit","side","Roasted whole. A tree that feeds a village.","The fish’s wine","Pair the main.","breadfruit","salt"),
    D("Cassava or tapioca pudding","Tapioca_pudding","dessert","A soft sweet after a salty grill.","Moscato","Coconut-milk pudding and a light sweet wine.","tapioca or cassava","coconut milk","sugar"),
    D("Local lager","Beer","drink","Cold, simple, next to the grill.","The beer is the drink","Bubbles reset salt and smoke.","lager"),
    D("Pavlova if you are near NZ or Australia","Pavlova_(food)","dessert","Meringue, cream, fruit. The argument is half the fun.","Moscato","Crisp meringue and a little sparkle.","egg whites","sugar","cream","fruit"),
    D("Oysters if the water is cold","Oyster","starter","A squeeze of lemon. That is the recipe.","Champagne or Muscadet","Oysters and bubbles or a razor white. The classic lesson.","oysters","lemon"),
    D("Lamb if you are in New Zealand","Lamb","main","Grass and wind on a plate.","Pinot Noir from Central Otago","Lamb and Pinot is a textbook pair.","lamb","rosemary","salt"),
    D("ANZAC or coconut biscuit","ANZAC_biscuit","dessert","Oats or coconut, a tin, a pot of tea.","Tea","A biscuit and a pot.","oats or coconut","golden syrup","flour")
  ]
};

const SPECIAL = {
  "250": [ // France extras beyond the two in foods.js
    D("Soupe à l'oignon","French_onion_soup","starter","Market porters in Paris ate this after dawn. Onions, stock, melted cheese.","Beaujolais or dry cider","Salty-sweet soup. A light red or cider cuts the cheese.","onions","beef stock","baguette","Gruyère","butter"),
    D("Salade niçoise","Salade_niçoise","starter","Nice put tuna, egg, and olives on one plate and called it lunch.","Provence rosé","Rosé was born for tomatoes, olive oil, and a warm afternoon.","tuna","eggs","green beans","olives","olive oil"),
    D("Coq au vin","Coq_au_vin","main","Old rooster, red wine, and time. Burgundy farmers made toughness taste like velvet.","Red Burgundy / Pinot Noir","Cook with the same grape you drink.","chicken","red wine","lardons","mushrooms","pearl onions"),
    D("Cassoulet","Cassoulet","main","Toulouse, Castelnaudary, and Carcassonne still argue who owns it.","Cahors Malbec","A dark southwest red stands up to duck fat and beans.","white beans","duck confit","sausage","garlic"),
    D("Steak frites","Steak_frites","main","The bistro plate: a seared steak and a mountain of fries.","Bordeaux or Côtes du Rhône","Tannin loves grilled beef. Keep the glass simple.","steak","potatoes","butter","shallot"),
    D("Ratatouille","Ratatouille","side","Provence summer in a pot.","Côtes de Provence rosé","Vegetables and olive oil want a pink wine with acid.","eggplant","zucchini","tomato","bell pepper","olive oil"),
    D("Gratin dauphinois","Gratin_dauphinois","side","The Alps taught cream and potato to sit still under a brown top.","White Burgundy","Butter and cream want a white with body, not oak soup.","potatoes","cream","garlic","nutmeg"),
    D("Tarte tatin","Tarte_Tatin","dessert","The Tatin sisters burned apples, flipped the pan, and invented a classic.","Calvados or cider","Apple dessert, apple brandy.","apples","sugar","butter","puff pastry"),
    D("Crème brûlée","Crème_brûlée","dessert","A custard with a glass lid of burnt sugar.","Sauternes, a small glass","Sweet wine and burnt sugar is a French handshake.","cream","egg yolks","sugar","vanilla"),
    D("Kir","Kir_(cocktail)","drink","A splash of crème de cassis in white wine. Burgundy’s porch drink.","Aligoté","The wine is the drink. Keep it cold.","crème de cassis","dry white wine"),
    D("Champagne","Champagne","drink","Bubbles clean fat. That is the whole first lesson.","Champagne itself","Drink it with fries, oysters, or nothing at all.","champagne"),
    D("Duck confit","Duck_confit","main","Gascony salted duck and hid it in its own fat.","Madiran or Cahors","Fat needs tannin.","duck legs","duck fat","garlic","thyme"),
    D("Quiche Lorraine","Quiche_Lorraine","main","Bacon, cream, a tart. Lunch that became a world word.","Alsace Riesling","Egg, cream, and smoke love a white with acid.","pie dough","eggs","cream","lardons"),
    D("Croque-monsieur","Croque-monsieur","main","A grilled ham-and-cheese that grew up and put on béchamel.","Beaujolais","A juicy red with a hot sandwich.","bread","ham","Gruyère","béchamel"),
    D("Profiteroles","Profiterole","dessert","Choux puffs, ice cream, chocolate.","Champagne","Bubbles cut cream.","choux pastry","ice cream","chocolate"),
    D("Bouillabaisse","Bouillabaisse","main","Marseille fishermen threw unsold rockfish in a pot with saffron.","White from Cassis","A salty southern white matches the sea.","mixed fish","fennel","saffron","baguette")
  ],
  "380": [
    D("Bruschetta","Bruschetta","starter","Tuscany’s oldest snack: grilled bread, garlic, tomato, oil.","Chianti Classico","Tomato acid and Sangiovese acid are cousins.","bread","tomatoes","garlic","olive oil","basil"),
    D("Caprese","Caprese_salad","starter","Capri put tomato, mozzarella, and basil in the colors of the flag.","Vermentino","A salty island white loves mozzarella and oil.","mozzarella","tomatoes","basil","olive oil"),
    D("Lasagne alla bolognese","Lasagne","main","Bologna’s Sunday. Sheets, ragù, béchamel.","Sangiovese","Meat sauce wants a red with acid, not a jam bomb.","lasagna sheets","beef ragù","béchamel","Parmigiano"),
    D("Pizza Margherita","Pizza_Margherita","main","Naples, 1889. Tomato, mozzarella, basil.","Light red or sparkling","Pizza is salty. Bubbles and acid keep it from sitting heavy.","pizza dough","tomato","mozzarella","basil"),
    D("Cacio e pepe","Cacio_e_pepe","main","Rome: cheese, pepper, pasta water. Three things.","Frascati","A local white from the hills around Rome.","spaghetti","Pecorino Romano","black pepper"),
    D("Tiramisu","Tiramisu","dessert","Coffee, mascarpone, a little rum.","Vin Santo or espresso","Sweet wine or just coffee. Both are honest.","mascarpone","eggs","espresso","ladyfingers","cocoa"),
    D("Gelato","Gelato","dessert","Denser than ice cream. Eat it walking.","Moscato d'Asti","A little sparkle and peach next to cold cream.","milk","sugar","seasonal flavor"),
    D("Espresso","Espresso","drink","A short, dark yes.","The coffee is the drink","Wine after, coffee now.","espresso"),
    D("Prosecco","Prosecco","drink","Veneto’s everyday bubbles.","Prosecco itself","Drink it cold with salty snacks.","prosecco"),
    D("Focaccia","Focaccia","side","Liguria’s olive-oil bread. Dimple it. Salt it.","Vermentino","Salty bread and a seaside white.","flour","olive oil","yeast","rosemary"),
    D("Aperol spritz","Spritz","drink","Veneto’s orange hour.","The spritz is the drink","This is the starter glass.","Aperol","prosecco","soda","orange"),
    D("Osso buco","Ossobuco","main","Milan braised veal shanks and put gremolata on top like sunlight.","Barolo or Nebbiolo","Long-cooked veal can take a serious Piedmont red.","veal shanks","white wine","broth","gremolata"),
    D("Ribollita","Ribollita","side","Tuscan bread-and-bean soup, boiled twice.","Chianti","Beans, kale, and bread want a rustic red.","cannellini","cavolo nero","stale bread","tomato"),
    D("Cannoli","Cannoli","dessert","Sicily filled fried tubes with sweet ricotta.","Passito di Pantelleria","A sun-dried Sicilian sweet wine is the old partner.","cannoli shells","ricotta","sugar","pistachio"),
    D("Negroni","Negroni","drink","Florence, 1919. Equal parts, no debate.","The Negroni is the drink","Bitter, sweet, strong. Then eat.","gin","Campari","sweet vermouth"),
    D("Saltimbocca","Saltimbocca","main","Veal, sage, prosciutto. It jumps in the mouth.","Orvieto","A clean white keeps sage and salt in line.","veal","prosciutto","sage","white wine")
  ],
  "392": [
    D("Sushi","Sushi","main","Vinegared rice first, fish second. Edo stalls made it fast food.","Junmai sake or dry Champagne","Rice vinegar and sea flavors want clean, cold drinks.","sushi rice","nori","fresh fish","wasabi","soy"),
    D("Ramen","Ramen","main","Chinese noodles that Japan made into a national hug.","Cold beer or sake","Salt and fat love bubbles or a dry sake.","ramen noodles","broth","chashu pork","egg","scallion"),
    D("Tempura","Tempura","starter","Portugal brought frying. Japan made it light as paper.","Sparkling sake or Champagne","Fried food and bubbles is a world rule.","shrimp","vegetables","tempura flour","oil"),
    D("Yakitori","Yakitori","main","Chicken on charcoal, salted or glazed.","Highball or dry sake","Smoke and salt want something cold and not fancy.","chicken","scallion","tare or salt"),
    D("Tonkatsu","Tonkatsu","main","A breaded pork cutlet with shredded cabbage.","Junmai ginjo sake","Fried pork wants a drink with acid, not a heavy red.","pork loin","panko","cabbage","tonkatsu sauce"),
    D("Gyoza","Gyoza","starter","Crisp bottom, steamed top, pork and garlic.","Beer","Dumplings and beer is not a suggestion.","gyoza wrappers","ground pork","cabbage","garlic"),
    D("Matcha","Matcha","drink","Powdered green tea from the tea ceremony.","The tea is the drink","Learn the bitter. Sugar came later.","matcha powder","hot water"),
    D("Sake","Sake","drink","Rice wine brewed like beer. Serve warm or cold, never sloppy.","Sake itself","Sip with fish, fried food, or nothing.","sake"),
    D("Dorayaki","Dorayaki","dessert","Two pancakes hugging red-bean paste.","Green tea","Sweet bean wants bitter tea.","flour","eggs","anko red bean"),
    D("Mochi","Mochi","dessert","Pounded sticky rice. New Year food. Chew.","Green tea","Soft sweet rice likes tea.","mochigome rice","sugar","anko or fruit"),
    D("Karaage","Karaage","starter","Japanese fried chicken. Marinated, not just battered.","Highball","Fried chicken and whisky-soda is a Tokyo bar move.","chicken thighs","soy","ginger","potato starch"),
    D("Udon","Udon","main","Thick wheat noodles in a quiet broth.","Hot sake","Warm sake and warm broth are the same idea.","udon noodles","dashi","scallion"),
    D("Tamagoyaki","Tamagoyaki","side","Rolled sweet-savory egg. In sushi bars it tells you if the cook cares.","Green tea","Egg and tea. Quiet is the pairing.","eggs","dashi","sugar","soy"),
    D("Okonomiyaki","Okonomiyaki","main","Osaka’s cabbage pancake. You finish it at the table.","Dry beer","Savory-sweet sauce loves a bitter beer.","cabbage","flour","egg","okonomiyaki sauce"),
    D("Sunomono","Sunomono","starter","Cucumber and seaweed in sweet vinegar.","Junmai sake","Vinegar and sake are both rice talking.","cucumber","wakame","rice vinegar","sugar"),
    D("Green tea ice cream","Green_tea_ice_cream","dessert","Bitter matcha in cold cream.","Hot matcha","Hot and cold, bitter and sweet.","cream","matcha","sugar")
  ],
  "156": [
    D("Peking duck","Peking_duck","main","Beijing’s banquet bird. Skin so crisp it is carved at the table.","Pinot Noir or oolong tea","Fat skin wants acid or tea, not a tannic monster.","whole duck","scallion","cucumber","hoisin","pancakes"),
    D("Kung pao chicken","Kung_Pao_chicken","main","Sichuan: chicken, chili, peanut, and the tingle of peppercorn.","Off-dry Riesling","Heat plus tingle wants a little sugar and a lot of acid.","chicken","dried chili","Sichuan pepper","peanuts"),
    D("Dumplings","Jiaozi","starter","Northern China’s New Year food. Folded by the family.","Shaoxing wine or beer","Salty pork and vinegar like a warm grain wine or beer.","dumpling wrappers","ground pork","napa cabbage","ginger"),
    D("Hot pot","Hot_pot","main","A boiling table. You cook your own dinner and talk.","Light beer or tea","Chili oil and conversation. Keep the drink simple.","hot pot broth","thin beef","tofu","greens"),
    D("Char siu","Char_siu","main","Cantonese roast pork, red and sweet at the edge.","Gewürztraminer","Sweet-savory glaze loves a floral white.","pork shoulder","hoisin","honey","five-spice"),
    D("Scallion pancakes","Cong_you_bing","side","Flaky, fried, pulled apart at the table.","Beer","Fried bread and beer. Universal.","flour","scallions","oil","salt"),
    D("Jasmine tea","Tea","drink","China invented the leaf. Scented jasmine is the welcome.","The tea is the drink","Learn to taste the leaf before you chase wine.","jasmine tea"),
    D("Mooncake","Mooncake","dessert","Mid-Autumn: dense pastry and a story about the moon.","Oolong tea","Sweet dense pastry needs bitter tea.","mooncakes","tea"),
    D("Red-braised pork","Red_braised_pork","main","Shanghai’s soy-and-sugar pork belly.","Pinot Noir","Sweet soy and fat like a soft red.","pork belly","soy","rock sugar","star anise"),
    D("Spring rolls","Spring_roll","starter","A thin fried cigar of vegetables.","Sparkling wine","Fried and salty. Bubbles.","spring roll wrappers","cabbage","carrot","oil"),
    D("Egg drop soup","Egg_drop_soup","starter","A three-minute soup that still feels like care.","Jasmine tea","Light soup, light tea.","chicken stock","eggs","scallion","white pepper"),
    D("Fried rice","Fried_rice","main","Day-old rice, a hot wok, leftover respect.","Dry lager","Wok smoke and soy want bubbles.","cold rice","eggs","scallion","soy"),
    D("Wonton soup","Wonton","starter","Silk purses of pork in a clear broth.","Shaoxing or tea","A little warm wine in the broth is an old trick.","wonton wrappers","pork","stock","greens"),
    D("Mango pudding","Mango_pudding","dessert","Hong Kong’s cold mango jiggle.","Moscato or jasmine tea","Fruit dessert likes a light sweet sip or tea.","mango","cream","gelatin","sugar"),
    D("Szechuan green beans","Sichuan_cuisine","side","Blistered beans, pork crumbs, chili.","Riesling","Chili and garlic want acid.","green beans","ground pork","garlic","chili"),
    D("Congee","Congee","main","Rice cooked until it forgets it was rice. Breakfast and comfort.","Jasmine tea","A quiet tea for a quiet bowl.","rice","ginger","scallion")
  ],
  "356": [
    D("Butter chicken","Butter_chicken","main","Delhi, 1950s. Leftover tandoori, tomato, butter, cream.","Off-dry Riesling","Cream and spice want a white with a hint of fruit.","chicken","tomato","butter","cream","garam masala"),
    D("Biryani","Biryani","main","A Mughal layering of rice and meat, sealed and steamed.","Grenache","Spice and saffron can take a juicy red if you keep oak out.","basmati","lamb or chicken","yogurt","saffron"),
    D("Palak paneer","Palak_paneer","main","Spinach and fresh cheese. North Indian home food.","Sauvignon Blanc","Greens and cream like a grassy white.","spinach","paneer","garlic","ginger"),
    D("Samosa","Samosa","starter","A triangle that traveled. Potato, pea, a blistered crust.","Gewürztraminer","Fried spice and a floral white.","samosa wrappers","potato","peas","cumin"),
    D("Raita","Raita","side","Yogurt, cucumber, a little spice. The fire extinguisher.","The raita is the cooler","This is the pairing for the spicy plate.","yogurt","cucumber","cumin","mint"),
    D("Naan","Naan","side","Tandoor bread. Tear it.","The curry’s wine","Bread carries the sauce. Pair the sauce.","flour","yogurt","yeast","ghee"),
    D("Gulab jamun","Gulab_jamun","dessert","Milk balls in rose syrup. A wedding sweet.","Late-harvest Riesling or chai","Rose and sugar want a sweet sip or spiced tea.","milk powder","sugar syrup","cardamom","rose water"),
    D("Mango lassi","Lassi","drink","Yogurt, mango, a little sugar. The best air conditioner.","The lassi is the drink","This is how India cools a hot plate.","yogurt","mango","sugar"),
    D("Masala chai","Masala_chai","drink","Tea boiled with milk, ginger, and spice. Not a bag in a mug.","The chai is the drink","Learn this before you chase coffee.","black tea","milk","ginger","cardamom"),
    D("Tandoori chicken","Tandoori_chicken","main","Yogurt and chili, then a clay oven’s fire.","Grenache rosé","Char and yogurt like a pink wine with fruit.","chicken","yogurt","tandoori masala","lemon"),
    D("Aloo gobi","Aloo_gobi","side","Potato and cauliflower, everyday and perfect.","Grüner Veltliner","Vegetables and turmeric like a peppery white.","potato","cauliflower","turmeric","cumin"),
    D("Rogan josh","Rogan_josh","main","Kashmir: lamb in a red gravy of aromatics.","Pinot Noir","Lamb and gentle spice love Pinot.","lamb","yogurt","kashmiri chili","ginger"),
    D("Kheer","Kheer","dessert","Rice pudding with cardamom and nuts.","Muscat","Floral sweet wine next to cardamom.","rice","milk","sugar","cardamom"),
    D("Pakora","Pakora","starter","Vegetables in chickpea batter, fried, eaten in the rain.","Beer or chai","Monsoon food. Beer or tea.","chickpea flour","onion","spinach","oil"),
    D("Chole","Chana_masala","main","Spicy chickpeas. Punjab’s pride, with bread or rice.","Lassi or beer","Heat and a yogurt drink.","chickpeas","onion","chole masala","tomato"),
    D("Idli","Idli","starter","Steamed rice-lentil cakes. South India’s morning.","Coconut water or beer","Fermented batter and chili. Keep drinks light.","idli batter","sambar","coconut chutney")
  ],
  "484": [
    D("Guacamole","Guacamole","starter","The Aztec word is āhuacamolli — avocado sauce.","Mexican lager or Sauvignon Blanc","Fat avocado wants acid and cold.","avocados","lime","onion","cilantro","jalapeño"),
    D("Elote","Elote","starter","Street corn: mayo, cotija, chili, lime.","Michelada or lager","Chili and mayo love a salty beer.","corn","mayonnaise","cotija","chili powder","lime"),
    D("Pozole","Pozole","main","A hominy stew with a pre-Hispanic soul.","Grenache or beer","Pork and chile can take a juicy red or a cold beer.","hominy","pork","chile","radish","cabbage"),
    D("Enchiladas","Enchilada","main","A tortilla bathed in chile sauce. The sauce is the dish.","Tempranillo","Chile and cheese like a Spanish-style red.","corn tortillas","chile sauce","cheese","onion"),
    D("Tamales","Tamale","main","Masa steamed in a husk. A celebration food you unwrap.","Atole or a light red","Corn and steam. A warm drink or a gentle red.","masa","corn husks","filling"),
    D("Pico de gallo","Pico_de_gallo","side","A raw salsa that should taste like a garden, not a jar.","Sauvignon Blanc","Tomato, lime, and onion are a white-wine salad.","tomato","onion","cilantro","lime"),
    D("Churros","Churro","dessert","Fried dough and cinnamon sugar.","Mexican hot chocolate","Cinnamon sugar likes chocolate.","flour","oil","sugar","cinnamon"),
    D("Flan","Crème_caramel","dessert","A Spanish custard Mexico made its own.","Pedro Ximénez, a sip","Caramel custard and a raisiny sherry.","eggs","milk","sugar","vanilla"),
    D("Horchata","Horchata","drink","Rice, cinnamon, and cold milk.","The horchata is the drink","This cools chile better than most wine.","rice","cinnamon","milk","sugar"),
    D("Margarita","Margarita_(cocktail)","drink","Tequila, lime, a little orange liqueur.","The margarita is the drink","Then eat. Do not chase every taco with another one.","tequila","lime","orange liqueur","salt"),
    D("Carne asada","Carne_asada","main","Skirt steak, fire, lime, a crowd.","Cabernet or beer","Grill smoke and beef can take a bigger red.","skirt steak","lime","garlic","tortillas"),
    D("Salsa verde","Salsa_verde","side","Tomatillo, not green tomato. Bright and tart.","Sauvignon Blanc","Tart green sauce loves a tart white.","tomatillos","jalapeño","cilantro","onion"),
    D("Quesadilla","Quesadilla","main","A folded tortilla and melted cheese.","Lager","Melted cheese wants bubbles.","tortillas","Oaxaca cheese"),
    D("Tres leches","Tres_leches_cake","dessert","Sponge soaked in three milks.","Sweet sparkling or coffee","Milk cake likes bubbles or a bitter cup.","sponge cake","evaporated milk","condensed milk","cream"),
    D("Agua fresca","Agua_fresca","drink","Fruit, water, a little sugar.","The agua is the drink","Learn jamaica, horchata, and melon before soda.","fruit","water","sugar","lime"),
    D("Chiles rellenos","Chile_relleno","main","A roasted chile stuffed, battered, and sauced.","Riesling","Stuffed chile and fried batter want a little sweetness.","poblano peppers","cheese","eggs","tomato sauce")
  ],
  "840": [
    D("Clam chowder","Clam_chowder","starter","New England’s cream and clams. Manhattan made a tomato version and started a fight.","Unoaked Chardonnay","Cream and clam want a white with body, not oak.","clams","potato","onion","cream"),
    D("Buffalo wings","Buffalo_wing","starter","Buffalo, 1964. Butter, hot sauce, a leftover chicken.","Lager or sparkling","Hot, fried, and blue-cheese cool. Bubbles win.","chicken wings","hot sauce","butter","celery"),
    D("Cheeseburger","Cheeseburger","main","A griddle, a bun, and an argument about doneness.","Zinfandel or a shake","Juicy beef likes a juicy red — or just the shake.","ground beef","buns","cheese","pickles"),
    D("Fried chicken","Fried_chicken","main","West African frying met Southern larders.","Riesling or sweet tea","Crisp skin and spice like a little sugar in the glass.","chicken","buttermilk","flour","oil"),
    D("Barbecue ribs","Barbecue","main","Low fire, time, and a regional religion.","Zinfandel or beer","Smoke and sweet sauce like ripe fruit or a cold beer.","pork ribs","rub","sauce"),
    D("Mac and cheese","Macaroni_and_cheese","side","Jefferson served a version. The boxed one fed a century of kids.","Chardonnay","Cheese sauce wants a white with a little weight.","elbow pasta","cheddar","milk","butter"),
    D("Coleslaw","Coleslaw","side","Cabbage and a dressing. The cool side of every picnic.","Riesling","Vinegar slaw and a little sweetness in the wine.","cabbage","carrot","mayonnaise or vinegar"),
    D("Cornbread","Cornbread","side","Indigenous corn, a cast-iron skillet, a debate about sugar.","Sweet tea or beer","Corn and crumb. Keep the drink humble.","cornmeal","buttermilk","egg","butter"),
    D("Brownies","Chocolate_brownie","dessert","A dense chocolate square that does not need frosting.","Port or milk","Chocolate likes a sweet fortified wine or a glass of milk.","chocolate","butter","sugar","eggs"),
    D("Iced tea","Iced_tea","drink","The South drinks it sweet. The rest of the country argues.","The tea is the drink","Learn unsweet first, then add what you want.","black tea","ice","lemon"),
    D("Old Fashioned","Old_fashioned","drink","Whiskey, sugar, bitters, orange.","The cocktail is the drink","Then eat. This is a porch glass, not a pairing.","bourbon or rye","sugar","bitters","orange"),
    D("Lobster roll","Lobster_roll","main","Warm butter or cold mayo. Maine will tell you which is right.","Muscadet or Champagne","Sweet lobster and a razor-sharp white.","lobster","split-top bun","butter or mayo","lemon"),
    D("Gumbo","Gumbo","main","Louisiana: roux, the holy trinity, okra or filé.","Off-dry Riesling or beer","Spice, smoke, and stew like a little sweetness.","roux","andouille","chicken or shrimp","okra","rice"),
    D("Key lime pie","Key_lime_pie","dessert","Condensed milk, lime, a graham crust. Bright and cold.","Moscato","Tart pie likes a sweet little wine.","key lime juice","condensed milk","egg yolks","graham crust"),
    D("Pecan pie","Pecan_pie","dessert","A Southern syrup pie with a nut lid.","Bourbon","Brown sugar and whiskey are family.","pecans","corn syrup","eggs","pie dough"),
    D("Root beer float","Root_beer_float","drink","Soda and ice cream in one glass.","The float is the drink","This is dessert in a cup.","root beer","vanilla ice cream")
  ],
  "076": [
    D("Moqueca","Moqueca","main","A clay-pot fish stew. Bahia uses dendê; Espírito Santo uses olive oil.","Albariño","Coconut, lime, and fish want a salty white.","firm fish","coconut milk","dendê or olive oil","peppers"),
    D("Coxinha","Coxinha","starter","A chicken croquette shaped like a drumstick. Party food.","Caipirinha or sparkling","Fried dough and bubbles — or cachaça.","shredded chicken","dough","oil"),
    D("Brigadeiro","Brigadeiro","dessert","Condensed milk and cocoa rolled in sprinkles.","Sweet sparkling or coffee","Chocolate milk fudge likes bubbles or a bitter cup.","condensed milk","cocoa","butter","sprinkles"),
    D("Caipirinha","Caipirinha","drink","Cachaça, lime, sugar. Brazil’s national glass.","The caipirinha is the drink","Then eat. Do not make every sip a cocktail.","cachaça","limes","sugar"),
    D("Picanha","Picanha","main","The cap steak Brazil taught the world to grill. Fat cap on.","Malbec","Grill and fat like a ripe red.","picanha steak","coarse salt"),
    D("Farofa","Farofa","side","Toasted cassava meal. It goes on everything at a churrasco.","The grill’s wine","Pair the meat. Farofa is the crunch.","cassava flour","butter","onion"),
    D("Couve à mineira","Collard_greens","side","Collard ribbons fried with garlic. The feijoada plate.","Malbec or beer","Greens and garlic next to a juicy red.","collard greens","garlic","oil"),
    D("Açaí bowl","Açaí","dessert","Amazon fruit, frozen and smashed. Rio made it a beach breakfast.","None — eat it cold","This is the bowl.","açaí pulp","banana","granola"),
    D("Guaraná soda","Guaraná_Antarctica","drink","Amazon berry soda. The other national drink.","The soda is the drink","Sweet, bright, and everywhere.","guaraná soda"),
    D("Quindim","Quindim","dessert","Coconut and egg yolk, glossy as a jewel.","Moscatel","Egg yolk and coconut like a floral sweet wine.","egg yolks","sugar","coconut"),
    D("Romeu e Julieta","Romeu_e_Julieta_(food)","dessert","Guava paste and fresh cheese.","Late-harvest wine","Sweet fruit and salt cheese.","guava paste","queijo minas"),
    D("Cafézinho","Coffee","drink","A small, sweet coffee. Hospitality in a demitasse.","The coffee is the drink","Brazil grows the bean. Drink it.","coffee","sugar"),
    D("Acarajé","Acarajé","starter","Black-eyed-pea fritters fried in dendê, sold by baianas.","Beer","Palm oil and chili like a cold lager.","black-eyed peas","dendê oil","shrimp"),
    D("Vatapá","Vatapá","side","Bread, shrimp, coconut, dendê, peanuts. A rich spoon.","Off-dry Riesling","Heat and coconut like a little sweetness.","bread","shrimp","coconut milk","dendê"),
    D("Bolinho de bacalhau","Bolinho_de_bacalhau","starter","Salt-cod fritters from the Portuguese table.","Vinho Verde","Salt cod and a spritzy Portuguese white.","salt cod","potato","parsley","oil"),
    D("Kibe","Kibbeh","starter","Lebanese Brazil: fried bulgur croquettes on every birthday tray.","Syrah or beer","Spice and fry like a juicy red or a lager.","bulgur","ground beef","onion","mint")
  ],
  "826": [
    D("Yorkshire pudding","Yorkshire_pudding","side","A batter that puffs in hot fat. The roast’s crown.","The roast’s red","Pair the beef. The pudding drinks the gravy.","flour","eggs","milk","beef drippings"),
    D("Shepherd's pie","Shepherd's_pie","main","Lamb under mashed potato. Cottage pie if you use beef.","Côtes du Rhône","Minced lamb and a peppery red.","ground lamb","onion","peas","mashed potato"),
    D("Bangers and mash","Bangers_and_mash","main","Sausages, mash, onion gravy. A pub plate.","Ale or Pinot Noir","Onion gravy likes a pint or a light red.","sausages","potatoes","onions","gravy"),
    D("Ploughman's lunch","Ploughman's_lunch","starter","Cheese, pickle, bread, and a pint.","Cider or ale","Cheese and pickle want apple or malt, not oak.","cheddar","pickle","bread","apple"),
    D("Scotch egg","Scotch_egg","starter","A boiled egg in sausage, breaded and fried.","Sparkling wine or ale","Fried and salty. Bubbles or a pint.","eggs","sausage meat","breadcrumbs","oil"),
    D("Sticky toffee pudding","Sticky_toffee_pudding","dessert","Dates, sponge, and a toffee flood.","Pedro Ximénez","Brown sugar wants a raisiny sweet wine.","dates","flour","butter","toffee sauce"),
    D("Eton mess","Eton_mess","dessert","Broken meringue, cream, strawberries.","Moscato or cider","Berries and cream like a little sparkle.","strawberries","meringue","cream"),
    D("Scones and clotted cream","Scone","dessert","The cream-or-jam-first war is real. Eat them warm.","Tea","This is a tea lesson, not a wine lesson.","flour","cream","jam","clotted cream"),
    D("Gin and tonic","Gin_and_tonic","drink","The Empire’s malaria tonic became a garden drink.","The G&T is the drink","Then eat. Keep the pour honest.","gin","tonic","lime"),
    D("Builder's tea","Tea","drink","Strong, milky, in a mug.","The tea is the drink","Learn this before you learn sommelier words.","black tea","milk","sugar"),
    D("Roast potatoes","Roast_potato","side","Hot fat, rough edges, a crunch.","The roast’s wine","Pair the meat.","potatoes","duck fat or oil","rosemary"),
    D("Mushy peas","Mushy_peas","side","Marrowfat peas with the fish.","The beer with the fish","Peas and malt. A pint.","marrowfat peas","butter","mint"),
    D("Cornish pasty","Cornish_pasty","main","A miner’s lunch: meat and veg in a crimped pastry handle.","Cider","A handheld pie and apple drink.","pastry","beef","potato","swede","onion"),
    D("Trifle","Trifle","dessert","Cake, jelly, custard, cream.","Sweet sherry","The old recipe already has sherry in it.","sponge","jelly","custard","cream","fruit"),
    D("Pimm's cup","Pimm's","drink","Summer: Pimm’s, lemonade, cucumber, fruit.","The Pimm's is the drink","A garden drink. Then eat the picnic.","Pimm's No. 1","lemonade","cucumber","strawberries"),
    D("Crumble","Crumble","dessert","Fruit under a rubble of butter and flour.","Custard or late-harvest wine","Hot fruit likes cream or a sweet sip.","fruit","flour","butter","sugar")
  ],
  "276": [
    D("Kartoffelsalat","German_potato_salad","side","Warm with vinegar in the south; mayo in the north.","Riesling","Vinegar potatoes and Riesling are a German pair.","potatoes","vinegar","onion","broth"),
    D("Bratwurst","Bratwurst","main","A grilled sausage with a regional name on every town sign.","German lager or Riesling","Pork and smoke like malt or acid.","bratwurst","mustard","bread"),
    D("Currywurst","Currywurst","main","Berlin, 1949. Sausage, ketchup, curry powder.","Pilsner","Street spice and a bitter beer.","bratwurst","ketchup","curry powder","fries"),
    D("Sauerkraut","Sauerkraut","side","Fermented cabbage. Winter vitamin C before anyone said the words.","Riesling Kabinett","Sour cabbage and a little sweetness in the wine.","sauerkraut","juniper","apple","onion"),
    D("Spätzle","Spätzle","side","Hand-scraped noodles. Swabia’s hug.","A light red","Butter noodles like a gentle red.","flour","eggs","butter"),
    D("Black Forest cake","Black_Forest_gateau","dessert","Cherries, cream, chocolate, and a splash of kirsch.","Kirschwasser, a sip","Cherry brandy is already in the cake.","chocolate cake","cherries","cream","kirsch"),
    D("Kölsch","Kölsch","drink","Cologne’s pale ale, served in small glasses so it never warms.","The Kölsch is the drink","This is a beer lesson: temperature and glass size matter.","kölsch beer"),
    D("Riesling","Riesling","drink","The teaching grape. Acid, fruit, and a rumor of petrol with age.","Riesling itself","Taste dry, off-dry, and sweet. Same grape, three lessons.","riesling"),
    D("Obatzda","Obatzda","starter","Bavarian beer-garden cheese spread.","Hefeweizen","Cheese and a cloudy wheat beer.","camembert","butter","paprika","onion","pretzels"),
    D("Glühwein","Mulled_wine","drink","Winter markets: red wine, orange, clove.","The glühwein is the drink","A seasonal cup. Then eat a sausage.","red wine","orange","cloves","cinnamon"),
    D("Königsberger klopse","Königsberger_Klopse","main","Meatballs in a caper cream sauce.","Riesling","Caper and cream like acid.","ground meat","capers","cream","broth"),
    D("Apfelkuchen","German_apple_cake","dessert","A simpler apple cake than strudel. Coffee-table food.","Cider or Auslese","Apple and apple drink.","apples","flour","butter","cinnamon"),
    D("Semmelknödel","Semmelknödel","side","Bread dumplings that catch roast gravy.","The roast’s wine","Pair the meat.","stale rolls","milk","egg","parsley"),
    D("Rote Grütze","Rote_Grütze","dessert","North German berry pudding with cream.","Beerenauslese, a sip","Berries and a sweet berry wine.","mixed berries","sugar","starch","cream"),
    D("Pumpernickel","Pumpernickel","side","Westphalia’s dark rye. Slow, dense, a little sweet.","The smoked fish’s wine","Pair whatever you put on it.","pumpernickel bread","butter"),
    D("Labskaus","Labskaus","main","Hamburg’s sailor mash: corned beef, beet, potato, egg, herring.","Pilsner","A salty plate wants a clean beer.","corned beef","beets","potatoes","egg","herring")
  ],
  "724": [
    D("Gazpacho","Gazpacho","starter","Andalusia’s cold tomato soup. A blender and a hot afternoon.","Fino sherry or Albariño","Cold soup and a cold dry drink.","tomatoes","cucumber","pepper","garlic","olive oil"),
    D("Patatas bravas","Patatas_bravas","starter","Fried potatoes, spicy sauce. The tapa that never leaves.","Cava","Fried potato and bubbles. Spain’s Champagne lesson.","potatoes","bravas sauce","aioli"),
    D("Pan con tomate","Pa_amb_tomàquet","starter","Bread, tomato, oil, and a slice of ham if you are lucky.","Cava or Rioja","Salt and tomato like bubbles or a bright red.","bread","tomato","olive oil","jamón"),
    D("Croquetas","Croquette","starter","Béchamel, ham, a crisp coat.","Cava","Fried cream and bubbles.","béchamel","jamón","breadcrumbs","oil"),
    D("Pulpo a la gallega","Polbo_à_feira","main","Octopus, paprika, olive oil, potato.","Albariño","Octopus and the local white are married.","octopus","paprika","olive oil","potato"),
    D("Churros con chocolate","Churros","dessert","Breakfast or midnight. Dunk.","Sweet sherry or thick chocolate","The chocolate is the pairing.","flour","oil","sugar","drinking chocolate"),
    D("Cava","Cava","drink","Catalonia’s bubbles. Same method as Champagne, different hills.","Cava itself","Drink it with fries and jamón. That is the lesson.","cava"),
    D("Fino sherry","Sherry","drink","The teaching wine of Spain. Oxidized on purpose, bone dry.","Fino itself","Sip with olives and almonds. This is wine school.","fino sherry","olives","almonds"),
    D("Padrón peppers","Padrón_pepper","starter","Some are hot, some are not. Olive oil and salt.","Albariño","Blistered peppers and a Galician white.","padrón peppers","olive oil","salt"),
    D("Fabada","Fabada_asturiana","main","Asturias: giant beans, chorizo, morcilla.","Cider from Asturias","Beans and smoke like a sharp cider.","fabes beans","chorizo","morcilla"),
    D("Garlic shrimp","Gambas_al_ajillo","starter","A cazuela of shrimp, garlic, and chili. Bread for the oil.","Manzanilla sherry","Garlic, sea, and a salty sherry.","shrimp","garlic","olive oil","chili"),
    D("Manchego and quince","Manchego","starter","Sheep cheese and membrillo. A two-bite Spain.","Crianza Rioja","Sheep milk and a Tempranillo with a little age.","manchego","quince paste"),
    D("Crema catalana","Crema_catalana","dessert","Catalonia’s burnt-cream cousin, citrus and cinnamon.","Moscatel","Custard and a floral sweet wine.","milk","egg yolks","sugar","cinnamon"),
    D("Tinto de verano","Tinto_de_verano","drink","Red wine and lemon soda. More common at home than sangria.","The tinto is the drink","A hot-day glass. Then eat tapas.","red wine","lemon soda"),
    D("Sangria","Sangria","drink","Wine, fruit, a picnic. Not a serious tasting — a happy one.","The sangria is the drink","Then try a straight Rioja and taste the difference.","red wine","orange","brandy","sugar"),
    D("Cocido madrileño","Cocido_madrileño","main","Madrid’s boiled feast: chickpeas, meats, a soup first.","Rioja","A long table and a Tempranillo.","chickpeas","meats","cabbage","potato")
  ],
  "410": [
    D("Kimchi","Kimchi","side","Cabbage, chili, time. A side dish that is also a culture.","Soju or beer","Ferment and heat like a clean drink.","napa cabbage","gochugaru","garlic","fish sauce"),
    D("Korean fried chicken","Korean_fried_chicken","main","Twice-fried, glazed, impossibly crisp.","Beer","The original pairing is chimaek — chicken and beer.","chicken","potato starch","gochujang glaze","oil"),
    D("Japchae","Japchae","side","Glass noodles, sesame, vegetables. A celebration plate.","Off-dry Riesling","Sesame and soy like a little fruit in the white.","sweet potato noodles","spinach","carrot","soy"),
    D("Samgyeopsal","Samgyeopsal","main","Pork belly you grill yourself. Wrap in lettuce.","Soju","Fat and lettuce and a short glass.","pork belly","lettuce","ssamjang","garlic"),
    D("Tteokbokki","Tteokbokki","main","Chewy rice cakes in a red sauce. Street-cart heat.","Beer","Chili-sweet sauce and a cold lager.","rice cakes","gochujang","fish cakes"),
    D("Soju","Soju","drink","The clear everyday spirit. Share the bottle.","The soju is the drink","Pour for others. That is the lesson.","soju"),
    D("Barley tea","Bori-cha","drink","Roasted barley water, hot or cold.","The tea is the drink","A toasted, caffeine-free cup.","roasted barley","water"),
    D("Pajeon","Pajeon","starter","A scallion pancake for the rain.","Makgeolli","The old pair: pancake and cloudy rice wine.","scallions","flour","egg"),
    D("Galbi","Galbi","main","Marinated short ribs on a table grill.","Pinot Noir or soju","Sweet soy marinade likes a soft red.","short ribs","soy","pear","garlic"),
    D("Hotteok","Hotteok","dessert","A winter pancake stuffed with brown sugar and nuts.","Sikhye or tea","Brown sugar and a sweet rice drink.","yeast dough","brown sugar","seeds"),
    D("Sundubu jjigae","Sundubu-jjigae","main","Soft tofu stew that arrives bubbling.","Beer or soju","Heat and silk tofu like a cold drink.","soft tofu","kimchi or seafood","egg","stock"),
    D("Mandu","Mandu","starter","Korean dumplings — steamed, fried, or in soup.","Beer","Dumplings and beer.","mandu wrappers","pork","tofu","garlic"),
    D("Doenjang jjigae","Doenjang_jjigae","main","Soybean-paste stew. The everyday pot.","Soju or tea","Fermented soybean likes a clean sip.","doenjang","zucchini","tofu","stock"),
    D("Bingsu","Bingsu","dessert","Shaved ice, red bean, fruit, condensed milk.","None — eat it cold","This is the cooler.","shaved ice","red bean","milk","fruit"),
    D("Sikhye","Sikhye","drink","Sweet malted rice drink, cold, with grains at the bottom.","The sikhye is the drink","Dessert in a cup.","sikhye"),
    D("Banchan plate","Banchan","side","The little dishes. A Korean table is a constellation.","The main’s drink","Pair the grill or the stew.","spinach namul","bean sprouts","pickles")
  ],
  "764": [
    D("Som tam","Som_tam","starter","Green papaya salad. Pounded, loud, a little sweet, a little fire.","Off-dry Riesling","Lime, fish sauce, and chili want sugar and acid in the glass.","green papaya","lime","fish sauce","chili","peanuts"),
    D("Green curry","Green_curry","main","A fragrant coconut curry. The green is herb, not just heat.","Gewürztraminer","Coconut and basil like a floral white.","green curry paste","coconut milk","chicken or tofu","Thai basil"),
    D("Massaman curry","Massaman_curry","main","A spice-route curry: cardamom, potato, peanut.","Pinot Noir","Gentle spice and potato can take a soft red.","massaman paste","coconut milk","beef","potato"),
    D("Mango sticky rice","Mango_sticky_rice","dessert","Ripe mango, coconut-soaked rice. The rainy-season prize.","Moscato","Tropical fruit and a light sweet wine.","mango","sticky rice","coconut milk","sugar"),
    D("Thai iced tea","Thai_tea","drink","Strong tea, spice, condensed milk, ice.","The tea is the drink","This cools a curry better than most wine.","Thai tea mix","condensed milk","ice"),
    D("Larb","Larb","main","Minced meat, toasted rice, lime, mint. Isaan’s bright salad.","Sauvignon Blanc","Herbs and lime are a white-wine plate.","minced meat","lime","mint","toasted rice"),
    D("Pad kra pao","Pad_krapow","main","Holy basil, chili, a fried egg. The everyday wok.","Beer","Heat and basil like a cold lager.","ground meat","holy basil","chili","egg"),
    D("Tom kha","Tom_kha_gai","starter","Coconut, galangal, chicken. A gentler sister to tom yum.","Off-dry Riesling","Coconut and lime like a little sugar.","coconut milk","galangal","chicken","lime"),
    D("Sticky rice","Sticky_rice","side","Isaan rice you pinch. The salad’s partner.","The salad’s wine","Pair the som tam.","glutinous rice"),
    D("Kanom krok","Khanom_khrok","dessert","Coconut pancakes from a street griddle.","Thai tea","Coconut sweet and a spiced tea.","coconut milk","rice flour","sugar"),
    D("Coconut water","Coconut_water","drink","From the fruit, not a can if you can help it.","The coconut is the drink","A market cooler.","coconut water"),
    D("Nam prik and vegetables","Nam_phrik","side","A chili relish and raw vegetables.","Riesling","Chili dip wants off-dry.","chili relish","cucumber","long beans"),
    D("Miang kham","Miang_kham","starter","A leaf wrap: coconut, lime, ginger, peanut, a drop of sauce.","Off-dry Riesling","Sweet, sour, salty, hot — the wine should be the same idea.","leaves","coconut","lime","ginger","peanuts"),
    D("Pad thai leftovers — lime and peanut","Pad_thai","side","The last squeeze and the last crunch.","The pad thai’s wine","Pair the wok.","limes","peanuts"),
    D("Local lager","Beer","drink","With chili, beer is a tool.","Cold lager","Carbonation resets heat.","lager"),
    D("Coconut ice cream","Coconut_ice_cream","dessert","Often served in the husk with peanuts.","None — eat it cold","Street dessert.","coconut ice cream","peanuts")
  ],
  "704": [
    D("Gỏi cuốn","Gỏi_cuốn","starter","Fresh spring rolls. Rice paper, herbs, shrimp, a dip.","Sauvignon Blanc","Herbs and lime are a white-wine plate.","rice paper","shrimp","herbs","rice noodles"),
    D("Bún chả","Bun_cha","main","Hanoi: grilled pork, noodles, a sweet-sour dip, a pile of herbs.","Riesling","Char, herbs, and nước chấm like a little sweetness.","pork","rice noodles","herbs","nuoc cham"),
    D("Cơm tấm","Cơm_tấm","main","Saigon broken rice with grilled pork and a fried egg.","Beer","Grill and fish sauce like a cold lager.","broken rice","grilled pork","egg","pickles"),
    D("Cà phê sữa đá","Vietnamese_iced_coffee","drink","Phin coffee, condensed milk, ice.","The coffee is the drink","This is Vietnam’s dessert and breakfast.","dark roast coffee","condensed milk","ice"),
    D("Egg coffee","Egg_coffee","drink","Hanoi: coffee under a meringue-like egg cream.","The coffee is the drink","A cup to sit with.","coffee","egg yolk","condensed milk"),
    D("Bánh xèo","Bánh_xèo","main","A turmeric crepe you shatter and wrap in herbs.","Riesling","Crisp, herbal, a little fatty. Off-dry white.","rice flour","turmeric","pork","shrimp","bean sprouts"),
    D("Bún bò Huế","Bun_bo_Hue","main","Huế’s lemongrass beef noodle. Louder than phở.","Beer","Lemongrass heat and a lager.","beef","rice noodles","lemongrass","chili"),
    D("Nem rán","Nem_rán","starter","Hanoi fried spring rolls. A family tray food.","Sparkling or beer","Fried and salty. Bubbles.","rice paper","pork","wood ear","oil"),
    D("Chè","Chè","dessert","A sweet soup of beans, coconut, ice, jelly.","None — eat it cold","Dessert in a glass.","beans","coconut milk","ice","sugar"),
    D("Bánh cuốn","Bánh_cuốn","starter","Steamed rice sheets, minced pork, fried shallot.","Green tea","A delicate plate. Quiet tea.","rice batter","pork","wood ear","shallots"),
    D("Cá kho tộ","Cá_kho_tộ","main","Caramel fish in a clay pot. Home food.","Pinot Noir","Sweet-salty caramel fish likes a soft red.","catfish or salmon","sugar","fish sauce","pepper"),
    D("Trà đá","Iced_tea","drink","Iced tea on every table, free and expected.","The tea is the drink","Hospitality in a glass.","tea","ice"),
    D("Xôi","Xôi","side","Sticky rice, morning street food, savory or sweet.","Tea","A dawn plate. Tea.","sticky rice","mung bean or chicken"),
    D("Rau muống xào","Morning_glory_(vegetable)","side","Morning glory, garlic, a blast of heat.","The phở’s drink","Pair the main.","water spinach","garlic","oil"),
    D("Nước mía","Sugarcane_juice","drink","Pressed cane, ice, a sidewalk machine.","The juice is the drink","A market cooler.","sugarcane juice","ice"),
    D("Bánh flan","Flan","dessert","French custard that stayed after the French left.","Coffee","The cà phê is the pairing.","eggs","milk","sugar")
  ],
  "036": [
    D("Barramundi","Barramundi","main","A northern fish on the barbecue. Lemon, salt, no fuss.","Sémillon or Sauvignon Blanc","A clean white for a clean fish.","barramundi","lemon","olive oil"),
    D("Vegemite toast","Vegemite","starter","A thin smear. A thick one is how you learn humility.","Black tea","Salt yeast and tea. Breakfast.","bread","butter","Vegemite"),
    D("Prawns on the barbie","Shrimp","main","The ad was American. The barbecue is real.","Clare Valley Riesling","Grilled prawn and a limey Riesling.","prawns","garlic","lemon"),
    D("ANZAC biscuits","ANZAC_biscuit","dessert","Oats, golden syrup, a wartime name.","Tea","A biscuit and a pot.","oats","golden syrup","flour","coconut"),
    D("Flat white","Flat_white","drink","Australia and New Zealand still share the credit.","The coffee is the drink","A milk-coffee lesson.","espresso","milk"),
    D("Tim Tam slam","Tim_Tam","dessert","Bite both ends, drink tea through it.","Tea","Chocolate biscuit and tea.","Tim Tams","tea"),
    D("Kangaroo steak","Kangaroo_meat","main","Lean, a little sweet, a backyard grill for the curious.","Tasmanian Pinot Noir","Lean red meat likes a cool-climate Pinot.","kangaroo","pepper","oil"),
    D("Vanilla slice","Vanilla_slice","dessert","Custard between pastry. A bakery window.","Dessert wine, small","Custard and a sip.","puff pastry","custard","icing"),
    D("Pumpkin scones","Scone","dessert","Dame Flo’s recipe, still copied.","Tea","Pumpkin sweet and a pot.","pumpkin","flour","cream"),
    D("Meat pie with sauce","Australian_meat_pie","main","A hand pie and tomato sauce at the footy.","Shiraz","Gravy beef and a ripe Australian red.","pie","tomato sauce"),
    D("Lamingtons","Lamington","dessert","Sponge, chocolate, coconut. A bake-sale square.","Rutherglen Muscat, a sip","Chocolate coconut and a sticky Australian wine.","sponge","chocolate icing","coconut"),
    D("Pavlova","Pavlova_(food)","dessert","Australia and New Zealand still argue. Eat the crisp meringue anyway.","Moscato","Fruit and cream like a light sweet sparkle.","egg whites","sugar","cream","passionfruit"),
    D("Lemon delicious","Lemon_delicious_pudding","dessert","A self-saucing lemon sponge. Sunday lunch.","Late-harvest Riesling","Lemon and a sweet Riesling.","lemons","sugar","flour","butter"),
    D("Lamington leftover tea","Tea","drink","The bake-sale cup.","The tea is the drink","Chocolate coconut and a pot.","black tea","milk")
  ]
};

function keyOf(id) {
  return String(id);
}

function regionOf(id) {
  if (REGION[id]) return REGION[id];
  if (id === "Kosovo") return "europe";
  if (id === "Somaliland") return "africa";
  return "asia";
}

function uniqByName(list) {
  var seen = {};
  var out = [];
  for (var i = 0; i < list.length; i++) {
    var n = String(list[i].name || "").toLowerCase().replace(/\s+/g, " ").trim();
    if (!n || seen[n]) continue;
    seen[n] = 1;
    out.push(list[i]);
  }
  return out;
}

function fillTo20(id, base) {
  var region = regionOf(id);
  var extra = SPECIAL[id] || [];
  var bank = BANKS[region] || BANKS.asia;
  var list = uniqByName(base.concat(extra).concat(bank));
  var i = 0;
  while (list.length < 20 && i < 40) {
    var d = bank[i % bank.length];
    var copy = JSON.parse(JSON.stringify(d));
    if (list.length >= bank.length) copy.name = copy.name + " · table " + (Math.floor(i / bank.length) + 2);
    list = uniqByName(list.concat([copy]));
    i++;
  }
  return list.slice(0, 20);
}

var out = {};
var keys = Object.keys(window.COUNTRY_FOODS);
var i, id, region, base;
for (i = 0; i < keys.length; i++) {
  id = keys[i];
  region = regionOf(id);
  base = (window.COUNTRY_FOODS[id] || []).map(function (d) { return upgrade(d, region); });
  out[id] = fillTo20(id, base);
}

var named = ["Kosovo", "Somaliland"];
for (i = 0; i < named.length; i++) {
  id = named[i];
  if (!out[id] && window.COUNTRY_FOODS[id]) {
    region = regionOf(id);
    base = window.COUNTRY_FOODS[id].map(function (d) { return upgrade(d, region); });
    out[id] = fillTo20(id, base);
  }
}

var wineSchool = [
  { title: "Acid is your friend", text: "Fat, salt, and fried food love a drink with snap. That is why fries and Champagne, and why fish hates oaky butter-wine." },
  { title: "Sweet food, sweeter wine", text: "If the dessert is sweeter than the glass, the wine tastes thin. A small pour of something sweet is not showing off. It is matching." },
  { title: "Chili likes a little sugar", text: "Off-dry Riesling is the world traveler’s trick. A hint of fruit cools heat. A tannic red makes chili taste hotter." },
  { title: "Drink what grew next door", text: "In Europe that is almost a law. In the rest of the world it is still a good first guess: local beer, tea, or the grape that likes the same weather as the food." },
  { title: "Bubbles clean the plate", text: "Fried food, salty ham, and cheese all like sparkle. Cava, Champagne, Prosecco, or just beer. Carbonation is a napkin." },
  { title: "Tea and coffee are pairings too", text: "China, Japan, India, Vietnam, Brazil — the cup on the table is often the right cup. Wine is a guest, not a requirement." },
  { title: "One glass, then water", text: "Taste better if you are not racing. Water on the table is not a slight." },
  { title: "DoorDash and cards come later", text: "This page will not take your card and it cannot send a driver. Tonight it helps you pick a meal and a list. The rest we build when it can be done safely." }
];

var payload = {
  dishes: out,
  wineSchool: wineSchool
};

var js = "window.DINNER_FOODS=" + JSON.stringify(out) + ";\nwindow.WINE_SCHOOL=" + JSON.stringify(wineSchool) + ";\n";
fs.writeFileSync(path.join(__dirname, "foods.js"), js);
var counts = Object.keys(out).map(function (k) { return out[k].length; });
var min = Math.min.apply(null, counts);
var max = Math.max.apply(null, counts);
console.log("countries", Object.keys(out).length, "min", min, "max", max, "bytes", js.length);
