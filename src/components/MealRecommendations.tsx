import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { FoodItem } from '../data/foodDatabase';
import { MealCombination, getMealPlan } from '../utils/mealCombinations';

interface MealRecommendationsProps {
  onClose: () => void;
  userData: any;
  preferences: {
    cuisines: string[];
    meals: string[];
    dietaryType: string;
  };
  onLogin?: () => void;
}

export default function MealRecommendations({ onClose, userData, preferences, onLogin }: MealRecommendationsProps) {
  const [selectedMealType, setSelectedMealType] = useState<string>('breakfast');
  const [favoriteMeals, setFavoriteMeals] = useState<Set<string>>(new Set());
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [customMeals, setCustomMeals] = useState<Map<string, MealCombination>>(new Map());
  const [showCustomMealModal, setShowCustomMealModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState<MealCombination | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Map meal types
  const mealTypeMap: Record<string, string> = {
    'Breakfast': 'breakfast',
    'Mid-Morning Snack': 'snack',
    'Lunch': 'lunch',
    'Evening Snack': 'snack',
    'Dinner': 'dinner',
    'Late Night Snack': 'snack',
  };

  const mappedMealTypes = preferences.meals.map(meal => mealTypeMap[meal] || meal.toLowerCase());
  const uniqueMealTypes = Array.from(new Set(mappedMealTypes));

  // Generate meal plan
  const mealPlan = getMealPlan(
    userData?.dailyCalorieAllowance || 2000,
    preferences.cuisines,
    preferences.dietaryType === 'Both' ? 'both' : preferences.dietaryType.toLowerCase() as 'veg' | 'non-veg',
    uniqueMealTypes
  );

  const currentMeals = mealPlan[selectedMealType] || [];
  const allMeals = [...currentMeals, ...Array.from(customMeals.values()).filter(m => m.mealType === selectedMealType)];

  const toggleFavorite = (mealId: string) => {
    setFavoriteMeals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(mealId)) {
        newSet.delete(mealId);
      } else {
        newSet.add(mealId);
      }
      return newSet;
    });
  };

  const handleRemoveItem = (meal: MealCombination, itemToRemove: FoodItem) => {
    const updatedItems = meal.items.filter(item => item.food.id !== itemToRemove.id);
    const updatedMeal: MealCombination = {
      ...meal,
      items: updatedItems,
      totalCalories: updatedItems.reduce((sum, item) => sum + item.calories, 0),
      totalProtein: updatedItems.reduce((sum, item) => sum + (item.food.protein * item.portion), 0),
      totalCarbs: updatedItems.reduce((sum, item) => sum + (item.food.carbs * item.portion), 0),
      totalFat: updatedItems.reduce((sum, item) => sum + (item.food.fat * item.portion), 0),
    };
    
    if (customMeals.has(meal.description)) {
      setCustomMeals(prev => {
        const newMap = new Map(prev);
        newMap.set(meal.description, updatedMeal);
        return newMap;
      });
    }
  };

  const handleSaveCustomMeal = (meal: MealCombination, name: string) => {
    const customMeal: MealCombination = {
      ...meal,
      description: name,
    };
    setCustomMeals(prev => new Map(prev).set(name, customMeal));
    setShowCustomMealModal(false);
  };

  return (
    <div className="min-h-screen gradient-bg relative fixed inset-0 overflow-y-auto z-50">
      <div className="sticky top-0 z-40 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              Step 3: Your Food Recommendations
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

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl"
        >

          <div className="text-center mb-10">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="inline-block mb-4"
            >
              <span className="text-7xl">🍽️</span>
            </motion.div>
            <h2 className="text-4xl font-heading font-bold text-white mb-3">
              <span className="text-yellow-400">Your Perfect Meal Plan is Ready!</span> 🎉
            </h2>
            <p className="text-gray-300 text-lg">
              We've crafted these delicious combinations just for you! ✨
            </p>
          </div>

          {/* Meal Type Tabs - Playful */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-3 scrollbar-hide">
            {uniqueMealTypes.map((mealType, index) => {
              const mealEmojis: Record<string, string> = {
                'breakfast': '🌅',
                'lunch': '☀️',
                'dinner': '🌙',
                'snack': '🍿',
              };
              const emoji = mealEmojis[mealType] || '🍽️';
              const isSelected = selectedMealType === mealType;
              
              return (
                <motion.button
                  key={mealType}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedMealType(mealType)}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-4 rounded-2xl font-bold text-base whitespace-nowrap transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 shadow-2xl shadow-yellow-400/50 border-2 border-white/30'
                      : 'glass border-2 border-white/20 text-gray-300 active:border-yellow-400 active:bg-white/5'
                  }`}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</span>
                  {mealPlan[mealType] && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                      isSelected ? 'bg-white/30' : 'bg-purple-500/30'
                    }`}>
                      {mealPlan[mealType].length}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Meal Cards - Playful Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {allMeals.length === 0 ? (
              <div className="col-span-2 text-center py-16">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-8xl mb-4"
                >
                  🍽️
                </motion.div>
                <p className="text-gray-300 text-xl">No meal recommendations available yet</p>
                <p className="text-gray-400 text-sm mt-2">Try selecting different preferences!</p>
              </div>
            ) : (
              allMeals.map((meal, index) => (
                <MealCard
                  key={`${meal.description}-${index}`}
                  meal={meal}
                  isFavorite={favoriteMeals.has(meal.description)}
                  onToggleFavorite={() => toggleFavorite(meal.description)}
                  isExpanded={expandedMeal === meal.description}
                  onToggleExpand={() => setExpandedMeal(expandedMeal === meal.description ? null : meal.description)}
                  onRemoveItem={(item) => handleRemoveItem(meal, item)}
                  onSaveCustom={() => {
                    setEditingMeal(meal);
                    setShowCustomMealModal(true);
                  }}
                />
              ))
            )}
          </div>

          {/* CTA Button - Playful */}
          <motion.button
            onClick={() => {
              setShowAuthDialog(true);
            }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-10 py-5 rounded-2xl font-bold text-xl shadow-2xl active:shadow-yellow-400/50 transition-all relative overflow-hidden text-gray-900"
            style={{
              background: 'linear-gradient(135deg, #FCD34D 0%, #FDE047 50%, #FCD34D 100%)',
              boxShadow: `
                0 0 20px rgba(252, 211, 77, 0.6),
                0 0 40px rgba(252, 211, 77, 0.4),
                0 10px 30px rgba(252, 211, 77, 0.3)
              `,
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <span className="text-2xl">🚀</span>
              <span>Start My Amazing Weight-Loss Journey!</span>
              <span className="text-2xl">✨</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent opacity-60 rounded-2xl"></div>
          </motion.button>

          {/* Auth Dialog */}
          <AnimatePresence>
            {showAuthDialog && (
              <AuthDialog
                onContinueAsGuest={() => {
                  // Save meal plan and proceed to dashboard
                  localStorage.setItem('slaycal_meal_plan', JSON.stringify({
                    mealPlan,
                    customMeals: Array.from(customMeals.entries()),
                    favorites: Array.from(favoriteMeals),
                  }));
                  setShowAuthDialog(false);
                  onClose();
                }}
                onLogin={() => {
                  setShowAuthDialog(false);
                  if (onLogin) {
                    onLogin();
                  }
                }}
                onClose={() => setShowAuthDialog(false)}
              />
            )}
          </AnimatePresence>

          {/* Custom Meal Modal */}
          {showCustomMealModal && editingMeal && (
            <CustomMealModal
              meal={editingMeal}
              onClose={() => {
                setShowCustomMealModal(false);
                setEditingMeal(null);
              }}
              onSave={handleSaveCustomMeal}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Meal Card Component
interface MealCardProps {
  meal: MealCombination;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRemoveItem: (item: FoodItem) => void;
  onSaveCustom: () => void;
}

function MealCard({
  meal,
  isFavorite,
  onToggleFavorite,
  isExpanded,
  onToggleExpand,
  onRemoveItem,
  onSaveCustom,
}: MealCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="glass rounded-3xl p-6 lg:p-8 border-2 border-white/20 active:border-yellow-400/50 transition-all bg-gradient-to-br from-yellow-400/5 to-purple-300/5"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1">
          <h3 className="text-2xl font-heading font-bold text-white mb-3">
            <span className="text-yellow-400">{meal.description}</span>
          </h3>
          <div className="flex items-center gap-4 text-base font-semibold">
            <span className="text-purple-300 flex items-center gap-1">
              <span className="text-xl">🍽️</span> {meal.items.length} items
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-orange-300 flex items-center gap-1">
              <span className="text-xl">⏱️</span> ~20 min
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={onToggleFavorite}
            whileHover={{ scale: 1.3, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-xl transition-all ${
              isFavorite 
                ? 'bg-red-500/20 border-2 border-red-400 text-red-400' 
                : 'bg-white/5 border-2 border-white/20 text-gray-400 active:border-red-400/50'
            }`}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
          <motion.button
            onClick={onToggleExpand}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl bg-white/5 border-2 border-white/20 text-gray-400 active:border-yellow-400/50 transition-all"
          >
            {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Calories & Macros Summary - Playful */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="text-center glass rounded-xl p-4 border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 to-transparent"
        >
          <div className="text-3xl font-bold text-yellow-400 mb-1">{meal.totalCalories}</div>
          <div className="text-xs text-gray-300 font-semibold">🔥 Calories</div>
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="text-center glass rounded-xl p-4 border-2 border-purple-300/30 bg-gradient-to-br from-purple-300/10 to-transparent"
        >
          <div className="text-2xl font-bold text-purple-300 mb-1">{meal.totalProtein}g</div>
          <div className="text-xs text-gray-300 font-semibold">💪 Protein</div>
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="text-center glass rounded-xl p-4 border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 to-transparent"
        >
          <div className="text-2xl font-bold text-yellow-400 mb-1">{meal.totalCarbs}g</div>
          <div className="text-xs text-gray-300 font-semibold">🌾 Carbs</div>
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="text-center glass rounded-xl p-4 border-2 border-purple-300/30 bg-gradient-to-br from-purple-300/10 to-transparent"
        >
          <div className="text-2xl font-bold text-purple-300 mb-1">{meal.totalFat}g</div>
          <div className="text-xs text-gray-300 font-semibold">🥑 Fat</div>
        </motion.div>
      </div>

      {/* Expanded Details - Playful */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t-2 border-white/20 pt-5 mt-5 space-y-3"
        >
          <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-lg">
            <span className="text-2xl">🍴</span>
            What's Inside This Delicious Meal?
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {meal.items.map((item, index) => (
              <motion.div
                key={item.food.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between glass rounded-xl p-4 border-2 border-white/10 active:border-yellow-400/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    className="text-3xl"
                  >
                    {item.food.emoji || '🍽️'}
                  </motion.span>
                  <div>
                    <div className="font-bold text-white text-base">
                      {item.food.name} {item.portion !== 1 ? `(${item.portion}x)` : ''}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{item.food.servingSize}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-yellow-400 bg-yellow-400/20 px-3 py-1 rounded-full">
                    {Math.round(item.calories)} cal
                  </span>
                  <motion.button
                    onClick={() => onRemoveItem(item.food)}
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-red-500/20 border-2 border-red-400/50 text-red-400 hover:bg-red-500/30 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.button
            onClick={onSaveCustom}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 glass border-2 border-yellow-400/50 rounded-xl text-white font-bold flex items-center justify-center gap-2 active:bg-yellow-400/20 transition-all mt-4"
          >
            <Save className="w-5 h-5" />
            <span>💾 Save as Custom Meal</span>
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Auth Dialog Component
interface AuthDialogProps {
  onContinueAsGuest: () => void;
  onLogin: () => void;
  onClose: () => void;
}

function AuthDialog({ onContinueAsGuest, onLogin, onClose }: AuthDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full border-2 border-yellow-400/30 shadow-2xl"
      >
        <div className="text-center mb-6">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="inline-block mb-4"
          >
            <span className="text-6xl sm:text-7xl">🎉</span>
          </motion.div>
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2">
            <span className="text-yellow-400">Ready to Start?</span>
          </h3>
          <p className="text-gray-300 text-sm sm:text-base">
            Choose how you'd like to continue your journey! ✨
          </p>
        </div>

        <div className="space-y-4">
          <motion.button
            onClick={onContinueAsGuest}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-xl font-bold text-lg text-gray-900 shadow-xl transition-all relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FCD34D 0%, #FDE047 50%, #FCD34D 100%)',
              boxShadow: '0 0 20px rgba(252, 211, 77, 0.6), 0 0 40px rgba(252, 211, 77, 0.4)',
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="text-xl">👤</span>
              <span>Continue as Guest</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent opacity-60 rounded-xl"></div>
          </motion.button>

          <motion.button
            onClick={onLogin}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-xl font-bold text-lg text-white glass border-2 border-purple-300/50 active:border-purple-300 transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              <span className="text-xl">🔐</span>
              <span>Login</span>
            </span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Custom Meal Modal
interface CustomMealModalProps {
  meal: MealCombination;
  onClose: () => void;
  onSave: (meal: MealCombination, name: string) => void;
}

function CustomMealModal({ meal, onClose, onSave }: CustomMealModalProps) {
  const [mealName, setMealName] = useState(meal.description);

  const handleSave = () => {
    if (mealName.trim()) {
      onSave(meal, mealName.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl p-6 max-w-md w-full border border-white/20"
      >
        <h3 className="text-xl font-heading font-bold text-white mb-4">Save Custom Meal</h3>
        <input
          type="text"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          placeholder="Enter meal name..."
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 mb-4"
        />
        <div className="flex gap-3">
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-4 py-2 glass border border-white/20 text-white rounded-lg"
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold"
          >
            Save
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

