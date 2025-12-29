import { motion } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { useState } from 'react';
import { getMealPlan } from '../utils/mealCombinations';

interface CuisinePreferencesProps {
  onClose: () => void;
  userData: any;
  onComplete?: (preferences: any) => void;
}

const cuisines = [
  'North Indian',
  'South Indian',
  'Bengali',
  'Gujarati',
  'Maharashtrian',
  'Malayali',
  'Andhra',
  'Odia',
  'Rajasthani',
  'Bihari',
  'North-Eastern',
  'Kashmiri',
  'Snacks',
];

const mealTypes = [
  'Breakfast',
  'Mid-Morning Snack',
  'Lunch',
  'Evening Snack',
  'Dinner',
  'Late Night Snack',
];

const dietaryOptions = ['Veg', 'Non-Veg', 'Both'];

export default function CuisinePreferences({ onClose, userData, onComplete }: CuisinePreferencesProps) {
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string>('Both');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCuisines = cuisines.filter(cuisine =>
    cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const toggleMeal = (meal: string) => {
    setSelectedMeals(prev =>
      prev.includes(meal)
        ? prev.filter(m => m !== meal)
        : [...prev, meal]
    );
  };

  const selectAllCuisines = () => {
    setSelectedCuisines(cuisines);
  };

  const clearAllCuisines = () => {
    setSelectedCuisines([]);
  };

  const handleContinue = () => {
    if (selectedCuisines.length === 0 || selectedMeals.length === 0) {
      alert('Please select at least one cuisine and one meal type');
      return;
    }

    // Map meal types to system format
    const mealTypeMap: Record<string, string> = {
      'Breakfast': 'breakfast',
      'Mid-Morning Snack': 'snack',
      'Lunch': 'lunch',
      'Evening Snack': 'snack',
      'Dinner': 'dinner',
      'Late Night Snack': 'snack',
    };

    const mappedMealTypes = selectedMeals.map(meal => mealTypeMap[meal] || meal.toLowerCase());

    // Generate meal plan
    const targetCalories = userData?.dailyCalorieAllowance || 2000;
    const dietaryType = selectedDietary === 'Both' ? 'both' : 
                       selectedDietary === 'Veg' ? 'veg' : 'non-veg';
    
    const mealPlan = getMealPlan(
      targetCalories,
      selectedCuisines,
      dietaryType as 'veg' | 'non-veg' | 'both',
      mappedMealTypes
    );

    // Save preferences and meal plan
    const preferences = {
      cuisines: selectedCuisines,
      meals: selectedMeals,
      dietaryType: selectedDietary,
      mealPlan,
      userData,
    };

    // Store in localStorage for now
    localStorage.setItem('slaycal_preferences', JSON.stringify(preferences));
    
    // Call onComplete callback if provided
    if (onComplete) {
      onComplete(preferences);
    } else {
      // Show success message
      alert(`Meal plan generated! ${Object.keys(mealPlan).length} meal types with recommendations.`);
      onClose();
    }
  };

  return (
    <div className="min-h-screen gradient-bg relative fixed inset-0 overflow-y-auto z-50">
      <div className="sticky top-0 z-40 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🍽️</span>
              <span>
                <span className="text-yellow-400">Step 2:</span> Your Food Adventure
              </span>
            </h1>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-12 border border-white/20 shadow-2xl"
        >
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="inline-block mb-3 sm:mb-4"
            >
              <span className="text-5xl sm:text-7xl">🍽️</span>
            </motion.div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white mb-2 sm:mb-3 px-2">
              <span className="text-yellow-400">What Makes Your Taste Buds Dance?</span> 🎉
            </h2>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg px-2">
              Pick your favorite cuisines and meal times - we'll create magic! ✨
            </p>
          </div>

          {/* Dietary Options - Mobile Friendly */}
          <div className="mb-8 sm:mb-10">
            <label className="block text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🥗</span>
              <span>What's Your Food Vibe?</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              {dietaryOptions.map((option) => {
                const emoji = option === 'Veg' ? '🌿' : option === 'Non-Veg' ? '🍗' : '🍽️';
                const isSelected = selectedDietary === option;
                return (
                  <motion.button
                    key={option}
                    onClick={() => setSelectedDietary(option)}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 sm:flex-none px-6 sm:px-8 py-4 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all relative overflow-hidden min-h-[56px] touch-manipulation ${
                      isSelected
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 shadow-2xl shadow-yellow-400/50 border-2 border-white/30'
                        : 'glass border-2 border-white/20 text-gray-300 active:border-yellow-400 active:bg-white/5'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mr-2">{emoji}</span>
                    {option}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 text-xl sm:text-2xl"
                      >
                        ✅
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Cuisine Selection - Mobile Friendly */}
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 gap-3 sm:gap-0">
              <label className="block text-base sm:text-lg font-bold text-white flex items-center gap-2 flex-wrap">
                <span className="text-xl sm:text-2xl">🌍</span>
                <span>Pick Your Favorite Flavors!</span>
                <span className="text-lg sm:text-2xl text-yellow-400">
                  ({selectedCuisines.length} selected)
                </span>
              </label>
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <motion.button
                  onClick={selectAllCuisines}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 rounded-lg bg-green-500/20 border border-green-400/50 text-green-300 active:bg-green-500/30 text-sm font-semibold min-h-[44px] touch-manipulation"
                >
                  ✅ Select All
                </motion.button>
                <motion.button
                  onClick={clearAllCuisines}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 rounded-lg bg-red-500/20 border border-red-400/50 text-red-300 active:bg-red-500/30 text-sm font-semibold min-h-[44px] touch-manipulation"
                >
                  🗑️ Clear
                </motion.button>
              </div>
            </div>

            {/* Search - Mobile Friendly */}
            <div className="relative mb-4 sm:mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search cuisines..."
                className="w-full pl-11 sm:pl-12 pr-4 py-3.5 sm:py-4 rounded-2xl bg-white/10 border-2 border-yellow-400/30 text-white text-base sm:text-lg placeholder-gray-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30 transition-all min-h-[48px]"
              />
            </div>

            {/* Cuisine Chips - Mobile Friendly */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {filteredCuisines.map((cuisine, index) => {
                const isSelected = selectedCuisines.includes(cuisine);
                const cuisineEmojis: Record<string, string> = {
                  'North Indian': '🍛',
                  'South Indian': '🍚',
                  'Bengali': '🐟',
                  'Gujarati': '🥘',
                  'Maharashtrian': '🌶️',
                  'Malayali': '🥥',
                  'Andhra': '🔥',
                  'Odia': '🍲',
                  'Rajasthani': '🌮',
                  'Bihari': '🥟',
                  'North-Eastern': '🍜',
                  'Kashmiri': '🧄',
                  'Snacks': '🍿',
                };
                const emoji = cuisineEmojis[cuisine] || '🍽️';
                
                return (
                  <motion.button
                    key={cuisine}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => toggleCuisine(cuisine)}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 sm:px-5 py-3 sm:py-3 rounded-2xl font-semibold text-sm sm:text-base transition-all flex items-center gap-2 relative overflow-hidden min-h-[48px] touch-manipulation ${
                      isSelected
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 shadow-2xl shadow-yellow-400/50 border-2 border-white/30'
                        : 'glass border-2 border-white/20 text-gray-300 active:border-yellow-400 active:bg-white/5'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl">{emoji}</span>
                    <span>{cuisine}</span>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="ml-1 text-lg sm:text-xl"
                      >
                        ✨
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

            {/* Meal Types - Mobile Friendly */}
          <div className="mb-8 sm:mb-10">
            <label className="block text-base sm:text-lg font-bold text-white mb-4 sm:mb-5 flex items-center gap-2 flex-wrap">
              <span className="text-xl sm:text-2xl">⏰</span>
              <span>When Do You Like to Eat?</span>
              <span className="text-lg sm:text-2xl text-yellow-400">
                ({selectedMeals.length} selected)
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {mealTypes.map((meal, index) => {
                const isSelected = selectedMeals.includes(meal);
                const emoji = meal.includes('Breakfast') ? '🌅' :
                             meal.includes('Snack') ? '🍿' :
                             meal.includes('Lunch') ? '☀️' :
                             meal.includes('Dinner') ? '🌙' : '🍽️';
                
                return (
                  <motion.button
                    key={meal}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => toggleMeal(meal)}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 sm:px-5 py-4 sm:py-5 rounded-2xl font-bold text-xs sm:text-sm lg:text-base transition-all flex flex-col items-center justify-center gap-2 relative overflow-hidden min-h-[80px] sm:min-h-[100px] touch-manipulation ${
                      isSelected
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 shadow-2xl shadow-yellow-400/50 border-2 border-white/30'
                        : 'glass border-2 border-white/20 text-gray-300 active:border-yellow-400 active:bg-white/5'
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl">{emoji}</span>
                    <span className="text-center leading-tight">{meal}</span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 text-lg sm:text-xl"
                      >
                        ✅
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Continue Button - Mobile Friendly */}
          <motion.button
            onClick={handleContinue}
            whileTap={{ scale: 0.97 }}
            disabled={selectedCuisines.length === 0 || selectedMeals.length === 0}
            className={`w-full py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg lg:text-xl shadow-2xl transition-all relative overflow-hidden min-h-[56px] touch-manipulation ${
              selectedCuisines.length === 0 || selectedMeals.length === 0
                ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed border-2 border-gray-500/30'
                : 'text-gray-900 active:shadow-yellow-400/50 border-2 border-white/30'
            }`}
            style={selectedCuisines.length > 0 && selectedMeals.length > 0 ? {
              background: 'linear-gradient(135deg, #FCD34D 0%, #FDE047 50%, #FCD34D 100%)',
              boxShadow: `
                0 0 20px rgba(252, 211, 77, 0.6),
                0 0 40px rgba(252, 211, 77, 0.4),
                0 10px 30px rgba(252, 211, 77, 0.3)
              `,
            } : {}}
          >
            {selectedCuisines.length === 0 || selectedMeals.length === 0 ? (
              <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
                <span>⏳</span>
                <span className="hidden sm:inline">Please select at least one cuisine and meal type</span>
                <span className="sm:hidden">Select cuisine & meal</span>
              </span>
            ) : (
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-xl sm:text-2xl">🚀</span>
                <span className="text-sm sm:text-base lg:text-lg">Let's Create My Meal Plan!</span>
                <span className="text-xl sm:text-2xl">✨</span>
              </span>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

