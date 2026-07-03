// word-packs.js — all word packs for Imposter game

const WORD_PACKS = {
  office: {
    name: "At the Office",
    emoji: "💼",
    words: [
      { word: "Stapler",         hint: "Office supply" },
      { word: "Whiteboard",      hint: "Writing surface" },
      { word: "Meeting Room",    hint: "Conference space" },
      { word: "Coffee Machine",  hint: "Hot beverage maker" },
      { word: "Filing Cabinet",  hint: "Document storage" },
      { word: "Office Chair",    hint: "Seating furniture" },
      { word: "Printer",         hint: "Document outputter" },
      { word: "Post-it Notes",   hint: "Sticky paper" },
      { word: "Desk Lamp",       hint: "Light source" },
      { word: "Computer Monitor",hint: "Display screen" },
    ]
  },
  kitchen: {
    name: "In the Kitchen",
    emoji: "🍳",
    words: [
      { word: "Blender",         hint: "Appliance" },
      { word: "Cutting Board",   hint: "Food prep surface" },
      { word: "Spatula",         hint: "Cooking tool" },
      { word: "Mixing Bowl",     hint: "Large container" },
      { word: "Dish Soap",       hint: "Cleaning product" },
      { word: "Toaster",         hint: "Heating appliance" },
      { word: "Colander",        hint: "Draining tool" },
      { word: "Rolling Pin",     hint: "Baking tool" },
      { word: "Oven Mitt",       hint: "Hand protector" },
      { word: "Fridge Magnet",   hint: "Decorative holder" },
    ]
  },
  beach: {
    name: "At the Beach",
    emoji: "🏖️",
    words: [
      { word: "Sunscreen",       hint: "Sun protection" },
      { word: "Beach Umbrella",  hint: "Shade provider" },
      { word: "Sandcastle",      hint: "Sand structure" },
      { word: "Surfboard",       hint: "Wave rider" },
      { word: "Seashell",        hint: "Ocean treasure" },
      { word: "Beach Towel",     hint: "Drying cloth" },
      { word: "Flip Flops",      hint: "Beach footwear" },
      { word: "Ice Cream",       hint: "Frozen treat" },
      { word: "Volleyball",      hint: "Net sport ball" },
      { word: "Boogie Board",    hint: "Water toy" },
    ]
  },
  sports: {
    name: "Sports",
    emoji: "🏆",
    words: [
      { word: "Basketball",      hint: "Ball sport" },
      { word: "Referee Whistle", hint: "Official's tool" },
      { word: "Scoreboard",      hint: "Points display" },
      { word: "Tennis Racket",   hint: "Hitting tool" },
      { word: "Swim Goggles",    hint: "Eye protection" },
      { word: "Football Helmet", hint: "Head protection" },
      { word: "Baseball Glove",  hint: "Catching tool" },
      { word: "Golf Club",       hint: "Hitting stick" },
      { word: "Running Shoes",   hint: "Athletic footwear" },
      { word: "Penalty Kick",    hint: "Free shot" },
    ]
  },
  movies: {
    name: "Movies",
    emoji: "🎬",
    words: [
      { word: "Popcorn",         hint: "Snack" },
      { word: "Clapperboard",    hint: "Scene marker" },
      { word: "Film Reel",       hint: "Movie storage" },
      { word: "Movie Ticket",    hint: "Admission pass" },
      { word: "Oscar Trophy",    hint: "Award statue" },
      { word: "Red Carpet",      hint: "Event flooring" },
      { word: "Movie Trailer",   hint: "Preview clip" },
      { word: "Projector",       hint: "Image thrower" },
      { word: "Director's Chair",hint: "Special seat" },
      { word: "End Credits",     hint: "Closing text" },
    ]
  },
  school: {
    name: "School",
    emoji: "📚",
    words: [
      { word: "Homework",        hint: "Assignment" },
      { word: "Detention",       hint: "Punishment" },
      { word: "Cafeteria",       hint: "Eating area" },
      { word: "Backpack",        hint: "Book carrier" },
      { word: "Pencil Case",     hint: "Supply holder" },
      { word: "Report Card",     hint: "Grade sheet" },
      { word: "Hall Pass",       hint: "Permission slip" },
      { word: "Science Fair",    hint: "Student showcase" },
      { word: "Yearbook",        hint: "Memory book" },
      { word: "Pop Quiz",        hint: "Surprise test" },
    ]
  },
  travel: {
    name: "Travel",
    emoji: "✈️",
    words: [
      { word: "Passport",        hint: "Document" },
      { word: "Boarding Pass",   hint: "Flight ticket" },
      { word: "Luggage Tag",     hint: "Bag identifier" },
      { word: "Hotel Key Card",  hint: "Room access" },
      { word: "Travel Pillow",   hint: "Sleep support" },
      { word: "Tour Guide",      hint: "Local expert" },
      { word: "Souvenir",        hint: "Memory item" },
      { word: "Airport Terminal",hint: "Travel hub" },
      { word: "Travel Insurance",hint: "Trip protection" },
      { word: "Jet Lag",         hint: "Time zone fatigue" },
    ]
  },
  animals: {
    name: "Animals",
    emoji: "🐾",
    words: [
      { word: "Penguin",         hint: "Flightless bird" },
      { word: "Platypus",        hint: "Odd mammal" },
      { word: "Chameleon",       hint: "Color changer" },
      { word: "Narwhal",         hint: "Sea unicorn" },
      { word: "Sloth",           hint: "Slow creature" },
      { word: "Axolotl",         hint: "Water creature" },
      { word: "Capybara",        hint: "Large rodent" },
      { word: "Meerkat",         hint: "Watchful animal" },
      { word: "Pangolin",        hint: "Scaled mammal" },
      { word: "Flamingo",        hint: "Pink bird" },
    ]
  },

  // --- Funny Packs ---

  fastfood: {
    name: "Fast Food",
    emoji: "🍔",
    words: [
      { word: "Big Mac",         hint: "Burger" },
      { word: "Chicken Nuggets", hint: "Chicken pieces" },
      { word: "Milkshake",       hint: "Cold drink" },
      { word: "Drive-Through",   hint: "Car order window" },
      { word: "Happy Meal",      hint: "Kid's combo" },
      { word: "Secret Sauce",    hint: "Mystery condiment" },
      { word: "Curly Fries",     hint: "Twisted potato" },
      { word: "Soft Serve",      hint: "Swirled ice cream" },
      { word: "Combo Meal",      hint: "Food set" },
      { word: "Apple Pie",       hint: "Dessert slice" },
    ]
  },
  awkward: {
    name: "Awkward Moments",
    emoji: "😬",
    words: [
      { word: "Elevator Silence",              hint: "Quiet moment" },
      { word: "Waving Back Wrong",             hint: "False signal" },
      { word: "Calling Teacher Mom",           hint: "Name slip" },
      { word: "Laughing at the Wrong Time",    hint: "Bad timing" },
      { word: "Forgetting Someone's Name",     hint: "Memory fail" },
      { word: "Texting the Wrong Person",      hint: "Misdirected message" },
      { word: "Walking Into Glass",            hint: "Invisible barrier" },
      { word: "Running Into Your Ex",          hint: "Unexpected encounter" },
      { word: "Handshake Turned Fist Bump",    hint: "Bad greeting" },
      { word: "Someone Finishing Your Joke",   hint: "Punchline steal" },
    ]
  },
  grandma: {
    name: "Grandma's House",
    emoji: "👵",
    words: [
      { word: "Doily",            hint: "Fabric decoration" },
      { word: "Hard Candy Bowl",  hint: "Old candy dish" },
      { word: "Crocheted Blanket",hint: "Knitted cover" },
      { word: "Floral Wallpaper", hint: "Patterned wall" },
      { word: "Rocking Chair",    hint: "Moving seat" },
      { word: "Ceramic Cat",      hint: "Animal figurine" },
      { word: "Lavender Sachet",  hint: "Scented bag" },
      { word: "Magnifying Glass", hint: "Vision aid" },
      { word: "Old Family Photos",hint: "Past pictures" },
      { word: "Rotary Phone",     hint: "Old telephone" },
    ]
  },
  overrated: {
    name: "Things That Are Overrated",
    emoji: "🙄",
    words: [
      { word: "Pineapple Pizza",      hint: "Controversial food" },
      { word: "Avocado Toast",        hint: "Trendy food" },
      { word: "Mondays",              hint: "First weekday" },
      { word: "Kale Smoothie",        hint: "Green drink" },
      { word: "Black Friday",         hint: "Shopping day" },
      { word: "Subscription Boxes",   hint: "Monthly surprises" },
      { word: "Alarm Clocks",         hint: "Wake-up disturbers" },
      { word: "Sequels",              hint: "Second movie" },
      { word: "Networking Events",    hint: "Professional meeting" },
      { word: "Bullet Journaling",    hint: "Fancy diary" },
    ]
  },
  slaps: {
    name: "Things That Slap",
    emoji: "🔥",
    words: [
      { word: "Chicken Wings",             hint: "Finger food" },
      { word: "Crunchy Tacos",             hint: "Crispy shells" },
      { word: "Late Night Snacks",         hint: "Midnight munchies" },
      { word: "Pizza Straight from the Box",hint: "Delivered food" },
      { word: "Mac and Cheese",            hint: "Comfort food" },
      { word: "Spicy Ramen",               hint: "Hot noodles" },
      { word: "Street Tacos",              hint: "Roadside food" },
      { word: "Cereal at 2am",             hint: "Late night bowl" },
      { word: "Loaded Nachos",             hint: "Topped chips" },
      { word: "Garlic Bread",              hint: "Buttered bread" },
    ]
  },
};
