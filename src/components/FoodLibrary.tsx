import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Plus, Minus, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { foodDatabase, FoodItem, searchFoods } from '../data/foodDatabase';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface FoodLibraryProps {
  onClose?: () => void;
  onAddToMeal?: (food: FoodItem, portion: number) => void;
  onAskSlayAI?: () => void;
}

export default function FoodLibrary({ onClose, onAddToMeal, onAskSlayAI }: FoodLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'calories-asc' | 'calories-desc' | 'protein-desc'>('name');
  const [selectedFoods, setSelectedFoods] = useState<Map<number, number>>(new Map());
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [expandedFood, setExpandedFood] = useState<number | null>(null);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };


  // Filter and search foods
  const filteredFoods = useMemo(() => {
    let foods = foodDatabase;

    // Search
    if (searchQuery) {
      foods = searchFoods(searchQuery);
    }

    // Sort
    foods = [...foods].sort((a, b) => {
      switch (sortBy) {
        case 'calories-asc':
          return a.calories - b.calories;
        case 'calories-desc':
          return b.calories - a.calories;
        case 'protein-desc':
          return b.protein - a.protein;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return foods;
  }, [searchQuery, sortBy]);

  // Group by cuisine for alphabet scroll
  const foodsByCuisine = useMemo(() => {
    const grouped: Record<string, FoodItem[]> = {};
    filteredFoods.forEach(food => {
      if (!grouped[food.cuisine]) {
        grouped[food.cuisine] = [];
      }
      grouped[food.cuisine].push(food);
    });
    return grouped;
  }, [filteredFoods]);

  const handlePortionChange = (foodId: number, delta: number) => {
    setSelectedFoods(prev => {
      const newMap = new Map(prev);
      const current = newMap.get(foodId) || 0;
      const newValue = Math.max(0, current + delta);
      if (newValue === 0) {
        newMap.delete(foodId);
      } else {
        newMap.set(foodId, newValue);
      }
      return newMap;
    });
  };

  const toggleFavorite = (foodId: number) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(foodId)) {
        newSet.delete(foodId);
      } else {
        newSet.add(foodId);
      }
      return newSet;
    });
  };


  const totalCalories = Array.from(selectedFoods.entries()).reduce((sum, [id, portion]) => {
    const food = foodDatabase.find(f => f.id === id);
    return sum + (food ? food.calories * portion : 0);
  }, 0);


  return (
    <div className="min-h-screen gradient-bg pb-20">
      {/* Header - Playful Design */}
      <div className="sticky top-0 z-40 glass border-b-2 border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-5 sm:py-6">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-3 sm:gap-4">
              {onClose && (
                <motion.button
                  onClick={onClose}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 glass border-2 border-white/20 rounded-xl text-white active:bg-white/10 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white">
                <span className="text-yellow-400">🍽️ Food Library</span>
              </h1>
            </div>
          </div>

          {/* Search Bar - Playful */}
          <div className="relative mb-4 sm:mb-5">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 text-xl">
              🔍
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="🔍 Search foods... (e.g., Roti, Biryani, Dosa)"
              className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-xl bg-white/10 border-2 border-yellow-400/30 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all min-h-[48px] text-base"
            />
            {searchQuery && (
              <motion.button
                onClick={() => setSearchQuery('')}
                whileTap={{ scale: 0.9 }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1 rounded-lg active:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}

            {/* Search Suggestions - Playful */}
            {searchQuery && filteredFoods.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl border-2 border-yellow-400/30 max-h-60 overflow-y-auto z-50 scrollbar-hide">
                {filteredFoods.slice(0, 5).map((food, index) => (
                  <motion.button
                    key={food.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setSearchQuery(food.name);
                      setExpandedFood(food.id);
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 text-white hover:bg-yellow-400/10 active:bg-yellow-400/20 transition-all border-b border-white/5 last:border-0"
                  >
                    <span className="text-2xl">{food.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm sm:text-base">{food.name}</div>
                      <div className="text-xs text-gray-400">{food.cuisine} • <span className="text-yellow-400 font-semibold">{food.calories} cal</span></div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Option - Playful */}
          <div className="flex items-center justify-end">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl bg-white/10 border-2 border-yellow-400/30 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all min-h-[44px] font-semibold text-sm sm:text-base"
            >
              <option value="name">📝 Sort: Name (A-Z)</option>
              <option value="calories-asc">⬆️ Sort: Calories (Low-High)</option>
              <option value="calories-desc">⬇️ Sort: Calories (High-Low)</option>
              <option value="protein-desc">💪 Sort: Protein (High-Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Total Calorie Counter - Playful Design */}
      <div className="sticky top-[280px] z-30 mb-8 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-yellow-400/20 to-purple-300/10 border-2 border-yellow-400/50 shadow-2xl backdrop-blur-xl"
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-300 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative flex flex-col items-center justify-center gap-5 sm:gap-6">
              {/* Large calorie number - Centered */}
              <div className="text-center">
                <motion.div
                  key={totalCalories}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-6xl sm:text-7xl lg:text-8xl font-black text-yellow-400 drop-shadow-2xl"
                >
                  {totalCalories}
                </motion.div>
                <div className="text-base sm:text-lg font-semibold text-white/80 mt-1">calories selected</div>
              </div>
              
              {/* Add to Meal Button - Centered */}
              {selectedFoods.size > 0 && onAddToMeal && (
                <motion.button
                  onClick={() => {
                    selectedFoods.forEach((portion, foodId) => {
                      const food = foodDatabase.find(f => f.id === foodId);
                      if (food) {
                        onAddToMeal(food, portion);
                      }
                    });
                    setSelectedFoods(new Map());
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg text-gray-900 shadow-2xl transition-all relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #FCD34D 0%, #FDE047 50%, #FCD34D 100%)',
                    boxShadow: '0 0 20px rgba(252, 211, 77, 0.6), 0 0 40px rgba(252, 211, 77, 0.4)',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>✨</span>
                    <span>Add to Meal</span>
                    <span>🚀</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent opacity-60 rounded-2xl"></div>
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>


      {/* Food List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-8">
        {filteredFoods.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🔍
            </motion.div>
            <p className="text-white text-xl mb-2 font-bold">No foods found</p>
            <p className="text-gray-400 mb-4">Try a different search term</p>
            <motion.button
              onClick={() => setSearchQuery('')}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl font-bold text-gray-900 transition-all"
              style={{
                background: 'linear-gradient(135deg, #FCD34D 0%, #FDE047 50%, #FCD34D 100%)',
                boxShadow: '0 0 20px rgba(252, 211, 77, 0.4)',
              }}
            >
              Clear Search
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {Object.entries(foodsByCuisine).map(([cuisine, foods]) => (
              <div key={cuisine} id={`cuisine-${cuisine}`} className="space-y-4 scroll-mt-32">
                <h2 className="text-xl sm:text-2xl font-heading font-bold text-white sticky top-[250px] bg-gradient-bg py-2 z-20">
                  <span className="text-yellow-400">{cuisine}</span>
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {foods.map((food) => (
                    <FoodCard
                      key={food.id}
                      food={food}
                      portion={selectedFoods.get(food.id) || 0}
                      onPortionChange={(delta) => handlePortionChange(food.id, delta)}
                      isFavorite={favorites.has(food.id)}
                      onToggleFavorite={() => toggleFavorite(food.id)}
                      isExpanded={expandedFood === food.id}
                      onToggleExpand={() => setExpandedFood(expandedFood === food.id ? null : food.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Ask Slay AI Button */}
      {onAskSlayAI && (
        <motion.button
          onClick={onAskSlayAI}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 px-5 py-4 rounded-2xl font-bold text-base sm:text-lg text-gray-900 shadow-2xl z-40 flex items-center gap-2 transition-all"
          style={{
            background: 'linear-gradient(135deg, #FCD34D 0%, #FDE047 50%, #FCD34D 100%)',
            boxShadow: `
              0 0 20px rgba(252, 211, 77, 0.6),
              0 0 40px rgba(252, 211, 77, 0.4),
              0 10px 30px rgba(252, 211, 77, 0.3)
            `,
          }}
        >
          <span className="text-xl sm:text-2xl">✨</span>
          <span className="hidden sm:inline">Ask Slay AI</span>
          <span className="sm:hidden">AI</span>
          <span className="text-xl sm:text-2xl">🤖</span>
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent opacity-60 rounded-2xl"></div>
        </motion.button>
      )}
    </div>
  );
}

// Food Card Component
interface FoodCardProps {
  food: FoodItem;
  portion: number;
  onPortionChange: (delta: number) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function FoodCard({
  food,
  portion,
  onPortionChange,
  isFavorite,
  onToggleFavorite,
  isExpanded,
  onToggleExpand,
}: FoodCardProps) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true });

  const displayCalories = portion > 0 ? Math.round(food.calories * portion) : food.calories;
  const displayProtein = portion > 0 ? Math.round(food.protein * portion) : food.protein;
  const displayCarbs = portion > 0 ? Math.round(food.carbs * portion) : food.carbs;
  const displayFat = portion > 0 ? Math.round(food.fat * portion) : food.fat;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      whileHover={{ scale: 1.02, y: -5 }}
      className="glass rounded-3xl p-6 lg:p-8 border-2 border-white/20 active:border-yellow-400/50 transition-all bg-gradient-to-br from-yellow-400/5 to-purple-300/5"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1">
          <h3 className="text-2xl font-heading font-bold text-white mb-3">
            <span className="text-yellow-400">{food.name}</span>
          </h3>
          <div className="flex items-center gap-4 text-base font-semibold">
            <span className="text-purple-300 flex items-center gap-1">
              <span className="text-xl">🍽️</span> {food.cuisine}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-orange-300 flex items-center gap-1">
              <span className="text-xl">📦</span> {food.servingSize}
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
          <div className="text-3xl font-bold text-yellow-400 mb-1">{displayCalories}</div>
          <div className="text-xs text-gray-300 font-semibold">🔥 Calories</div>
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="text-center glass rounded-xl p-4 border-2 border-purple-300/30 bg-gradient-to-br from-purple-300/10 to-transparent"
        >
          <div className="text-2xl font-bold text-purple-300 mb-1">{displayProtein}g</div>
          <div className="text-xs text-gray-300 font-semibold">💪 Protein</div>
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="text-center glass rounded-xl p-4 border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 to-transparent"
        >
          <div className="text-2xl font-bold text-yellow-400 mb-1">{displayCarbs}g</div>
          <div className="text-xs text-gray-300 font-semibold">🌾 Carbs</div>
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="text-center glass rounded-xl p-4 border-2 border-purple-300/30 bg-gradient-to-br from-purple-300/10 to-transparent"
        >
          <div className="text-2xl font-bold text-purple-300 mb-1">{displayFat}g</div>
          <div className="text-xs text-gray-300 font-semibold">🥑 Fat</div>
        </motion.div>
      </div>

      {/* Expanded Details - Playful */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t-2 border-white/20 pt-5 mt-5 space-y-3"
          >
            <h4 className="font-bold text-white mb-4 flex items-center gap-2 text-lg">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                {food.emoji || '🍽️'}
              </motion.span>
              Food Details
            </h4>
            <div className="glass rounded-xl p-4 border-2 border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-semibold">Serving Size:</span>
                <span className="text-white">{food.servingSize}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-semibold">Category:</span>
                <span className="text-white">{food.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-semibold">Suitable for:</span>
                <span className="text-white">{food.suitableMealTypes.join(', ')}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portion Controls - Playful */}
      <div className="flex items-center justify-between mt-5 pt-5 border-t-2 border-white/20" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300 font-semibold">⚖️ Portion:</span>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onPortionChange(-0.5);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl bg-white/10 border-2 border-yellow-400/30 active:bg-yellow-400/20 transition-all flex items-center justify-center"
          >
            <Minus className="w-5 h-5 text-white" />
          </motion.button>
          <span className="font-bold text-white w-16 text-center text-lg">{portion || 0}</span>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onPortionChange(0.5);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl bg-white/10 border-2 border-yellow-400/30 active:bg-yellow-400/20 transition-all flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-white" />
          </motion.button>
        </div>
        {portion > 0 && (
          <div className="text-right">
            <div className="text-lg font-bold text-yellow-400">
              {Math.round(food.calories * portion)} cal
            </div>
            <div className="text-xs text-gray-400">
              {food.calories} cal per serving
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}


