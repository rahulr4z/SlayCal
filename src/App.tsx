import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import FourSteps from './components/FourSteps';
import InteractiveCards from './components/InteractiveCards';
import AuthModal from './components/AuthModal';
import IdealWeightCalculator from './components/IdealWeightCalculator';
import CuisinePreferences from './components/CuisinePreferences';
import MealRecommendations from './components/MealRecommendations';
import FoodTracker from './components/FoodTracker';
import FoodLibrary from './components/FoodLibrary';
import Footer from './components/Footer';
import AICoachSlay from './components/AICoachSlay';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [showIdealWeight, setShowIdealWeight] = useState(false);
  const [showCuisinePrefs, setShowCuisinePrefs] = useState(false);
  const [showMealRecommendations, setShowMealRecommendations] = useState(false);
  const [showFoodTracker, setShowFoodTracker] = useState(false);
  const [showFoodLibrary, setShowFoodLibrary] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const [showQuickTools, setShowQuickTools] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);

  const handleTryNow = () => {
    // Skip auth and go directly to the workflow
    setShowIdealWeight(true);
  };

  const handleAuthSuccess = (isGuest: boolean) => {
    setShowAuth(false);
    if (!isGuest) {
      setShowIdealWeight(true);
    } else {
      setShowIdealWeight(true);
    }
  };

  const handleWeightCalcComplete = (data: any) => {
    setUserData(data);
    setShowIdealWeight(false);
    setShowCuisinePrefs(true);
  };

  const handleCuisinePrefsComplete = (preferences: any) => {
    setUserPreferences(preferences);
    setShowCuisinePrefs(false);
    setShowMealRecommendations(true);
  };

  const handleMealRecommendationsComplete = () => {
    setShowMealRecommendations(false);
    setShowFoodTracker(true);
  };

  // Check if we're on the landing page (no quick tools open)
  const isLandingPage = !showFoodLibrary && 
                       !showAICoach && 
                       !showIdealWeight && 
                       !showCuisinePrefs && 
                       !showMealRecommendations && 
                       !showFoodTracker && 
                       !showAuth &&
                       !showQuickTools;

  // Show header on landing page or when FoodTracker is open
  const shouldShowHeader = isLandingPage || showFoodTracker;

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
      
      {/* Show header on landing page or when FoodTracker is open */}
      {shouldShowHeader && (
        <Header 
          onLoginClick={() => setShowAuth(true)} 
          onDashboardClick={() => {
            // Close any other open views first
            setShowFoodLibrary(false);
            setShowAICoach(false);
            setShowIdealWeight(false);
            setShowCuisinePrefs(false);
            setShowMealRecommendations(false);
            
            if (userData) {
              setShowFoodTracker(true);
            } else {
              // If no user data, start the workflow
              setShowIdealWeight(true);
            }
          }}
          onAskSlayAI={() => {
            if (showFoodTracker) {
              setShowFoodTracker(false);
            }
            setShowAICoach(true);
          }}
          onLogoClick={() => {
            // Reset to landing page
            setShowFoodTracker(false);
            setShowFoodLibrary(false);
            setShowAICoach(false);
            setShowIdealWeight(false);
            setShowCuisinePrefs(false);
            setShowMealRecommendations(false);
          }}
        />
      )}
      
      <main className="min-h-screen">
        {!showFoodLibrary && !showAICoach && !showIdealWeight && !showCuisinePrefs && !showMealRecommendations && !showFoodTracker ? (
          <>
            <Hero onTryNow={handleTryNow} onFoodLibrary={() => setShowFoodLibrary(true)} />
            <FourSteps />
            <InteractiveCards 
              onQuickToolToggle={setShowQuickTools}
              onOpenFoodLibrary={() => setShowFoodLibrary(true)}
            />
            <Footer onTalkToAI={() => setShowAICoach(true)} />
          </>
        ) : showFoodLibrary ? (
          <FoodLibrary 
            onClose={() => setShowFoodLibrary(false)} 
            onAskSlayAI={() => {
              setShowFoodLibrary(false);
              setShowAICoach(true);
            }}
          />
        ) : showAICoach ? (
          <AICoachSlay onClose={() => setShowAICoach(false)} />
        ) : null}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </AnimatePresence>

      {showIdealWeight && (
        <IdealWeightCalculator
          onClose={() => setShowIdealWeight(false)}
          onComplete={handleWeightCalcComplete}
        />
      )}

      {showCuisinePrefs && (
        <CuisinePreferences
          onClose={() => setShowCuisinePrefs(false)}
          userData={userData}
          onComplete={handleCuisinePrefsComplete}
        />
      )}

      {showMealRecommendations && userPreferences && (
        <MealRecommendations
          onClose={handleMealRecommendationsComplete}
          userData={userData}
          preferences={userPreferences}
          onLogin={() => {
            setShowMealRecommendations(false);
            setShowAuth(true);
          }}
        />
      )}

      {showFoodTracker && (
        <FoodTracker
          userData={userData}
          onClose={() => setShowFoodTracker(false)}
        />
      )}
    </div>
  );
}

export default App;

