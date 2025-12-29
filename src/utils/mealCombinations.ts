import { FoodItem, foodDatabase } from '../data/foodDatabase';

export interface MealCombination {
  name: string;
  items: Array<{
    food: FoodItem;
    portion: number;
    calories: number;
  }>;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  description: string;
}


// Helper function to find food item by name (fuzzy matching)
function findFoodByName(name: string, cuisine?: string): FoodItem | null {
  // Normalize the search name - remove parentheses and numbers
  const normalizedSearch = name.toLowerCase()
    .replace(/\([^)]*\)/g, '') // Remove parentheses content
    .replace(/\d+/g, '') // Remove numbers
    .replace(/with milk & sugar|without sugar|with milk|& sugar|milk & sugar/gi, '')
    .trim();

  // Try exact match first (check if food name starts with or contains the search term)
  let match = foodDatabase.find(food => {
    const foodName = food.name.toLowerCase();
    const foodBaseName = foodName.split('(')[0].trim(); // Base name without portion info
    
    // Check if search term matches base name or vice versa
    const matches = foodBaseName === normalizedSearch ||
                   foodBaseName.includes(normalizedSearch) || 
                   normalizedSearch.includes(foodBaseName) ||
                   foodName.includes(normalizedSearch);
    
    return matches && (!cuisine || food.cuisine === cuisine);
  });

  // Try partial match across all cuisines if not found
  if (!match) {
    match = foodDatabase.find(food => {
      const foodName = food.name.toLowerCase();
      const foodBaseName = foodName.split('(')[0].trim();
      return foodBaseName === normalizedSearch ||
             foodBaseName.includes(normalizedSearch) || 
             normalizedSearch.includes(foodBaseName) ||
             foodName.includes(normalizedSearch);
    });
  }

  // Special cases for common items with exact name matching
  if (!match) {
    const specialCases: Record<string, string[]> = {
      'tea without sugar': ['Tea without Sugar'],
      'tea with milk & sugar': ['Tea with Milk & Sugar', 'Tea with milk & sugar'],
      'tea with milk and sugar': ['Tea with Milk & Sugar'],
      'coffee with milk & sugar': ['Coffee with Milk & Sugar', 'Coffee with milk & sugar'],
      'coffee with milk and sugar': ['Coffee with Milk & Sugar'],
      'masala chai': ['Masala Chai'],
      'buttermilk': ['Buttermilk'],
      'green salad': ['Green Salad'],
      'onion salad': ['Onion Salad'],
      'banana': ['Banana'],
      'apple': ['Apple'],
      'papad': ['Papad'],
      'digestive biscuits': ['Digestive Biscuits'],
      'sambar': ['Sambar'],
      'rasam': ['Rasam'],
      'coconut chutney': ['Coconut Chutney'],
      'idli': ['Idli'],
      'dosa': ['Dosa'],
      'medu vada': ['Medu Vada'],
      'upma': ['Upma'],
      'pongal': ['Pongal'],
      'avial': ['Avial'],
      'curd rice': ['Curd Rice'],
      'lemon rice': ['Lemon Rice'],
      'plain rice': ['Plain Rice'],
      'raita': ['Raita'],
      'plain curd': ['Plain Curd'],
      'chapati': ['Chapati'],
      'aloo paratha': ['Aloo Paratha'],
      'paneer paratha': ['Paneer Paratha'],
      'poori': ['Poori'],
      'bread omelette': ['Bread Omelette'],
      'bread': ['Bread'],
      'kadala curry': ['Kadala Curry'],
      'chokha': ['Chokha'],
      'green chutney': ['Green Chutney'],
      'aloo curry': ['Aloo Curry'],
      'vegetable stew': ['Vegetable Stew'],
    };

    const searchKey = normalizedSearch.trim();
    if (specialCases[searchKey]) {
      for (const exactName of specialCases[searchKey]) {
        match = foodDatabase.find(f => {
          const fName = f.name.toLowerCase();
          return fName.includes(exactName.toLowerCase()) || 
                 fName.split('(')[0].trim() === exactName.toLowerCase();
        });
        if (match) break;
      }
    }
  }

  return match || null;
}

// Helper to parse portion from food name
function parsePortion(foodName: string): number {
  // Extract numbers from food name (e.g., "Chapati (2)" -> 2)
  const match = foodName.match(/\((\d+(?:\.\d+)?)\)/);
  if (match) {
    return parseFloat(match[1]);
  }
  
  // Check for common patterns
  if (foodName.includes('1/2')) return 0.5;
  if (foodName.includes('2/3')) return 0.67;
  if (foodName.includes('3/4')) return 0.75;
  if (foodName.includes('1.5')) return 1.5;
  
  return 1; // Default to 1 serving
}

