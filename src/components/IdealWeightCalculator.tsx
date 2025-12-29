import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Printer } from 'lucide-react';
import { useState, useMemo } from 'react';

interface IdealWeightCalculatorProps {
  onClose: () => void;
  onComplete: (data: any) => void;
}

type ActivityLevel = 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active';

export default function IdealWeightCalculator({ onClose, onComplete }: IdealWeightCalculatorProps) {
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
      // Average for other/prefer not to say
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

  const handleShare = (results: any) => {
    const activityLabels: Record<string, string> = {
      'sedentary': 'Sedentary',
      'lightly-active': 'Lightly Active',
      'moderately-active': 'Moderately Active',
      'very-active': 'Very Active',
      'extremely-active': 'Extremely Active'
    };
    const text = `My BMI: ${results.bmi} (${results.bmiInfo.category})\nIdeal Weight Range: ${results.minIdealWeight} - ${results.maxIdealWeight} kg\nTarget Weight: ${results.targetWeight} kg\nDaily Calories: ${results.dailyCalorieAllowance} cal\nActivity Level: ${activityLabels[results.activityLevel] || results.activityLevel}\nTime to Goal: ${results.monthsToGoal} months\n\nTrack your weight loss journey with SlayCal! 🎯`;
    if (navigator.share) {
      navigator.share({
        title: 'My Weight Loss Plan',
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
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

    // Estimate time to goal (assuming 0.5-1 kg per week)
    const weeksToGoal = Math.ceil(weightToLose / 0.75); // Average of 0.5-1 kg/week

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
    <div className="min-h-screen gradient-bg relative">
      <div className="sticky top-0 z-40 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <span>
                <span className="text-yellow-400">Step 1:</span> Your Ideal Weight Journey
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
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-12 border border-white/20 shadow-2xl"
          >
            {step === 'input' && (
              <div>
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
                    Let's Find Your Perfect Weight! ✨
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg px-2">Tell us about yourself and we'll create your personalized plan! 🚀</p>
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
                  <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">✨</span>
                    <span className="text-base sm:text-lg lg:text-xl">Calculate My Perfect Weight!</span>
                    <span className="text-xl sm:text-2xl">🚀</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent opacity-60 rounded-2xl"></div>
                </motion.button>
              </div>
            )}

            {step === 'results' && results && (
              <ResultsDisplay
                results={results}
                currentWeight={parseFloat(weight)}
                onComplete={onComplete}
                onShare={() => handleShare(results)}
                onPrint={() => window.print()}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Results Display Component with enhanced features
interface ResultsDisplayProps {
  results: any;
  currentWeight: number;
  onComplete: (data: any) => void;
  onShare: () => void;
  onPrint: () => void;
}

function ResultsDisplay({ results, currentWeight, onComplete, onShare, onPrint }: ResultsDisplayProps) {
  const [isProgressExpanded, setIsProgressExpanded] = useState(false);
  
  // Generate month-on-month weight loss projection
  const monthlyProgress = useMemo(() => {
    const progress = [];
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
        <div className="flex gap-2">
          <motion.button
            onClick={onShare}
            whileTap={{ scale: 0.9 }}
            className="p-2 glass border border-white/20 rounded-lg text-white active:bg-white/10 transition-all"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={onPrint}
            whileTap={{ scale: 0.9 }}
            className="p-2 glass border border-white/20 rounded-lg text-white active:bg-white/10 transition-all"
            title="Print"
          >
            <Printer className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

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
                className="relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${
                      isCurrent 
                        ? 'bg-yellow-400 text-gray-900' 
                        : isLast
                        ? 'bg-green-400 text-white'
                        : 'bg-purple-300/30 text-white border-2 border-purple-300'
                    }`}>
                      {isCurrent ? '📍' : isLast ? '🎯' : item.month}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{item.monthLabel}</div>
                      {item.month > 0 && (
                        <div className="text-xs text-gray-400">
                          {item.weightLoss} kg lost
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">{item.weight} kg</div>
                    {isLast && (
                      <div className="text-xs text-green-400">Target reached!</div>
                    )}
                  </div>
                </div>
                {item.month > 0 && (
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-full rounded-full ${
                        isLast 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                          : 'bg-gradient-to-r from-yellow-400 to-yellow-300'
                      }`}
                    />
                  </div>
                )}
                {!isLast && (
                  <div className="flex justify-center my-2">
                    <div className="text-gray-500 text-xl">↓</div>
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

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Daily Calorie Allowance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 to-transparent"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">
              {results.dailyCalorieAllowance}
            </div>
            <div className="text-base text-gray-300 font-semibold mb-1">Daily Calories</div>
            <div className="text-xs text-gray-400">
              Your personalized target
            </div>
          </div>
        </motion.div>

        {/* BMI Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6 border-2 border-purple-300/30 bg-gradient-to-br from-purple-300/10 to-transparent"
        >
          <div className="text-center">
            <div className="text-3xl mb-2">{results.bmiInfo.emoji}</div>
            <div className={`text-3xl font-bold ${results.bmiInfo.color} mb-2`}>
              {results.bmi}
            </div>
            <div className={`text-sm font-semibold ${results.bmiInfo.color}`}>
              {results.bmiInfo.category}
            </div>
          </div>
        </motion.div>

        {/* Time to Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-6 border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 to-transparent"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">
              {results.monthsToGoal}
            </div>
            <div className="text-base text-gray-300 font-semibold mb-1">
              {results.monthsToGoal === 1 ? 'Month' : 'Months'}
            </div>
            <div className="text-xs text-gray-400">
              To reach your goal
            </div>
          </div>
        </motion.div>
      </div>

      <motion.button
        onClick={() => onComplete(results)}
        whileHover={{ scale: 1.05, y: -3 }}
        whileTap={{ scale: 0.95 }}
        className="w-full py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-yellow-400/50 transition-all relative overflow-hidden text-gray-900"
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
          <span className="text-2xl">🍽️</span>
          <span>Next: Let's Pick My Favorite Foods!</span>
          <span className="text-2xl">✨</span>
        </span>
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent opacity-60 rounded-2xl"></div>
      </motion.button>
    </motion.div>
  );
}


