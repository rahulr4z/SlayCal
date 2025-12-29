import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Trash2, Award, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { FoodItem, foodDatabase } from '../data/foodDatabase';
import { getMealCombinations, MealCombination } from '../utils/mealCombinations';
// Using CSS-based circular progress instead
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FoodTrackerProps {
  userData: any;
  onClose?: () => void;
}

interface LoggedFood {
  id: string;
  food: FoodItem;
  portion: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: Date;
}

interface DailyLog {
  date: string;
  foods: LoggedFood[];
  totalCalories: number;
}

export default function FoodTracker({ userData, onClose }: FoodTrackerProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showLogMeal, setShowLogMeal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [dailyLogs, setDailyLogs] = useState<Map<string, DailyLog>>(new Map());
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);

  const targetCalories = userData?.dailyCalorieAllowance || 2000;
  const dateString = currentDate.toISOString().split('T')[0];
  const currentLog = dailyLogs.get(dateString) || { date: dateString, foods: [], totalCalories: 0 };

  // Calculate totals
  const consumedCalories = currentLog.totalCalories;
  const remainingCalories = Math.max(0, targetCalories - consumedCalories);
  const progressPercentage = Math.min((consumedCalories / targetCalories) * 100, 100);

  // Calculate streak
  useEffect(() => {
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      const log = dailyLogs.get(dateStr);
      if (log && log.foods.length > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  }, [dailyLogs]);

  // Check achievements
  useEffect(() => {
    const newAchievements: string[] = [];
    if (streak >= 7) newAchievements.push('week-warrior');
    if (streak >= 30) newAchievements.push('month-master');
    if (consumedCalories <= targetCalories + 50 && consumedCalories >= targetCalories - 50) {
      newAchievements.push('perfect-day');
    }
    setAchievements(newAchievements);
  }, [streak, consumedCalories, targetCalories]);

  const handleAddFood = (food: FoodItem, portion: number) => {
    const newFood: LoggedFood = {
      id: `${Date.now()}-${Math.random()}`,
      food,
      portion,
      mealType: selectedMealType,
      timestamp: new Date(),
    };

    setDailyLogs(prev => {
      const newMap = new Map(prev);
      const existingLog = newMap.get(dateString) || { date: dateString, foods: [], totalCalories: 0 };
      const updatedLog = {
        ...existingLog,
        foods: [...existingLog.foods, newFood],
        totalCalories: existingLog.totalCalories + (food.calories * portion),
      };
      newMap.set(dateString, updatedLog);
      return newMap;
    });

    setShowLogMeal(false);
  };

  const handleDeleteFood = (foodId: string) => {
    setDailyLogs(prev => {
      const newMap = new Map(prev);
      const existingLog = newMap.get(dateString);
      if (existingLog) {
        const foodToRemove = existingLog.foods.find(f => f.id === foodId);
        if (foodToRemove) {
          const updatedLog = {
            ...existingLog,
            foods: existingLog.foods.filter(f => f.id !== foodId),
            totalCalories: existingLog.totalCalories - (foodToRemove.food.calories * foodToRemove.portion),
          };
          newMap.set(dateString, updatedLog);
        }
      }
      return newMap;
    });
  };

  // Group foods by meal type
  const foodsByMeal = useMemo(() => {
    const grouped: Record<string, LoggedFood[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };
    currentLog.foods.forEach(food => {
      grouped[food.mealType].push(food);
    });
    return grouped;
  }, [currentLog]);

  // Weekly data
  const weeklyData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const log = dailyLogs.get(dateStr);
      data.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        calories: log?.totalCalories || 0,
        target: targetCalories,
      });
    }
    return data;
  }, [currentDate, dailyLogs, targetCalories]);

  const getCalorieColor = () => {
    const diff = consumedCalories - targetCalories;
    if (diff <= -200) return 'text-purple-300';
    if (diff >= 200) return 'text-red-400';
    if (Math.abs(diff) <= 50) return 'text-yellow-400';
    return 'text-yellow-400';
  };

  const mealTypes: Array<{ type: 'breakfast' | 'lunch' | 'dinner' | 'snack'; label: string; emoji: string }> = [
    { type: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { type: 'lunch', label: 'Lunch', emoji: '☀️' },
    { type: 'dinner', label: 'Dinner', emoji: '🌙' },
    { type: 'snack', label: 'Snacks', emoji: '🍿' },
  ];

  return (
    <div className="min-h-screen gradient-bg pb-20">
      {/* Header - Playful Design */}
      <div className="sticky top-0 z-40 glass border-b-2 border-yellow-400/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-5 sm:py-6">
          <div className="flex items-center justify-between mb-4">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white"
            >
              <span className="text-yellow-400 flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🍽️
                </motion.span>
                Food Tracker
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  ✨
                </motion.span>
              </span>
            </motion.h1>
            <div className="flex items-center gap-3">
              <motion.select
                whileTap={{ scale: 0.95 }}
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="px-4 py-2.5 rounded-xl bg-white/10 border-2 border-yellow-400/30 text-white text-sm font-semibold focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all min-h-[44px] cursor-pointer"
              >
                <option value="daily">📅 Daily</option>
                <option value="weekly">📊 Weekly</option>
                <option value="monthly">📆 Monthly</option>
              </motion.select>
              {onClose && (
                <motion.button
                  onClick={onClose}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ rotate: 90 }}
                  className="p-2 glass border-2 border-white/20 rounded-xl text-white active:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Date Navigation - Playful */}
          {viewMode === 'daily' && (
            <div className="flex items-center justify-center gap-4">
              <motion.button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setDate(newDate.getDate() - 1);
                  setCurrentDate(newDate);
                }}
                whileTap={{ scale: 0.9 }}
                className="p-2 glass border-2 border-yellow-400/30 rounded-xl text-yellow-400 active:bg-yellow-400/20 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <div className="text-white font-bold text-base sm:text-lg px-4 py-2 glass rounded-xl border-2 border-yellow-400/20">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <motion.button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setDate(newDate.getDate() + 1);
                  if (newDate <= new Date()) {
                    setCurrentDate(newDate);
                  }
                }}
                whileTap={{ scale: 0.9 }}
                className="p-2 glass border-2 border-yellow-400/30 rounded-xl text-yellow-400 active:bg-yellow-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentDate.toDateString() === new Date().toDateString()}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-8">
        {viewMode === 'daily' ? (
          <>
            {/* Calorie Counter - Playful Design */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6 sm:p-8 mb-8 border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 via-purple-300/10 to-yellow-400/5 shadow-2xl shadow-yellow-400/20"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center">
                <motion.div 
                  className="flex flex-col items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-4">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <svg className="transform -rotate-90 w-40 h-40 sm:w-48 sm:h-48">
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="16"
                          fill="none"
                        />
                        <motion.circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke={progressPercentage > 100 ? '#EF4444' : progressPercentage > 80 ? '#FCD34D' : '#FCD34D'}
                          strokeWidth="16"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 88}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - progressPercentage / 100) }}
                          transition={{ duration: 1 }}
                        />
                      </svg>
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <motion.div 
                          className="text-2xl sm:text-3xl font-bold text-white"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {Math.round(progressPercentage)}%
                        </motion.div>
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-2xl"
                        >
                          {progressPercentage > 100 ? '🔥' : progressPercentage > 80 ? '⚡' : '💪'}
                        </motion.span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <motion.div 
                      className={`text-3xl sm:text-4xl font-bold ${getCalorieColor()} flex items-center justify-center gap-2`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {consumedCalories}
                      <span className="text-2xl">🔥</span>
                    </motion.div>
                    <div className="text-gray-300 text-sm sm:text-base flex items-center justify-center gap-1">
                      <span>of</span>
                      <span className="text-yellow-400 font-semibold">{targetCalories}</span>
                      <span>cal</span>
                    </div>
                  </div>
                </motion.div>

                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass rounded-2xl p-5 border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 via-yellow-400/5 to-transparent shadow-lg shadow-yellow-400/20"
                  >
                    <motion.div 
                      className="text-3xl font-bold text-yellow-400 mb-1 flex items-center gap-2"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {remainingCalories}
                      <motion.span
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        🔥
                      </motion.span>
                    </motion.div>
                    <div className="text-sm text-gray-300 font-semibold flex items-center gap-1">
                      <span>Remaining Calories</span>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass rounded-2xl p-5 border-2 border-purple-300/30 bg-gradient-to-br from-purple-300/10 via-purple-300/5 to-transparent shadow-lg shadow-purple-300/20"
                  >
                    <motion.div 
                      className="flex items-center gap-2 text-3xl font-bold text-purple-300 mb-1"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Flame className="w-6 h-6" />
                      </motion.div>
                      {streak}
                    </motion.div>
                    <div className="text-sm text-gray-300 font-semibold flex items-center gap-1">
                      <span>Day Streak</span>
                      {streak >= 7 && <span className="text-yellow-400">🏆</span>}
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-3">
                  {achievements.length > 0 ? (
                    achievements.map((achievement, idx) => (
                      <motion.div
                        key={achievement}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: idx * 0.2, type: "spring", stiffness: 200 }}
                        whileHover={{ scale: 1.05, y: -3 }}
                        className="glass rounded-2xl p-4 border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 via-yellow-400/5 to-transparent flex items-center gap-3 shadow-lg shadow-yellow-400/20"
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Award className="w-6 h-6 text-yellow-400" />
                        </motion.div>
                        <div>
                          <div className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                            {achievement === 'week-warrior' ? (
                              <>
                                <span>Week Warrior!</span>
                                <motion.span
                                  animate={{ scale: [1, 1.3, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  🏆
                                </motion.span>
                              </>
                            ) : achievement === 'month-master' ? (
                              <>
                                <span>Month Master!</span>
                                <motion.span
                                  animate={{ scale: [1, 1.3, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  👑
                                </motion.span>
                              </>
                            ) : (
                              <>
                                <span>Perfect Day!</span>
                                <motion.span
                                  animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  ⭐
                                </motion.span>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass rounded-2xl p-4 border-2 border-white/10 text-center"
                    >
                      <div className="text-gray-400 text-sm">Keep logging to unlock achievements! 🎯</div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Meal Sections - Playful Cards */}
            <div className="space-y-6">
              {mealTypes.map(({ type, label, emoji }, idx) => {
                const foods = foodsByMeal[type];
                const mealCalories = foods.reduce((sum, f) => sum + (f.food.calories * f.portion), 0);
                
                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 border-yellow-400/20 hover:border-yellow-400/40 transition-all shadow-lg hover:shadow-xl hover:shadow-yellow-400/20"
                  >
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                      <div className="flex items-center gap-3">
                        <motion.span 
                          className="text-3xl sm:text-4xl"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }}
                        >
                          {emoji}
                        </motion.span>
                        <div>
                          <h3 className="text-lg sm:text-xl font-heading font-bold text-white flex items-center gap-2">
                            {label}
                            {mealCalories > 0 && (
                              <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-yellow-400"
                              >
                                ✨
                              </motion.span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-300 font-semibold flex items-center gap-1">
                            <span className="text-yellow-400">{mealCalories}</span>
                            <span>calories</span>
                          </p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => {
                          setSelectedMealType(type);
                          setShowLogMeal(true);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base text-gray-900 min-h-[44px] touch-manipulation relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, #FCD34D 0%, #FDE047 50%, #FCD34D 100%)',
                          boxShadow: '0 0 20px rgba(252, 211, 77, 0.4)',
                        }}
                      >
                        <motion.span
                          animate={{ rotate: [0, 90, 0] }}
                          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.span>
                        <span className="hidden sm:inline">Log Meal</span>
                        <span className="sm:hidden">Add</span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent opacity-60 rounded-xl"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        />
                      </motion.button>
                    </div>

                    {foods.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 text-gray-400"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-4xl mb-2"
                        >
                          🍽️
                        </motion.div>
                        <p className="text-sm sm:text-base">No foods logged yet</p>
                        <p className="text-xs mt-1 text-gray-500">Tap the button above to add! 👆</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        {foods.map((food, foodIdx) => (
                          <motion.div
                            key={food.id}
                            initial={{ opacity: 0, x: -20, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ delay: foodIdx * 0.05 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-between glass rounded-xl p-3 sm:p-4 border-2 border-white/10 hover:border-yellow-400/30 transition-all bg-gradient-to-r from-white/5 to-transparent"
                          >
                            <div className="flex items-center gap-3">
                              <motion.span 
                                className="text-2xl sm:text-3xl"
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 3, repeat: Infinity, delay: foodIdx * 0.2 }}
                              >
                                {food.food.emoji}
                              </motion.span>
                              <div>
                                <div className="font-semibold text-white text-sm sm:text-base flex items-center gap-2">
                                  {food.food.name}
                                  <motion.span
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-xs"
                                  >
                                    ✨
                                  </motion.span>
                                </div>
                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                  <span>{food.portion}x</span>
                                  <span>•</span>
                                  <span className="text-yellow-400 font-semibold flex items-center gap-1">
                                    {Math.round(food.food.calories * food.portion)} cal
                                    <span className="text-xs">🔥</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <motion.button
                              onClick={() => handleDeleteFood(food.id)}
                              whileHover={{ scale: 1.1, rotate: 90 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 rounded-lg bg-red-500/20 border-2 border-red-400/50 text-red-400 active:bg-red-500/30 transition-all hover:shadow-lg hover:shadow-red-400/30"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : viewMode === 'weekly' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-6 sm:p-8 border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 to-purple-300/10 shadow-2xl shadow-yellow-400/20"
          >
            <motion.h2 
              className="text-2xl sm:text-3xl font-heading font-bold text-white mb-6 flex items-center gap-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span 
                className="text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📊
              </motion.span>
              <span className="text-yellow-400">Weekly Overview</span>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </motion.h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    border: '2px solid rgba(252, 211, 77, 0.5)',
                    borderRadius: '12px',
                    color: '#fff',
                    boxShadow: '0 0 20px rgba(252, 211, 77, 0.3)',
                  }}
                />
                <Bar dataKey="calories" fill="#FCD34D" radius={[8, 8, 0, 0]} />
                <Bar dataKey="target" fill="rgba(252, 211, 77, 0.2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-6 sm:p-8 border-2 border-purple-300/30 bg-gradient-to-br from-purple-300/10 to-yellow-400/10 shadow-2xl shadow-purple-300/20"
          >
            <motion.h2 
              className="text-2xl sm:text-3xl font-heading font-bold text-white mb-6 flex items-center gap-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span 
                className="text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📆
              </motion.span>
              <span className="text-purple-300">Monthly Overview</span>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </motion.h2>
            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {Array.from({ length: 30 }, (_, i) => {
                const date = new Date(currentDate);
                date.setDate(date.getDate() - (29 - i));
                const dateStr = date.toISOString().split('T')[0];
                const log = dailyLogs.get(dateStr);
                const calories = log?.totalCalories || 0;
                const diff = calories - targetCalories;
                let color = 'bg-white/10';
                let emoji = '';
                if (Math.abs(diff) <= 50) {
                  color = 'bg-yellow-400';
                  emoji = '⭐';
                } else if (diff <= -200) {
                  color = 'bg-purple-300';
                  emoji = '💪';
                } else if (diff >= 200) {
                  color = 'bg-red-400';
                  emoji = '⚠️';
                } else if (calories > 0) {
                  color = 'bg-yellow-400/50';
                  emoji = '🔥';
                }
                
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    className="aspect-square glass rounded-xl border-2 border-white/10 p-2 cursor-pointer"
                  >
                    <div className={`w-full h-full rounded-lg ${color} flex flex-col items-center justify-center text-xs font-bold text-white relative overflow-hidden`}>
                      <span>{date.getDate()}</span>
                      {emoji && (
                        <motion.span
                          className="text-xs mt-0.5"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          {emoji}
                        </motion.span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Log Meal Modal */}
      <AnimatePresence>
        {showLogMeal && (
          <LogMealModal
            mealType={selectedMealType}
            onClose={() => setShowLogMeal(false)}
            onAddFood={handleAddFood}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Log Meal Modal Component
interface LogMealModalProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  onClose: () => void;
  onAddFood: (food: FoodItem, portion: number) => void;
}

function LogMealModal({ mealType, onClose, onAddFood }: LogMealModalProps) {
  const [selectionType, setSelectionType] = useState<'meal' | 'food'>('meal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<MealCombination | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('North Indian');
  const [portion, setPortion] = useState(1);

  // Get all unique cuisines
  const allCuisines = useMemo(() => {
    const cuisines = Array.from(new Set(foodDatabase.map(food => food.cuisine))).sort();
    return cuisines;
  }, []);

  // Get meal combinations for selected cuisine and meal type
  const mealCombinations = useMemo(() => {
    if (selectionType === 'meal') {
      return getMealCombinations(selectedCuisine, mealType, 'both');
    }
    return [];
  }, [selectedCuisine, mealType, selectionType]);

  // Filter meal combinations by search query
  const filteredMeals = useMemo(() => {
    if (selectionType === 'meal' && searchQuery) {
      return mealCombinations.filter(meal =>
        meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.items.some(item => item.food.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return mealCombinations;
  }, [mealCombinations, searchQuery, selectionType]);

  // Filter foods
  const filteredFoods = useMemo(() => {
    if (selectionType === 'food') {
      return foodDatabase.filter(food =>
        food.suitableMealTypes.includes(mealType) &&
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 10);
    }
    return [];
  }, [selectionType, mealType, searchQuery]);

  // Handle adding a meal (multiple foods)
  const handleAddMeal = (meal: MealCombination) => {
    meal.items.forEach(item => {
      onAddFood(item.food, item.portion);
    });
    setSelectedMeal(null);
    setSearchQuery('');
  };

  const mealEmojis: Record<string, string> = {
    'breakfast': '🌅',
    'lunch': '☀️',
    'dinner': '🌙',
    'snack': '🍿',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-3xl p-5 sm:p-8 max-w-2xl w-full border-2 border-yellow-400/30 max-h-[90vh] overflow-y-auto shadow-2xl bg-gradient-to-br from-yellow-400/5 via-purple-300/5 to-yellow-400/5"
      >
        <div className="flex items-center justify-between mb-6">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.span 
              className="text-4xl"
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {mealEmojis[mealType] || '🍽️'}
            </motion.span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              <span className="text-yellow-400 flex items-center gap-2">
                Log {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              </span>
            </h2>
          </motion.div>
          <motion.button
            onClick={onClose}
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 glass border-2 border-white/20 rounded-xl text-white active:bg-white/10 transition-all hover:border-red-400/50"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="space-y-5">
          {/* Selection Type Toggle - Playful */}
          <div className="flex items-center gap-3">
            <label className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
              <span className="text-xl">📋</span>
              <span>Choose:</span>
            </label>
            <div className="flex gap-2 flex-1">
              <motion.button
                onClick={() => {
                  setSelectionType('meal');
                  setSelectedFood(null);
                  setSelectedMeal(null);
                  setSearchQuery('');
                }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm sm:text-base transition-all min-h-[44px] ${
                  selectionType === 'meal'
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 border-2 border-yellow-400 shadow-lg shadow-yellow-400/50'
                    : 'glass border-2 border-white/20 text-white active:border-yellow-400/50'
                }`}
              >
                🍽️ Meal
              </motion.button>
              <motion.button
                onClick={() => {
                  setSelectionType('food');
                  setSelectedFood(null);
                  setSelectedMeal(null);
                  setSearchQuery('');
                }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm sm:text-base transition-all min-h-[44px] ${
                  selectionType === 'food'
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 border-2 border-yellow-400 shadow-lg shadow-yellow-400/50'
                    : 'glass border-2 border-white/20 text-white active:border-yellow-400/50'
                }`}
              >
                🥗 Food
              </motion.button>
            </div>
          </div>

          {/* Cuisine Selection (only for meals) - Playful */}
          {selectionType === 'meal' && (
            <div className="flex items-center gap-3">
              <label className="text-white font-semibold text-sm sm:text-base flex items-center gap-2 whitespace-nowrap">
                <span className="text-xl">🌍</span>
                <span>Cuisine:</span>
              </label>
              <select
                value={selectedCuisine}
                onChange={(e) => {
                  setSelectedCuisine(e.target.value);
                  setSelectedMeal(null);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border-2 border-yellow-400/30 text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all min-h-[44px] font-semibold"
              >
                {allCuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>
          )}

          {/* Search Input - Playful */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={selectionType === 'meal' ? '🔍 Search meals...' : '🔍 Search foods...'}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border-2 border-yellow-400/30 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all min-h-[48px] text-base"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 text-xl">
              🔍
            </div>
          </div>

          {/* Meal Combinations List - Playful Cards */}
          {selectionType === 'meal' && (
            <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto scrollbar-hide">
              {filteredMeals.length > 0 ? (
                filteredMeals.map((meal, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
                    onClick={() => setSelectedMeal(meal)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-2xl text-left transition-all ${
                      selectedMeal?.name === meal.name
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 border-2 border-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/50'
                        : 'glass border-2 border-white/10 hover:border-yellow-400/50 active:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-400/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <motion.span 
                        className="text-3xl"
                        animate={selectedMeal?.name === meal.name ? { rotate: [0, 15, -15, 0] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {meal.name.includes('Breakfast') ? '🌅' : meal.name.includes('Lunch') ? '☀️' : meal.name.includes('Dinner') ? '🌙' : '🍿'}
                      </motion.span>
                      <div className="flex-1">
                        <div className={`font-bold text-base sm:text-lg flex items-center gap-2 ${selectedMeal?.name === meal.name ? 'text-gray-900' : 'text-white'}`}>
                          {meal.name}
                          {selectedMeal?.name === meal.name && (
                            <motion.span
                              animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              ✨
                            </motion.span>
                          )}
                        </div>
                        <div className={`text-xs sm:text-sm mt-1 flex items-center gap-1 ${selectedMeal?.name === meal.name ? 'text-gray-700' : 'text-gray-300'}`}>
                          <span className="font-semibold text-yellow-400">{meal.totalCalories} cal</span>
                          <span>•</span>
                          <span>{meal.items.length} items</span>
                        </div>
                      </div>
                      {selectedMeal?.name === meal.name && (
                        <motion.span 
                          className="text-2xl"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          ✅
                        </motion.span>
                      )}
                    </div>
                  </motion.button>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-400 py-8"
                >
                  <motion.div 
                    className="text-4xl mb-2"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🍽️
                  </motion.div>
                  <p className="text-sm">No meals found for {selectedCuisine} {mealType}</p>
                </motion.div>
              )}
            </div>
          )}

          {/* Food Items List - Playful Cards */}
          {selectionType === 'food' && (
            <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto scrollbar-hide">
              {filteredFoods.map((food, index) => (
                <motion.button
                  key={food.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
                  onClick={() => setSelectedFood(food)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-2xl text-left transition-all ${
                    selectedFood?.id === food.id
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 border-2 border-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/50'
                      : 'glass border-2 border-white/10 hover:border-yellow-400/50 active:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-400/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <motion.span 
                      className="text-3xl"
                      animate={selectedFood?.id === food.id ? { rotate: [0, 15, -15, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {food.emoji}
                    </motion.span>
                    <div className="flex-1">
                      <div className={`font-bold text-base sm:text-lg flex items-center gap-2 ${selectedFood?.id === food.id ? 'text-gray-900' : 'text-white'}`}>
                        {food.name}
                        {selectedFood?.id === food.id && (
                          <motion.span
                            animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            ✨
                          </motion.span>
                        )}
                      </div>
                      <div className={`text-xs sm:text-sm mt-1 flex items-center gap-1 ${selectedFood?.id === food.id ? 'text-gray-700' : 'text-gray-300'}`}>
                        <span className="font-semibold text-yellow-400">{food.calories} cal</span>
                        <span>•</span>
                        <span>{food.servingSize}</span>
                      </div>
                    </div>
                    {selectedFood?.id === food.id && (
                      <motion.span 
                        className="text-2xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        ✅
                      </motion.span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Selected Meal Details - Playful */}
          {selectedMeal && selectionType === 'meal' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5 sm:p-6 border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-400/10 to-purple-300/10"
            >
              <div className="mb-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🍽️</span>
                  <div className="font-bold text-white text-lg sm:text-xl">{selectedMeal.name}</div>
                </div>
                <div className="text-sm text-gray-300 mb-4 flex items-center gap-2">
                  <span className="text-yellow-400 font-bold">{selectedMeal.totalCalories} cal</span>
                  <span>•</span>
                  <span>{selectedMeal.items.length} items</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="glass rounded-xl p-3 border-2 border-purple-300/30 text-center">
                    <div className="font-bold text-purple-300 text-lg">{selectedMeal.totalProtein}g</div>
                    <div className="text-xs text-gray-400 mt-1">💪 Protein</div>
                  </div>
                  <div className="glass rounded-xl p-3 border-2 border-yellow-400/30 text-center">
                    <div className="font-bold text-yellow-400 text-lg">{selectedMeal.totalCarbs}g</div>
                    <div className="text-xs text-gray-400 mt-1">🌾 Carbs</div>
                  </div>
                  <div className="glass rounded-xl p-3 border-2 border-purple-300/30 text-center">
                    <div className="font-bold text-purple-300 text-lg">{selectedMeal.totalFat}g</div>
                    <div className="text-xs text-gray-400 mt-1">🥑 Fat</div>
                  </div>
                </div>
                <div className="space-y-2 border-t-2 border-white/10 pt-4">
                  <div className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <span>📝</span>
                    <span>What's inside:</span>
                  </div>
                  {selectedMeal.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between glass rounded-lg p-2 border border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.food.emoji}</span>
                        <span className="text-xs sm:text-sm text-gray-300">{item.food.name} ({item.portion}x)</span>
                      </div>
                      <span className="text-xs sm:text-sm text-yellow-400 font-semibold">{item.calories} cal</span>
                    </div>
                  ))}
                </div>
              </div>
              <motion.button
                onClick={() => {
                  handleAddMeal(selectedMeal);
                }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-xl font-bold text-lg text-gray-900 transition-all relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #FCD34D 0%, #FDE047 50%, #FCD34D 100%)',
                  boxShadow: '0 0 20px rgba(252, 211, 77, 0.6), 0 0 40px rgba(252, 211, 77, 0.4)',
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>✨</span>
                  <span>Add Meal to {mealType}</span>
                  <span>🚀</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent opacity-60 rounded-xl"></div>
              </motion.button>
            </motion.div>
          )}

          {/* Selected Food Details - Playful */}
          {selectedFood && selectionType === 'food' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5 sm:p-6 border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-400/10 to-purple-300/10"
            >
              <div className="flex items-center gap-4 mb-5">
                <span className="text-4xl">{selectedFood.emoji}</span>
                <div className="flex-1">
                  <div className="font-bold text-white text-lg sm:text-xl mb-1">{selectedFood.name}</div>
                  <div className="text-sm text-gray-300">
                    <span className="text-yellow-400 font-semibold">{selectedFood.calories} cal</span> per serving
                  </div>
                </div>
              </div>
              
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-white flex items-center gap-2">
                    <span>⚖️</span>
                    <span>Portion:</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <motion.button
                      onClick={() => setPortion(Math.max(0.5, portion - 0.5))}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-xl bg-white/10 border-2 border-yellow-400/30 text-white flex items-center justify-center font-bold text-lg active:bg-yellow-400/20 transition-all"
                    >
                      -
                    </motion.button>
                    <span className="text-white font-bold text-xl w-12 text-center">{portion}</span>
                    <motion.button
                      onClick={() => setPortion(portion + 0.5)}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-xl bg-white/10 border-2 border-yellow-400/30 text-white flex items-center justify-center font-bold text-lg active:bg-yellow-400/20 transition-all"
                    >
                      +
                    </motion.button>
                  </div>
                </div>
                <div className="glass rounded-xl p-4 border-2 border-yellow-400/30 text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">
                    {Math.round(selectedFood.calories * portion)}
                  </div>
                  <div className="text-xs text-gray-300">Total Calories</div>
                </div>
              </div>
              
              <motion.button
                onClick={() => {
                  onAddFood(selectedFood, portion);
                  setSelectedFood(null);
                  setPortion(1);
                  setSearchQuery('');
                }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-xl font-bold text-lg text-gray-900 transition-all relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #FCD34D 0%, #FDE047 50%, #FCD34D 100%)',
                  boxShadow: '0 0 20px rgba(252, 211, 77, 0.6), 0 0 40px rgba(252, 211, 77, 0.4)',
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>✨</span>
                  <span>Add to {mealType}</span>
                  <span>🚀</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent opacity-60 rounded-xl"></div>
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