// Meal combinations data structure
const MEAL_COMBINATIONS: Record<string, Record<string, Array<{
  name: string;
  items: Array<{ name: string; calories: number; portion?: number }>;
  totalCalories: number;
  macros: { protein: number; carbs: number; fat: number };
}>>> = {
  'North Indian': {
    breakfast: [
      {
        name: 'Classic Paratha Breakfast',
        items: [
          { name: 'Aloo Paratha', calories: 290, portion: 1 },
          { name: 'Raita', calories: 30, portion: 0.33 },
        ],
        totalCalories: 320,
        macros: { protein: 8, carbs: 46, fat: 13 },
      },
      {
        name: 'Light Roti Meal',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Plain Curd', calories: 33, portion: 0.33 },
          { name: 'Tea without sugar', calories: 20 },
        ],
        totalCalories: 293,
        macros: { protein: 9, carbs: 50, fat: 5 },
      },
      {
        name: 'Bread & Protein',
        items: [
          { name: 'Bread Omelette', calories: 320 },
        ],
        totalCalories: 320,
        macros: { protein: 18, carbs: 28, fat: 15 },
      },
      {
        name: 'Quick Poori Meal',
        items: [
          { name: 'Poori', calories: 240, portion: 2 },
          { name: 'Aloo Curry', calories: 60, portion: 0.33 },
        ],
        totalCalories: 300,
        macros: { protein: 6, carbs: 42, fat: 13 },
      },
      {
        name: 'Paneer Paratha Special',
        items: [
          { name: 'Paneer Paratha', calories: 340, portion: 1 },
        ],
        totalCalories: 340,
        macros: { protein: 12, carbs: 38, fat: 15 },
      },
    ],
    lunch: [
      {
        name: 'Dal-Rice Thali',
        items: [
          { name: 'Plain Rice', calories: 180, portion: 0.75 },
          { name: 'Dal Tadka', calories: 180 },
          { name: 'Green Salad', calories: 25 },
          { name: 'Raita', calories: 30, portion: 0.33 },
        ],
        totalCalories: 415,
        macros: { protein: 15, carbs: 73, fat: 6 },
      },
      {
        name: 'Rajma Rice Bowl',
        items: [
          { name: 'Plain Rice', calories: 162, portion: 0.67 },
          { name: 'Rajma Masala', calories: 250 },
        ],
        totalCalories: 412,
        macros: { protein: 18, carbs: 75, fat: 5 },
      },
      {
        name: 'Paneer Roti Meal',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Palak Paneer', calories: 140, portion: 0.5 },
          { name: 'Onion Salad', calories: 20 },
        ],
        totalCalories: 400,
        macros: { protein: 16, carbs: 55, fat: 13 },
      },
      {
        name: 'Chana Masala Plate',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Chana Masala', calories: 120, portion: 0.5 },
          { name: 'Raita', calories: 90 },
        ],
        totalCalories: 450,
        macros: { protein: 18, carbs: 67, fat: 11 },
      },
      {
        name: 'Mixed Veg Thali',
        items: [
          { name: 'Jeera Rice', calories: 187, portion: 0.75 },
          { name: 'Mix Veg Curry', calories: 160 },
          { name: 'Dal Tadka', calories: 90, portion: 0.5 },
        ],
        totalCalories: 437,
        macros: { protein: 13, carbs: 78, fat: 9 },
      },
    ],
    dinner: [
      {
        name: 'Light Dal-Roti',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Dal Tadka', calories: 90, portion: 0.5 },
          { name: 'Green Salad', calories: 25 },
        ],
        totalCalories: 355,
        macros: { protein: 11, carbs: 62, fat: 6 },
      },
      {
        name: 'Paneer Light Meal',
        items: [
          { name: 'Chapati', calories: 120, portion: 1 },
          { name: 'Matar Paneer', calories: 150, portion: 0.5 },
          { name: 'Raita', calories: 45, portion: 0.5 },
          { name: 'Green Salad', calories: 25 },
        ],
        totalCalories: 340,
        macros: { protein: 12, carbs: 37, fat: 14 },
      },
      {
        name: 'Simple Khichdi',
        items: [
          { name: 'Dal Khichdi', calories: 315, portion: 1.5 },
          { name: 'Plain Curd', calories: 33, portion: 0.33 },
        ],
        totalCalories: 348,
        macros: { protein: 13, carbs: 57, fat: 5 },
      },
      {
        name: 'Aloo Gobi Dinner',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Aloo Gobi', calories: 90, portion: 0.5 },
          { name: 'Buttermilk', calories: 60 },
        ],
        totalCalories: 390,
        macros: { protein: 9, carbs: 70, fat: 8 },
      },
      {
        name: 'Light Rice Meal',
        items: [
          { name: 'Plain Rice', calories: 162, portion: 0.67 },
          { name: 'Dal Makhani', calories: 140, portion: 0.5 },
          { name: 'Green Salad', calories: 25 },
        ],
        totalCalories: 327,
        macros: { protein: 12, carbs: 50, fat: 7 },
      },
    ],
    snack: [
      {
        name: 'Tea Time Classic',
        items: [
          { name: 'Tea with milk & sugar', calories: 60 },
        ],
        totalCalories: 60,
        macros: { protein: 2, carbs: 10, fat: 2 },
      },
      {
        name: 'Light Snack',
        items: [
          { name: 'Aloo Tikki', calories: 110, portion: 1 },
        ],
        totalCalories: 110,
        macros: { protein: 2, carbs: 16, fat: 4.5 },
      },
      {
        name: 'Samosa Mini',
        items: [
          { name: 'Samosa', calories: 154, portion: 1 },
        ],
        totalCalories: 154,
        macros: { protein: 3, carbs: 19, fat: 7.5 },
      },
      {
        name: 'Pakora Snack',
        items: [
          { name: 'Pakora', calories: 120, portion: 0.33 },
        ],
        totalCalories: 120,
        macros: { protein: 3, carbs: 14, fat: 6 },
      },
      {
        name: 'Fruit & Tea',
        items: [
          { name: 'Tea without sugar', calories: 20 },
          { name: 'Banana', calories: 60 },
          { name: 'Apple', calories: 60 },
        ],
        totalCalories: 140,
        macros: { protein: 2, carbs: 34, fat: 1 },
      },
    ],
  },
  'South Indian': {
    breakfast: [
      {
        name: 'Classic Idli Breakfast',
        items: [
          { name: 'Idli', calories: 120, portion: 3 },
          { name: 'Sambar', calories: 120 },
          { name: 'Coconut Chutney', calories: 40, portion: 2 },
        ],
        totalCalories: 280,
        macros: { protein: 8, carbs: 51, fat: 4 },
      },
      {
        name: 'Dosa Delight',
        items: [
          { name: 'Dosa (Plain)', calories: 252, portion: 1.5 },
          { name: 'Sambar', calories: 60, portion: 0.5 },
        ],
        totalCalories: 312,
        macros: { protein: 8, carbs: 50, fat: 7 },
      },
      {
        name: 'Vada Special',
        items: [
          { name: 'Medu Vada', calories: 220, portion: 2 },
          { name: 'Sambar', calories: 60, portion: 0.5 },
          { name: 'Coconut Chutney', calories: 20, portion: 1 },
        ],
        totalCalories: 300,
        macros: { protein: 8, carbs: 36, fat: 12 },
      },
      {
        name: 'Upma Breakfast',
        items: [
          { name: 'Upma', calories: 220 },
          { name: 'Coconut Chutney', calories: 40, portion: 2 },
          { name: 'Banana', calories: 60 },
        ],
        totalCalories: 320,
        macros: { protein: 8, carbs: 58, fat: 6 },
      },
      {
        name: 'Pongal Morning',
        items: [
          { name: 'Pongal', calories: 260 },
          { name: 'Coconut Chutney', calories: 40, portion: 2 },
        ],
        totalCalories: 300,
        macros: { protein: 10, carbs: 50, fat: 8 },
      },
    ],
    lunch: [
      {
        name: 'Sambar Rice Meal',
        items: [
          { name: 'Plain Rice', calories: 240, portion: 1 },
          { name: 'Sambar', calories: 120 },
          { name: 'Rasam', calories: 25, portion: 0.5 },
          { name: 'Papad', calories: 35, portion: 1 },
        ],
        totalCalories: 420,
        macros: { protein: 10, carbs: 83, fat: 4 },
      },
      {
        name: 'Lemon Rice Combo',
        items: [
          { name: 'Lemon Rice', calories: 280 },
          { name: 'Rasam', calories: 50 },
          { name: 'Poriyal', calories: 80 },
        ],
        totalCalories: 410,
        macros: { protein: 9, carbs: 74, fat: 11 },
      },
      {
        name: 'Curd Rice Special',
        items: [
          { name: 'Curd Rice', calories: 270, portion: 1.5 },
          { name: 'Avial', calories: 80, portion: 0.5 },
          { name: 'Rasam', calories: 50 },
          { name: 'Papad', calories: 35, portion: 1 },
        ],
        totalCalories: 435,
        macros: { protein: 11, carbs: 73, fat: 10 },
      },
      {
        name: 'Bisi Bele Bath Meal',
        items: [
          { name: 'Bisi Bele Bath', calories: 310 },
          { name: 'Raita', calories: 90 },
          { name: 'Papad', calories: 35, portion: 1 },
        ],
        totalCalories: 435,
        macros: { protein: 14, carbs: 69, fat: 10 },
      },
      {
        name: 'Coconut Rice Thali',
        items: [
          { name: 'Coconut Rice', calories: 320 },
          { name: 'Kootu', calories: 70, portion: 0.5 },
          { name: 'Thoran', calories: 45, portion: 0.5 },
        ],
        totalCalories: 435,
        macros: { protein: 9, carbs: 63, fat: 15 },
      },
    ],
    dinner: [
      {
        name: 'Light Dosa Dinner',
        items: [
          { name: 'Dosa (Plain)', calories: 252, portion: 1.5 },
          { name: 'Sambar', calories: 120 },
        ],
        totalCalories: 372,
        macros: { protein: 10, carbs: 62, fat: 8 },
      },
      {
        name: 'Idli Night Meal',
        items: [
          { name: 'Idli', calories: 160, portion: 4 },
          { name: 'Sambar', calories: 120 },
          { name: 'Coconut Chutney', calories: 40, portion: 2 },
          { name: 'Buttermilk', calories: 60 },
        ],
        totalCalories: 380,
        macros: { protein: 10, carbs: 67, fat: 5 },
      },
      {
        name: 'Rava Dosa Light',
        items: [
          { name: 'Rava Dosa', calories: 240 },
          { name: 'Sambar', calories: 60, portion: 0.5 },
          { name: 'Coconut Chutney', calories: 40, portion: 2 },
        ],
        totalCalories: 340,
        macros: { protein: 7, carbs: 56, fat: 9 },
      },
      {
        name: 'Appam Dinner',
        items: [
          { name: 'Appam', calories: 180, portion: 3 },
          { name: 'Avial', calories: 160 },
        ],
        totalCalories: 340,
        macros: { protein: 7, carbs: 48, fat: 13 },
      },
      {
        name: 'Uttapam Evening',
        items: [
          { name: 'Uttapam', calories: 210 },
          { name: 'Sambar', calories: 120 },
          { name: 'Coconut Chutney', calories: 20, portion: 1 },
        ],
        totalCalories: 350,
        macros: { protein: 8, carbs: 60, fat: 7 },
      },
    ],
    snack: [
      {
        name: 'Coffee Break',
        items: [
          { name: 'Coffee with Milk & Sugar', calories: 70 },
          { name: 'Banana', calories: 60 },
        ],
        totalCalories: 130,
        macros: { protein: 3, carbs: 26, fat: 2 },
      },
      {
        name: 'Vada Mini',
        items: [
          { name: 'Medu Vada', calories: 110, portion: 1 },
        ],
        totalCalories: 110,
        macros: { protein: 3, carbs: 12, fat: 5.5 },
      },
      {
        name: 'Idli Snack',
        items: [
          { name: 'Idli', calories: 80, portion: 2 },
          { name: 'Coconut Chutney', calories: 20, portion: 1 },
        ],
        totalCalories: 100,
        macros: { protein: 3, carbs: 19, fat: 1 },
      },
      {
        name: 'Light Tea',
        items: [
          { name: 'Masala Chai', calories: 65 },
          { name: 'Digestive biscuits', calories: 40 },
        ],
        totalCalories: 105,
        macros: { protein: 3, carbs: 19, fat: 2 },
      },
      {
        name: 'Buttermilk Refresh',
        items: [
          { name: 'Buttermilk', calories: 120, portion: 2 },
        ],
        totalCalories: 120,
        macros: { protein: 6, carbs: 16, fat: 3 },
      },
    ],
  },
  'Bengali': {
    breakfast: [
      {
        name: 'Classic Luchi-Alur Dom',
        items: [
          { name: 'Luchi', calories: 240, portion: 2 },
          { name: 'Alur Dom', calories: 90, portion: 0.5 },
        ],
        totalCalories: 330,
        macros: { protein: 6, carbs: 48, fat: 13 },
      },
      {
        name: 'Cholar Dal Morning',
        items: [
          { name: 'Luchi', calories: 180, portion: 1.5 },
          { name: 'Cholar Dal', calories: 110, portion: 0.5 },
        ],
        totalCalories: 290,
        macros: { protein: 9, carbs: 41, fat: 9 },
      },
      {
        name: 'Light Posto Breakfast',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Aloo Posto', calories: 73, portion: 0.33 },
        ],
        totalCalories: 313,
        macros: { protein: 7, carbs: 40, fat: 12 },
      },
      {
        name: 'Egg Breakfast',
        items: [
          { name: 'Luchi', calories: 120, portion: 1 },
          { name: 'Egg Bhurji', calories: 120, portion: 0.5 },
          { name: 'Tea with Milk & Sugar', calories: 60 },
        ],
        totalCalories: 300,
        macros: { protein: 11, carbs: 30, fat: 13 },
      },
      {
        name: 'Paratha Morning',
        items: [
          { name: 'Paratha - Plain', calories: 230, portion: 1 },
          { name: 'Mishti Doi', calories: 60, portion: 0.33 },
        ],
        totalCalories: 290,
        macros: { protein: 8, carbs: 39, fat: 11 },
      },
    ],
    lunch: [
      {
        name: 'Traditional Fish Meal',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Macher Jhol', calories: 120, portion: 0.5 },
          { name: 'Begun Bhaja', calories: 70, portion: 0.5 },
        ],
        totalCalories: 430,
        macros: { protein: 18, carbs: 60, fat: 12 },
      },
      {
        name: 'Shukto Thali',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Shukto', calories: 160 },
          { name: 'Papad', calories: 35, portion: 0.5 },
        ],
        totalCalories: 435,
        macros: { protein: 8, carbs: 71, fat: 11 },
      },
      {
        name: 'Dal-Rice Bengali Style',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Cholar Dal', calories: 220 },
        ],
        totalCalories: 460,
        macros: { protein: 14, carbs: 79, fat: 8 },
      },
      {
        name: 'Doi Maach Special',
        items: [
          { name: 'Steamed Rice', calories: 180, portion: 0.75 },
          { name: 'Doi Maach', calories: 140, portion: 0.5 },
          { name: 'Aloo Posto', calories: 73, portion: 0.33 },
        ],
        totalCalories: 393,
        macros: { protein: 18, carbs: 45, fat: 14 },
      },
      {
        name: 'Mixed Bengali Meal',
        items: [
          { name: 'Steamed Rice', calories: 180, portion: 0.75 },
          { name: 'Alur Dom', calories: 180 },
          { name: 'Begun Bhaja', calories: 70, portion: 0.5 },
        ],
        totalCalories: 430,
        macros: { protein: 6, carbs: 64, fat: 16 },
      },
    ],
    dinner: [
      {
        name: 'Light Fish Dinner',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Macher Jhol', calories: 120, portion: 0.5 },
          { name: 'Green Salad', calories: 25 },
          { name: 'Papad', calories: 35, portion: 0.5 },
        ],
        totalCalories: 342,
        macros: { protein: 16, carbs: 51, fat: 8 },
      },
      {
        name: 'Dal-Rice Light',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Cholar Dal', calories: 110, portion: 0.5 },
          { name: 'Raita', calories: 90 },
        ],
        totalCalories: 362,
        macros: { protein: 13, carbs: 55, fat: 9 },
      },
      {
        name: 'Simple Shukto Meal',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Shukto', calories: 80, portion: 0.5 },
          { name: 'Buttermilk', calories: 60 },
        ],
        totalCalories: 380,
        macros: { protein: 7, carbs: 69, fat: 7 },
      },
      {
        name: 'Aloo Posto Dinner',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Aloo Posto', calories: 110, portion: 0.5 },
        ],
        totalCalories: 350,
        macros: { protein: 8, carbs: 48, fat: 13 },
      },
      {
        name: 'Light Bengali Evening',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Alur Dom', calories: 90, portion: 0.5 },
          { name: 'Raita', calories: 90 },
        ],
        totalCalories: 342,
        macros: { protein: 8, carbs: 56, fat: 9 },
      },
    ],
    snack: [
      {
        name: 'Tea & Mishti',
        items: [
          { name: 'Tea with Milk & Sugar', calories: 60 },
          { name: 'Rasgulla', calories: 93, portion: 0.5 },
        ],
        totalCalories: 153,
        macros: { protein: 4, carbs: 30, fat: 3 },
      },
      {
        name: 'Light Tea Break',
        items: [
          { name: 'Tea with Milk & Sugar', calories: 60 },
          { name: 'Digestive biscuits', calories: 40 },
        ],
        totalCalories: 100,
        macros: { protein: 3, carbs: 18, fat: 3 },
      },
      {
        name: 'Mishti Doi Snack',
        items: [
          { name: 'Mishti Doi', calories: 90, portion: 0.5 },
        ],
        totalCalories: 90,
        macros: { protein: 3, carbs: 14, fat: 2.5 },
      },
      {
        name: 'Fruit & Tea',
        items: [
          { name: 'Tea without Sugar', calories: 20 },
          { name: 'Banana', calories: 105 },
        ],
        totalCalories: 125,
        macros: { protein: 2, carbs: 28, fat: 1 },
      },
      {
        name: 'Simple Chai',
        items: [
          { name: 'Masala Chai', calories: 65 },
          { name: 'Apple', calories: 60 },
        ],
        totalCalories: 125,
        macros: { protein: 2, carbs: 27, fat: 2 },
      },
    ],
  },
  'Gujarati': {
    breakfast: [
      {
        name: 'Thepla Classic',
        items: [
          { name: 'Thepla', calories: 250, portion: 2.5 },
          { name: 'Plain Curd', calories: 33, portion: 0.33 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 303,
        macros: { protein: 8, carbs: 42, fat: 10 },
      },
      {
        name: 'Dhokla Morning',
        items: [
          { name: 'Dhokla', calories: 200, portion: 5 },
          { name: 'Green Chutney', calories: 15, portion: 2 },
          { name: 'Tea with Milk & Sugar', calories: 60 },
        ],
        totalCalories: 275,
        macros: { protein: 7, carbs: 46, fat: 5 },
      },
      {
        name: 'Handvo Breakfast',
        items: [
          { name: 'Handvo', calories: 285, portion: 1.5 },
          { name: 'Green Chutney', calories: 8, portion: 1 },
        ],
        totalCalories: 293,
        macros: { protein: 7.5, carbs: 39, fat: 10.5 },
      },
      {
        name: 'Khandvi Special',
        items: [
          { name: 'Khandvi', calories: 231, portion: 10 },
          { name: 'Tea with Milk & Sugar', calories: 60 },
        ],
        totalCalories: 291,
        macros: { protein: 11, carbs: 36, fat: 10 },
      },
      {
        name: 'Quick Thepla',
        items: [
          { name: 'Thepla', calories: 300, portion: 3 },
        ],
        totalCalories: 300,
        macros: { protein: 7.5, carbs: 45, fat: 10.5 },
      },
    ],
    lunch: [
      {
        name: 'Undhiyu Thali',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Undhiyu', calories: 110, portion: 0.5 },
          { name: 'Kadhi', calories: 90, portion: 0.5 },
        ],
        totalCalories: 440,
        macros: { protein: 13, carbs: 66, fat: 13 },
      },
      {
        name: 'Dal Dhokli Meal',
        items: [
          { name: 'Dal Dhokli', calories: 280 },
          { name: 'Raita', calories: 90 },
          { name: 'Papad', calories: 35, portion: 0.5 },
        ],
        totalCalories: 405,
        macros: { protein: 15, carbs: 62, fat: 11 },
      },
      {
        name: 'Kadhi-Rice',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Kadhi', calories: 180 },
        ],
        totalCalories: 420,
        macros: { protein: 10, carbs: 69, fat: 12 },
      },
      {
        name: 'Mixed Gujarati Thali',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Ringan Bateta', calories: 140 },
          { name: 'Raita', calories: 30, portion: 0.33 },
        ],
        totalCalories: 410,
        macros: { protein: 10, carbs: 66, fat: 11 },
      },
      {
        name: 'Simple Dal-Roti',
        items: [
          { name: 'Chapati', calories: 360, portion: 3 },
          { name: 'Gujarati Dal', calories: 90, portion: 0.5 },
        ],
        totalCalories: 450,
        macros: { protein: 14, carbs: 78, fat: 8 },
      },
    ],
    dinner: [
      {
        name: 'Light Kadhi Meal',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Kadhi', calories: 180 },
        ],
        totalCalories: 342,
        macros: { protein: 9, carbs: 50, fat: 11 },
      },
      {
        name: 'Dhokla Dinner',
        items: [
          { name: 'Dhokla', calories: 240, portion: 6 },
          { name: 'Green Chutney', calories: 15, portion: 2 },
          { name: 'Raita', calories: 90 },
        ],
        totalCalories: 345,
        macros: { protein: 12, carbs: 52, fat: 9 },
      },
      {
        name: 'Simple Thepla Meal',
        items: [
          { name: 'Thepla', calories: 200, portion: 2 },
          { name: 'Plain Curd', calories: 98 },
          { name: 'Pickle', calories: 26 },
        ],
        totalCalories: 324,
        macros: { protein: 11, carbs: 45, fat: 10 },
      },
      {
        name: 'Sev Tameta Dinner',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Sev Tameta', calories: 160 },
        ],
        totalCalories: 400,
        macros: { protein: 9, carbs: 56, fat: 14 },
      },
      {
        name: 'Light Vegetable Meal',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Ringan Bateta', calories: 70, portion: 0.5 },
          { name: 'Buttermilk', calories: 60 },
        ],
        totalCalories: 370,
        macros: { protein: 9, carbs: 60, fat: 9 },
      },
    ],
    snack: [
      {
        name: 'Tea & Fafda',
        items: [
          { name: 'Tea with Milk & Sugar', calories: 60 },
          { name: 'Fafda', calories: 80, portion: 0.25 },
        ],
        totalCalories: 140,
        macros: { protein: 4, carbs: 17, fat: 6 },
      },
      {
        name: 'Khandvi Snack',
        items: [
          { name: 'Khandvi', calories: 91, portion: 4 },
        ],
        totalCalories: 91,
        macros: { protein: 4, carbs: 12, fat: 3 },
      },
      {
        name: 'Dhokla Light',
        items: [
          { name: 'Dhokla', calories: 80, portion: 2 },
          { name: 'Green Chutney', calories: 8, portion: 1 },
        ],
        totalCalories: 88,
        macros: { protein: 2.5, carbs: 14, fat: 1.5 },
      },
      {
        name: 'Chai Time',
        items: [
          { name: 'Masala Chai', calories: 65 },
          { name: 'Digestive biscuits', calories: 40 },
        ],
        totalCalories: 105,
        macros: { protein: 3, carbs: 19, fat: 2 },
      },
      {
        name: 'Buttermilk Break',
        items: [
          { name: 'Buttermilk', calories: 120, portion: 2 },
        ],
        totalCalories: 120,
        macros: { protein: 6, carbs: 16, fat: 3 },
      },
    ],
  },
  'Maharashtrian': {
    breakfast: [
      {
        name: 'Poha Classic',
        items: [
          { name: 'Poha', calories: 250 },
          { name: 'Tea with Milk & Sugar', calories: 60 },
        ],
        totalCalories: 310,
        macros: { protein: 7, carbs: 55, fat: 8 },
      },
      {
        name: 'Thalipeeth Morning',
        items: [
          { name: 'Thalipeeth', calories: 240, portion: 2 },
          { name: 'Plain Curd', calories: 33, portion: 0.33 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 293,
        macros: { protein: 9, carbs: 46, fat: 9 },
      },
      {
        name: 'Sabudana Breakfast',
        items: [
          { name: 'Sabudana Khichdi', calories: 180, portion: 0.5 },
          { name: 'Plain Curd', calories: 98 },
        ],
        totalCalories: 278,
        macros: { protein: 7, carbs: 49, fat: 6 },
      },
      {
        name: 'Bread Breakfast',
        items: [
          { name: 'Bread Omelette', calories: 320 },
        ],
        totalCalories: 320,
        macros: { protein: 18, carbs: 28, fat: 15 },
      },
      {
        name: 'Light Upma',
        items: [
          { name: 'Upma', calories: 220 },
          { name: 'Banana', calories: 60 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 300,
        macros: { protein: 7, carbs: 56, fat: 5 },
      },
    ],
    lunch: [
      {
        name: 'Misal Pav',
        items: [
          { name: 'Misal Pav', calories: 380 },
          { name: 'Onion Salad', calories: 20 },
        ],
        totalCalories: 400,
        macros: { protein: 12, carbs: 56, fat: 12 },
      },
      {
        name: 'Pav Bhaji Meal',
        items: [
          { name: 'Pav Bhaji', calories: 400 },
        ],
        totalCalories: 400,
        macros: { protein: 8, carbs: 58, fat: 15 },
      },
      {
        name: 'Varan Bhaat Thali',
        items: [
          { name: 'Varan Bhaat', calories: 300 },
          { name: 'Raita', calories: 90 },
          { name: 'Papad', calories: 35, portion: 0.5 },
        ],
        totalCalories: 425,
        macros: { protein: 15, carbs: 72, fat: 7 },
      },
      {
        name: 'Dal-Rice Simple',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Dal Tadka', calories: 180 },
        ],
        totalCalories: 420,
        macros: { protein: 14, carbs: 77, fat: 6 },
      },
      {
        name: 'Zunka Bhakri',
        items: [
          { name: 'Zunka Bhakri', calories: 280 },
          { name: 'Raita', calories: 90 },
          { name: 'Onion Salad', calories: 20 },
        ],
        totalCalories: 390,
        macros: { protein: 13, carbs: 60, fat: 10 },
      },
    ],
    dinner: [
      {
        name: 'Light Bhakri Meal',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Dal Tadka', calories: 90, portion: 0.5 },
          { name: 'Buttermilk', calories: 60 },
        ],
        totalCalories: 390,
        macros: { protein: 12, carbs: 66, fat: 7 },
      },
      {
        name: 'Thalipeeth Dinner',
        items: [
          { name: 'Thalipeeth', calories: 240, portion: 2 },
          { name: 'Plain Curd', calories: 98 },
        ],
        totalCalories: 338,
        macros: { protein: 12, carbs: 46, fat: 11 },
      },
      {
        name: 'Simple Rice Meal',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Varan Bhaat', calories: 160, portion: 0.67 },
          { name: 'Green Salad', calories: 25 },
        ],
        totalCalories: 347,
        macros: { protein: 11, carbs: 66, fat: 3 },
      },
      {
        name: 'Light Pav Bhaji',
        items: [
          { name: 'Pav Bhaji', calories: 267, portion: 0.67 },
          { name: 'Raita', calories: 90 },
        ],
        totalCalories: 357,
        macros: { protein: 10, carbs: 52, fat: 12 },
      },
      {
        name: 'Poha Dinner',
        items: [
          { name: 'Poha', calories: 375, portion: 1.5 },
        ],
        totalCalories: 375,
        macros: { protein: 7.5, carbs: 67.5, fat: 9 },
      },
    ],
    snack: [
      {
        name: 'Vada Pav',
        items: [
          { name: 'Vada Pav', calories: 145, portion: 0.5 },
        ],
        totalCalories: 145,
        macros: { protein: 3, carbs: 21, fat: 5.5 },
      },
      {
        name: 'Tea Break',
        items: [
          { name: 'Tea with Milk & Sugar', calories: 60 },
          { name: 'Digestive biscuits', calories: 40 },
        ],
        totalCalories: 100,
        macros: { protein: 3, carbs: 18, fat: 3 },
      },
      {
        name: 'Samosa Mini',
        items: [
          { name: 'Samosa', calories: 77, portion: 0.25 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 97,
        macros: { protein: 2, carbs: 11, fat: 4 },
      },
      {
        name: 'Light Snack',
        items: [
          { name: 'Buttermilk', calories: 120, portion: 2 },
        ],
        totalCalories: 120,
        macros: { protein: 6, carbs: 16, fat: 3 },
      },
      {
        name: 'Fruit Break',
        items: [
          { name: 'Banana', calories: 105 },
        ],
        totalCalories: 105,
        macros: { protein: 1, carbs: 27, fat: 0.3 },
      },
    ],
  },
  'Malayali': {
    breakfast: [
      {
        name: 'Puttu-Kadala',
        items: [
          { name: 'Puttu', calories: 140 },
          { name: 'Kadala Curry', calories: 110, portion: 0.5 },
          { name: 'Banana', calories: 60 },
        ],
        totalCalories: 310,
        macros: { protein: 9, carbs: 60, fat: 4 },
      },
      {
        name: 'Appam-Stew',
        items: [
          { name: 'Appam', calories: 120, portion: 2 },
          { name: 'Chicken Stew', calories: 140, portion: 0.5 },
          { name: 'Banana', calories: 60 },
        ],
        totalCalories: 320,
        macros: { protein: 6, carbs: 54, fat: 8 },
      },
      {
        name: 'Dosa Kerala Style',
        items: [
          { name: 'Plain Dosa', calories: 252, portion: 1.5 },
          { name: 'Coconut Chutney', calories: 40, portion: 2 },
        ],
        totalCalories: 292,
        macros: { protein: 6, carbs: 48, fat: 7 },
      },
      {
        name: 'Idli Breakfast',
        items: [
          { name: 'Idli', calories: 120, portion: 3 },
          { name: 'Sambar', calories: 120 },
          { name: 'Coconut Chutney', calories: 40, portion: 2 },
        ],
        totalCalories: 280,
        macros: { protein: 8, carbs: 51, fat: 4 },
      },
      {
        name: 'Simple Puttu',
        items: [
          { name: 'Puttu', calories: 280, portion: 2 },
          { name: 'Banana', calories: 60 },
        ],
        totalCalories: 340,
        macros: { protein: 6, carbs: 72, fat: 2 },
      },
    ],
    lunch: [
      {
        name: 'Kerala Sadya Mini',
        items: [
          { name: 'Steamed Rice', calories: 180, portion: 0.75 },
          { name: 'Sambar', calories: 60, portion: 0.5 },
          { name: 'Avial', calories: 160 },
          { name: 'Papad', calories: 35, portion: 0.5 },
        ],
        totalCalories: 435,
        macros: { protein: 8, carbs: 71, fat: 12 },
      },
      {
        name: 'Fish Curry Meal',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Fish Curry (Kerala style)', calories: 140, portion: 0.5 },
          { name: 'Green Salad', calories: 25 },
        ],
        totalCalories: 405,
        macros: { protein: 17, carbs: 57, fat: 10 },
      },
      {
        name: 'Olan Rice',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Olan', calories: 140 },
          { name: 'Papad', calories: 35, portion: 0.5 },
        ],
        totalCalories: 415,
        macros: { protein: 8, carbs: 69, fat: 10 },
      },
      {
        name: 'Thoran Meal',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Thoran', calories: 180, portion: 2 },
        ],
        totalCalories: 420,
        macros: { protein: 10, carbs: 73, fat: 10 },
      },
      {
        name: 'Erissery Thali',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Erissery', calories: 180 },
        ],
        totalCalories: 420,
        macros: { protein: 10, carbs: 77, fat: 9 },
      },
    ],
    dinner: [
      {
        name: 'Light Appam Meal',
        items: [
          { name: 'Appam', calories: 180, portion: 3 },
          { name: 'Chicken Stew', calories: 140, portion: 0.5 },
        ],
        totalCalories: 320,
        macros: { protein: 7, carbs: 48, fat: 9 },
      },
      {
        name: 'Fish Light Dinner',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Fish Curry (Kerala style)', calories: 140, portion: 0.5 },
          { name: 'Green Salad', calories: 25 },
        ],
        totalCalories: 327,
        macros: { protein: 16, carbs: 44, fat: 8 },
      },
      {
        name: 'Puttu Evening',
        items: [
          { name: 'Puttu', calories: 210, portion: 1.5 },
          { name: 'Kadala Curry', calories: 110, portion: 0.5 },
        ],
        totalCalories: 320,
        macros: { protein: 11, carbs: 56, fat: 4 },
      },
      {
        name: 'Simple Rice Meal',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Olan', calories: 140 },
          { name: 'Buttermilk', calories: 60 },
        ],
        totalCalories: 362,
        macros: { protein: 7, carbs: 62, fat: 9 },
      },
      {
        name: 'Avial Dinner',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Avial', calories: 160 },
          { name: 'Papad', calories: 35, portion: 0.5 },
        ],
        totalCalories: 357,
        macros: { protein: 7, carbs: 56, fat: 11 },
      },
    ],
    snack: [
      {
        name: 'Banana Snack',
        items: [
          { name: 'Banana', calories: 105 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 125,
        macros: { protein: 2, carbs: 29, fat: 1 },
      },
      {
        name: 'Appam Light',
        items: [
          { name: 'Appam', calories: 60, portion: 1 },
          { name: 'Tea with Milk & Sugar', calories: 60 },
        ],
        totalCalories: 120,
        macros: { protein: 3, carbs: 22, fat: 3 },
      },
      {
        name: 'Coconut Water',
        items: [
          { name: 'Coconut Water', calories: 92, portion: 2 },
        ],
        totalCalories: 92,
        macros: { protein: 4, carbs: 18, fat: 1 },
      },
      {
        name: 'Tea Break',
        items: [
          { name: 'Masala Chai', calories: 65 },
          { name: 'Banana', calories: 60 },
        ],
        totalCalories: 125,
        macros: { protein: 3, carbs: 26, fat: 2 },
      },
      {
        name: 'Simple Snack',
        items: [
          { name: 'Buttermilk', calories: 120, portion: 2 },
        ],
        totalCalories: 120,
        macros: { protein: 6, carbs: 16, fat: 3 },
      },
    ],
  },
  'Andhra': {
    breakfast: [
      {
        name: 'Pesarattu-Upma',
        items: [
          { name: 'Pesarattu with Upma', calories: 280 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 300,
        macros: { protein: 10, carbs: 46, fat: 6 },
      },
      {
        name: 'Idli Andhra Style',
        items: [
          { name: 'Idli', calories: 120, portion: 3 },
          { name: 'Sambar', calories: 120 },
          { name: 'Coconut Chutney', calories: 40, portion: 2 },
        ],
        totalCalories: 280,
        macros: { protein: 8, carbs: 51, fat: 4 },
      },
      {
        name: 'Dosa Breakfast',
        items: [
          { name: 'Plain Dosa', calories: 252, portion: 1.5 },
          { name: 'Sambar', calories: 60, portion: 0.5 },
        ],
        totalCalories: 312,
        macros: { protein: 8, carbs: 50, fat: 7 },
      },
      {
        name: 'Upma Morning',
        items: [
          { name: 'Upma', calories: 220 },
          { name: 'Banana', calories: 60 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 300,
        macros: { protein: 7, carbs: 56, fat: 5 },
      },
      {
        name: 'Pesarattu Simple',
        items: [
          { name: 'Pesarattu', calories: 360, portion: 2 },
        ],
        totalCalories: 360,
        macros: { protein: 16, carbs: 56, fat: 8 },
      },
    ],
    lunch: [
      {
        name: 'Pulihora Meal',
        items: [
          { name: 'Pulihora', calories: 300 },
          { name: 'Raita', calories: 90 },
          { name: 'Papad', calories: 35, portion: 0.5 },
        ],
        totalCalories: 425,
        macros: { protein: 10, carbs: 72, fat: 10 },
      },
      {
        name: 'Pappu Rice',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Pappu', calories: 160 },
          { name: 'Papad', calories: 35, portion: 0.5 },
        ],
        totalCalories: 435,
        macros: { protein: 13, carbs: 79, fat: 6 },
      },
      {
        name: 'Gutti Vankaya Meal',
        items: [
          { name: 'Steamed Rice', calories: 180, portion: 0.75 },
          { name: 'Gutti Vankaya', calories: 200 },
          { name: 'Raita', calories: 30, portion: 0.33 },
        ],
        totalCalories: 410,
        macros: { protein: 9, carbs: 59, fat: 15 },
      },
      {
        name: 'Gongura Chicken',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Gongura Chicken', calories: 180, portion: 0.5 },
          { name: 'Green Salad', calories: 25 },
          { name: 'Buttermilk', calories: 60 },
        ],
        totalCalories: 427,
        macros: { protein: 19, carbs: 50, fat: 16 },
      },
      {
        name: 'Hyderabadi Biryani',
        items: [
          { name: 'Hyderabadi Biryani', calories: 480 },
        ],
        totalCalories: 480,
        macros: { protein: 22, carbs: 58, fat: 18 },
      },
    ],
    dinner: [
      {
        name: 'Light Rice Meal',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Pappu', calories: 160 },
          { name: 'Green Salad', calories: 25 },
        ],
        totalCalories: 347,
        macros: { protein: 11, carbs: 62, fat: 4 },
      },
      {
        name: 'Pesarattu Dinner',
        items: [
          { name: 'Pesarattu', calories: 270, portion: 1.5 },
          { name: 'Coconut Chutney', calories: 40, portion: 2 },
          { name: 'Buttermilk', calories: 60 },
        ],
        totalCalories: 370,
        macros: { protein: 14, carbs: 52, fat: 8 },
      },
      {
        name: 'Simple Dal Rice',
        items: [
          { name: 'Steamed Rice', calories: 180, portion: 0.75 },
          { name: 'Dal Tadka', calories: 180 },
        ],
        totalCalories: 360,
        macros: { protein: 14, carbs: 61, fat: 6 },
      },
      {
        name: 'Gutti Vankaya Light',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Gutti Vankaya', calories: 100, portion: 0.5 },
        ],
        totalCalories: 340,
        macros: { protein: 8, carbs: 48, fat: 12 },
      },
      {
        name: 'Dosa Evening',
        items: [
          { name: 'Plain Dosa', calories: 252, portion: 1.5 },
          { name: 'Sambar', calories: 120 },
        ],
        totalCalories: 372,
        macros: { protein: 10, carbs: 62, fat: 8 },
      },
    ],
    snack: [
      {
        name: 'Tea Time',
        items: [
          { name: 'Tea with Milk & Sugar', calories: 60 },
          { name: 'Banana', calories: 60 },
        ],
        totalCalories: 120,
        macros: { protein: 3, carbs: 24, fat: 2 },
      },
      {
        name: 'Light Snack',
        items: [
          { name: 'Buttermilk', calories: 120, portion: 2 },
        ],
        totalCalories: 120,
        macros: { protein: 6, carbs: 16, fat: 3 },
      },
      {
        name: 'Idli Snack',
        items: [
          { name: 'Idli', calories: 80, portion: 2 },
          { name: 'Coconut Chutney', calories: 20, portion: 1 },
        ],
        totalCalories: 100,
        macros: { protein: 3, carbs: 19, fat: 1 },
      },
      {
        name: 'Simple Tea',
        items: [
          { name: 'Masala Chai', calories: 65 },
          { name: 'Digestive biscuits', calories: 40 },
        ],
        totalCalories: 105,
        macros: { protein: 3, carbs: 19, fat: 2 },
      },
      {
        name: 'Coconut Water',
        items: [
          { name: 'Coconut Water', calories: 92, portion: 2 },
        ],
        totalCalories: 92,
        macros: { protein: 4, carbs: 18, fat: 1 },
      },
    ],
  },
  'Odia': {
    breakfast: [
      {
        name: 'Light Pakhala',
        items: [
          { name: 'Pakhala Bhata', calories: 160 },
          { name: 'Green Salad', calories: 25 },
          { name: 'Banana', calories: 105 },
        ],
        totalCalories: 290,
        macros: { protein: 6, carbs: 63, fat: 2 },
      },
      {
        name: 'Idli Breakfast',
        items: [
          { name: 'Idli', calories: 120, portion: 3 },
          { name: 'Dalma', calories: 90, portion: 0.5 },
          { name: 'Coconut Chutney', calories: 40, portion: 2 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 270,
        macros: { protein: 9, carbs: 49, fat: 4 },
      },
      {
        name: 'Dosa Morning',
        items: [
          { name: 'Plain Dosa', calories: 252, portion: 1.5 },
          { name: 'Sambar', calories: 60, portion: 0.5 },
        ],
        totalCalories: 312,
        macros: { protein: 8, carbs: 50, fat: 7 },
      },
      {
        name: 'Simple Bread',
        items: [
          { name: 'Bread Omelette', calories: 320 },
        ],
        totalCalories: 320,
        macros: { protein: 18, carbs: 28, fat: 15 },
      },
      {
        name: 'Upma Breakfast',
        items: [
          { name: 'Upma', calories: 220 },
          { name: 'Banana', calories: 60 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 300,
        macros: { protein: 7, carbs: 56, fat: 5 },
      },
    ],
    lunch: [
      {
        name: 'Dalma Thali',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Dalma', calories: 180 },
        ],
        totalCalories: 420,
        macros: { protein: 12, carbs: 76, fat: 4 },
      },
      {
        name: 'Fish Besara Meal',
        items: [
          { name: 'Steamed Rice', calories: 180, portion: 0.75 },
          { name: 'Machha Besara', calories: 130, portion: 0.5 },
          { name: 'Santula', calories: 100 },
        ],
        totalCalories: 410,
        macros: { protein: 19, carbs: 55, fat: 10 },
      },
      {
        name: 'Prawn Curry Meal',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Chingudi Jhola', calories: 120, portion: 0.5 },
          { name: 'Green Salad', calories: 25 },
          { name: 'Papad', calories: 35, portion: 0.5 },
        ],
        totalCalories: 420,
        macros: { protein: 18, carbs: 66, fat: 9 },
      },
      {
        name: 'Simple Dal Rice',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Dal Tadka', calories: 180 },
        ],
        totalCalories: 420,
        macros: { protein: 14, carbs: 77, fat: 6 },
      },
      {
        name: 'Dahi Baigana Meal',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Dahi Baigana', calories: 160 },
          { name: 'Papad', calories: 35, portion: 0.5 },
        ],
        totalCalories: 435,
        macros: { protein: 10, carbs: 67, fat: 11 },
      },
    ],
    dinner: [
      {
        name: 'Light Pakhala',
        items: [
          { name: 'Pakhala Bhata', calories: 240, portion: 1.5 },
          { name: 'Santula', calories: 100 },
        ],
        totalCalories: 340,
        macros: { protein: 7, carbs: 67, fat: 4 },
      },
      {
        name: 'Simple Dalma',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Dalma', calories: 180 },
        ],
        totalCalories: 342,
        macros: { protein: 12, carbs: 61, fat: 4 },
      },
      {
        name: 'Fish Light Dinner',
        items: [
          { name: 'Steamed Rice', calories: 120, portion: 0.5 },
          { name: 'Machha Besara', calories: 260 },
        ],
        totalCalories: 380,
        macros: { protein: 30, carbs: 38, fat: 15 },
      },
      {
        name: 'Dal-Rice Light',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Dal Tadka', calories: 180 },
        ],
        totalCalories: 342,
        macros: { protein: 13, carbs: 61, fat: 5 },
      },
      {
        name: 'Dahi Baigana Dinner',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Dahi Baigana', calories: 160 },
          { name: 'Buttermilk', calories: 60 },
        ],
        totalCalories: 382,
        macros: { protein: 9, carbs: 60, fat: 11 },
      },
    ],
    snack: [
      {
        name: 'Tea Break',
        items: [
          { name: 'Tea with Milk & Sugar', calories: 60 },
          { name: 'Banana', calories: 60 },
        ],
        totalCalories: 120,
        macros: { protein: 3, carbs: 24, fat: 2 },
      },
      {
        name: 'Simple Snack',
        items: [
          { name: 'Buttermilk', calories: 120, portion: 2 },
        ],
        totalCalories: 120,
        macros: { protein: 6, carbs: 16, fat: 3 },
      },
      {
        name: 'Light Tea',
        items: [
          { name: 'Tea without Sugar', calories: 20 },
          { name: 'Apple', calories: 95 },
        ],
        totalCalories: 115,
        macros: { protein: 1, carbs: 27, fat: 1 },
      },
      {
        name: 'Coconut Water',
        items: [
          { name: 'Coconut Water', calories: 92, portion: 2 },
        ],
        totalCalories: 92,
        macros: { protein: 4, carbs: 18, fat: 1 },
      },
      {
        name: 'Chai Time',
        items: [
          { name: 'Masala Chai', calories: 65 },
          { name: 'Digestive biscuits', calories: 40 },
        ],
        totalCalories: 105,
        macros: { protein: 3, carbs: 19, fat: 2 },
      },
    ],
  },
  'Rajasthani': {
    breakfast: [
      {
        name: 'Light Paratha',
        items: [
          { name: 'Paratha - Plain', calories: 230, portion: 1 },
          { name: 'Plain Curd', calories: 33, portion: 0.33 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 283,
        macros: { protein: 8, carbs: 39, fat: 11 },
      },
      {
        name: 'Bread & Egg',
        items: [
          { name: 'Boiled Egg', calories: 140 },
          { name: 'Bread', calories: 140, portion: 2 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 300,
        macros: { protein: 17, carbs: 30, fat: 11 },
      },
      {
        name: 'Poori Light',
        items: [
          { name: 'Poori', calories: 240, portion: 2 },
          { name: 'Aloo Curry', calories: 60, portion: 0.33 },
        ],
        totalCalories: 300,
        macros: { protein: 6, carbs: 42, fat: 13 },
      },
      {
        name: 'Chapati Breakfast',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Plain Curd', calories: 33, portion: 0.33 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 293,
        macros: { protein: 9, carbs: 50, fat: 5 },
      },
      {
        name: 'Simple Upma',
        items: [
          { name: 'Upma', calories: 220 },
          { name: 'Banana', calories: 60 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 300,
        macros: { protein: 7, carbs: 56, fat: 5 },
      },
    ],
    lunch: [
      {
        name: 'Gatte ki Sabzi Thali',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Gatte ki Sabzi', calories: 130, portion: 0.5 },
          { name: 'Raita', calories: 30, portion: 0.33 },
        ],
        totalCalories: 400,
        macros: { protein: 13, carbs: 60, fat: 12 },
      },
      {
        name: 'Ker Sangri Meal',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Ker Sangri', calories: 180 },
        ],
        totalCalories: 420,
        macros: { protein: 10, carbs: 58, fat: 15 },
      },
      {
        name: 'Dal-Rice Rajasthani',
        items: [
          { name: 'Steamed Rice', calories: 180, portion: 0.75 },
          { name: 'Dal Tadka', calories: 180 },
          { name: 'Papad', calories: 70, portion: 2 },
        ],
        totalCalories: 430,
        macros: { protein: 16, carbs: 73, fat: 8 },
      },
      {
        name: 'Simple Roti Meal',
        items: [
          { name: 'Chapati', calories: 360, portion: 3 },
          { name: 'Raita', calories: 90 },
        ],
        totalCalories: 450,
        macros: { protein: 15, carbs: 78, fat: 9 },
      },
      {
        name: 'Mixed Veg Meal',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Mix Veg Curry', calories: 160 },
          { name: 'Buttermilk', calories: 60 },
        ],
        totalCalories: 460,
        macros: { protein: 11, carbs: 70, fat: 12 },
      },
    ],
    dinner: [
      {
        name: 'Light Roti Dal',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Dal Tadka', calories: 90, portion: 0.5 },
          { name: 'Buttermilk', calories: 60 },
        ],
        totalCalories: 390,
        macros: { protein: 12, carbs: 66, fat: 7 },
      },
      {
        name: 'Gatte Light',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Gatte ki Sabzi', calories: 130, portion: 0.5 },
        ],
        totalCalories: 370,
        macros: { protein: 12, carbs: 54, fat: 12 },
      },
      {
        name: 'Simple Rice Meal',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Dal Tadka', calories: 180 },
        ],
        totalCalories: 342,
        macros: { protein: 13, carbs: 61, fat: 5 },
      },
      {
        name: 'Ker Sangri Dinner',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Ker Sangri', calories: 90, portion: 0.5 },
          { name: 'Raita', calories: 30, portion: 0.33 },
        ],
        totalCalories: 360,
        macros: { protein: 10, carbs: 52, fat: 11 },
      },
      {
        name: 'Light Khichdi',
        items: [
          { name: 'Dal Khichdi', calories: 315, portion: 1.5 },
          { name: 'Raita', calories: 30, portion: 0.33 },
        ],
        totalCalories: 345,
        macros: { protein: 13, carbs: 57, fat: 5 },
      },
    ],
    snack: [
      {
        name: 'Kachori Mini',
        items: [
          { name: 'Kachori', calories: 70, portion: 0.25 },
          { name: 'Tea with Milk & Sugar', calories: 60 },
        ],
        totalCalories: 130,
        macros: { protein: 4, carbs: 19, fat: 4.5 },
      },
      {
        name: 'Mirchi Vada',
        items: [
          { name: 'Mirchi Vada', calories: 90, portion: 0.5 },
        ],
        totalCalories: 90,
        macros: { protein: 2, carbs: 10, fat: 4.5 },
      },
      {
        name: 'Tea Break',
        items: [
          { name: 'Tea with Milk & Sugar', calories: 60 },
          { name: 'Digestive biscuits', calories: 40 },
        ],
        totalCalories: 100,
        macros: { protein: 3, carbs: 18, fat: 3 },
      },
      {
        name: 'Buttermilk Snack',
        items: [
          { name: 'Buttermilk', calories: 120, portion: 2 },
        ],
        totalCalories: 120,
        macros: { protein: 6, carbs: 16, fat: 3 },
      },
      {
        name: 'Fruit Break',
        items: [
          { name: 'Apple', calories: 95 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 115,
        macros: { protein: 1, carbs: 27, fat: 1 },
      },
    ],
  },
  'Bihari': {
    breakfast: [
      {
        name: 'Sattu Paratha',
        items: [
          { name: 'Sattu Paratha', calories: 260 },
          { name: 'Plain Curd', calories: 33, portion: 0.33 },
        ],
        totalCalories: 293,
        macros: { protein: 11, carbs: 44, fat: 10 },
      },
      {
        name: 'Light Litti',
        items: [
          { name: 'Litti Chokha', calories: 190, portion: 1 },
          { name: 'Chokha', calories: 40, portion: 0.2 },
          { name: 'Tea with Milk & Sugar', calories: 60 },
        ],
        totalCalories: 290,
        macros: { protein: 7, carbs: 45, fat: 8 },
      },
      {
        name: 'Simple Paratha',
        items: [
          { name: 'Paratha - Plain', calories: 230, portion: 1 },
          { name: 'Pickle', calories: 26 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 276,
        macros: { protein: 6, carbs: 33, fat: 12 },
      },
      {
        name: 'Bread Breakfast',
        items: [
          { name: 'Bread Omelette', calories: 320 },
        ],
        totalCalories: 320,
        macros: { protein: 18, carbs: 28, fat: 15 },
      },
      {
        name: 'Poori Morning',
        items: [
          { name: 'Poori', calories: 240, portion: 2 },
          { name: 'Aloo Curry', calories: 60, portion: 0.33 },
        ],
        totalCalories: 300,
        macros: { protein: 6, carbs: 42, fat: 13 },
      },
    ],
    lunch: [
      {
        name: 'Litti Chokha Meal',
        items: [
          { name: 'Litti Chokha', calories: 380 },
          { name: 'Onion Salad', calories: 20 },
        ],
        totalCalories: 400,
        macros: { protein: 10, carbs: 58, fat: 12 },
      },
      {
        name: 'Ghugni Thali',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Ghugni', calories: 220 },
        ],
        totalCalories: 460,
        macros: { protein: 16, carbs: 78, fat: 8 },
      },
      {
        name: 'Dal-Rice Simple',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Dal Tadka', calories: 180 },
        ],
        totalCalories: 420,
        macros: { protein: 14, carbs: 77, fat: 6 },
      },
      {
        name: 'Sattu Meal',
        items: [
          { name: 'Sattu Paratha', calories: 390, portion: 1.5 },
          { name: 'Raita', calories: 30, portion: 0.33 },
        ],
        totalCalories: 420,
        macros: { protein: 16, carbs: 60, fat: 14 },
      },
      {
        name: 'Mixed Meal',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Mix Veg Curry', calories: 160 },
          { name: 'Buttermilk', calories: 60 },
        ],
        totalCalories: 460,
        macros: { protein: 11, carbs: 70, fat: 12 },
      },
    ],
    dinner: [
      {
        name: 'Light Litti',
        items: [
          { name: 'Litti Chokha', calories: 380, portion: 2 },
        ],
        totalCalories: 380,
        macros: { protein: 10, carbs: 58, fat: 12 },
      },
      {
        name: 'Dal-Roti',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Dal Tadka', calories: 90, portion: 0.5 },
          { name: 'Green Salad', calories: 25 },
        ],
        totalCalories: 355,
        macros: { protein: 11, carbs: 62, fat: 6 },
      },
      {
        name: 'Sattu Dinner',
        items: [
          { name: 'Sattu Paratha', calories: 260 },
          { name: 'Plain Curd', calories: 98 },
        ],
        totalCalories: 358,
        macros: { protein: 16, carbs: 50, fat: 11 },
      },
      {
        name: 'Simple Rice Meal',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Ghugni', calories: 110, portion: 0.5 },
          { name: 'Raita', calories: 90 },
        ],
        totalCalories: 362,
        macros: { protein: 13, carbs: 59, fat: 7 },
      },
      {
        name: 'Light Khichdi',
        items: [
          { name: 'Dal Khichdi', calories: 315, portion: 1.5 },
          { name: 'Raita', calories: 30, portion: 0.33 },
        ],
        totalCalories: 345,
        macros: { protein: 13, carbs: 57, fat: 5 },
      },
    ],
    snack: [
      {
        name: 'Tea Break',
        items: [
          { name: 'Tea with Milk & Sugar', calories: 60 },
          { name: 'Banana', calories: 60 },
        ],
        totalCalories: 120,
        macros: { protein: 3, carbs: 24, fat: 2 },
      },
      {
        name: 'Light Snack',
        items: [
          { name: 'Buttermilk', calories: 120, portion: 2 },
        ],
        totalCalories: 120,
        macros: { protein: 6, carbs: 16, fat: 3 },
      },
      {
        name: 'Samosa Mini',
        items: [
          { name: 'Samosa', calories: 77, portion: 0.25 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 97,
        macros: { protein: 2, carbs: 11, fat: 4 },
      },
      {
        name: 'Simple Tea',
        items: [
          { name: 'Masala Chai', calories: 65 },
          { name: 'Digestive biscuits', calories: 40 },
        ],
        totalCalories: 105,
        macros: { protein: 3, carbs: 19, fat: 2 },
      },
      {
        name: 'Fruit Break',
        items: [
          { name: 'Apple', calories: 95 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 115,
        macros: { protein: 1, carbs: 27, fat: 1 },
      },
    ],
  },
  'North-Eastern': {
    breakfast: [
      {
        name: 'Momos Breakfast',
        items: [
          { name: 'Momos (Veg)', calories: 192, portion: 4 },
          { name: 'Tea with Milk & Sugar', calories: 60 },
          { name: 'Banana', calories: 60 },
        ],
        totalCalories: 312,
        macros: { protein: 8, carbs: 54, fat: 7 },
      },
      {
        name: 'Thukpa Light',
        items: [
          { name: 'Thukpa', calories: 320 },
        ],
        totalCalories: 320,
        macros: { protein: 14, carbs: 48, fat: 8 },
      },
      {
        name: 'Simple Bread',
        items: [
          { name: 'Bread Omelette', calories: 320 },
        ],
        totalCalories: 320,
        macros: { protein: 18, carbs: 28, fat: 15 },
      },
      {
        name: 'Rice Breakfast',
        items: [
          { name: 'Jadoh', calories: 255, portion: 0.75 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 275,
        macros: { protein: 9, carbs: 39, fat: 7.5 },
      },
      {
        name: 'Light Momos',
        items: [
          { name: 'Momos (Veg)', calories: 240, portion: 5 },
          { name: 'Tea with Milk & Sugar', calories: 60 },
        ],
        totalCalories: 300,
        macros: { protein: 9, carbs: 48, fat: 7 },
      },
    ],
    lunch: [
      {
        name: 'Momos Meal',
        items: [
          { name: 'Momos (Chicken)', calories: 280, portion: 5 },
          { name: 'Thukpa', calories: 160, portion: 0.5 },
        ],
        totalCalories: 440,
        macros: { protein: 23, carbs: 60, fat: 10 },
      },
      {
        name: 'Thukpa Complete',
        items: [
          { name: 'Thukpa', calories: 480, portion: 1.5 },
        ],
        totalCalories: 480,
        macros: { protein: 21, carbs: 72, fat: 12 },
      },
      {
        name: 'Jadoh Meal',
        items: [
          { name: 'Jadoh', calories: 340 },
          { name: 'Green Salad', calories: 25 },
          { name: 'Raita', calories: 90 },
        ],
        totalCalories: 455,
        macros: { protein: 15, carbs: 64, fat: 13 },
      },
      {
        name: 'Fish Tenga Meal',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Fish Tenga', calories: 220 },
        ],
        totalCalories: 460,
        macros: { protein: 28, carbs: 63, fat: 10.5 },
      },
      {
        name: 'Mixed Momos',
        items: [
          { name: 'Momos (Chicken)', calories: 224, portion: 4 },
          { name: 'Momos (Veg)', calories: 144, portion: 3 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 388,
        macros: { protein: 18, carbs: 57, fat: 8 },
      },
    ],
    dinner: [
      {
        name: 'Light Momos',
        items: [
          { name: 'Momos (Veg)', calories: 240, portion: 5 },
          { name: 'Green Salad', calories: 25 },
          { name: 'Raita', calories: 90 },
        ],
        totalCalories: 355,
        macros: { protein: 11, carbs: 54, fat: 10 },
      },
      {
        name: 'Thukpa Dinner',
        items: [
          { name: 'Thukpa', calories: 320 },
          { name: 'Green Salad', calories: 25 },
        ],
        totalCalories: 345,
        macros: { protein: 14, carbs: 53, fat: 8 },
      },
      {
        name: 'Rice Light Meal',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Fish Tenga', calories: 110, portion: 0.5 },
          { name: 'Raita', calories: 90 },
        ],
        totalCalories: 362,
        macros: { protein: 17, carbs: 50, fat: 10 },
      },
      {
        name: 'Jadoh Dinner',
        items: [
          { name: 'Jadoh', calories: 340 },
        ],
        totalCalories: 340,
        macros: { protein: 12, carbs: 52, fat: 10 },
      },
      {
        name: 'Simple Momos',
        items: [
          { name: 'Momos (Chicken)', calories: 224, portion: 4 },
          { name: 'Green Salad', calories: 25 },
          { name: 'Buttermilk', calories: 120, portion: 2 },
        ],
        totalCalories: 369,
        macros: { protein: 22, carbs: 44, fat: 11 },
      },
    ],
    snack: [
      {
        name: 'Momos Snack',
        items: [
          { name: 'Momos (Veg)', calories: 96, portion: 2 },
        ],
        totalCalories: 96,
        macros: { protein: 3, carbs: 15, fat: 2.4 },
      },
      {
        name: 'Tea Break',
        items: [
          { name: 'Tea with Milk & Sugar', calories: 60 },
          { name: 'Banana', calories: 60 },
        ],
        totalCalories: 120,
        macros: { protein: 3, carbs: 24, fat: 2 },
      },
      {
        name: 'Light Tea',
        items: [
          { name: 'Masala Chai', calories: 65 },
          { name: 'Digestive biscuits', calories: 40 },
        ],
        totalCalories: 105,
        macros: { protein: 3, carbs: 19, fat: 2 },
      },
      {
        name: 'Simple Snack',
        items: [
          { name: 'Tea without Sugar', calories: 20 },
          { name: 'Apple', calories: 95 },
        ],
        totalCalories: 115,
        macros: { protein: 1, carbs: 27, fat: 1 },
      },
      {
        name: 'Buttermilk Break',
        items: [
          { name: 'Buttermilk', calories: 120, portion: 2 },
        ],
        totalCalories: 120,
        macros: { protein: 6, carbs: 16, fat: 3 },
      },
    ],
  },
  'Kashmiri': {
    breakfast: [
      {
        name: 'Simple Roti',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Plain Curd', calories: 33, portion: 0.33 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 293,
        macros: { protein: 9, carbs: 50, fat: 5 },
      },
      {
        name: 'Bread & Egg',
        items: [
          { name: 'Boiled Egg', calories: 140 },
          { name: 'Bread', calories: 140, portion: 2 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 300,
        macros: { protein: 17, carbs: 30, fat: 11 },
      },
      {
        name: 'Light Paratha',
        items: [
          { name: 'Paratha - Plain', calories: 230, portion: 1 },
          { name: 'Raita', calories: 30, portion: 0.33 },
          { name: 'Tea with Milk & Sugar', calories: 60 },
        ],
        totalCalories: 320,
        macros: { protein: 8, carbs: 41, fat: 13 },
      },
      {
        name: 'Poori Morning',
        items: [
          { name: 'Poori', calories: 240, portion: 2 },
          { name: 'Aloo Curry', calories: 60, portion: 0.33 },
        ],
        totalCalories: 300,
        macros: { protein: 6, carbs: 42, fat: 13 },
      },
      {
        name: 'Simple Upma',
        items: [
          { name: 'Upma', calories: 220 },
          { name: 'Banana', calories: 60 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 300,
        macros: { protein: 7, carbs: 56, fat: 5 },
      },
    ],
    lunch: [
      {
        name: 'Rogan Josh Meal',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Rogan Josh', calories: 240, portion: 0.5 },
        ],
        totalCalories: 402,
        macros: { protein: 18, carbs: 41, fat: 19 },
      },
      {
        name: 'Yakhni Rice',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Yakhni', calories: 320 },
        ],
        totalCalories: 482,
        macros: { protein: 30, carbs: 47, fat: 21 },
      },
      {
        name: 'Dum Aloo Meal',
        items: [
          { name: 'Steamed Rice', calories: 180, portion: 0.75 },
          { name: 'Dum Aloo Kashmiri', calories: 280 },
        ],
        totalCalories: 460,
        macros: { protein: 8, carbs: 72, fat: 15 },
      },
      {
        name: 'Nadru Yakhni Thali',
        items: [
          { name: 'Steamed Rice', calories: 240, portion: 1 },
          { name: 'Nadru Yakhni', calories: 180 },
        ],
        totalCalories: 420,
        macros: { protein: 8, carbs: 77, fat: 9 },
      },
      {
        name: 'Simple Roti Meal',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Rogan Josh', calories: 240, portion: 0.5 },
        ],
        totalCalories: 480,
        macros: { protein: 18, carbs: 48, fat: 20 },
      },
    ],
    dinner: [
      {
        name: 'Light Dum Aloo',
        items: [
          { name: 'Steamed Rice', calories: 120, portion: 0.5 },
          { name: 'Dum Aloo Kashmiri', calories: 280 },
        ],
        totalCalories: 400,
        macros: { protein: 6, carbs: 62, fat: 15 },
      },
      {
        name: 'Simple Rice Meal',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Nadru Yakhni', calories: 180 },
        ],
        totalCalories: 342,
        macros: { protein: 8, carbs: 61, fat: 9 },
      },
      {
        name: 'Light Yakhni',
        items: [
          { name: 'Steamed Rice', calories: 120, portion: 0.5 },
          { name: 'Yakhni', calories: 320 },
        ],
        totalCalories: 440,
        macros: { protein: 28, carbs: 37, fat: 21 },
      },
      {
        name: 'Roti Dinner',
        items: [
          { name: 'Chapati', calories: 240, portion: 2 },
          { name: 'Dum Aloo Kashmiri', calories: 140, portion: 0.5 },
        ],
        totalCalories: 380,
        macros: { protein: 7, carbs: 50, fat: 16 },
      },
      {
        name: 'Light Dal',
        items: [
          { name: 'Steamed Rice', calories: 162, portion: 0.67 },
          { name: 'Dal Tadka', calories: 180 },
        ],
        totalCalories: 342,
        macros: { protein: 13, carbs: 61, fat: 5 },
      },
    ],
    snack: [
      {
        name: 'Tea Break',
        items: [
          { name: 'Tea with Milk & Sugar', calories: 60 },
          { name: 'Banana', calories: 60 },
        ],
        totalCalories: 120,
        macros: { protein: 3, carbs: 24, fat: 2 },
      },
      {
        name: 'Simple Tea',
        items: [
          { name: 'Masala Chai', calories: 65 },
          { name: 'Digestive biscuits', calories: 40 },
        ],
        totalCalories: 105,
        macros: { protein: 3, carbs: 19, fat: 2 },
      },
      {
        name: 'Light Snack',
        items: [
          { name: 'Buttermilk', calories: 120, portion: 2 },
        ],
        totalCalories: 120,
        macros: { protein: 6, carbs: 16, fat: 3 },
      },
      {
        name: 'Fruit Break',
        items: [
          { name: 'Apple', calories: 95 },
          { name: 'Tea without Sugar', calories: 20 },
        ],
        totalCalories: 115,
        macros: { protein: 1, carbs: 27, fat: 1 },
      },
      {
        name: 'Simple Chai',
        items: [
          { name: 'Tea with Milk & Sugar', calories: 60 },
        ],
        totalCalories: 60,
        macros: { protein: 2, carbs: 10, fat: 2 },
      },
    ],
  },
  'Snacks': {
    snack: [
      {
        name: 'Pani Puri',
        items: [
          { name: 'Pani Puri', calories: 120, portion: 0.5 },
        ],
        totalCalories: 120,
        macros: { protein: 3, carbs: 23, fat: 2.5 },
      },
      {
        name: 'Bhel Puri',
        items: [
          { name: 'Bhel Puri', calories: 110, portion: 0.5 },
        ],
        totalCalories: 110,
        macros: { protein: 2.5, carbs: 18, fat: 3.5 },
      },
      {
        name: 'Samosa',
        items: [
          { name: 'Samosa', calories: 154, portion: 0.5 },
        ],
        totalCalories: 154,
        macros: { protein: 3, carbs: 19, fat: 7.5 },
      },
      {
        name: 'Pakora',
        items: [
          { name: 'Pakora', calories: 120, portion: 0.5 },
        ],
        totalCalories: 120,
        macros: { protein: 3, carbs: 14, fat: 6 },
      },
      {
        name: 'Aloo Tikki',
        items: [
          { name: 'Aloo Tikki', calories: 110, portion: 0.5 },
        ],
        totalCalories: 110,
        macros: { protein: 2, carbs: 16, fat: 4.5 },
      },
    ],
  },
};

// Get meal combinations for a specific cuisine and meal type
export function getMealCombinations(
  cuisine: string,
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  dietaryType: 'veg' | 'non-veg' | 'both' = 'both'
): MealCombination[] {
  const cuisineCombos = MEAL_COMBINATIONS[cuisine];
  if (!cuisineCombos) {
    return [];
  }

  const mealCombos = cuisineCombos[mealType];
  if (!mealCombos) {
    return [];
  }

  // Convert to MealCombination format
  return mealCombos.map(combo => {
    const items: Array<{ food: FoodItem; portion: number; calories: number }> = [];
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (const item of combo.items) {
      // Try finding food with cuisine first, then without
      let food = findFoodByName(item.name, cuisine);
      if (!food) {
        food = findFoodByName(item.name);
      }

      if (food) {
        // Check dietary type filter (allow eggetarian for veg)
        const dietaryMatch = dietaryType === 'both' || 
                            food.dietaryType === dietaryType || 
                            (dietaryType === 'veg' && food.dietaryType === 'eggetarian');
        
        if (!dietaryMatch) {
          continue;
        }

        const portion = item.portion || parsePortion(item.name) || 1;
        const itemCalories = item.calories || (food.calories * portion);
        
        items.push({
          food,
          portion,
          calories: itemCalories,
        });

        totalProtein += food.protein * portion;
        totalCarbs += food.carbs * portion;
        totalFat += food.fat * portion;
      } else {
        // Debug: Log when food is not found
        console.warn(`Food not found: "${item.name}" for cuisine: ${cuisine}`);
      }
    }

    return {
      name: combo.name,
      items,
      totalCalories: combo.totalCalories,
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFat: Math.round(totalFat),
      mealType,
      description: combo.name,
    };
  }).filter(combo => combo.items.length > 0); // Only return combinations with valid items
}

// Get meal plan for all selected cuisines and meal types
export function getMealPlan(
  _targetCalories: number,
  selectedCuisines: string[],
  dietaryType: 'veg' | 'non-veg' | 'both',
  selectedMealTypes: string[]
): Record<string, MealCombination[]> {
  const mealPlan: Record<string, MealCombination[]> = {};

  // Map meal type names to internal format
  const mealTypeMap: Record<string, 'breakfast' | 'lunch' | 'dinner' | 'snack'> = {
    'Breakfast': 'breakfast',
    'Mid-Morning Snack': 'snack',
    'Lunch': 'lunch',
    'Evening Snack': 'snack',
    'Dinner': 'dinner',
    'Late Night Snack': 'snack',
  };

  for (const mealType of selectedMealTypes) {
    const internalMealType = mealTypeMap[mealType] || mealType.toLowerCase() as 'breakfast' | 'lunch' | 'dinner' | 'snack';
    
    if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(internalMealType)) {
      continue;
    }

    const selectedMeals: MealCombination[] = [];
    const targetMealCount = 5;

    // Cycle through cuisines, picking 1 meal from each until we have 5 meals
    if (selectedCuisines.length > 0) {
      let cuisineIndex = 0;
      let attempts = 0;
      const maxAttempts = selectedCuisines.length * 10; // Prevent infinite loops

      while (selectedMeals.length < targetMealCount && attempts < maxAttempts) {
        const cuisine = selectedCuisines[cuisineIndex % selectedCuisines.length];
        
        // Get combinations for this cuisine
        let combinations = getMealCombinations(cuisine, internalMealType, dietaryType);
        
        // If no combinations found, try with 'both' dietary type as fallback
        if (combinations.length === 0 && dietaryType !== 'both') {
          combinations = getMealCombinations(cuisine, internalMealType, 'both');
        }

        // Pick the first available meal from this cuisine that we haven't used yet
        if (combinations.length > 0) {
          // Find a meal that hasn't been selected yet (by name/description)
          const existingMealNames = new Set(selectedMeals.map(m => m.description || m.name));
          const availableMeal = combinations.find(combo => 
            !existingMealNames.has(combo.description || combo.name)
          ) || combinations[0]; // If all are used, just pick the first one
          
          selectedMeals.push(availableMeal);
        }

        cuisineIndex++;
        attempts++;
      }
    }

    // Return the selected meals (up to 5)
    mealPlan[internalMealType] = selectedMeals.slice(0, targetMealCount);
  }

  return mealPlan;
}
