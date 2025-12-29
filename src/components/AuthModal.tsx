import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (isGuest: boolean) => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (!isLogin && password) {
      calculatePasswordStrength(password);
    } else {
      setPasswordStrength(0);
    }
  }, [password, isLogin]);

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!isLogin && passwordStrength < 3) {
      alert('Password is too weak. Please use a stronger password.');
      return;
    }
    // In a real app, this would authenticate
    if (rememberMe) {
      localStorage.setItem('slaycal_remember_email', email);
    }
    onSuccess(false);
  };

  const handleGuest = () => {
    onSuccess(true);
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return { label: '', color: '' };
    if (passwordStrength <= 2) return { label: 'Weak', color: 'text-red-400' };
    if (passwordStrength <= 3) return { label: 'Fair', color: 'text-yellow-400' };
    if (passwordStrength <= 4) return { label: 'Good', color: 'text-blue-400' };
    return { label: 'Strong', color: 'text-green-400' };
  };

  const passwordStrengthInfo = getPasswordStrengthLabel();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="glass rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-heading font-bold text-white mb-2">
              {isLogin ? 'Welcome Back! 👋' : 'Join SlayCal! 🎉'}
            </h2>
            <p className="text-gray-300 text-sm">
              {isLogin
                ? 'Login to sync your data across devices'
                : 'Create an account to save your progress'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  required
                  placeholder="your@email.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border ${
                    emailError ? 'border-red-400' : 'border-white/20'
                  } text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all`}
                />
              </div>
              {emailError && (
                <p className="text-red-400 text-xs mt-1">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min 8 characters"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {!isLogin && password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          level <= passwordStrength
                            ? passwordStrength <= 2
                              ? 'bg-red-400'
                              : passwordStrength <= 3
                              ? 'bg-yellow-400'
                              : passwordStrength <= 4
                              ? 'bg-blue-400'
                              : 'bg-green-400'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrengthInfo.label && (
                    <p className={`text-xs ${passwordStrengthInfo.color}`}>
                      Password strength: {passwordStrengthInfo.label}
                    </p>
                  )}
                </div>
              )}

              {/* Password Requirements */}
              {!isLogin && password && (
                <div className="mt-2 space-y-1 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <Check className={`w-3 h-3 ${password.length >= 8 ? 'text-green-400' : 'text-gray-500'}`} />
                    <span>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className={`w-3 h-3 ${/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-400' : 'text-gray-500'}`} />
                    <span>Uppercase and lowercase letters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className={`w-3 h-3 ${/\d/.test(password) ? 'text-green-400' : 'text-gray-500'}`} />
                    <span>At least one number</span>
                  </div>
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Confirm password"
                    className={`w-full pl-10 pr-12 py-3 rounded-xl bg-white/10 border ${
                      confirmPassword && password !== confirmPassword ? 'border-red-400' : 'border-white/20'
                    } text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
                )}
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-400"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setShowPasswordReset(true)}
                  className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </motion.button>
          </form>

          <div className="text-center mb-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>

          <div className="border-t border-white/20 pt-6">
            <motion.button
              onClick={handleGuest}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 text-gray-300 hover:text-white font-medium transition-colors"
            >
              Continue as Guest 👤
            </motion.button>
            <p className="text-xs text-center text-gray-400 mt-2">
              You can always create an account later
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {showPasswordReset && (
          <PasswordResetModal
            onClose={() => setShowPasswordReset(false)}
            email={email}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}

// Password Reset Modal
interface PasswordResetModalProps {
  onClose: () => void;
  email: string;
}

function PasswordResetModal({ onClose, email }: PasswordResetModalProps) {
  const [resetEmail, setResetEmail] = useState(email);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send reset email
    setSent(true);
    setTimeout(() => {
      onClose();
      setSent(false);
    }, 2000);
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
        className="glass rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {!sent ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-heading font-bold text-white mb-2">
                Reset Password
              </h2>
              <p className="text-gray-300 text-sm">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Send Reset Link
              </motion.button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl mb-4"
            >
              ✉️
            </motion.div>
            <h2 className="text-2xl font-heading font-bold text-white mb-2">
              Check Your Email!
            </h2>
            <p className="text-gray-300 text-sm">
              We've sent a password reset link to {resetEmail}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

