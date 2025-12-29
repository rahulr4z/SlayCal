import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Lottie from 'lottie-react';
import { useState, useEffect } from 'react';

interface HeroProps {
  onTryNow: () => void;
  onFoodLibrary?: () => void;
}

export default function Hero({ onTryNow, onFoodLibrary }: HeroProps) {
  const [animationData, setAnimationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the Lottie JSON animation
    fetch(`${import.meta.env.BASE_URL}assets/Food Choice.json`)
      .then(response => response.json())
      .then(data => {
        setAnimationData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading animation:', error);
        setLoading(false);
      });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-[200px] pb-32">
      <div className="max-w-5xl mx-auto text-center">
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mb-4">
            <span className="text-white">Watch Them </span>
            <motion.span
              className="text-yellow-400 inline-block"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Lose
            </motion.span>
            <Sparkles className="inline-block w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 ml-2" />
            <span className="text-white"> their </span>
            <span className="text-purple-300">Weight</span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Lose your weight using this DIY calorie tracking tool, get your{' '}
          <strong className="text-white">personalised calorie allowance</strong> and build your own meal using{' '}
          <strong className="text-white">Food vs Calorie table</strong>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <motion.button
            onClick={onTryNow}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 text-gray-900 rounded-xl font-semibold text-lg relative overflow-visible"
            style={{
              background: 'linear-gradient(135deg, #FCD34D 0%, #FDE047 50%, #FCD34D 100%)',
              boxShadow: `
                0 0 20px rgba(255, 215, 0, 0.6),
                0 0 40px rgba(255, 215, 0, 0.4),
                0 0 60px rgba(255, 215, 0, 0.2),
                0 10px 30px rgba(255, 215, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.6),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1)
              `,
            }}
          >
            <span className="relative z-10">Try Now</span>
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent opacity-60 rounded-xl"></div>
            {/* Outer glow effect */}
            <div 
              className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-xl blur-xl opacity-75 -z-10"
              style={{
                filter: 'blur(12px)',
              }}
            ></div>
          </motion.button>

          <motion.button
            onClick={onFoodLibrary}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white/50 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white/10"
          >
            Food Library
          </motion.button>
        </motion.div>

        {/* Healthy Lifestyle Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center items-center mt-8"
        >
          <div className="relative max-w-2xl w-full">
            {loading ? (
              <div className="w-full h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-pulse">🌱</div>
                  <p className="text-white/60 text-sm">Loading animation...</p>
                </div>
              </div>
            ) : animationData ? (
              <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                className="w-full h-auto"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌱</div>
                  <p className="text-white/60 text-sm">Healthy Lifestyle</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

