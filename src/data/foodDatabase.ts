export interface FoodItem {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  cuisine: string;
  dietaryType: 'veg' | 'non-veg' | 'eggetarian';
  suitableMealTypes: ('breakfast' | 'lunch' | 'dinner' | 'snack')[];
  category: 'bread' | 'rice' | 'curry' | 'snack' | 'beverage' | 'dessert' | 'side' | 'protein' | 'other';
  servingSize: string;
  emoji?: string;
}

export const foodDatabase: FoodItem[] = [
  // North Indian - Breads
  { id: 1, name: 'Chapati/Roti', calories: 120, protein: 3, carbs: 24, fat: 2, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'bread', servingSize: '1 medium (40g)', emoji: '🫓' },
  { id: 2, name: 'Phulka', calories: 90, protein: 2, carbs: 18, fat: 1.5, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'bread', servingSize: '1 small (30g)', emoji: '🫓' },
  { id: 3, name: 'Tandoori Roti', calories: 140, protein: 4, carbs: 28, fat: 2, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'bread', servingSize: '1 medium (50g)', emoji: '🫓' },
  { id: 4, name: 'Butter Naan', calories: 310, protein: 7, carbs: 45, fat: 11, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'bread', servingSize: '1 medium (90g)', emoji: '🧈' },
  { id: 5, name: 'Plain Naan', calories: 260, protein: 6, carbs: 42, fat: 6, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'bread', servingSize: '1 medium (80g)', emoji: '🥖' },
  { id: 6, name: 'Garlic Naan', calories: 330, protein: 7, carbs: 46, fat: 13, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'bread', servingSize: '1 medium (90g)', emoji: '🧄' },
  { id: 7, name: 'Paratha - Plain', calories: 230, protein: 5, carbs: 30, fat: 10, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'lunch'], category: 'bread', servingSize: '1 medium (60g)', emoji: '🫓' },
  { id: 8, name: 'Aloo Paratha', calories: 290, protein: 6, carbs: 40, fat: 12, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'lunch'], category: 'bread', servingSize: '1 medium (100g)', emoji: '🥔' },
  { id: 9, name: 'Paneer Paratha', calories: 340, protein: 12, carbs: 38, fat: 15, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'lunch'], category: 'bread', servingSize: '1 medium (110g)', emoji: '🧀' },
  { id: 10, name: 'Methi Paratha', calories: 250, protein: 6, carbs: 32, fat: 11, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'lunch'], category: 'bread', servingSize: '1 medium (90g)', emoji: '🌿' },
  { id: 11, name: 'Kulcha', calories: 240, protein: 6, carbs: 40, fat: 6, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'bread', servingSize: '1 medium (80g)', emoji: '🫓' },
  { id: 12, name: 'Bhatura', calories: 390, protein: 7, carbs: 47, fat: 19, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'lunch'], category: 'bread', servingSize: '1 large (100g)', emoji: '🫓' },

  // North Indian - Rice Dishes
  { id: 13, name: 'Steamed Rice', calories: 240, protein: 4, carbs: 53, fat: 0.5, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 cup (200g)', emoji: '🍚' },
  { id: 14, name: 'Jeera Rice', calories: 280, protein: 5, carbs: 54, fat: 5, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 cup (220g)', emoji: '🍚' },
  { id: 15, name: 'Vegetable Pulao', calories: 320, protein: 6, carbs: 56, fat: 8, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 cup (250g)', emoji: '🍚' },
  { id: 16, name: 'Chicken Biryani', calories: 450, protein: 20, carbs: 58, fat: 15, cuisine: 'North Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 cup (300g)', emoji: '🍛' },
  { id: 17, name: 'Vegetable Biryani', calories: 360, protein: 8, carbs: 60, fat: 10, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 cup (280g)', emoji: '🍛' },
  { id: 18, name: 'Mutton Biryani', calories: 520, protein: 22, carbs: 56, fat: 22, cuisine: 'North Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 cup (300g)', emoji: '🍛' },
  { id: 19, name: 'Egg Biryani', calories: 380, protein: 14, carbs: 58, fat: 11, cuisine: 'North Indian', dietaryType: 'eggetarian', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 cup (280g)', emoji: '🍛' },
  { id: 20, name: 'Dal Khichdi', calories: 210, protein: 8, carbs: 38, fat: 3, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 cup (250g)', emoji: '🍚' },

  // North Indian - Vegetarian Curries
  { id: 21, name: 'Dal Tadka', calories: 180, protein: 10, carbs: 28, fat: 4, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🥘' },
  { id: 22, name: 'Dal Makhani', calories: 280, protein: 12, carbs: 30, fat: 12, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍛' },
  { id: 23, name: 'Chana Masala', calories: 240, protein: 12, carbs: 35, fat: 6, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🫘' },
  { id: 24, name: 'Rajma Masala', calories: 250, protein: 13, carbs: 38, fat: 5, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🫘' },
  { id: 25, name: 'Paneer Butter Masala', calories: 420, protein: 16, carbs: 18, fat: 32, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🧈' },
  { id: 26, name: 'Palak Paneer', calories: 280, protein: 14, carbs: 12, fat: 20, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🥬' },
  { id: 27, name: 'Shahi Paneer', calories: 380, protein: 15, carbs: 16, fat: 28, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🧀' },
  { id: 28, name: 'Kadai Paneer', calories: 320, protein: 14, carbs: 14, fat: 24, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍲' },
  { id: 29, name: 'Matar Paneer', calories: 300, protein: 13, carbs: 18, fat: 20, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🧀' },
  { id: 30, name: 'Malai Kofta', calories: 450, protein: 10, carbs: 28, fat: 32, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '2 koftas + gravy (200g)', emoji: '🍲' },
  { id: 31, name: 'Aloo Gobi', calories: 180, protein: 4, carbs: 28, fat: 6, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🥔' },
  { id: 32, name: 'Baingan Bharta', calories: 160, protein: 3, carbs: 18, fat: 9, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍆' },
  { id: 33, name: 'Bhindi Masala', calories: 140, protein: 3, carbs: 16, fat: 7, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (150g)', emoji: '🥗' },
  { id: 34, name: 'Mix Veg Curry', calories: 160, protein: 5, carbs: 22, fat: 6, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🥗' },

  // North Indian - Non-Vegetarian Curries
  { id: 35, name: 'Butter Chicken', calories: 490, protein: 28, carbs: 12, fat: 36, cuisine: 'North Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍗' },
  { id: 36, name: 'Chicken Tikka Masala', calories: 420, protein: 30, carbs: 14, fat: 28, cuisine: 'North Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍗' },
  { id: 37, name: 'Chicken Curry', calories: 320, protein: 26, carbs: 10, fat: 20, cuisine: 'North Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍗' },
  { id: 38, name: 'Kadai Chicken', calories: 350, protein: 28, carbs: 12, fat: 22, cuisine: 'North Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍗' },
  { id: 39, name: 'Chicken Korma', calories: 450, protein: 26, carbs: 14, fat: 32, cuisine: 'North Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍗' },
  { id: 40, name: 'Mutton Rogan Josh', calories: 480, protein: 24, carbs: 12, fat: 36, cuisine: 'North Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍖' },
  { id: 41, name: 'Mutton Curry', calories: 420, protein: 22, carbs: 10, fat: 32, cuisine: 'North Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍖' },
  { id: 42, name: 'Keema', calories: 380, protein: 20, carbs: 8, fat: 28, cuisine: 'North Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (150g)', emoji: '🍖' },
  { id: 43, name: 'Fish Curry', calories: 260, protein: 24, carbs: 10, fat: 14, cuisine: 'North Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🐟' },
  { id: 44, name: 'Egg Curry', calories: 280, protein: 16, carbs: 10, fat: 20, cuisine: 'North Indian', dietaryType: 'eggetarian', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '2 eggs + gravy (200g)', emoji: '🍳' },

  // North Indian - Tandoori & Grilled
  { id: 45, name: 'Chicken Tandoori', calories: 260, protein: 32, carbs: 4, fat: 12, cuisine: 'North Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'protein', servingSize: '2 pieces (150g)', emoji: '🍖' },
  { id: 46, name: 'Chicken Tikka', calories: 220, protein: 28, carbs: 3, fat: 10, cuisine: 'North Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'protein', servingSize: '5 pieces (120g)', emoji: '🍖' },
  { id: 47, name: 'Paneer Tikka', calories: 310, protein: 14, carbs: 8, fat: 24, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'protein', servingSize: '5 pieces (120g)', emoji: '🧀' },
  { id: 48, name: 'Seekh Kebab', calories: 280, protein: 18, carbs: 6, fat: 20, cuisine: 'North Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'protein', servingSize: '2 pieces (100g)', emoji: '🍖' },

  // South Indian - Breakfast
  { id: 49, name: 'Idli', calories: 80, protein: 2, carbs: 17, fat: 0.5, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast'], category: 'bread', servingSize: '2 pieces (100g)', emoji: '🫓' },
  { id: 50, name: 'Medu Vada', calories: 220, protein: 6, carbs: 24, fat: 11, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'snack', servingSize: '2 pieces (80g)', emoji: '🍩' },
  { id: 51, name: 'Plain Dosa', calories: 168, protein: 4, carbs: 28, fat: 4, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'dinner'], category: 'bread', servingSize: '1 medium (120g)', emoji: '🥞' },
  { id: 52, name: 'Masala Dosa', calories: 380, protein: 8, carbs: 60, fat: 12, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'dinner'], category: 'bread', servingSize: '1 large (250g)', emoji: '🥞' },
  { id: 53, name: 'Rava Dosa', calories: 240, protein: 5, carbs: 38, fat: 7, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'dinner'], category: 'bread', servingSize: '1 medium (150g)', emoji: '🥞' },
  { id: 54, name: 'Onion Dosa', calories: 200, protein: 5, carbs: 32, fat: 6, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'dinner'], category: 'bread', servingSize: '1 medium (140g)', emoji: '🥞' },
  { id: 55, name: 'Uttapam', calories: 210, protein: 6, carbs: 36, fat: 5, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'dinner'], category: 'bread', servingSize: '1 medium (150g)', emoji: '🥞' },
  { id: 56, name: 'Pesarattu', calories: 180, protein: 8, carbs: 28, fat: 4, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast'], category: 'bread', servingSize: '1 medium (130g)', emoji: '🥞' },
  { id: 57, name: 'Appam', calories: 120, protein: 2, carbs: 24, fat: 2, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast'], category: 'bread', servingSize: '2 pieces (100g)', emoji: '🥞' },
  { id: 58, name: 'Puttu', calories: 140, protein: 3, carbs: 30, fat: 1, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast'], category: 'other', servingSize: '1 cup (150g)', emoji: '🍚' },
  { id: 59, name: 'Upma', calories: 220, protein: 6, carbs: 38, fat: 5, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast'], category: 'other', servingSize: '1 bowl (200g)', emoji: '🍲' },
  { id: 60, name: 'Pongal', calories: 260, protein: 8, carbs: 42, fat: 7, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast'], category: 'rice', servingSize: '1 bowl (200g)', emoji: '🍚' },

  // South Indian - Rice Dishes
  { id: 61, name: 'Sambar Rice', calories: 240, protein: 6, carbs: 46, fat: 4, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 bowl (250g)', emoji: '🍚' },
  { id: 62, name: 'Curd Rice', calories: 180, protein: 6, carbs: 34, fat: 3, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 bowl (250g)', emoji: '🍚' },
  { id: 63, name: 'Lemon Rice', calories: 280, protein: 5, carbs: 52, fat: 6, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 bowl (200g)', emoji: '🍋' },
  { id: 64, name: 'Coconut Rice', calories: 320, protein: 5, carbs: 50, fat: 11, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 bowl (200g)', emoji: '🍚' },
  { id: 65, name: 'Tamarind Rice', calories: 290, protein: 5, carbs: 54, fat: 6, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 bowl (200g)', emoji: '🍚' },
  { id: 66, name: 'Bisi Bele Bath', calories: 310, protein: 8, carbs: 55, fat: 7, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 bowl (250g)', emoji: '🍚' },
  { id: 67, name: 'Vangi Bath', calories: 270, protein: 6, carbs: 48, fat: 6, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 bowl (200g)', emoji: '🍚' },

  // South Indian - Curries & Sides
  { id: 68, name: 'Sambar', calories: 120, protein: 6, carbs: 20, fat: 2, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍲' },
  { id: 69, name: 'Rasam', calories: 50, protein: 2, carbs: 10, fat: 1, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍲' },
  { id: 70, name: 'Avial', calories: 160, protein: 4, carbs: 18, fat: 8, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (150g)', emoji: '🥗' },
  { id: 71, name: 'Kootu', calories: 140, protein: 6, carbs: 22, fat: 3, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (150g)', emoji: '🥗' },
  { id: 72, name: 'Thoran', calories: 90, protein: 3, carbs: 12, fat: 4, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (100g)', emoji: '🥗' },
  { id: 73, name: 'Poriyal', calories: 80, protein: 2, carbs: 10, fat: 4, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (100g)', emoji: '🥗' },
  { id: 74, name: 'Chettinad Chicken Curry', calories: 380, protein: 28, carbs: 12, fat: 25, cuisine: 'South Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍗' },
  { id: 75, name: 'Fish Curry (Kerala style)', calories: 280, protein: 26, carbs: 8, fat: 16, cuisine: 'South Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🐟' },
  { id: 76, name: 'Prawn Curry', calories: 240, protein: 24, carbs: 10, fat: 12, cuisine: 'South Indian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🦐' },
  { id: 77, name: 'Coconut Chutney', calories: 40, protein: 1, carbs: 4, fat: 3, cuisine: 'South Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast'], category: 'side', servingSize: '2 tbsp (30g)', emoji: '🥥' },

  // Bengali Cuisine
  { id: 78, name: 'Luchi', calories: 240, protein: 4, carbs: 30, fat: 11, cuisine: 'Bengali', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'lunch'], category: 'bread', servingSize: '2 pieces (60g)', emoji: '🫓' },
  { id: 79, name: 'Alur Dom', calories: 180, protein: 3, carbs: 26, fat: 7, cuisine: 'Bengali', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (150g)', emoji: '🥔' },
  { id: 80, name: 'Cholar Dal', calories: 220, protein: 10, carbs: 32, fat: 6, cuisine: 'Bengali', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🫘' },
  { id: 81, name: 'Shukto', calories: 160, protein: 4, carbs: 18, fat: 8, cuisine: 'Bengali', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🥗' },
  { id: 82, name: 'Macher Jhol', calories: 240, protein: 24, carbs: 8, fat: 13, cuisine: 'Bengali', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🐟' },
  { id: 83, name: 'Doi Maach', calories: 280, protein: 26, carbs: 10, fat: 16, cuisine: 'Bengali', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🐟' },
  { id: 84, name: 'Kosha Mangsho', calories: 460, protein: 24, carbs: 12, fat: 34, cuisine: 'Bengali', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍖' },
  { id: 85, name: 'Chingri Malai Curry', calories: 320, protein: 22, carbs: 12, fat: 21, cuisine: 'Bengali', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🦐' },
  { id: 86, name: 'Begun Bhaja', calories: 140, protein: 2, carbs: 14, fat: 9, cuisine: 'Bengali', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '100g', emoji: '🍆' },
  { id: 87, name: 'Aloo Posto', calories: 220, protein: 5, carbs: 24, fat: 12, cuisine: 'Bengali', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (150g)', emoji: '🥔' },
  { id: 88, name: 'Mishti Doi', calories: 180, protein: 6, carbs: 28, fat: 5, cuisine: 'Bengali', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'dessert', servingSize: '1 bowl (150g)', emoji: '🥛' },
  { id: 89, name: 'Rasgulla', calories: 186, protein: 4, carbs: 40, fat: 1, cuisine: 'Bengali', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'dessert', servingSize: '2 pieces (100g)', emoji: '🍡' },

  // Gujarati Cuisine
  { id: 90, name: 'Thepla', calories: 200, protein: 5, carbs: 30, fat: 7, cuisine: 'Gujarati', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'lunch'], category: 'bread', servingSize: '2 pieces (80g)', emoji: '🫓' },
  { id: 91, name: 'Dhokla', calories: 160, protein: 5, carbs: 28, fat: 3, cuisine: 'Gujarati', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'snack', servingSize: '4 pieces (120g)', emoji: '🍰' },
  { id: 92, name: 'Khandvi', calories: 140, protein: 6, carbs: 18, fat: 5, cuisine: 'Gujarati', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'snack', servingSize: '6 rolls (100g)', emoji: '🍰' },
  { id: 93, name: 'Undhiyu', calories: 220, protein: 6, carbs: 32, fat: 8, cuisine: 'Gujarati', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🥗' },
  { id: 94, name: 'Gujarati Dal', calories: 160, protein: 8, carbs: 22, fat: 4, cuisine: 'Gujarati', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🥘' },
  { id: 95, name: 'Kadhi', calories: 180, protein: 6, carbs: 16, fat: 10, cuisine: 'Gujarati', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍲' },
  { id: 96, name: 'Dal Dhokli', calories: 280, protein: 10, carbs: 42, fat: 8, cuisine: 'Gujarati', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (250g)', emoji: '🍲' },
  { id: 97, name: 'Handvo', calories: 190, protein: 5, carbs: 26, fat: 7, cuisine: 'Gujarati', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'bread', servingSize: '1 piece (100g)', emoji: '🫓' },
  { id: 98, name: 'Fafda', calories: 320, protein: 8, carbs: 36, fat: 16, cuisine: 'Gujarati', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'snack', servingSize: '4 pieces (80g)', emoji: '🥨' },
  { id: 99, name: 'Sev Tameta', calories: 160, protein: 3, carbs: 20, fat: 8, cuisine: 'Gujarati', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (150g)', emoji: '🍅' },
  { id: 100, name: 'Ringan Bateta', calories: 140, protein: 3, carbs: 22, fat: 5, cuisine: 'Gujarati', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (150g)', emoji: '🍆' },

  // Maharashtrian Cuisine
  { id: 101, name: 'Poha', calories: 250, protein: 5, carbs: 45, fat: 6, cuisine: 'Maharashtrian', dietaryType: 'veg', suitableMealTypes: ['breakfast'], category: 'other', servingSize: '1 plate (200g)', emoji: '🍚' },
  { id: 102, name: 'Misal Pav', calories: 380, protein: 12, carbs: 56, fat: 12, cuisine: 'Maharashtrian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'lunch'], category: 'other', servingSize: '1 plate (250g)', emoji: '🍲' },
  { id: 103, name: 'Vada Pav', calories: 290, protein: 6, carbs: 42, fat: 11, cuisine: 'Maharashtrian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'snack', servingSize: '1 piece (150g)', emoji: '🍔' },
  { id: 104, name: 'Pav Bhaji', calories: 400, protein: 8, carbs: 58, fat: 15, cuisine: 'Maharashtrian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'other', servingSize: '1 plate (300g)', emoji: '🍞' },
  { id: 105, name: 'Sabudana Khichdi', calories: 360, protein: 2, carbs: 66, fat: 9, cuisine: 'Maharashtrian', dietaryType: 'veg', suitableMealTypes: ['breakfast'], category: 'other', servingSize: '1 bowl (200g)', emoji: '🍚' },
  { id: 106, name: 'Thalipeeth', calories: 240, protein: 6, carbs: 36, fat: 8, cuisine: 'Maharashtrian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'bread', servingSize: '2 pieces (100g)', emoji: '🫓' },
  { id: 107, name: 'Zunka Bhakri', calories: 280, protein: 8, carbs: 44, fat: 8, cuisine: 'Maharashtrian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'other', servingSize: '1 plate (200g)', emoji: '🍲' },
  { id: 108, name: 'Kolhapuri Chicken', calories: 380, protein: 28, carbs: 12, fat: 25, cuisine: 'Maharashtrian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍗' },
  { id: 109, name: 'Bombil Fry', calories: 220, protein: 24, carbs: 8, fat: 10, cuisine: 'Maharashtrian', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'protein', servingSize: '150g', emoji: '🐟' },
  { id: 110, name: 'Varan Bhaat', calories: 300, protein: 10, carbs: 56, fat: 4, cuisine: 'Maharashtrian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 plate (250g)', emoji: '🍚' },

  // Malayali (Kerala) Cuisine
  { id: 111, name: 'Appam with Stew', calories: 280, protein: 8, carbs: 42, fat: 9, cuisine: 'Malayali', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'dinner'], category: 'other', servingSize: '2 appam + stew (250g)', emoji: '🥞' },
  { id: 112, name: 'Puttu with Kadala Curry', calories: 320, protein: 12, carbs: 54, fat: 7, cuisine: 'Malayali', dietaryType: 'veg', suitableMealTypes: ['breakfast'], category: 'other', servingSize: '1 serving (250g)', emoji: '🍚' },
  { id: 113, name: 'Kerala Parotta', calories: 300, protein: 6, carbs: 42, fat: 12, cuisine: 'Malayali', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'bread', servingSize: '1 piece (100g)', emoji: '🫓' },
  { id: 114, name: 'Sadya Meal', calories: 600, protein: 18, carbs: 110, fat: 10, cuisine: 'Malayali', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'other', servingSize: 'full plate', emoji: '🍽️' },
  { id: 115, name: 'Meen Pollichathu', calories: 280, protein: 28, carbs: 8, fat: 15, cuisine: 'Malayali', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'protein', servingSize: '200g', emoji: '🐟' },
  { id: 116, name: 'Karimeen Fry', calories: 260, protein: 26, carbs: 6, fat: 14, cuisine: 'Malayali', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'protein', servingSize: '150g', emoji: '🐟' },
  { id: 117, name: 'Beef Fry', calories: 340, protein: 28, carbs: 4, fat: 24, cuisine: 'Malayali', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'protein', servingSize: '150g', emoji: '🍖' },
  { id: 118, name: 'Chicken Stew', calories: 280, protein: 24, carbs: 12, fat: 16, cuisine: 'Malayali', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍗' },
  { id: 218, name: 'Vegetable Stew', calories: 140, protein: 3, carbs: 18, fat: 6, cuisine: 'Malayali', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'dinner'], category: 'curry', servingSize: '1 bowl (150g)', emoji: '🥗' },
  { id: 119, name: 'Olan', calories: 140, protein: 4, carbs: 16, fat: 7, cuisine: 'Malayali', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🥗' },
  { id: 120, name: 'Erissery', calories: 180, protein: 6, carbs: 24, fat: 7, cuisine: 'Malayali', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (150g)', emoji: '🥗' },

  // Andhra Cuisine
  { id: 121, name: 'Pesarattu with Upma', calories: 280, protein: 10, carbs: 46, fat: 6, cuisine: 'Andhra', dietaryType: 'veg', suitableMealTypes: ['breakfast'], category: 'other', servingSize: '1 serving (200g)', emoji: '🥞' },
  { id: 122, name: 'Gongura Chicken', calories: 360, protein: 28, carbs: 10, fat: 24, cuisine: 'Andhra', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍗' },
  { id: 123, name: 'Hyderabadi Biryani', calories: 480, protein: 22, carbs: 58, fat: 18, cuisine: 'Andhra', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 plate (300g)', emoji: '🍛' },
  { id: 124, name: 'Gutti Vankaya', calories: 200, protein: 4, carbs: 20, fat: 12, cuisine: 'Andhra', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (150g)', emoji: '🍆' },
  { id: 125, name: 'Natukodi Pulusu', calories: 340, protein: 26, carbs: 12, fat: 22, cuisine: 'Andhra', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍗' },
  { id: 126, name: 'Royyala Vepudu', calories: 240, protein: 26, carbs: 6, fat: 12, cuisine: 'Andhra', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'protein', servingSize: '150g', emoji: '🦐' },
  { id: 127, name: 'Pulihora', calories: 300, protein: 5, carbs: 56, fat: 7, cuisine: 'Andhra', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 bowl (200g)', emoji: '🍚' },
  { id: 128, name: 'Pappu', calories: 160, protein: 9, carbs: 26, fat: 3, cuisine: 'Andhra', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🥘' },

  // Odia Cuisine
  { id: 129, name: 'Pakhala Bhata', calories: 160, protein: 4, carbs: 34, fat: 1, cuisine: 'Odia', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 bowl (250g)', emoji: '🍚' },
  { id: 130, name: 'Dalma', calories: 180, protein: 8, carbs: 30, fat: 3, cuisine: 'Odia', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🥘' },
  { id: 131, name: 'Santula', calories: 100, protein: 3, carbs: 16, fat: 3, cuisine: 'Odia', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (150g)', emoji: '🥗' },
  { id: 132, name: 'Machha Besara', calories: 260, protein: 26, carbs: 10, fat: 14, cuisine: 'Odia', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🐟' },
  { id: 133, name: 'Chingudi Jhola', calories: 240, protein: 24, carbs: 12, fat: 11, cuisine: 'Odia', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🦐' },
  { id: 134, name: 'Dahi Baigana', calories: 160, protein: 4, carbs: 18, fat: 8, cuisine: 'Odia', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (150g)', emoji: '🍆' },

  // Rajasthani Cuisine
  { id: 135, name: 'Dal Baati Churma', calories: 520, protein: 12, carbs: 68, fat: 22, cuisine: 'Rajasthani', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'other', servingSize: '1 serving (300g)', emoji: '🍛' },
  { id: 136, name: 'Gatte ki Sabzi', calories: 260, protein: 8, carbs: 32, fat: 11, cuisine: 'Rajasthani', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍲' },
  { id: 137, name: 'Ker Sangri', calories: 180, protein: 4, carbs: 22, fat: 9, cuisine: 'Rajasthani', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (150g)', emoji: '🥗' },
  { id: 138, name: 'Laal Maas', calories: 480, protein: 24, carbs: 10, fat: 38, cuisine: 'Rajasthani', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍖' },
  { id: 139, name: 'Pyaaz Kachori', calories: 320, protein: 6, carbs: 40, fat: 15, cuisine: 'Rajasthani', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'snack', servingSize: '2 pieces (100g)', emoji: '🥟' },
  { id: 140, name: 'Mirchi Vada', calories: 180, protein: 4, carbs: 20, fat: 9, cuisine: 'Rajasthani', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'snack', servingSize: '2 pieces (80g)', emoji: '🌶️' },

  // Bihari Cuisine
  { id: 141, name: 'Litti Chokha', calories: 380, protein: 10, carbs: 58, fat: 12, cuisine: 'Bihari', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'other', servingSize: '2 litti + chokha (250g)', emoji: '🫓' },
  { id: 142, name: 'Sattu Paratha', calories: 260, protein: 8, carbs: 38, fat: 9, cuisine: 'Bihari', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'lunch'], category: 'bread', servingSize: '1 piece (100g)', emoji: '🫓' },
  { id: 143, name: 'Champaran Mutton', calories: 440, protein: 26, carbs: 8, fat: 34, cuisine: 'Bihari', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍖' },
  { id: 144, name: 'Ghugni', calories: 220, protein: 10, carbs: 36, fat: 4, cuisine: 'Bihari', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🫘' },

  // North-Eastern Cuisine
  { id: 145, name: 'Momos (Veg)', calories: 240, protein: 8, carbs: 38, fat: 6, cuisine: 'North-Eastern', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner', 'snack'], category: 'snack', servingSize: '5 pieces (150g)', emoji: '🥟' },
  { id: 146, name: 'Momos (Chicken)', calories: 280, protein: 16, carbs: 36, fat: 8, cuisine: 'North-Eastern', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner', 'snack'], category: 'snack', servingSize: '5 pieces (150g)', emoji: '🥟' },
  { id: 147, name: 'Thukpa', calories: 320, protein: 14, carbs: 48, fat: 8, cuisine: 'North-Eastern', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'other', servingSize: '1 bowl (300g)', emoji: '🍜' },
  { id: 148, name: 'Pork with Bamboo Shoot', calories: 360, protein: 24, carbs: 12, fat: 24, cuisine: 'North-Eastern', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍖' },
  { id: 149, name: 'Fish Tenga', calories: 220, protein: 24, carbs: 10, fat: 10, cuisine: 'North-Eastern', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🐟' },
  { id: 150, name: 'Jadoh', calories: 340, protein: 12, carbs: 52, fat: 10, cuisine: 'North-Eastern', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'rice', servingSize: '1 bowl (200g)', emoji: '🍚' },

  // Kashmiri Cuisine
  { id: 151, name: 'Rogan Josh', calories: 480, protein: 24, carbs: 12, fat: 36, cuisine: 'Kashmiri', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍖' },
  { id: 152, name: 'Yakhni', calories: 320, protein: 26, carbs: 10, fat: 20, cuisine: 'Kashmiri', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🍲' },
  { id: 153, name: 'Dum Aloo Kashmiri', calories: 280, protein: 4, carbs: 36, fat: 14, cuisine: 'Kashmiri', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🥔' },
  { id: 154, name: 'Gushtaba', calories: 380, protein: 20, carbs: 12, fat: 28, cuisine: 'Kashmiri', dietaryType: 'non-veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '3 pieces (150g)', emoji: '🍖' },
  { id: 155, name: 'Nadru Yakhni', calories: 180, protein: 4, carbs: 24, fat: 8, cuisine: 'Kashmiri', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (150g)', emoji: '🌿' },

  // Snacks & Street Food
  { id: 156, name: 'Samosa', calories: 308, protein: 6, carbs: 38, fat: 15, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '2 pieces (100g)', emoji: '🥟' },
  { id: 157, name: 'Kachori', calories: 280, protein: 6, carbs: 34, fat: 13, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '2 pieces (80g)', emoji: '🥟' },
  { id: 158, name: 'Pakora', calories: 240, protein: 6, carbs: 28, fat: 12, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '6 pieces (100g)', emoji: '🍤' },
  { id: 159, name: 'Bread Pakora', calories: 320, protein: 8, carbs: 42, fat: 13, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '2 pieces (120g)', emoji: '🍞' },
  { id: 160, name: 'Paneer Pakora', calories: 340, protein: 14, carbs: 24, fat: 21, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '6 pieces (120g)', emoji: '🧀' },
  { id: 161, name: 'Aloo Tikki', calories: 220, protein: 4, carbs: 32, fat: 9, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '2 pieces (100g)', emoji: '🥔' },
  { id: 162, name: 'Pani Puri', calories: 240, protein: 6, carbs: 46, fat: 5, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '10 pieces (200g)', emoji: '🥟' },
  { id: 163, name: 'Sev Puri', calories: 280, protein: 6, carbs: 38, fat: 12, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '1 plate (150g)', emoji: '🥗' },
  { id: 164, name: 'Bhel Puri', calories: 220, protein: 5, carbs: 36, fat: 7, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '1 plate (150g)', emoji: '🥗' },
  { id: 165, name: 'Dahi Puri', calories: 300, protein: 8, carbs: 44, fat: 10, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '10 pieces (200g)', emoji: '🥗' },
  { id: 166, name: 'Papdi Chaat', calories: 260, protein: 7, carbs: 38, fat: 9, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '1 plate (150g)', emoji: '🥗' },
  { id: 167, name: 'Aloo Chaat', calories: 200, protein: 4, carbs: 32, fat: 6, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '1 plate (150g)', emoji: '🥔' },
  { id: 168, name: 'Raj Kachori', calories: 360, protein: 8, carbs: 48, fat: 15, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '1 large (150g)', emoji: '🥟' },
  { id: 169, name: 'Pav', calories: 140, protein: 4, carbs: 26, fat: 2, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'bread', servingSize: '1 piece (50g)', emoji: '🍞' },
  { id: 170, name: 'Spring Roll', calories: 260, protein: 6, carbs: 32, fat: 12, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '2 pieces (100g)', emoji: '🥟' },
  { id: 171, name: 'Cutlet', calories: 220, protein: 8, carbs: 26, fat: 10, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '2 pieces (100g)', emoji: '🍖' },
  { id: 172, name: 'Bonda', calories: 180, protein: 4, carbs: 24, fat: 8, cuisine: 'Snacks', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '2 pieces (80g)', emoji: '🍩' },

  // Breakfast & Light Items
  { id: 173, name: 'Poori', calories: 240, protein: 4, carbs: 28, fat: 12, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast'], category: 'bread', servingSize: '2 pieces (60g)', emoji: '🫓' },
  { id: 174, name: 'Chole Bhature', calories: 580, protein: 14, carbs: 72, fat: 26, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'lunch'], category: 'other', servingSize: '1 plate (300g)', emoji: '🍛' },
  { id: 175, name: 'Aloo Puri', calories: 460, protein: 8, carbs: 64, fat: 19, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast'], category: 'other', servingSize: '1 plate (250g)', emoji: '🍛' },
  { id: 176, name: 'Bread Omelette', calories: 320, protein: 18, carbs: 28, fat: 15, cuisine: 'North Indian', dietaryType: 'eggetarian', suitableMealTypes: ['breakfast'], category: 'protein', servingSize: '2 slices + 2 eggs (150g)', emoji: '🍳' },
  { id: 177, name: 'Boiled Egg', calories: 140, protein: 13, carbs: 1, fat: 9, cuisine: 'North Indian', dietaryType: 'eggetarian', suitableMealTypes: ['breakfast', 'snack'], category: 'protein', servingSize: '2 eggs (100g)', emoji: '🥚' },
  { id: 178, name: 'Omelette', calories: 190, protein: 14, carbs: 2, fat: 14, cuisine: 'North Indian', dietaryType: 'eggetarian', suitableMealTypes: ['breakfast'], category: 'protein', servingSize: '2 eggs (120g)', emoji: '🍳' },
  { id: 179, name: 'Egg Bhurji', calories: 240, protein: 16, carbs: 6, fat: 17, cuisine: 'North Indian', dietaryType: 'eggetarian', suitableMealTypes: ['breakfast', 'lunch'], category: 'curry', servingSize: '2 eggs (150g)', emoji: '🍳' },
  { id: 180, name: 'Bread Butter Jam', calories: 260, protein: 5, carbs: 38, fat: 9, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast'], category: 'bread', servingSize: '2 slices (80g)', emoji: '🍞' },
  { id: 181, name: 'Sandwich (Veg)', calories: 280, protein: 8, carbs: 42, fat: 9, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'other', servingSize: '2 slices (150g)', emoji: '🥪' },
  { id: 182, name: 'Grilled Sandwich', calories: 320, protein: 10, carbs: 44, fat: 12, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'other', servingSize: '1 sandwich (150g)', emoji: '🥪' },

  // Accompaniments & Sides
  { id: 183, name: 'Raita', calories: 90, protein: 5, carbs: 10, fat: 4, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'side', servingSize: '1 bowl (150g)', emoji: '🥛' },
  { id: 184, name: 'Plain Curd', calories: 98, protein: 6, carbs: 7, fat: 5, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner', 'snack'], category: 'side', servingSize: '1 bowl (150g)', emoji: '🥛' },
  { id: 185, name: 'Pickle', calories: 26, protein: 0.5, carbs: 3, fat: 1.5, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'side', servingSize: '1 tbsp (20g)', emoji: '🥒' },
  { id: 186, name: 'Papad', calories: 70, protein: 2, carbs: 10, fat: 2, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'side', servingSize: '2 pieces (20g)', emoji: '🍪' },
  { id: 187, name: 'Green Salad', calories: 25, protein: 1, carbs: 5, fat: 0.3, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'side', servingSize: '1 bowl (100g)', emoji: '🥗' },
  { id: 188, name: 'Onion Salad', calories: 20, protein: 0.5, carbs: 5, fat: 0.1, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'side', servingSize: '1 bowl (50g)', emoji: '🧅' },
  { id: 189, name: 'Mint Chutney', calories: 15, protein: 0.5, carbs: 3, fat: 0.2, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner', 'snack'], category: 'side', servingSize: '2 tbsp (30g)', emoji: '🌿' },
  { id: 190, name: 'Tamarind Chutney', calories: 50, protein: 0.3, carbs: 13, fat: 0.1, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner', 'snack'], category: 'side', servingSize: '2 tbsp (30g)', emoji: '🍯' },

  // Desserts & Sweets
  { id: 191, name: 'Gulab Jamun', calories: 260, protein: 4, carbs: 50, fat: 6, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'dessert', servingSize: '2 pieces (100g)', emoji: '🍡' },
  { id: 192, name: 'Jalebi', calories: 280, protein: 2, carbs: 60, fat: 3, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'dessert', servingSize: '4 pieces (100g)', emoji: '🍩' },
  { id: 193, name: 'Ladoo', calories: 320, protein: 6, carbs: 48, fat: 12, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'dessert', servingSize: '2 pieces (80g)', emoji: '🍡' },
  { id: 194, name: 'Barfi', calories: 280, protein: 6, carbs: 44, fat: 9, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'dessert', servingSize: '2 pieces (80g)', emoji: '🍬' },
  { id: 195, name: 'Halwa', calories: 320, protein: 4, carbs: 52, fat: 11, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'dessert', servingSize: '1 bowl (100g)', emoji: '🍯' },
  { id: 196, name: 'Kheer', calories: 220, protein: 6, carbs: 38, fat: 5, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'dessert', servingSize: '1 bowl (150g)', emoji: '🍚' },
  { id: 197, name: 'Rasmalai', calories: 240, protein: 6, carbs: 36, fat: 8, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'dessert', servingSize: '2 pieces (120g)', emoji: '🍡' },
  { id: 198, name: 'Kulfi', calories: 200, protein: 5, carbs: 28, fat: 8, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'dessert', servingSize: '1 piece (100g)', emoji: '🍦' },
  { id: 199, name: 'Ice Cream', calories: 140, protein: 3, carbs: 18, fat: 7, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'dessert', servingSize: '1 scoop (75g)', emoji: '🍨' },

  // Beverages
  { id: 200, name: 'Tea with Milk & Sugar', calories: 60, protein: 2, carbs: 10, fat: 2, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'beverage', servingSize: '1 cup (150ml)', emoji: '☕' },
  { id: 201, name: 'Tea without Sugar', calories: 20, protein: 1, carbs: 2, fat: 1, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'beverage', servingSize: '1 cup (150ml)', emoji: '☕' },
  { id: 202, name: 'Coffee with Milk & Sugar', calories: 70, protein: 2, carbs: 12, fat: 2, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'beverage', servingSize: '1 cup (150ml)', emoji: '☕' },
  { id: 203, name: 'Masala Chai', calories: 65, protein: 2, carbs: 11, fat: 2, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'beverage', servingSize: '1 cup (150ml)', emoji: '☕' },
  { id: 204, name: 'Lassi - Sweet', calories: 180, protein: 6, carbs: 28, fat: 5, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'beverage', servingSize: '1 glass (200ml)', emoji: '🥛' },
  { id: 205, name: 'Lassi - Salted', calories: 120, protein: 6, carbs: 12, fat: 5, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'beverage', servingSize: '1 glass (200ml)', emoji: '🥛' },
  { id: 206, name: 'Buttermilk', calories: 60, protein: 3, carbs: 8, fat: 1.5, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner', 'snack'], category: 'beverage', servingSize: '1 glass (200ml)', emoji: '🥛' },
  { id: 207, name: 'Sugarcane Juice', calories: 180, protein: 0, carbs: 45, fat: 0, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'beverage', servingSize: '1 glass (250ml)', emoji: '🥤' },
  { id: 208, name: 'Coconut Water', calories: 46, protein: 2, carbs: 9, fat: 0.5, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'beverage', servingSize: '1 glass (250ml)', emoji: '🥥' },
  { id: 209, name: 'Nimbu Pani', calories: 60, protein: 0, carbs: 16, fat: 0, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'beverage', servingSize: '1 glass (250ml)', emoji: '🍋' },

  // Common Items
  { id: 210, name: 'Bread', calories: 70, protein: 2, carbs: 13, fat: 1, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'bread', servingSize: '1 slice (25g)', emoji: '🍞' },
  { id: 211, name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0.3, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'other', servingSize: '1 medium (118g)', emoji: '🍌' },
  { id: 212, name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'other', servingSize: '1 medium (182g)', emoji: '🍎' },
  { id: 213, name: 'Digestive Biscuits', calories: 20, protein: 0.5, carbs: 3.5, fat: 0.8, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['snack'], category: 'snack', servingSize: '1 biscuit (8g)', emoji: '🍪' },
  { id: 214, name: 'Kadala Curry', calories: 220, protein: 8, carbs: 32, fat: 6, cuisine: 'Malayali', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (200g)', emoji: '🫘' },
  { id: 215, name: 'Chokha', calories: 80, protein: 2, carbs: 12, fat: 3, cuisine: 'Bihari', dietaryType: 'veg', suitableMealTypes: ['lunch', 'dinner'], category: 'side', servingSize: '1 bowl (100g)', emoji: '🥗' },
  { id: 216, name: 'Green Chutney', calories: 8, protein: 0.3, carbs: 1.5, fat: 0.2, cuisine: 'Gujarati', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'snack'], category: 'side', servingSize: '1 tbsp (15g)', emoji: '🌿' },
  { id: 217, name: 'Aloo Curry', calories: 180, protein: 3, carbs: 28, fat: 6, cuisine: 'North Indian', dietaryType: 'veg', suitableMealTypes: ['breakfast', 'lunch', 'dinner'], category: 'curry', servingSize: '1 bowl (150g)', emoji: '🥔' },
];

// Helper functions
export const getFoodsByCuisine = (cuisine: string): FoodItem[] => {
  return foodDatabase.filter(food => food.cuisine === cuisine);
};

export const getFoodsByDietaryType = (dietaryType: 'veg' | 'non-veg' | 'eggetarian' | 'both'): FoodItem[] => {
  if (dietaryType === 'both') {
    return foodDatabase;
  }
  return foodDatabase.filter(food => food.dietaryType === dietaryType);
};

export const getFoodsByMealType = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'): FoodItem[] => {
  return foodDatabase.filter(food => food.suitableMealTypes.includes(mealType));
};

export const searchFoods = (query: string): FoodItem[] => {
  const lowerQuery = query.toLowerCase();
  return foodDatabase.filter(food =>
    food.name.toLowerCase().includes(lowerQuery) ||
    food.cuisine.toLowerCase().includes(lowerQuery)
  );
};
