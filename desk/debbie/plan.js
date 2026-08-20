/* Debbie's Diet Plan — one week of meals, written for her kitchen. */
window.DEBBIE_PLAN = {
  person: "Debbie",
  ageNote: "69",
  dailyTarget: {
    calories: "about 1,450–1,550",
    carbs: "about 110–130 grams",
    protein: "about 95–110 grams",
    meals: "breakfast, noon lunch, dinner, and one small snack"
  },
  days: [
    {
      id: "sun",
      name: "Sunday",
      mood: "Easy start · eggs and salmon",
      note: "A quiet day. Protein in the morning so her blood sugar stays steady.",
      meals: [
        {
          slot: "Breakfast",
          name: "Garden scramble and berries",
          time: "15 minutes",
          serves: "1 plate",
          cal: 320, carbs: 18, protein: 28, fiber: 5,
          why: "Eggs keep Debbie full. Spinach helps after a hysterectomy — iron and a little calcium without extra carbs.",
          need: [
            "2 large eggs",
            "2 egg whites, or 1 extra whole egg if that is easier",
            "1 large handful fresh spinach",
            "4 cherry tomatoes, halved",
            "3 mushrooms, sliced",
            "1 teaspoon olive oil or butter",
            "Pinch of salt and black pepper",
            "1/2 cup blueberries or strawberries"
          ],
          steps: [
            "Warm a nonstick skillet on medium. Add the oil.",
            "Cook the mushrooms 3 minutes. Add tomatoes and spinach until the spinach wilts.",
            "Beat the eggs and whites with a pinch of salt. Pour over the vegetables.",
            "Push the eggs gently with a spatula until just set. Do not dry them out.",
            "Plate the scramble. Eat the berries on the side, not with sugar or syrup."
          ],
          tip: "If she uses insulin or a morning pill, eat this at the same time each day."
        },
        {
          slot: "Noon lunch",
          name: "Chicken cobb bowl",
          time: "20 minutes, or 10 with leftover chicken",
          serves: "1 big bowl",
          cal: 430, carbs: 14, protein: 40, fiber: 7,
          why: "A full meal without bread. Avocado slows the sugar rise. Plenty of protein so she is not hungry at 3 o'clock.",
          need: [
            "4 ounces cooked chicken breast, sliced (a store rotisserie breast works)",
            "2 big handfuls mixed salad greens",
            "1/2 cucumber, sliced",
            "1/4 ripe avocado, sliced",
            "1 hard-boiled egg, quartered",
            "6 cherry tomatoes",
            "1 tablespoon olive oil",
            "1 tablespoon red wine vinegar or lemon juice",
            "Salt, pepper, and a pinch of dried oregano"
          ],
          steps: [
            "If the chicken is not cooked, bake a breast at 400°F for 20 minutes, or use rotisserie.",
            "Fill a wide bowl with greens, cucumber, and tomatoes.",
            "Add the chicken, egg, and avocado on top.",
            "Shake oil, vinegar, salt, pepper, and oregano in a jar. Pour over the bowl.",
            "Eat the whole bowl. No crackers on the side today."
          ],
          tip: "Cook two chicken breasts. Save one for Tuesday lunch."
        },
        {
          slot: "Dinner",
          name: "Lemon salmon, broccoli, and cauliflower mash",
          time: "30 minutes",
          serves: "1 plate (cook 2 salmon pieces if she wants leftover)",
          cal: 490, carbs: 16, protein: 38, fiber: 7,
          why: "Salmon is gentle protein and good fat. The mash feels like potatoes without the blood-sugar jump.",
          need: [
            "5 ounces salmon fillet",
            "1 teaspoon olive oil",
            "1 lemon (juice of half, plus a few slices)",
            "1 cup broccoli florets",
            "2 cups cauliflower florets",
            "1 tablespoon plain Greek yogurt or a splash of milk",
            "Salt, pepper, garlic powder"
          ],
          steps: [
            "Heat the oven to 400°F. Line a small pan.",
            "Pat the salmon dry. Rub with oil, salt, pepper, and lemon juice. Lay lemon slices on top.",
            "Put broccoli on the same pan. Dust with salt and a little oil. Bake 14–16 minutes.",
            "While that cooks, boil cauliflower in salted water 10 minutes until very soft. Drain well.",
            "Mash the cauliflower with yogurt, salt, pepper, and garlic powder until it looks like mashed potatoes.",
            "Plate salmon, broccoli, and a scoop of mash. Stop when the plate is full — no second starch."
          ],
          tip: "Frozen salmon and frozen broccoli are fine. Thaw the fish in the fridge, not on the counter."
        },
        {
          slot: "Snack",
          name: "Cinnamon yogurt cup",
          time: "2 minutes",
          serves: "1 cup",
          cal: 120, carbs: 7, protein: 16, fiber: 0,
          why: "A measured snack so she does not graze. Protein, not cookies.",
          need: [
            "3/4 cup plain Greek yogurt (2% or nonfat)",
            "Dash of cinnamon",
            "3 or 4 berries if she wants them, no honey"
          ],
          steps: [
            "Spoon the yogurt into a cup.",
            "Stir in cinnamon. Add a few berries only if she is still hungry.",
            "Eat it sitting down. Put the big tub back in the fridge."
          ],
          tip: "Skip flavored yogurt. The sugar in those cups can undo the day."
        }
      ]
    },
    {
      id: "mon",
      name: "Monday",
      mood: "Soup day · warm and filling",
      note: "Make a pot at noon. She can eat a bowl tonight if dinner feels like too much work.",
      meals: [
        {
          slot: "Breakfast",
          name: "Cottage cheese berry bowl",
          time: "5 minutes",
          serves: "1 bowl",
          cal: 340, carbs: 20, protein: 30, fiber: 6,
          why: "Cottage cheese is cheap protein and calcium — useful after a hysterectomy, when bones need more care.",
          need: [
            "1 cup 2% cottage cheese",
            "1/2 cup raspberries or blackberries",
            "8 walnut halves, broken",
            "Cinnamon"
          ],
          steps: [
            "Spoon cottage cheese into a bowl.",
            "Top with berries and walnuts.",
            "Dust with cinnamon. Eat slowly."
          ],
          tip: "If cottage cheese is too salty, rinse it in a strainer, or use plain Greek yogurt the same way."
        },
        {
          slot: "Noon lunch",
          name: "Turkey vegetable soup",
          time: "35 minutes (leftovers keep 3 days)",
          serves: "2 big bowls — eat one now, save one",
          cal: 380, carbs: 22, protein: 32, fiber: 6,
          why: "Broth meals fill her up. The vegetables are the volume. The turkey is the staying power.",
          need: [
            "8 ounces lean ground turkey",
            "1 teaspoon olive oil",
            "1/2 onion, chopped",
            "2 carrots, sliced",
            "2 celery stalks, sliced",
            "1 small zucchini, chopped",
            "1 handful spinach",
            "1 can (14 ounces) diced tomatoes, no salt added if she can find it",
            "3 cups low-sodium chicken broth",
            "1/2 teaspoon Italian seasoning",
            "Salt and pepper"
          ],
          steps: [
            "In a pot, brown the turkey in the oil. Break it up. Drain extra fat.",
            "Add onion, carrot, and celery. Cook 5 minutes.",
            "Add tomatoes, broth, zucchini, and seasoning. Simmer 15 minutes.",
            "Stir in spinach at the end. Taste for salt.",
            "Ladle one big bowl. Cool the rest and refrigerate."
          ],
          tip: "No crackers, no bread bowl. If she wants crunch, add cucumber slices on the side."
        },
        {
          slot: "Dinner",
          name: "Turkey skillet over zucchini ribbons",
          time: "25 minutes",
          serves: "1 generous plate",
          cal: 450, carbs: 18, protein: 36, fiber: 5,
          why: "The taste of spaghetti night without a pile of noodles. One cup of zucchini, not a box of pasta.",
          need: [
            "5 ounces lean ground turkey",
            "1 teaspoon olive oil",
            "1 cup no-sugar-added marinara (read the label — under 8 grams sugar per serving)",
            "1 medium zucchini, cut into ribbons or half-moons",
            "1 clove garlic, minced, or 1/2 teaspoon garlic powder",
            "Pinch of red pepper flakes if she likes heat",
            "1 tablespoon grated Parmesan"
          ],
          steps: [
            "Brown the turkey in oil. Add garlic.",
            "Pour in the marinara. Simmer 8 minutes.",
            "In another pan, cook zucchini 4–5 minutes with a pinch of salt until just tender.",
            "Spoon the turkey sauce over the zucchini. Top with Parmesan.",
            "Stop there. Do not add pasta 'just a little.'"
          ],
          tip: "A vegetable peeler makes zucchini ribbons. A knife and half-moons is fine too."
        },
        {
          slot: "Snack",
          name: "Cheese and almonds",
          time: "1 minute",
          serves: "1 small plate",
          cal: 160, carbs: 4, protein: 9, fiber: 2,
          why: "Measured, not a handful from the bag all evening.",
          need: [
            "1 string cheese or 1 ounce cheddar",
            "10 almonds"
          ],
          steps: [
            "Count ten almonds. Put the bag away.",
            "Eat the cheese and almonds together."
          ],
          tip: "If she is not hungry, skip the snack. The plan does not require eating when she is full."
        }
      ]
    },
    {
      id: "tue",
      name: "Tuesday",
      mood: "Sheet-pan night",
      note: "Cook extra chicken at dinner. Wednesday noon is already done.",
      meals: [
        {
          slot: "Breakfast",
          name: "Feta omelet and a peach",
          time: "12 minutes",
          serves: "1 plate",
          cal: 330, carbs: 16, protein: 26, fiber: 3,
          why: "Another high-protein morning. Fruit is the carb, not juice and not toast.",
          need: [
            "2 eggs",
            "1 egg white",
            "1 handful spinach or leftover vegetables",
            "2 tablespoons crumbled feta",
            "1 teaspoon olive oil",
            "1 small peach or 1/2 cup berries if peaches are not in season"
          ],
          steps: [
            "Beat eggs and white. Heat oil in a skillet.",
            "Pour in eggs. When the edges set, add spinach and feta on one half.",
            "Fold. Cook one more minute.",
            "Eat the peach on the side. Whole fruit, not canned in syrup."
          ],
          tip: "A small peach is enough. Two big peaches is dessert, not breakfast."
        },
        {
          slot: "Noon lunch",
          name: "Tuna salad lettuce boats",
          time: "10 minutes",
          serves: "1 plate",
          cal: 360, carbs: 8, protein: 32, fiber: 3,
          why: "No sandwich bread. The crunch comes from lettuce and celery.",
          need: [
            "1 can tuna in water, drained (5 ounces)",
            "1 tablespoon light mayonnaise or plain Greek yogurt",
            "1 teaspoon mustard",
            "1 celery stalk, minced",
            "1 tablespoon minced onion or pickle relish with no added sugar",
            "4–6 large romaine or butter lettuce leaves",
            "Sliced cucumber on the side",
            "Pepper"
          ],
          steps: [
            "Mix tuna, mayo or yogurt, mustard, celery, and onion.",
            "Spoon into lettuce leaves.",
            "Eat with cucumber. Two boats is a meal. The rest of the tuna mix can wait until tomorrow if she made extra."
          ],
          tip: "Tuna in oil is richer. If she uses that, skip the mayo."
        },
        {
          slot: "Dinner",
          name: "Sheet-pan chicken, green beans, and a little sweet potato",
          time: "40 minutes",
          serves: "2 plates — tonight and tomorrow noon",
          cal: 470, carbs: 28, protein: 38, fiber: 6,
          why: "Sweet potato is the planned carb — a small one, not a pile. Green beans take up the rest of the plate.",
          need: [
            "2 boneless chicken thighs or small breasts (about 5 ounces each)",
            "3 cups green beans, trimmed",
            "1 small sweet potato, cut into 3/4-inch cubes (about 1 cup)",
            "1 tablespoon olive oil",
            "1 teaspoon paprika",
            "1/2 teaspoon garlic powder",
            "Salt and pepper"
          ],
          steps: [
            "Heat oven to 425°F. Line a sheet pan.",
            "Toss sweet potato with half the oil, salt, and paprika. Spread on one side. Roast 10 minutes.",
            "Rub chicken with the rest of the oil, garlic, salt, and pepper.",
            "Add chicken and green beans to the pan. Roast 20–22 minutes until the chicken is done (165°F).",
            "Tonight: one piece of chicken, half the beans, half the sweet potato. Box the rest for Wednesday."
          ],
          tip: "The sweet potato is the size of her fist, not a whole big potato. That is the diabetes part."
        },
        {
          slot: "Snack",
          name: "Celery and hummus",
          time: "3 minutes",
          serves: "1 small plate",
          cal: 110, carbs: 10, protein: 4, fiber: 4,
          why: "Crunch without chips.",
          need: [
            "3 celery stalks",
            "2 tablespoons hummus"
          ],
          steps: [
            "Measure two tablespoons of hummus. Not the rest of the tub.",
            "Dip. Drink water with it."
          ],
          tip: "Carrots work too. Same two-tablespoon rule."
        }
      ]
    },
    {
      id: "wed",
      name: "Wednesday",
      mood: "Leftovers at noon · shrimp at night",
      note: "Noon is already cooked. Dinner is fast in a skillet.",
      meals: [
        {
          slot: "Breakfast",
          name: "Strawberry chia cup",
          time: "5 minutes at night, 1 minute in the morning",
          serves: "1 jar",
          cal: 300, carbs: 22, protein: 12, fiber: 11,
          why: "Fiber is Debbie's friend. It slows sugar and helps her feel finished.",
          need: [
            "3 tablespoons chia seeds",
            "3/4 cup unsweetened almond milk or regular milk",
            "1/2 cup sliced strawberries",
            "1/2 teaspoon vanilla",
            "Optional: 2 tablespoons plain Greek yogurt on top in the morning"
          ],
          steps: [
            "The night before: stir chia, milk, and vanilla in a jar. Let sit 5 minutes, stir again so it does not clump.",
            "Lid it. Refrigerate overnight.",
            "In the morning, stir, add strawberries and yogurt if she wants it."
          ],
          tip: "If it is too thick, add a splash of milk. Do not add honey or maple."
        },
        {
          slot: "Noon lunch",
          name: "Yesterday's chicken bowl",
          time: "5 minutes",
          serves: "1 bowl",
          cal: 440, carbs: 24, protein: 36, fiber: 6,
          why: "Same good plate, no extra cooking. Consistency helps blood sugar.",
          need: [
            "The leftover chicken, green beans, and sweet potato from Tuesday",
            "1 big handful extra salad greens",
            "Lemon or a teaspoon of olive oil if it tastes dry"
          ],
          steps: [
            "Warm the chicken and vegetables, or eat them cold. Both are fine.",
            "Put greens underneath so the plate looks full.",
            "A squeeze of lemon is enough dressing."
          ],
          tip: "If she skipped Tuesday dinner leftovers, make the tuna boats again. Same rules."
        },
        {
          slot: "Dinner",
          name: "Garlic shrimp and vegetable skillet",
          time: "20 minutes",
          serves: "1 full skillet plate",
          cal: 420, carbs: 14, protein: 36, fiber: 5,
          why: "Shrimp cooks fast and is almost no carb. The vegetables are the meal.",
          need: [
            "6 ounces raw shrimp, peeled",
            "1 teaspoon olive oil",
            "1 cup broccoli florets",
            "1 cup sliced bell pepper",
            "1 cup sliced zucchini or cabbage",
            "1 clove garlic, minced",
            "1 teaspoon low-sodium soy sauce or coconut aminos",
            "1 cup cauliflower rice (fresh or frozen)",
            "Lemon, pepper, optional chili flake"
          ],
          steps: [
            "Pat shrimp dry. Salt lightly.",
            "Heat oil. Cook vegetables 5 minutes. Add garlic for 30 seconds.",
            "Push vegetables aside. Cook shrimp 2 minutes a side until pink.",
            "Add soy sauce and cauliflower rice. Toss 2 minutes.",
            "Finish with lemon. Eat from a plate, not standing at the stove."
          ],
          tip: "Frozen shrimp is fine. Thaw in a bowl of cold water for 15 minutes."
        },
        {
          slot: "Snack",
          name: "Half-cup cottage cheese",
          time: "1 minute",
          serves: "1 cup",
          cal: 90, carbs: 4, protein: 13, fiber: 0,
          why: "A small protein stop if supper was early.",
          need: [
            "1/2 cup cottage cheese",
            "Pepper or cinnamon"
          ],
          steps: [
            "Measure half a cup. Not the rest of the container."
          ],
          tip: "Skip this if dinner filled her up."
        }
      ]
    },
    {
      id: "thu",
      name: "Thursday",
      mood: "Pancake morning · fish night",
      note: "The pancakes are eggs and cheese. They are not diner pancakes.",
      meals: [
        {
          slot: "Breakfast",
          name: "Debbie's protein pancakes",
          time: "15 minutes",
          serves: "1 plate (2 small cakes)",
          cal: 320, carbs: 14, protein: 28, fiber: 3,
          why: "Feels like a treat. The batter is eggs and cottage cheese, so her sugar stays calmer than flour pancakes.",
          need: [
            "1/2 cup cottage cheese",
            "2 eggs",
            "2 tablespoons almond flour, or 1 tablespoon regular flour if that is what she has",
            "1/2 teaspoon baking powder",
            "Cinnamon and vanilla",
            "Spray oil or 1/2 teaspoon butter",
            "1/2 cup berries, no syrup"
          ],
          steps: [
            "Blend or mash cottage cheese, eggs, flour, baking powder, cinnamon, and vanilla until mostly smooth.",
            "Heat a nonstick pan. Light butter or spray.",
            "Pour two small pancakes. Cook 2–3 minutes a side.",
            "Top with berries only. No syrup, no jam."
          ],
          tip: "If she misses sweetness, mash three berries and spread that on top."
        },
        {
          slot: "Noon lunch",
          name: "Burger bowl, no bun",
          time: "20 minutes",
          serves: "1 bowl",
          cal: 450, carbs: 12, protein: 34, fiber: 4,
          why: "The burger taste she wants. The bun is the part that spikes sugar.",
          need: [
            "4 ounces 90% lean ground beef or turkey",
            "Salt, pepper, onion powder",
            "2 cups chopped lettuce",
            "2 slices tomato",
            "4 pickle chips",
            "2 tablespoons diced onion",
            "1 teaspoon mustard",
            "1 tablespoon ketchup with no added sugar, or salsa",
            "Optional: 1 tablespoon shredded cheddar"
          ],
          steps: [
            "Season the meat. Make a patty. Cook in a skillet 4 minutes a side, or until done.",
            "Build a bowl: lettuce, tomato, pickle, onion.",
            "Set the patty on top. Mustard and a measured spoon of ketchup or salsa.",
            "Cheese if she wants it — one tablespoon, not a handful."
          ],
          tip: "A restaurant burger with fries is not this lunch. This is the home version."
        },
        {
          slot: "Dinner",
          name: "Baked cod, garlic spinach, and a scoop of quinoa",
          time: "25 minutes",
          serves: "1 plate",
          cal: 460, carbs: 24, protein: 38, fiber: 5,
          why: "White fish is light and easy to chew. The quinoa is a small, planned carb — one third of a cup cooked.",
          need: [
            "6 ounces cod or other white fish",
            "1 teaspoon olive oil",
            "Lemon, paprika, salt, pepper",
            "3 big handfuls fresh spinach",
            "1 clove garlic, sliced",
            "1/3 cup cooked quinoa (from about 2 tablespoons dry)"
          ],
          steps: [
            "Heat oven to 400°F. Rub fish with oil, lemon, paprika, salt, and pepper. Bake 12–14 minutes.",
            "Cook quinoa if it is not ready: 2 tablespoons dry in a little water, 12 minutes.",
            "In a skillet, wilt spinach with garlic and a pinch of salt. One minute after it collapses, turn off the heat.",
            "Plate fish, all the spinach, and only one third cup quinoa. Measure the quinoa."
          ],
          tip: "Frozen cod works. Pat it very dry so it does not steam."
        },
        {
          slot: "Snack",
          name: "Plain yogurt",
          time: "1 minute",
          serves: "1 cup",
          cal: 110, carbs: 6, protein: 15, fiber: 0,
          why: "Same idea as Sunday — protein if the afternoon dips.",
          need: [
            "3/4 cup plain Greek yogurt",
            "Cinnamon"
          ],
          steps: [
            "Spoon and eat. No granola."
          ],
          tip: "Granola is candy with better marketing."
        }
      ]
    },
    {
      id: "fri",
      name: "Friday",
      mood: "Chili in the pot",
      note: "The chili makes extra. Saturday noon is taken care of, and one bowl can freeze.",
      meals: [
        {
          slot: "Breakfast",
          name: "Smoked salmon plate",
          time: "8 minutes",
          serves: "1 plate",
          cal: 310, carbs: 16, protein: 24, fiber: 3,
          why: "Salty and satisfying. One small piece of crispbread is the carb, not a bagel.",
          need: [
            "3 ounces smoked salmon",
            "1/4 cucumber, sliced",
            "4 cherry tomatoes",
            "2 tablespoons plain Greek yogurt or light cream cheese",
            "Dill, pepper, lemon",
            "1 Wasa cracker or 1 small slice thin whole-grain toast"
          ],
          steps: [
            "Lay salmon, cucumber, and tomatoes on a plate.",
            "Add the yogurt or a thin smear of cream cheese on the cracker.",
            "Lemon and dill on the fish. Eat the cracker last if she wants it."
          ],
          tip: "A whole bagel is too much carb for this breakfast. The little cracker is the plan."
        },
        {
          slot: "Noon lunch",
          name: "Egg salad cucumber boats",
          time: "12 minutes",
          serves: "1 plate",
          cal: 340, carbs: 8, protein: 20, fiber: 2,
          why: "Cool, cheap, and no bread.",
          need: [
            "2 hard-boiled eggs, chopped",
            "1 tablespoon plain Greek yogurt",
            "1 teaspoon mustard",
            "Salt, pepper, paprika",
            "1 large cucumber, halved and seeds scooped",
            "A few lettuce leaves"
          ],
          steps: [
            "Mix eggs, yogurt, mustard, salt, and pepper.",
            "Fill the cucumber halves. Dust with paprika.",
            "Set on lettuce. That is lunch."
          ],
          tip: "Boil a few extra eggs on Sunday. They keep all week."
        },
        {
          slot: "Dinner",
          name: "Debbie's chicken chili",
          time: "20 minutes hands-on, 30 minutes to simmer",
          serves: "4 bowls — Friday dinner, Saturday noon, two for the freezer",
          cal: 420, carbs: 28, protein: 38, fiber: 9,
          why: "Beans are measured, not endless. Fiber helps her sugar and her appetite. This is the hearty Friday plate.",
          need: [
            "1 pound boneless chicken breast or thighs, cubed",
            "1 teaspoon olive oil",
            "1 onion, chopped",
            "1 bell pepper, chopped",
            "2 cloves garlic",
            "1 can (14 ounces) diced tomatoes",
            "1 can (15 ounces) black beans or pinto, rinsed well",
            "1 cup low-sodium chicken broth",
            "1 tablespoon chili powder",
            "1 teaspoon cumin",
            "Salt",
            "Topping for her bowl only: 1 tablespoon cheddar, 1 tablespoon yogurt"
          ],
          steps: [
            "Brown chicken in oil. Add onion, pepper, and garlic. Cook 5 minutes.",
            "Add tomatoes, rinsed beans, broth, chili powder, cumin, and salt.",
            "Simmer 25–30 minutes until the chicken is tender.",
            "Her bowl tonight is one ladle — about a cup and a half, not the whole pot.",
            "Cool leftovers. Saturday lunch is one bowl. Freeze two in small containers."
          ],
          tip: "If a restaurant chili comes with cornbread and chips, that is a different meal. This bowl stands alone with a side salad."
        },
        {
          slot: "Snack",
          name: "Apple and peanut butter",
          time: "3 minutes",
          serves: "1 small plate",
          cal: 170, carbs: 18, protein: 4, fiber: 4,
          why: "Fruit plus fat. The tablespoon is the whole point.",
          need: [
            "1 small apple, sliced",
            "1 tablespoon peanut butter"
          ],
          steps: [
            "Measure the peanut butter. Spread on slices. Put the jar away."
          ],
          tip: "A large apple plus four spoons of peanut butter is not this snack."
        }
      ]
    },
    {
      id: "sat",
      name: "Saturday",
      mood: "Simple plate day",
      note: "Noon is leftover chili. Dinner is a regular meat-and-vegetable plate.",
      meals: [
        {
          slot: "Breakfast",
          name: "Yogurt parfait, Debbie's way",
          time: "5 minutes",
          serves: "1 glass or bowl",
          cal: 330, carbs: 20, protein: 28, fiber: 5,
          why: "Looks like a soda-shop parfait. It is yogurt, berries, and a few nuts — not granola towers.",
          need: [
            "1 cup plain Greek yogurt",
            "1/2 cup mixed berries",
            "6 walnut or pecan halves, crushed",
            "Cinnamon"
          ],
          steps: [
            "Layer yogurt and berries.",
            "Sprinkle the nuts and cinnamon.",
            "Do not add honey, granola, or chocolate chips."
          ],
          tip: "If she wants it sweeter after a week, mash the berries first. That is enough."
        },
        {
          slot: "Noon lunch",
          name: "Chili bowl and a green salad",
          time: "10 minutes",
          serves: "1 bowl",
          cal: 450, carbs: 30, protein: 38, fiber: 10,
          why: "Yesterday's work. A side salad makes it a full noon plate.",
          need: [
            "1 leftover bowl of Friday chili, warmed",
            "2 handfuls greens",
            "Cucumber and tomato",
            "1 teaspoon olive oil and vinegar"
          ],
          steps: [
            "Warm one measured bowl of chili.",
            "Toss a small salad. Eat both.",
            "No tortilla chips, no cornbread."
          ],
          tip: "If the chili is gone, use a rotisserie chicken thigh, slaw, and pickles instead."
        },
        {
          slot: "Dinner",
          name: "Pork tenderloin, asparagus, and one small potato",
          time: "35 minutes",
          serves: "2 plates — save one for Sunday if she wants a night off",
          cal: 480, carbs: 24, protein: 40, fiber: 5,
          why: "A Saturday supper that still follows the plate: half vegetables, a palm of meat, a small potato.",
          need: [
            "8–10 ounces pork tenderloin",
            "1 teaspoon olive oil",
            "Garlic powder, paprika, salt, pepper",
            "1 bunch asparagus, ends snapped",
            "1 small red potato (about the size of a computer mouse)",
            "Lemon"
          ],
          steps: [
            "Heat oven to 425°F.",
            "Rub pork with oil and spices. Set on a pan. Cube the potato, toss with a little oil and salt, put beside the pork.",
            "Roast 12 minutes. Add asparagus to the pan. Roast 12–15 minutes more, until the pork is 145°F.",
            "Rest the pork 5 minutes. Slice.",
            "Her plate: half the pork, all the asparagus she wants, and that one small potato. Lemon over everything."
          ],
          tip: "A baked russet the size of her hand is too much. The little red potato is the plan."
        },
        {
          slot: "Snack",
          name: "Berry cup",
          time: "1 minute",
          serves: "1 cup",
          cal: 50, carbs: 12, protein: 1, fiber: 3,
          why: "If she wants something after dinner, fruit — not ice cream.",
          need: [
            "1/2 cup berries"
          ],
          steps: [
            "Wash. Eat from a cup, not from the box."
          ],
          tip: "If she is not hungry, she can skip it. That is a win."
        }
      ]
    }
  ]
};

