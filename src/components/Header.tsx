import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
  onDashboardClick?: () => void;
  onAskSlayAI?: () => void;
}

export default function Header({ onLoginClick, onDashboardClick, onAskSlayAI }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-menu') && !target.closest('.hamburger-button')) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? 'glass border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange to-yellow rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/assets/slaycal-logo.svg" 
                alt="SlayCal Logo" 
                className="w-full h-full object-contain p-1"
              />
            </div>
            <h1 className="text-3xl font-heading font-bold text-white">
              SlayCal
            </h1>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-3">
            {onDashboardClick && (
              <motion.button
                onClick={onDashboardClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors duration-300 border border-white/20"
              >
                Dashboard
              </motion.button>
            )}
            {onAskSlayAI && (
              <motion.button
                onClick={onAskSlayAI}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                Ask Slay AI
              </motion.button>
            )}
            <motion.button
              onClick={onLoginClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-300"
            >
              Login via Email
            </motion.button>
          </div>

          {/* Mobile Hamburger Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
            className="md:hidden hamburger-button p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mobile-menu overflow-hidden border-t border-white/10"
          >
            <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-3">
              {onDashboardClick && (
                <motion.button
                  onClick={() => {
                    onDashboardClick();
                    setMobileMenuOpen(false);
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors duration-300 border border-white/20 text-left"
                >
                  Dashboard
                </motion.button>
              )}
              {onAskSlayAI && (
                <motion.button
                  onClick={() => {
                    onAskSlayAI();
                    setMobileMenuOpen(false);
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all duration-300 text-left flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Ask Slay AI
                </motion.button>
              )}
              <motion.button
                onClick={() => {
                  onLoginClick();
                  setMobileMenuOpen(false);
                }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-300 text-left"
              >
                Login via Email
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

