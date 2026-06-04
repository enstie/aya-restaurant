// Single source of truth — used by /menu (browse) and /walk-in (POS ordering)

export const MENU_CATEGORIES = [
  { id: 'starters',  label: 'Starters' },
  { id: 'mains',     label: 'Mains' },
  { id: 'fish',      label: 'From the Sea' },
  { id: 'sides',     label: 'Sides' },
  { id: 'desserts',  label: 'Desserts' },
  { id: 'drinks',    label: 'Drinks' },
];

export const MENU_ITEMS = [
  // ── STARTERS ──
  {
    id: 's1', category: 'starters',
    name: 'Oyster & Dashi',
    description: 'Fine de Claire, yuzu kosho, cucumber water, black sesame oil',
    price: 28,
    image: '/dish-hero.jpg',
  },
  {
    id: 's2', category: 'starters',
    name: 'Smoked Eel Tartare',
    description: 'Crispy shallot, pickled daikon, wasabi crème, nori powder',
    price: 32,
    image: '/dish-2.jpg',
  },
  {
    id: 's3', category: 'starters',
    name: 'Hamachi Crudo',
    description: 'Ponzu gel, avocado silk, radish, chili oil, bronze fennel',
    price: 36,
    image: '/dish-hero.jpg',
  },
  {
    id: 's4', category: 'starters',
    name: 'Foie Gras Torchon',
    description: 'Brioche, sauternes reduction, smoked cherry, hazelnut dust',
    price: 42,
    image: '/dish-3.jpg',
  },

  // ── MAINS ──
  {
    id: 'm1', category: 'mains',
    name: 'A5 Wagyu Sirloin',
    description: 'Truffle jus, bone marrow, fermented black garlic, charcoal ash',
    price: 110,
    image: '/dish-3.jpg',
  },
  {
    id: 'm2', category: 'mains',
    name: 'Dover Sole',
    description: 'Brown butter, capers, lemon beurre blanc, sea vegetable salad',
    price: 68,
    image: '/dish-2.jpg',
  },
  {
    id: 'm3', category: 'mains',
    name: 'Duck à la Presse',
    description: 'Pressed duck jus, cherry, turnip gratin, wild mushroom duxelle',
    price: 72,
    image: '/dish-hero.jpg',
  },
  {
    id: 'm4', category: 'mains',
    name: 'Dry-Aged Pigeon',
    description: 'Ras el hanout, compressed plum, pistachio, fig leaf oil',
    price: 65,
    image: '/dish-4.jpg',
  },

  // ── FISH ──
  {
    id: 'f1', category: 'fish',
    name: 'Blue Lobster Bisque',
    description: 'Cognac, tarragon oil, lobster mousse quenelle, oscietra caviar',
    price: 58,
    image: '/dish-2.jpg',
  },
  {
    id: 'f2', category: 'fish',
    name: 'Seared Sea Bass',
    description: 'Citrus foam, herb oil, baby gem, champagne velouté',
    price: 52,
    image: '/dish-hero.jpg',
  },
  {
    id: 'f3', category: 'fish',
    name: 'Turbot on the Bone',
    description: 'Hollandaise, asparagus, oyster cream, pickled cucumber',
    price: 78,
    image: '/dish-3.jpg',
  },
  {
    id: 'f4', category: 'fish',
    name: 'Langoustine Raviolo',
    description: 'Saffron bisque, sea urchin butter, Amalfi lemon gremolata',
    price: 54,
    image: '/dish-4.jpg',
  },

  // ── SIDES ──
  {
    id: 'si1', category: 'sides',
    name: 'Triple-Cooked Potatoes',
    description: 'Duck fat, rosemary salt, aged parmesan',
    price: 12,
    image: '/dish-hero.jpg',
  },
  {
    id: 'si2', category: 'sides',
    name: 'Seasonal Green Salad',
    description: 'Market leaves, sherry vinaigrette, walnut, aged goat cheese',
    price: 10,
    image: '/dish-2.jpg',
  },
  {
    id: 'si3', category: 'sides',
    name: 'White Truffle Mac & Cheese',
    description: 'Comté, black truffle, toasted breadcrumbs',
    price: 18,
    image: '/dish-3.jpg',
  },
  {
    id: 'si4', category: 'sides',
    name: 'Steamed Jersey Royals',
    description: 'Cultured butter, chives, Maldon sea salt',
    price: 8,
    image: '/dish-4.jpg',
  },

  // ── DESSERTS ──
  {
    id: 'd1', category: 'desserts',
    name: 'Valrhona 72% Cylinder',
    description: 'Hazelnut praline, salted caramel core, muscovado ice cream',
    price: 22,
    image: '/dish-4.jpg',
  },
  {
    id: 'd2', category: 'desserts',
    name: 'Jasmine Panna Cotta',
    description: 'Compressed lychee, yuzu curd, rose water gel, lime foam',
    price: 18,
    image: '/dish-hero.jpg',
  },
  {
    id: 'd3', category: 'desserts',
    name: 'Miso Caramel Tart',
    description: 'Vanilla custard, Breton pastry, white sesame praline',
    price: 20,
    image: '/dish-2.jpg',
  },
  {
    id: 'd4', category: 'desserts',
    name: 'Cheese Selection',
    description: 'Seasonal British & French cheeses, honeycomb, walnut bread',
    price: 28,
    image: '/dish-3.jpg',
  },

  // ── DRINKS ──
  {
    id: 'dr1', category: 'drinks',
    name: 'Champagne Coupe',
    description: 'Louis Roederer Cristal, 2018 vintage, 125ml',
    price: 48,
    image: '/interior-2.jpg',
  },
  {
    id: 'dr2', category: 'drinks',
    name: 'Natural Wine, Glass',
    description: 'Sommelier selection, rotating cellar, 175ml',
    price: 18,
    image: '/bar-bright.jpg',
  },
  {
    id: 'dr3', category: 'drinks',
    name: 'Signature Mocktail',
    description: 'Yuzu, elderflower, tonic, fresh mint, zero-alcohol',
    price: 14,
    image: '/bar-bright.jpg',
  },
  {
    id: 'dr4', category: 'drinks',
    name: 'Still or Sparkling Water',
    description: 'Hildon, 750ml',
    price: 6,
    image: '/bar-bright.jpg',
  },
];
