// Menu data with all products - EXACT IDs as specified (1-32)
// Images are stored in src/assets/{category}/{product_name}.png

// Helper function to get image path
const getImagePath = (category, productName) => {
  // Map product names to actual image filenames
  const imageMap = {
    // Cold Brews
    'Coffeebara': 'classic coffeebara cold brew.png',
    'Matchabara': 'classic matchabara cold brew.png',
    'Macchiabara': 'classic macchiabara cold brew.png',
    'Spanibara': 'classic spanibara cold brew.png',
    'Mochabara': 'classic mochabara cold brew.png',
    'Carabara': 'classic carabara cold brew.png',
    
    // Classics
    'Coffeebara (Classic)': 'classic coffeebara.png',
    'Mellowbara': 'classic mellowbara.png',
    'Creamybara': 'classic creamybara.png',
    'Kapebarako': 'classic kapebarako.png',
    
    // Frappes
    'Chocobara (Frappe)': 'chocobara frappe.png',
    'Matchabara (Frappe)': 'matchabara frappe.png',
    'Carabara (Frappe)': 'carabara frappe.png',
    'Vanibara': 'vanibara frappe.png',
    
    // Lattes
    'Coffeebara (Latte)': 'classic coffeebara latte.png',
    'Matchabara (Latte)': 'classic matchabara latte.png',
    'Berrybara': 'classic berrybara latte.png',
    'Carabara (Latte)': 'classic carabara latte.png',
    
    // Mocktails
    'Berrybara Fizz': 'berrybara fizz.png',
    'Tropibara Twist': 'tropibara twist.png',
    'Limebara Splash': 'limebara splash.png',
    
    // Cupcakes
    'Chocobara Mint': 'chocobara mint cupcake.png',
    'Vanibara Delight': 'vanibara delight cupcake.png',
    'Mochabara Caramel': 'mochabara caramel cupcake.png',
    
    // Snacks
    'Chocobara Chip Stack': 'chocobara chip stack.png',
    'Chocobara Mini Waffles': 'chocobara mini waffles.png',
    'Carabara Glazed Cookies': 'carabara glazed cookies.png',
    "S'morebara Bites": "s'morebara bites.png",
    'Nougatbara': 'nougatbara minis.png',
    
    // Rice Meals
    'Tofubara Garden Bowl': 'tofubara garden bowl.png',
    'Chickenbara Nori Bowl': 'chickenbara nori bowl.png',
    'Shrimpbara Peanut Bowl': 'shrimpbara peanut bowl.png',
  };
  
  const imageName = imageMap[productName] || `${productName.toLowerCase()}.png`;
  
  // Use new URL with import.meta.url for Vite (assets are in ./assets relative to this file)
  try {
    const imageUrl = new URL(`./assets/${category}/${imageName}`, import.meta.url);
    return imageUrl.href;
  } catch (error) {
    console.warn(`Failed to load image for ${productName}:`, error);
    // Fallback path (dev server serves from /src/... but using a relative path is preferred)
    return `/src/assets/${category}/${imageName}`;
  }
};

