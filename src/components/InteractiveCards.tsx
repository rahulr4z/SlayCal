import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useMemo, useEffect } from 'react';
import { Calculator, Scale, X, TrendingDown, Calendar, Search, BookOpen, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import FoodLibrary from './FoodLibrary';
import { foodDatabase, FoodItem } from '../data/foodDatabase';
import { getMealCombinations } from '../utils/mealCombinations';

interface InteractiveCardsProps {
  onQuickToolToggle?: (isOpen: boolean) => void;
}

export default function InteractiveCards({ onQuickToolToggle }: InteractiveCardsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [showBMICalculator, setShowBMICalculator] = useState(false);
  const [showCalorieMeasure, setShowCalorieMeasure] = useState(false);
  const [showMealLibrary, setShowMealLibrary] = useState(false);
  const [showCalorieComparison, setShowCalorieComparison] = useState(false);

  // Track if any quick tool is open
  const isAnyQuickToolOpen = showBMICalculator || showCalorieMeasure || showMealLibrary || showCalorieComparison;

  // Notify parent when quick tools state changes
  useEffect(() => {
    if (onQuickToolToggle) {
      onQuickToolToggle(isAnyQuickToolOpen);
    }
  }, [isAnyQuickToolOpen, onQuickToolToggle]);

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl sm:text-5xl font-heading font-bold text-center mb-16 text-white"
        >
          Quick Tools
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          {/* BMI Calculator Card - Mobile Screen Style */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowBMICalculator(true)}
            className="cursor-pointer mt-0"
          >
            <div className="relative w-full max-w-[300px] mx-auto mb-6">
              {/* Phone Frame */}
              <div className="bg-white rounded-[3rem] p-2 shadow-2xl relative">
                {/* Decorative Element - Overlapping top-right of screen */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -top-4 -right-4 z-20 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white"
                >
                  <span className="text-3xl">📊</span>
                </motion.div>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-white rounded-b-2xl z-10"></div>
                
                {/* Screen */}
                <div className="bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-[2.5rem] overflow-hidden border-2 border-gray-200">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 pt-8 pb-2 text-gray-700 text-xs font-medium">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 border border-gray-600 rounded-sm"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Screen Content */}
                  <div className="px-6 pb-6 pt-4 min-h-[500px] flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Calculator className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-heading font-bold text-gray-800">
                        BMI Calculator
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-6">
                      Calculate your Body Mass Index and understand your health status
                    </p>
                    <div className="flex gap-3 mb-6">
                      {['🌱', '✨', '🎯', '💪'].map((emoji, i) => (
                        <span key={i} className="text-2xl">{emoji}</span>
                      ))}
                    </div>
                    <div className="mt-auto bg-white/80 rounded-xl p-6 border border-gray-200 shadow-lg">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-500 mb-2">24.5</div>
                        <div className="text-sm text-gray-600 font-medium">Normal BMI</div>
                        <div className="text-xs text-gray-500 mt-1">Healthy Range</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Title and Description Below */}
            <div className="text-center">
              <h3 className="text-2xl font-heading font-bold text-white mb-3">
                BMI Calculator
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
                Calculate your Body Mass Index and understand your health status with personalized recommendations
              </p>
            </div>
          </motion.div>

          {/* Calorie Measure Card - Mobile Screen Style */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowCalorieMeasure(true)}
            className="cursor-pointer mt-16 md:mt-20"
          >
            <div className="relative w-full max-w-[300px] mx-auto mb-6">
              {/* Phone Frame */}
              <div className="bg-white rounded-[3rem] p-2 shadow-2xl relative">
                {/* Decorative Element - Overlapping bottom-left of screen */}
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 z-20 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white"
                >
                  <span className="text-4xl">🍎</span>
                </motion.div>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-white rounded-b-2xl z-10"></div>
                
                {/* Screen */}
                <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-[2.5rem] overflow-hidden border-2 border-gray-200">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 pt-8 pb-2 text-gray-700 text-xs font-medium">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 border border-gray-600 rounded-sm"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Screen Content */}
                  <div className="px-6 pb-6 pt-4 min-h-[500px] flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Scale className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-heading font-bold text-gray-800">
                        Calorie Measure
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-6">
                      Track your daily calorie intake and get personalized recommendations
                    </p>
                    <div className="flex gap-3 mb-6">
                      {['🍎', '🥗', '🍗', '🥑'].map((emoji, i) => (
                        <span key={i} className="text-2xl">{emoji}</span>
                      ))}
                    </div>
                    <div className="mt-auto bg-white/80 rounded-xl p-6 border border-gray-200 shadow-lg">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-purple-500 mb-2">1,850</div>
                        <div className="text-sm text-gray-600 font-medium">Calories Today</div>
                        <div className="text-xs text-gray-500 mt-1">Goal: 2,000 cal</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Title and Description Below */}
            <div className="text-center">
              <h3 className="text-2xl font-heading font-bold text-white mb-3">
                Calorie Measure
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
                Track your daily calorie intake and get personalized recommendations for your health goals
              </p>
            </div>
          </motion.div>

          {/* Meal Library Card - Mobile Screen Style */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowMealLibrary(true)}
            className="cursor-pointer mt-8 md:mt-12"
          >
            <div className="relative w-full max-w-[300px] mx-auto mb-6">
              {/* Phone Frame */}
              <div className="bg-white rounded-[3rem] p-2 shadow-2xl relative">
                {/* Decorative Element - Overlapping bottom-right of screen */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1], y: [0, -6, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity }}
                  className="absolute -bottom-5 -right-5 z-20 w-22 h-22 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white"
                >
                  <span className="text-3xl">🍛</span>
                </motion.div>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-white rounded-b-2xl z-10"></div>
                
                {/* Screen */}
                <div className="bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-[2.5rem] overflow-hidden border-2 border-gray-200">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 pt-8 pb-2 text-gray-700 text-xs font-medium">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 border border-gray-600 rounded-sm"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Screen Content */}
                  <div className="px-6 pb-6 pt-4 min-h-[500px] flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        className="text-4xl"
                      >
                        📚
                      </motion.div>
                      <h3 className="text-xl font-heading font-bold text-gray-800">
                        Meal Library
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-6">
                      Browse meal combinations by cuisine and discover new recipes
                    </p>
                    <div className="flex gap-3 mb-6 flex-wrap">
                      {['🍛', '🥘', '🍲', '🍱'].map((emoji, i) => (
                        <span key={i} className="text-2xl">{emoji}</span>
                      ))}
                    </div>
                    <div className="mt-auto bg-white/80 rounded-xl p-6 border border-gray-200 shadow-lg">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-500 mb-2">200+</div>
                        <div className="text-sm text-gray-600 font-medium">Meal Combinations</div>
                        <div className="text-xs text-gray-500 mt-1">Across 13 cuisines</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Title and Description Below */}
            <div className="text-center">
              <h3 className="text-2xl font-heading font-bold text-white mb-3">
                Meal Library
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
                Browse meal combinations by cuisine and discover new recipes organized by theme and meal type
              </p>
            </div>
          </motion.div>

          {/* Calorie Comparison Card - Mobile Screen Style */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowCalorieComparison(true)}
            className="cursor-pointer mt-0 md:mt-24"
          >
            <div className="relative w-full max-w-[300px] mx-auto mb-6">
              {/* Phone Frame */}
              <div className="bg-white rounded-[3rem] p-2 shadow-2xl relative">
                {/* Decorative Element - Overlapping top-left of screen */}
                <motion.div
                  animate={{ scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="absolute -top-3 -left-3 z-20 w-18 h-18 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white"
                >
                  <span className="text-3xl">⚖️</span>
                </motion.div>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-white rounded-b-2xl z-10"></div>
                
                {/* Screen */}
                <div className="bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-[2.5rem] overflow-hidden border-2 border-gray-200">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 pt-8 pb-2 text-gray-700 text-xs font-medium">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 border border-gray-600 rounded-sm"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Screen Content */}
                  <div className="px-6 pb-6 pt-4 min-h-[500px] flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-4xl"
                      >
                        ⚖️
                      </motion.div>
                      <h3 className="text-xl font-heading font-bold text-gray-800">
                        Compare
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-6">
                      Compare calories and nutrition between any two food items
                    </p>
                    <div className="flex gap-3 mb-6 flex-wrap">
                      {['🥗', '🍔', '🍕', '🍜'].map((emoji, i) => (
                        <span key={i} className="text-2xl">{emoji}</span>
                      ))}
                    </div>
                    <div className="mt-auto bg-white/80 rounded-xl p-6 border border-gray-200 shadow-lg">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-orange-500 mb-2">VS</div>
                        <div className="text-sm text-gray-600 font-medium">Side by Side</div>
                        <div className="text-xs text-gray-500 mt-1">Nutrition Comparison</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Title and Description Below */}
            <div className="text-center">
              <h3 className="text-2xl font-heading font-bold text-white mb-3">
                Calorie Comparison
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
                Compare calories and nutrition between any two food items to make informed dietary choices
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* BMI Calculator Modal */}
      {showBMICalculator && (
        <BMICalculatorModal onClose={() => setShowBMICalculator(false)} />
      )}

      {/* Calorie Measure - Opens Food Library */}
      {showCalorieMeasure && (
        <CalorieMeasurePage onClose={() => setShowCalorieMeasure(false)} />
      )}

      {/* Meal Library Modal */}
      {showMealLibrary && (
        <MealLibraryModal onClose={() => setShowMealLibrary(false)} />
      )}

      {/* Calorie Comparison Modal */}
      {showCalorieComparison && (
        <CalorieComparisonModal onClose={() => setShowCalorieComparison(false)} />
      )}
    </section>
  );
}

