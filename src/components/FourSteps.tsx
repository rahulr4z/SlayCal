import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Utensils, Lightbulb, Rocket } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Your ideal weight',
    icon: Target,
    color: 'blue',
    borderColor: 'border-blue-400',
    badgeColor: 'bg-blue-500',
  },
  {
    number: 2,
    title: 'Your food choices',
    icon: Utensils,
    color: 'pink',
    borderColor: 'border-pink-400',
    badgeColor: 'bg-pink-500',
  },
  {
    number: 3,
    title: 'Your food recommendations',
    icon: Lightbulb,
    color: 'orange',
    borderColor: 'border-orange-400',
    badgeColor: 'bg-orange-500',
  },
  {
    number: 4,
    title: 'Start the weight loss',
    icon: Rocket,
    color: 'green',
    borderColor: 'border-green-400',
    badgeColor: 'bg-green-500',
  },
];

export default function FourSteps() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-5xl sm:text-6xl font-heading font-bold text-white mb-3">
            4 Simple Steps
          </h2>
        </motion.div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center group"
                >
                  {/* Icon Container with Badge */}
                  <div className="relative mb-6">
                    {/* Rounded Square Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 ${step.borderColor} bg-white/5 backdrop-blur-sm flex items-center justify-center relative group-hover:bg-white/10 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-${step.color}-500/20`}
                    >
                      <Icon className={`w-10 h-10 sm:w-12 sm:h-12 text-white group-hover:scale-110 transition-transform duration-300`} strokeWidth={2} />
                    </motion.div>

                    {/* Number Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                      whileHover={{ scale: 1.15, rotate: 360 }}
                      className={`absolute -top-2 -right-2 w-8 h-8 ${step.badgeColor} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      {step.number}
                    </motion.div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-heading font-semibold text-white text-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {step.title}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