// Generate menu items with EXACT IDs (1-32) and category labels
const generateMenuItems = () => {
  const items = [];
  let idCounter = 1;

  // COLD BREWS (IDs 1-6)
  const coldBrews = [
    { name: 'Coffeebara', prices: { M: 100, L: 120 } },
    { name: 'Matchabara', prices: { M: 120, L: 140 } },
    { name: 'Macchiabara', prices: { M: 130, L: 150 } },
    { name: 'Spanibara', prices: { M: 120, L: 140 } },
    { name: 'Mochabara', prices: { M: 130, L: 150 } },
    { name: 'Carabara', prices: { M: 120, L: 140 } }
  ];
  
  coldBrews.forEach(item => {
    items.push({
      id: String(idCounter++),
      name: item.name,
      displayName: `${item.name} Cold Brew`,
      price: item.prices.M,
      priceM: item.prices.M,
      priceL: item.prices.L,
      description: `Refreshing cold brew ${item.name.toLowerCase()} with smooth, rich flavor.`,
      category: 'cold_brews',
      image: getImagePath('cold_brews', item.name),
      hasSize: true
    });
  });

  // CLASSICS (IDs 7-10)
  const classics = [
    { name: 'Coffeebara (Classic)', displayName: 'Coffeebara', prices: { M: 80, L: 100 } },
    { name: 'Mellowbara', displayName: 'Mellowbara', prices: { M: 100, L: 120 } },
    { name: 'Creamybara', displayName: 'Creamybara', prices: { M: 90, L: 110 } },
    { name: 'Kapebarako', displayName: 'Kapebarako', prices: { M: 100, L: 120 } }
  ];
  
  classics.forEach(item => {
    items.push({
      id: String(idCounter++),
      name: item.displayName,
      displayName: `${item.displayName} Classic`,
      price: item.prices.M,
      priceM: item.prices.M,
      priceL: item.prices.L,
      description: `Classic ${item.displayName.toLowerCase()} - a timeless favorite.`,
      category: 'classics',
      image: getImagePath('classics', item.name),
      hasSize: true
    });
  });

  // FRAPPES (IDs 11-14)
  const frappes = [
    { name: 'Chocobara (Frappe)', displayName: 'Chocobara', prices: { M: 150, L: 170 } },
    { name: 'Matchabara (Frappe)', displayName: 'Matchabara', prices: { M: 150, L: 170 } },
    { name: 'Carabara (Frappe)', displayName: 'Carabara', prices: { M: 150, L: 170 } },
    { name: 'Vanibara', displayName: 'Vanibara', prices: { M: 140, L: 160 } }
  ];
  
  frappes.forEach(item => {
    items.push({
      id: String(idCounter++),
      name: item.displayName,
      displayName: `${item.displayName} Frappe`,
      price: item.prices.M,
      priceM: item.prices.M,
      priceL: item.prices.L,
      description: `Creamy and indulgent ${item.displayName.toLowerCase()} frappe.`,
      category: 'frappes',
      image: getImagePath('frappes', item.name),
      hasSize: true
    });
  });

  // LATTES (IDs 15-18)
  const lattes = [
    { name: 'Coffeebara (Latte)', displayName: 'Coffeebara', prices: { M: 110, L: 130 } },
    { name: 'Matchabara (Latte)', displayName: 'Matchabara', prices: { M: 120, L: 140 } },
    { name: 'Berrybara', displayName: 'Berrybara', prices: { M: 130, L: 150 } },
    { name: 'Carabara (Latte)', displayName: 'Carabara', prices: { M: 120, L: 140 } }
  ];
  
  lattes.forEach(item => {
    items.push({
      id: String(idCounter++),
      name: item.displayName,
      displayName: `${item.displayName} Latte`,
      price: item.prices.M,
      priceM: item.prices.M,
      priceL: item.prices.L,
      description: `Smooth and aromatic ${item.displayName.toLowerCase()} latte.`,
      category: 'lattes',
      image: getImagePath('lattes', item.name),
      hasSize: true
    });
  });

  // MOCKTAILS (IDs 19-21)
  const mocktails = [
    { name: 'Berrybara Fizz', prices: { M: 120, L: 140 } },
    { name: 'Tropibara Twist', prices: { M: 120, L: 140 } },
    { name: 'Limebara Splash', prices: { M: 110, L: 130 } }
  ];
  
  mocktails.forEach(item => {
    items.push({
      id: String(idCounter++),
      name: item.name,
      displayName: item.name,
      price: item.prices.M,
      priceM: item.prices.M,
      priceL: item.prices.L,
      description: `Refreshing ${item.name.toLowerCase()} - perfect for any time of day.`,
      category: 'mocktails',
      image: getImagePath('mocktails', item.name),
      hasSize: true
    });
  });

  // CUPCAKES (IDs 22-24) - support Solo and 3pcs pricing
  const cupcakes = [
    { name: 'Chocobara Mint', priceSolo: 75, price3: 210 },
    { name: 'Vanibara Delight', priceSolo: 70, price3: 200 },
    { name: 'Mochabara Caramel', priceSolo: 80, price3: 225 }
  ];

  cupcakes.forEach(item => {
    items.push({
      id: String(idCounter++),
      name: item.name,
      displayName: item.name,
      // default displayed price = solo
      price: item.priceSolo,
      priceSolo: item.priceSolo,
      price3: item.price3,
      description: `Delicious ${item.name.toLowerCase()} cupcake - available solo or as 3pcs.`,
      category: 'cupcakes',
      image: getImagePath('cupcakes', item.name),
      hasSize: false
    });
  });

  // SNACKS (IDs 25-29) - support 3pcs and 6pcs pricing
  const snacks = [
    { name: 'Chocobara Chip Stack', price3: 60, price6: 115 },
    { name: 'Chocobara Mini Waffles', price3: 75, price6: 140 },
    { name: 'Carabara Glazed Cookies', price3: 55, price6: 125 },
    { name: "S'morebara Bites", price3: 65, price6: 125 },
    { name: 'Nougatbara', price3: 70, price6: 135 }
  ];

  snacks.forEach(item => {
    items.push({
      id: String(idCounter++),
      name: item.name,
      displayName: item.name,
      // default displayed price = 3pcs
      price: item.price3,
      price3: item.price3,
      price6: item.price6,
      description: `${item.name} available in 3pcs or 6pcs.`,
      category: 'snacks',
      image: getImagePath('snacks', item.name),
      hasSize: false
    });
  });

  // RICE MEALS (IDs 30-32)
  const riceMeals = [
    { name: 'Tofubara Garden Bowl', price: 139 },
    { name: 'Chickenbara Nori Bowl', price: 169 },
    { name: 'Shrimpbara Peanut Bowl', price: 189 }
  ];
  
  riceMeals.forEach(item => {
    items.push({
      id: String(idCounter++),
      name: item.name,
      displayName: item.name,
      price: item.price,
      description: `Hearty ${item.name.toLowerCase()} - a complete meal.`,
      category: 'rice_meal',
      image: getImagePath('rice_meal', item.name),
      hasSize: false
    });
  });

  return items;
};

export const menuData = generateMenuItems();

// Helper to get items by category
export const getItemsByCategory = (category) => {
  return menuData.filter(item => item.category === category);
};

// Helper to get bestsellers (IDs 1-3 from cold brews, IDs 7-9 from classics)
export const getBestsellers = () => {
  const coldBrews = menuData.filter(item => item.category === 'cold_brews').slice(0, 3);
  const classics = menuData.filter(item => item.category === 'classics').slice(0, 3);
  return [...coldBrews, ...classics];
};

// Helper to get snacks only
export const getSnacks = () => {
  return menuData.filter(item => item.category === 'snacks');
};

// Helper to get desserts only (cupcakes)
export const getDesserts = () => {
  return menuData.filter(item => item.category === 'cupcakes');
};

// Helper to get rice meals
export const getRiceMeals = () => {
  return menuData.filter(item => item.category === 'rice_meal');
};

// Helper to get snacks & desserts (cupcakes, snacks) - for backward compatibility
export const getSnacksAndDesserts = () => {
  return menuData.filter(item => 
    ['cupcakes', 'snacks'].includes(item.category)
  );
};

// Helper to get related items (same category, excluding current item)
export const getRelatedItems = (currentItem, limit = 3) => {
  return menuData
    .filter(item => item.category === currentItem.category && item.id !== currentItem.id)
    .slice(0, limit);
};