// BMI Calculator Modal - Similar to Ideal Weight Calculator
type ActivityLevel = 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active';

function BMICalculatorModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer-not'>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately-active');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [results, setResults] = useState<any>(null);

  // HealthifyMe-style BMR calculation using Mifflin-St Jeor equation (standard)
  const calculateBMR = (weightKg: number, heightCm: number, age: number, gender: string) => {
    if (gender === 'male') {
      return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    } else if (gender === 'female') {
      return (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    } else {
      return ((10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5 + (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161) / 2;
    }
  };

  // HealthifyMe-style activity level multipliers for TDEE
  const getActivityMultiplier = (level: ActivityLevel): number => {
    const multipliers = {
      'sedentary': 1.2,           // Little or no exercise
      'lightly-active': 1.375,    // Light exercise 1-3 days/week
      'moderately-active': 1.55,  // Moderate exercise 3-5 days/week
      'very-active': 1.725,       // Hard exercise 6-7 days/week
      'extremely-active': 1.9      // Very hard exercise, physical job
    };
    return multipliers[level];
  };

  const calculateBMI = (weightKg: number, heightM: number) => {
    return weightKg / (heightM * heightM);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', emoji: '🌱', color: 'text-blue-400' };
    if (bmi < 25) return { category: 'Normal', emoji: '✨', color: 'text-green-400' };
    if (bmi < 30) return { category: 'Overweight', emoji: '🎯', color: 'text-yellow-400' };
    return { category: 'Obese', emoji: '💪', color: 'text-red-400' };
  };

  const handleCalculate = () => {
    const heightValue = parseFloat(height);
    const weightValue = parseFloat(weight);
    const ageValue = parseInt(age);

    if (!heightValue || !weightValue || !ageValue) return;

    // Convert to metric if needed
    const heightCm = unit === 'metric' ? heightValue : heightValue * 30.48;
    const weightKg = unit === 'metric' ? weightValue : weightValue * 0.453592;
    const heightM = heightCm / 100;

    // Calculate BMI
    const bmi = calculateBMI(weightKg, heightM);
    const bmiInfo = getBMICategory(bmi);

    // Calculate ideal weight range (BMI 18.5-24.9) - HealthifyMe standard
    const minIdealWeight = 18.5 * heightM * heightM;
    const maxIdealWeight = 24.9 * heightM * heightM;
    // Use midpoint as target, but emphasize the range
    const targetWeight = (minIdealWeight + maxIdealWeight) / 2;

    // Calculate BMR using standard formula
    const bmr = calculateBMR(weightKg, heightCm, ageValue, gender);

    // Calculate TDEE (Total Daily Energy Expenditure) using activity multiplier
    const activityMultiplier = getActivityMultiplier(activityLevel);
    const tdee = bmr * activityMultiplier;

    // HealthifyMe-style calorie deficit: 20-25% of TDEE for sustainable weight loss
    // This creates a deficit of approximately 500-750 calories per day
    const calorieDeficitPercentage = 0.22; // 22% average of TDEE
    const calorieDeficit = tdee * calorieDeficitPercentage;
    const dailyCalorieAllowance = Math.round(tdee - calorieDeficit);

    // Ensure minimum calorie intake (1200 for women, 1500 for men)
    const minCalories = gender === 'female' ? 1200 : 1500;
    const finalCalorieAllowance = Math.max(dailyCalorieAllowance, minCalories);

    // Calculate weight to lose
    const weightToLose = weightKg - targetWeight;

    // Estimate time to goal
    const weeksToGoal = Math.ceil(weightToLose / 0.75);

    const calculatedResults = {
      bmi: bmi.toFixed(1),
      bmiInfo,
      currentWeight: weightKg.toFixed(1),
      targetWeight: targetWeight.toFixed(1),
      minIdealWeight: minIdealWeight.toFixed(1),
      maxIdealWeight: maxIdealWeight.toFixed(1),
      weightToLose: weightToLose.toFixed(1),
      dailyCalorieAllowance: finalCalorieAllowance,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calorieDeficit: Math.round(calorieDeficit),
      activityLevel,
      weeksToGoal,
      monthsToGoal: Math.ceil(weeksToGoal / 4),
    };

    setResults(calculatedResults);
    setStep('results');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="min-h-screen gradient-bg relative">
          <div className="sticky top-0 z-40 glass border-b-2 border-yellow-400/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-4 sm:py-5">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl">🎯</span>
                  <span>
                    <span className="text-yellow-400">BMI Calculator</span>
                  </span>
                </h1>
                <motion.button
                  onClick={onClose}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 glass border-2 border-white/20 rounded-xl text-white active:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-8 lg:py-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-12 border border-white/20 shadow-2xl"
              >
                {step === 'input' && (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="text-center mb-6 sm:mb-8">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                        className="inline-block mb-3 sm:mb-4"
                      >
                        <span className="text-5xl sm:text-7xl">🎯</span>
                      </motion.div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent px-2">
                        Let's Calculate Your BMI! ✨
                      </h2>
                      <p className="text-gray-300 text-sm sm:text-base lg:text-lg px-2">Tell us about yourself and we'll calculate your BMI and ideal weight! 🚀</p>
                    </div>

                    {/* Unit Toggle - Mobile Friendly */}
                    <div className="flex justify-center mb-6 sm:mb-8">
                      <div className="glass rounded-2xl p-1.5 sm:p-2 w-full sm:w-auto inline-flex gap-1.5 sm:gap-2 border-2 border-purple-400/30">
                        <motion.button
                          onClick={() => setUnit('metric')}
                          whileTap={{ scale: 0.95 }}
                          className={`flex-1 sm:flex-none px-4 sm:px-6 py-3.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 min-h-[48px] ${
                            unit === 'metric' 
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 shadow-lg shadow-yellow-400/50' 
                              : 'text-gray-300 active:bg-white/10'
                          }`}
                        >
                          <span className="text-lg sm:text-xl">📏</span>
                          <span className="hidden sm:inline">Metric (kg, cm)</span>
                          <span className="sm:hidden">Metric</span>
                        </motion.button>
                        <motion.button
                          onClick={() => setUnit('imperial')}
                          whileTap={{ scale: 0.95 }}
                          className={`flex-1 sm:flex-none px-4 sm:px-6 py-3.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 min-h-[48px] ${
                            unit === 'imperial' 
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 shadow-lg shadow-yellow-400/50' 
                              : 'text-gray-300 active:bg-white/10'
                          }`}
                        >
                          <span className="text-lg sm:text-xl">📐</span>
                          <span className="hidden sm:inline">Imperial (lbs, ft)</span>
                          <span className="sm:hidden">Imperial</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Mobile-Friendly Input Cards - Evenly Distributed */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                      {/* Row 1: Height and Weight */}
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="glass rounded-2xl p-4 sm:p-6 border-2 border-yellow-400/20 active:border-yellow-400/40 transition-all"
                      >
                        <label className="block text-sm sm:text-base font-semibold text-white mb-3 flex items-center gap-2">
                          <span className="text-xl sm:text-2xl">📏</span>
                          <span>Height ({unit === 'metric' ? 'cm' : 'feet & inches'})</span>
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder={unit === 'metric' ? '170' : '5.6'}
                          className="w-full px-4 py-4 sm:py-4 rounded-xl bg-white/10 border-2 border-yellow-400/30 text-white text-base sm:text-lg placeholder-gray-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30 transition-all min-h-[48px]"
                        />
                      </motion.div>

                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="glass rounded-2xl p-4 sm:p-6 border-2 border-purple-300/20 active:border-purple-300/40 transition-all"
                      >
                        <label className="block text-sm sm:text-base font-semibold text-white mb-3 flex items-center gap-2">
                          <span className="text-xl sm:text-2xl">⚖️</span>
                          <span>Current Weight ({unit === 'metric' ? 'kg' : 'lbs'})</span>
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder={unit === 'metric' ? '70' : '154'}
                          className="w-full px-4 py-4 sm:py-4 rounded-xl bg-white/10 border-2 border-purple-300/30 text-white text-base sm:text-lg placeholder-gray-400 focus:border-purple-300 focus:ring-4 focus:ring-purple-300/30 transition-all min-h-[48px]"
                        />
                      </motion.div>

                      {/* Row 2: Age and Gender */}
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="glass rounded-2xl p-4 sm:p-6 border-2 border-yellow-400/20 active:border-yellow-400/40 transition-all"
                      >
                        <label className="block text-sm sm:text-base font-semibold text-white mb-3 flex items-center gap-2">
                          <span className="text-xl sm:text-2xl">🎂</span>
                          <span>Age (years)</span>
                        </label>
                        <input
                          type="number"
                          inputMode="numeric"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="25"
                          className="w-full px-4 py-4 sm:py-4 rounded-xl bg-white/10 border-2 border-yellow-400/30 text-white text-base sm:text-lg placeholder-gray-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30 transition-all min-h-[48px]"
                        />
                      </motion.div>

                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="glass rounded-2xl p-4 sm:p-6 border-2 border-yellow-400/20 active:border-yellow-400/40 transition-all"
                      >
                        <label className="block text-sm sm:text-base font-semibold text-white mb-3 flex items-center gap-2">
                          <span className="text-xl sm:text-2xl">👤</span>
                          <span>Gender</span>
                        </label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value as any)}
                          className="w-full px-4 py-4 sm:py-4 rounded-xl bg-white/10 border-2 border-yellow-400/30 text-white text-base sm:text-lg focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30 transition-all min-h-[48px] appearance-none"
                        >
                          <option value="male">👨 Male</option>
                          <option value="female">👩 Female</option>
                          <option value="other">🌈 Other</option>
                          <option value="prefer-not">🤐 Prefer not to say</option>
                        </select>
                      </motion.div>

                      {/* Row 3: Activity Level - Full Width */}
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="md:col-span-2 glass rounded-2xl p-4 sm:p-6 border-2 border-purple-300/20 active:border-purple-300/40 transition-all"
                      >
                        <label className="block text-sm sm:text-base font-semibold text-white mb-3 flex items-center gap-2">
                          <span className="text-xl sm:text-2xl">🏃</span>
                          <span>Activity Level</span>
                        </label>
                        <select
                          value={activityLevel}
                          onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                          className="w-full px-4 py-4 sm:py-4 rounded-xl bg-white/10 border-2 border-purple-300/30 text-white text-base sm:text-lg focus:border-purple-300 focus:ring-4 focus:ring-purple-300/30 transition-all min-h-[48px] appearance-none"
                        >
                          <option value="sedentary">🛋️ Sedentary (Little or no exercise)</option>
                          <option value="lightly-active">🚶 Lightly Active (Light exercise 1-3 days/week)</option>
                          <option value="moderately-active">🏃 Moderately Active (Moderate exercise 3-5 days/week)</option>
                          <option value="very-active">💪 Very Active (Hard exercise 6-7 days/week)</option>
                          <option value="extremely-active">🔥 Extremely Active (Very hard exercise, physical job)</option>
                        </select>
                        <p className="text-xs sm:text-sm text-gray-300 mt-3 flex items-center gap-2">
                          <span>💡</span>
                          <span>This helps us calculate your accurate daily calorie needs!</span>
                        </p>
                      </motion.div>
                    </div>

                    <motion.button
                      onClick={handleCalculate}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-5 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl shadow-2xl active:shadow-yellow-400/50 transition-all relative overflow-hidden min-h-[56px] touch-manipulation text-gray-900"
                      style={{
                        background: 'linear-gradient(135deg, #FCD34D 0%, #FDE047 50%, #FCD34D 100%)',
                        boxShadow: `
                          0 0 20px rgba(252, 211, 77, 0.6),
                          0 0 40px rgba(252, 211, 77, 0.4),
                          0 10px 30px rgba(252, 211, 77, 0.3)
                        `,
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <span className="text-xl sm:text-2xl">✨</span>
                        <span>Calculate BMI</span>
                        <span className="text-xl sm:text-2xl">🚀</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent opacity-60 rounded-2xl"></div>
                    </motion.button>
                  </motion.div>
                )}

                {step === 'results' && results && (
                  <BMIResultsDisplay results={results} currentWeight={parseFloat(weight)} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// BMI Results Display Component
function BMIResultsDisplay({ results, currentWeight }: { results: any; currentWeight: number }) {
  const [isProgressExpanded, setIsProgressExpanded] = useState(false);
  
  // Generate month-on-month weight loss projection
  const monthlyProgress = useMemo(() => {
    const progress = [];
    const weightToLose = parseFloat(results.weightToLose);
    const monthlyLoss = 3; // kg per month (0.75 kg per week * 4)
    const currentW = currentWeight;
    const targetW = parseFloat(results.targetWeight);
    
    // Add current month
    progress.push({
      month: 0,
      monthLabel: 'Now',
      weight: currentW,
      weightLoss: 0,
    });
    
    // Calculate monthly projections
    for (let month = 1; month <= results.monthsToGoal; month++) {
      const projectedWeight = Math.max(
        currentW - (monthlyLoss * month),
        targetW
      );
      const weightLoss = currentW - projectedWeight;
      
      progress.push({
        month: month,
        monthLabel: `Month ${month}`,
        weight: Math.round(projectedWeight * 10) / 10,
        weightLoss: Math.round(weightLoss * 10) / 10,
      });
    }
    
    return progress;
  }, [results, currentWeight]);

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="text-center"
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <motion.h2
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-3xl sm:text-4xl font-heading font-bold text-white"
        >
          <span className="text-yellow-400">Your Results</span>
        </motion.h2>
      </div>

      {/* BMI Status - Compact */}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass rounded-2xl p-6 mb-6 border-2 border-white/20"
      >
        <div className="flex items-center justify-center gap-4">
          <span className="text-5xl">{results.bmiInfo.emoji}</span>
          <div>
            <div className={`text-4xl font-bold ${results.bmiInfo.color}`}>
              {results.bmi}
            </div>
            <div className={`text-lg font-semibold ${results.bmiInfo.color} px-4 py-1 rounded-full bg-white/10 inline-block mt-2`}>
              {results.bmiInfo.category}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Ideal Weight Range - Most Important Widget */}
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="glass rounded-3xl p-8 mb-8 border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-400/20 to-purple-300/10 shadow-2xl shadow-yellow-400/20"
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎯</div>
          <h3 className="text-2xl font-heading font-bold text-white mb-2">
            Your Ideal Weight Range
          </h3>
          <div className="text-6xl font-bold text-yellow-400 mb-3">
            {results.minIdealWeight} - {results.maxIdealWeight} kg
          </div>
          <div className="text-lg text-gray-300">
            Target: <span className="text-yellow-400 font-semibold">{results.targetWeight} kg</span>
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Based on BMI 18.5-24.9 (healthy range)
          </div>
        </div>
      </motion.div>

      {/* Month-on-Month Progress Indicator - Collapsible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 mb-8 border-2 border-purple-300/30"
      >
        <motion.button
          onClick={() => setIsProgressExpanded(!isProgressExpanded)}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-between mb-4"
        >
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Month-on-Month Weight Loss Progress
          </h3>
          <motion.div
            animate={{ rotate: isProgressExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl text-yellow-400"
          >
            ▼
          </motion.div>
        </motion.button>
        <AnimatePresence>
          {isProgressExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4">
          {monthlyProgress.map((item, index) => {
            const isCurrent = item.month === 0;
            const isLast = index === monthlyProgress.length - 1;
            const progressPercent = item.month === 0 
              ? 0 
              : (item.weightLoss / parseFloat(results.weightToLose)) * 100;
            
            return (
              <motion.div
                key={item.month}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`glass rounded-xl p-4 border-2 ${
                  isCurrent ? 'border-yellow-400/50 bg-yellow-400/10' : 
                  isLast ? 'border-green-400/50 bg-green-400/10' : 
                  'border-purple-300/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{isCurrent ? '📍' : isLast ? '🎯' : '📅'}</span>
                    <div>
                      <div className="font-bold text-white text-lg">{item.monthLabel}</div>
                      <div className="text-sm text-gray-400">Weight: {item.weight} kg</div>
                    </div>
                  </div>
                  {item.month > 0 && (
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold text-lg">-{item.weightLoss.toFixed(1)} kg</div>
                      <div className="text-xs text-gray-400">Loss</div>
                    </div>
                  )}
                </div>
                {item.month > 0 && (
                  <div className="mt-3">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                        className={`h-full rounded-full ${
                          isLast ? 'bg-gradient-to-r from-green-400 to-green-300' : 
                          'bg-gradient-to-r from-yellow-400 to-purple-300'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="glass rounded-xl p-4 border-2 border-white/20">
          <div className="text-2xl font-bold text-yellow-400 mb-1">
            {results.dailyCalorieAllowance}
          </div>
          <div className="text-sm text-gray-300">Daily Calorie Allowance</div>
          <div className="text-xs text-gray-400 mt-1">
            BMR: {results.bmr} cal • TDEE: {results.tdee} cal
          </div>
        </div>

        <div className="glass rounded-xl p-4 border-2 border-white/20">
          <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white mb-1">
            {results.monthsToGoal} months
          </div>
          <div className="text-sm text-gray-300">Estimated Time to Goal</div>
        </div>
      </div>
    </motion.div>
  );
}

// Calorie Measure Page - Opens Food Library
function CalorieMeasurePage({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50">
      <FoodLibrary onClose={onClose} />
    </div>
  );
}

// Meal Library Modal
function MealLibraryModal({ onClose }: { onClose: () => void }) {
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);

  // Get all available cuisines from meal combinations
  const availableCuisines = useMemo(() => {
    return ['North Indian', 'South Indian', 'Bengali', 'Gujarati', 'Maharashtrian', 
            'Malayali', 'Andhra', 'Odia', 'Rajasthani', 'Bihari', 'North-Eastern', 'Kashmiri'];
  }, []);

  const mealTypes: Array<{ value: 'breakfast' | 'lunch' | 'dinner' | 'snack'; label: string; emoji: string }> = [
    { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { value: 'lunch', label: 'Lunch', emoji: '🍽️' },
    { value: 'dinner', label: 'Dinner', emoji: '🌙' },
    { value: 'snack', label: 'Snack', emoji: '🍿' },
  ];

  // Get meal combinations for selected cuisine and meal type
  const mealCombinations = useMemo(() => {
    if (!selectedCuisine || !selectedMealType) return [];
    const combinations = getMealCombinations(selectedCuisine, selectedMealType, 'both');
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return combinations.filter(combo =>
        combo.name.toLowerCase().includes(query) ||
        combo.items.some(item => item.food.name.toLowerCase().includes(query))
      );
    }
    
    return combinations;
  }, [selectedCuisine, selectedMealType, searchQuery]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="min-h-screen gradient-bg relative">
          <div className="sticky top-0 z-40 glass border-b-2 border-yellow-400/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-4 sm:py-5">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl">📚</span>
                  <span>
                    <span className="text-yellow-400">Meal Library</span>
                  </span>
                </h1>
                <motion.button
                  onClick={onClose}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 glass border-2 border-white/20 rounded-xl text-white active:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-8 lg:py-12">

          {!selectedCuisine ? (
            // Cuisine Selection View - Playful
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-12 border border-white/20 shadow-2xl"
            >
              <div className="text-center mb-6 sm:mb-8">
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
                  <span className="text-6xl sm:text-7xl">📚</span>
                </motion.div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white mb-2 sm:mb-3">
                  <span className="text-yellow-400">Your Meal Library Awaits!</span> 🎉
                </h2>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
                  Pick a cuisine and discover amazing meal combinations! ✨
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {availableCuisines.map((cuisine, index) => {
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
                  };
                  const emoji = cuisineEmojis[cuisine] || '🍽️';
                  
                  return (
                    <motion.button
                      key={cuisine}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCuisine(cuisine)}
                      className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 border-white/20 hover:border-yellow-400/50 active:border-yellow-400 transition-all text-left relative overflow-hidden group"
                    >
                      <div className="relative z-10">
                        <div className="text-4xl sm:text-5xl mb-2">{emoji}</div>
                        <div className="font-bold text-white text-sm sm:text-base">{cuisine}</div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-purple-300/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : !selectedMealType ? (
            // Meal Type Selection View - Playful
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-12 border border-white/20 shadow-2xl"
            >
              <motion.button
                onClick={() => setSelectedCuisine(null)}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors p-2 rounded-lg active:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Back to Cuisines</span>
              </motion.button>

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
                  <span className="text-5xl sm:text-6xl">🍽️</span>
                </motion.div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white mb-2">
                  <span className="text-yellow-400">{selectedCuisine} Delights!</span> 🌟
                </h2>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
                  When do you want to enjoy these flavors? 🕐
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {mealTypes.map((mealType, index) => (
                  <motion.button
                    key={mealType.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMealType(mealType.value)}
                    className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-white/20 hover:border-yellow-400/50 active:border-yellow-400 transition-all relative overflow-hidden group"
                  >
                    <div className="relative z-10">
                      <div className="text-5xl sm:text-6xl mb-3">{mealType.emoji}</div>
                      <div className="font-bold text-white text-base sm:text-lg">{mealType.label}</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-purple-300/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            // Meal Combinations View - Playful
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-12 border border-white/20 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <motion.button
                  onClick={() => setSelectedMealType(null)}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg active:bg-white/10"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-semibold hidden sm:inline">Back</span>
                </motion.button>
                <div className="text-center flex-1">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-white">
                    <span className="text-yellow-400">{selectedCuisine}</span> - {mealTypes.find(m => m.value === selectedMealType)?.label}
                  </h2>
                </div>
                <div className="w-20 sm:w-24"></div>
              </div>

              {/* Search Bar - Playful */}
              <div className="relative mb-5 sm:mb-6">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 text-xl">
                  🔍
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search meal combinations..."
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-xl bg-white/10 border-2 border-yellow-400/30 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all min-h-[48px] text-base"
                />
              </div>

              {/* Meal Combinations List - Playful */}
              <div className="space-y-4 sm:space-y-6">
                {mealCombinations.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-7xl mb-4"
                    >
                      🍽️
                    </motion.div>
                    <p className="text-gray-300 text-lg font-semibold mb-2">No meal combinations found</p>
                    <p className="text-gray-400 text-sm">Try a different search term! 🔍</p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mealCombinations.map((combo, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="glass rounded-3xl p-6 lg:p-8 border-2 border-white/20 active:border-yellow-400/50 transition-all bg-gradient-to-br from-yellow-400/5 to-purple-300/5"
                      >
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex-1">
                            <h3 className="text-2xl font-heading font-bold text-white mb-3">
                              <span className="text-yellow-400">{combo.name}</span>
                            </h3>
                            <div className="flex items-center gap-4 text-base font-semibold">
                              <span className="text-purple-300 flex items-center gap-1">
                                <span className="text-xl">🍽️</span> {combo.items.length} items
                              </span>
                              <span className="text-gray-500">•</span>
                              <span className="text-orange-300 flex items-center gap-1">
                                <span className="text-xl">⏱️</span> ~20 min
                              </span>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => setExpandedMeal(expandedMeal === index ? null : index)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-xl bg-white/5 border-2 border-white/20 text-gray-400 active:border-yellow-400/50 transition-all"
                          >
                            {expandedMeal === index ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                          </motion.button>
                        </div>

                        {/* Calories & Macros Summary - Playful */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                          <motion.div
                            whileTap={{ scale: 0.95 }}
                            className="text-center glass rounded-xl p-4 border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 to-transparent"
                          >
                            <div className="text-3xl font-bold text-yellow-400 mb-1">{combo.totalCalories}</div>
                            <div className="text-xs text-gray-300 font-semibold">🔥 Calories</div>
                          </motion.div>
                          <motion.div
                            whileTap={{ scale: 0.95 }}
                            className="text-center glass rounded-xl p-4 border-2 border-purple-300/30 bg-gradient-to-br from-purple-300/10 to-transparent"
                          >
                            <div className="text-2xl font-bold text-purple-300 mb-1">{combo.totalProtein}g</div>
                            <div className="text-xs text-gray-300 font-semibold">💪 Protein</div>
                          </motion.div>
                          <motion.div
                            whileTap={{ scale: 0.95 }}
                            className="text-center glass rounded-xl p-4 border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 to-transparent"
                          >
                            <div className="text-2xl font-bold text-yellow-400 mb-1">{combo.totalCarbs}g</div>
                            <div className="text-xs text-gray-300 font-semibold">🌾 Carbs</div>
                          </motion.div>
                          <motion.div
                            whileTap={{ scale: 0.95 }}
                            className="text-center glass rounded-xl p-4 border-2 border-purple-300/30 bg-gradient-to-br from-purple-300/10 to-transparent"
                          >
                            <div className="text-2xl font-bold text-purple-300 mb-1">{combo.totalFat}g</div>
                            <div className="text-xs text-gray-300 font-semibold">🥑 Fat</div>
                          </motion.div>
                        </div>

                        {/* Expanded Details - Playful */}
                        <AnimatePresence>
                          {expandedMeal === index && (
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
                                {combo.items.map((item, itemIndex) => (
                                  <motion.div
                                    key={itemIndex}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: itemIndex * 0.1 }}
                                    className="flex items-center justify-between glass rounded-xl p-4 border-2 border-white/10 active:border-yellow-400/50 transition-all"
                                  >
                                    <div className="flex items-center gap-4">
                                      <motion.span
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: itemIndex * 0.2 }}
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
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Calorie Comparison Modal
function CalorieComparisonModal({ onClose }: { onClose: () => void }) {
  const [selectedFood1, setSelectedFood1] = useState<FoodItem | null>(null);
  const [selectedFood2, setSelectedFood2] = useState<FoodItem | null>(null);
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredFoods1 = useMemo(() => {
    if (!searchQuery1.trim()) return foodDatabase.slice(0, 20);
    const query = searchQuery1.toLowerCase();
    return foodDatabase.filter(food =>
      food.name.toLowerCase().includes(query) ||
      food.cuisine.toLowerCase().includes(query)
    ).slice(0, 20);
  }, [searchQuery1]);

  const filteredFoods2 = useMemo(() => {
    if (!searchQuery2.trim()) return foodDatabase.slice(0, 20);
    const query = searchQuery2.toLowerCase();
    return foodDatabase.filter(food =>
      food.name.toLowerCase().includes(query) ||
      food.cuisine.toLowerCase().includes(query)
    ).slice(0, 20);
  }, [searchQuery2]);

  const handleCompare = () => {
    if (selectedFood1 && selectedFood2) {
      setShowResults(true);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="min-h-screen gradient-bg relative">
          <div className="sticky top-0 z-40 glass border-b-2 border-yellow-400/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-4 sm:py-5">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white flex items-center gap-3">
                  <span className="text-3xl sm:text-4xl">⚖️</span>
                  <span>
                    <span className="text-yellow-400">Calorie Comparison</span>
                  </span>
                </h1>
                <motion.button
                  onClick={onClose}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 glass border-2 border-white/20 rounded-xl text-white active:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-6 sm:py-8 lg:py-12">
            {!showResults ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-12 border border-white/20 shadow-2xl"
            >
              <div className="text-center mb-6 sm:mb-8">
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
                  <span className="text-6xl sm:text-7xl">⚖️</span>
                </motion.div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white mb-2 sm:mb-3">
                  <span className="text-yellow-400">Food Face-Off!</span> 🥊
                </h2>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
                  Pick two foods and see who wins the nutrition battle! 🏆
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Food 1 Selection - Playful */}
                <div>
                  <label className="block text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-xl">🥗</span>
                    <span>Food Item 1</span>
                  </label>
                  <div className="relative mb-3">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 text-xl">
                      🔍
                    </div>
                    <input
                      type="text"
                      value={searchQuery1}
                      onChange={(e) => setSearchQuery1(e.target.value)}
                      placeholder="🔍 Search food..."
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border-2 border-yellow-400/30 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all min-h-[48px] text-base"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2 scrollbar-hide">
                    {filteredFoods1.map((food, index) => (
                      <motion.button
                        key={food.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedFood1(food)}
                        className={`w-full text-left glass rounded-xl p-3 sm:p-4 border-2 transition-all ${
                          selectedFood1?.id === food.id
                            ? 'border-yellow-400 bg-gradient-to-r from-yellow-400/30 to-yellow-300/20 text-gray-900'
                            : 'border-white/10 hover:border-yellow-400/50 active:border-yellow-400/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl sm:text-3xl">{food.emoji || '🍽️'}</span>
                          <div className="flex-1">
                            <div className={`font-bold text-sm sm:text-base ${selectedFood1?.id === food.id ? 'text-gray-900' : 'text-white'}`}>{food.name}</div>
                            <div className={`text-xs ${selectedFood1?.id === food.id ? 'text-gray-700' : 'text-gray-400'}`}>{food.cuisine}</div>
                          </div>
                          <div className={`font-bold text-sm sm:text-base ${selectedFood1?.id === food.id ? 'text-gray-900' : 'text-yellow-400'}`}>{food.calories} cal</div>
                          {selectedFood1?.id === food.id && (
                            <span className="text-xl">✅</span>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Food 2 Selection - Playful */}
                <div>
                  <label className="block text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-xl">🍽️</span>
                    <span>Food Item 2</span>
                  </label>
                  <div className="relative mb-3">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 text-xl">
                      🔍
                    </div>
                    <input
                      type="text"
                      value={searchQuery2}
                      onChange={(e) => setSearchQuery2(e.target.value)}
                      placeholder="🔍 Search food..."
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border-2 border-yellow-400/30 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all min-h-[48px] text-base"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2 scrollbar-hide">
                    {filteredFoods2.map((food, index) => (
                      <motion.button
                        key={food.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedFood2(food)}
                        className={`w-full text-left glass rounded-xl p-3 sm:p-4 border-2 transition-all ${
                          selectedFood2?.id === food.id
                            ? 'border-yellow-400 bg-gradient-to-r from-yellow-400/30 to-yellow-300/20 text-gray-900'
                            : 'border-white/10 hover:border-yellow-400/50 active:border-yellow-400/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl sm:text-3xl">{food.emoji || '🍽️'}</span>
                          <div className="flex-1">
                            <div className={`font-bold text-sm sm:text-base ${selectedFood2?.id === food.id ? 'text-gray-900' : 'text-white'}`}>{food.name}</div>
                            <div className={`text-xs ${selectedFood2?.id === food.id ? 'text-gray-700' : 'text-gray-400'}`}>{food.cuisine}</div>
                          </div>
                          <div className={`font-bold text-sm sm:text-base ${selectedFood2?.id === food.id ? 'text-gray-900' : 'text-yellow-400'}`}>{food.calories} cal</div>
                          {selectedFood2?.id === food.id && (
                            <span className="text-xl">✅</span>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <motion.button
                onClick={handleCompare}
                disabled={!selectedFood1 || !selectedFood2}
                whileTap={{ scale: selectedFood1 && selectedFood2 ? 0.97 : 1 }}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-base sm:text-lg transition-all relative overflow-hidden ${
                  selectedFood1 && selectedFood2
                    ? 'text-gray-900'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                style={selectedFood1 && selectedFood2 ? {
                  background: 'linear-gradient(135deg, #FCD34D 0%, #FDE047 50%, #FCD34D 100%)',
                  boxShadow: '0 0 20px rgba(252, 211, 77, 0.6), 0 0 40px rgba(252, 211, 77, 0.4)',
                } : {}}
              >
                {selectedFood1 && selectedFood2 ? (
                  <>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>✨</span>
                      <span>Compare Foods</span>
                      <span>🚀</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent opacity-60 rounded-xl"></div>
                  </>
                ) : (
                  'Select both foods to compare'
                )}
              </motion.button>
            </motion.div>
          ) : selectedFood1 && selectedFood2 ? (
            // Comparison Results - Playful
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-12 border border-white/20 shadow-2xl"
            >
              <motion.button
                onClick={() => setShowResults(false)}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors p-2 rounded-lg active:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-semibold">Back to Selection</span>
              </motion.button>

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
                  className="inline-block mb-4"
                >
                  <span className="text-6xl sm:text-7xl">🏆</span>
                </motion.div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-white mb-4">
                  <span className="text-yellow-400">And the Winner Is...</span> 🎉
                </h2>
                <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-2">
                  Here's how your food choices stack up! 📊
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                {/* Food 1 Card - Playful */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 to-transparent"
                >
                  <div className="text-center mb-4 sm:mb-5">
                    <div className="text-5xl sm:text-6xl mb-2">{selectedFood1.emoji || '🍽️'}</div>
                    <h3 className="text-lg sm:text-xl font-heading font-bold text-white mb-1">
                      {selectedFood1.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400">{selectedFood1.cuisine}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center glass rounded-xl p-3 border border-white/10">
                      <span className="text-gray-300 font-semibold flex items-center gap-2">
                        <span>🔥</span>
                        <span>Calories</span>
                      </span>
                      <span className="text-2xl font-bold text-yellow-400">{selectedFood1.calories}</span>
                    </div>
                    <div className="flex justify-between items-center glass rounded-xl p-3 border border-white/10">
                      <span className="text-gray-300 font-semibold flex items-center gap-2">
                        <span>💪</span>
                        <span>Protein</span>
                      </span>
                      <span className="text-xl font-bold text-purple-300">{selectedFood1.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center glass rounded-xl p-3 border border-white/10">
                      <span className="text-gray-300 font-semibold flex items-center gap-2">
                        <span>🌾</span>
                        <span>Carbs</span>
                      </span>
                      <span className="text-xl font-bold text-yellow-400">{selectedFood1.carbs}g</span>
                    </div>
                    <div className="flex justify-between items-center glass rounded-xl p-3 border border-white/10">
                      <span className="text-gray-300 font-semibold flex items-center gap-2">
                        <span>🥑</span>
                        <span>Fat</span>
                      </span>
                      <span className="text-xl font-bold text-purple-300">{selectedFood1.fat}g</span>
                    </div>
                  </div>
                </motion.div>

                {/* Food 2 Card - Playful */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 border-purple-300/30 bg-gradient-to-br from-purple-300/10 to-transparent"
                >
                  <div className="text-center mb-4 sm:mb-5">
                    <div className="text-5xl sm:text-6xl mb-2">{selectedFood2.emoji || '🍽️'}</div>
                    <h3 className="text-lg sm:text-xl font-heading font-bold text-white mb-1">
                      {selectedFood2.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400">{selectedFood2.cuisine}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center glass rounded-xl p-3 border border-white/10">
                      <span className="text-gray-300 font-semibold flex items-center gap-2">
                        <span>🔥</span>
                        <span>Calories</span>
                      </span>
                      <span className="text-2xl font-bold text-yellow-400">{selectedFood2.calories}</span>
                    </div>
                    <div className="flex justify-between items-center glass rounded-xl p-3 border border-white/10">
                      <span className="text-gray-300 font-semibold flex items-center gap-2">
                        <span>💪</span>
                        <span>Protein</span>
                      </span>
                      <span className="text-xl font-bold text-purple-300">{selectedFood2.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center glass rounded-xl p-3 border border-white/10">
                      <span className="text-gray-300 font-semibold flex items-center gap-2">
                        <span>🌾</span>
                        <span>Carbs</span>
                      </span>
                      <span className="text-xl font-bold text-yellow-400">{selectedFood2.carbs}g</span>
                    </div>
                    <div className="flex justify-between items-center glass rounded-xl p-3 border border-white/10">
                      <span className="text-gray-300 font-semibold flex items-center gap-2">
                        <span>🥑</span>
                        <span>Fat</span>
                      </span>
                      <span className="text-xl font-bold text-purple-300">{selectedFood2.fat}g</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Comparison Summary - Playful */}
              <div className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 to-purple-300/10">
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-4 sm:mb-5 text-center flex items-center justify-center gap-2">
                  <span className="text-2xl">📊</span>
                  <span>Difference</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center glass rounded-xl p-3 sm:p-4 border border-white/10">
                    <span className="text-gray-300 font-semibold flex items-center gap-2">
                      <span>🔥</span>
                      <span>Calorie Difference</span>
                    </span>
                    <span className={`text-lg sm:text-xl font-bold ${
                      selectedFood1.calories > selectedFood2.calories ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {Math.abs(selectedFood1.calories - selectedFood2.calories)} cal
                      {selectedFood1.calories > selectedFood2.calories ? ' more' : ' less'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center glass rounded-xl p-3 sm:p-4 border border-white/10">
                    <span className="text-gray-300 font-semibold flex items-center gap-2">
                      <span>💪</span>
                      <span>Protein Difference</span>
                    </span>
                    <span className={`text-base sm:text-lg font-bold ${
                      selectedFood1.protein > selectedFood2.protein ? 'text-purple-300' : 'text-red-400'
                    }`}>
                      {Math.abs(selectedFood1.protein - selectedFood2.protein).toFixed(1)}g
                    </span>
                  </div>
                  <div className="flex justify-between items-center glass rounded-xl p-3 sm:p-4 border border-white/10">
                    <span className="text-gray-300 font-semibold flex items-center gap-2">
                      <span>🌾</span>
                      <span>Carbs Difference</span>
                    </span>
                    <span className="text-base sm:text-lg font-bold text-yellow-400">
                      {Math.abs(selectedFood1.carbs - selectedFood2.carbs).toFixed(1)}g
                    </span>
                  </div>
                  <div className="flex justify-between items-center glass rounded-xl p-3 sm:p-4 border border-white/10">
                    <span className="text-gray-300 font-semibold flex items-center gap-2">
                      <span>🥑</span>
                      <span>Fat Difference</span>
                    </span>
                    <span className={`text-base sm:text-lg font-bold ${
                      selectedFood1.fat > selectedFood2.fat ? 'text-red-400' : 'text-purple-300'
                    }`}>
                      {Math.abs(selectedFood1.fat - selectedFood2.fat).toFixed(1)}g
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