window.DEBBIE_SHOP = [
  { aisle: "Produce", items: [
    "Spinach — 2 bags",
    "Mixed salad greens — 2 boxes or bags",
    "Romaine or butter lettuce — 1 head",
    "Broccoli — 2 heads, or 2 bags frozen",
    "Cauliflower — 1 head, plus a bag of cauliflower rice",
    "Zucchini — 3",
    "Cucumbers — 4",
    "Cherry tomatoes — 2 pints",
    "Regular tomatoes — 2",
    "Mushrooms — 1 small pack",
    "Bell peppers — 3",
    "Onion — 3",
    "Celery — 1 bunch",
    "Carrots — 1 small bag",
    "Asparagus — 1 bunch",
    "Green beans — 1 1/2 pounds, or frozen",
    "1 small sweet potato",
    "1 small red potato",
    "Avocado — 1 ripe",
    "Lemons — 3",
    "Garlic — 1 head",
    "Blueberries, strawberries, raspberries — enough for the week (fresh or frozen)",
    "1 small peach if they look good"
  ]},
  { aisle: "Meat and fish", items: [
    "Eggs — 1 dozen (plus extras if she likes them)",
    "Chicken breasts or thighs — about 2 pounds",
    "Lean ground turkey — 1 1/2 pounds",
    "Lean ground beef — 4 ounces, or use more turkey",
    "Salmon fillet — 5 to 10 ounces",
    "Smoked salmon — 3 ounces",
    "Shrimp — 6 ounces",
    "Cod or other white fish — 6 ounces",
    "Pork tenderloin — about 10 ounces",
    "Optional: a small rotisserie chicken for easy lunches"
  ]},
  { aisle: "Dairy", items: [
    "Plain Greek yogurt — big tub, unsweetened",
    "Cottage cheese, 2% — 1 large tub",
    "Feta — small tub",
    "Parmesan — small",
    "Cheddar — small block or string cheese",
    "Milk or unsweetened almond milk — 1 quart",
    "Butter or olive oil for the pan"
  ]},
  { aisle: "Pantry", items: [
    "Olive oil",
    "Red wine vinegar or extra lemons",
    "Low-sodium chicken broth — 2 cartons",
    "Diced tomatoes — 2 cans",
    "Black or pinto beans — 1 can",
    "No-sugar-added marinara — 1 jar",
    "Tuna in water — 2 cans",
    "Mustard",
    "Light mayonnaise (optional)",
    "Peanut butter — natural, no sugar if she can find it",
    "Hummus — small tub",
    "Chia seeds",
    "Almond flour (or a little regular flour)",
    "Walnuts or pecans, almonds",
    "Quinoa — a small bag",
    "Wasa crackers or thin whole-grain bread",
    "Chili powder, cumin, paprika, garlic powder, Italian seasoning, cinnamon, vanilla, pepper flakes",
    "Low-sodium soy sauce"
  ]}
];

window.DEBBIE_SWAPS = [
  ["Does not like salmon", "Use cod, tilapia, or an extra chicken thigh the same size."],
  ["Does not like cottage cheese", "Use plain Greek yogurt in the same amount."],
  ["Does not eat shrimp", "Use more chicken or cod in that skillet."],
  ["Does not eat pork", "Use a turkey tenderloin or chicken breast. Same small potato."],
  ["Does not eat red meat", "The burger bowl can be turkey. Same toppings."],
  ["Needs cheaper fish", "Frozen bags of salmon, shrimp, and cod are fine."],
  ["Eats with someone else", "Double the meat and vegetables. Do not double the potato, rice, or beans for her plate."],
  ["Invited out", "Order grilled meat or fish, extra vegetables, skip the bread basket and the sweet drink. Eat half the starch they bring."]
];
