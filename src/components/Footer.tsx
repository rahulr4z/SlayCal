import { motion } from 'framer-motion';
import { Sparkles, MessageCircle } from 'lucide-react';

interface FooterProps {
  onTalkToAI?: () => void;
}

export default function Footer({ onTalkToAI }: FooterProps) {
  // Valid AI Coach examples with randomized positions
  const chatBubbles = [
    { text: 'Calories in roti?', icon: '🫓', position: { top: '2%', right: '1%' }, delay: 0.1 },
    { text: 'Suggest a meal for 500 calories', icon: '🍽️', position: { top: '28%', right: '18%' }, delay: 0.2 },
    { text: 'What should I eat for breakfast?', icon: '🍳', position: { bottom: '35%', right: '3%' }, delay: 0.3 },
    { text: 'Tell me about biryani', icon: '🍛', position: { top: '15%', left: '2%' }, delay: 0.4 },
    { text: 'North Indian lunch for 400 calories', icon: '🥘', position: { bottom: '18%', left: '15%' }, delay: 0.5 },
    { text: 'How many calories in dosa?', icon: '🥞', position: { top: '5%', left: '25%' }, delay: 0.6 },
    { text: '500 cal meal', icon: '🍱', position: { bottom: '5%', left: '3%' }, delay: 0.7 },
    { text: 'Breakfast ideas', icon: '☕', position: { top: '42%', right: '12%' }, delay: 0.8 },
    { text: 'Calories in paneer paratha?', icon: '🧀', position: { bottom: '25%', right: '28%' }, delay: 0.9 },
    { text: 'South Indian dinner for 350 calories', icon: '🍚', position: { top: '38%', left: '8%' }, delay: 1.0 },
    { text: 'What are the nutrients in dal?', icon: '🫘', position: { top: '12%', right: '32%' }, delay: 1.1 },
    { text: 'Suggest a snack for 200 calories', icon: '🥗', position: { bottom: '42%', left: '22%' }, delay: 1.2 },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Central Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 relative"
        >
          {/* Sparkle Icon */}
          <motion.div
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white mb-6">
            Try Slay - Your Personal
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Health Coach!
            </span>
          </h2>

          {/* CTA Button */}
          <motion.button
            onClick={onTalkToAI}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-8 py-4 bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <MessageCircle className="w-5 h-5" />
            Ask Slay AI
          </motion.button>
        </motion.div>

        {/* Chat Bubbles - Scattered around */}
        <div className="relative min-h-[600px] mt-12">
          {chatBubbles.map((bubble, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{
                opacity: { delay: bubble.delay, type: 'spring', stiffness: 100 },
                scale: { delay: bubble.delay, type: 'spring', stiffness: 100 },
                y: {
                  duration: 3,
                  repeat: Infinity,
                  delay: bubble.delay,
                }
              }}
              style={bubble.position}
              className="absolute bg-white rounded-2xl px-4 py-3 border border-gray-200 shadow-lg max-w-[200px] sm:max-w-[240px]"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{bubble.icon}</span>
                <p className="text-sm sm:text-base text-gray-800 font-medium">
                  {bubble.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

