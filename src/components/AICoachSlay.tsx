import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import { foodDatabase, FoodItem, searchFoods } from '../data/foodDatabase';
import { getMealCombinations } from '../utils/mealCombinations';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AICoachSlayProps {
  onClose?: () => void;
}

interface ConversationState {
  waitingForCalorie?: boolean;
  waitingForCuisine?: boolean;
  requestedMealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export default function AICoachSlay({ onClose }: AICoachSlayProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationState, setConversationState] = useState<ConversationState>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI Response Logic
  const processUserMessage = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase().trim();
    let response = '';

    // Check if waiting for calorie input
    if (conversationState.waitingForCalorie) {
      const calorieMatch = userMessage.match(/(\d+)/);
      if (calorieMatch) {
        const targetCalories = parseInt(calorieMatch[1]);
        const cuisine = conversationState.waitingForCuisine 
          ? extractCuisine(userMessage) 
          : null;
        
        if (cuisine || !conversationState.waitingForCuisine) {
          const mealType = conversationState.requestedMealType || 'lunch';
          const finalCuisine = cuisine || 'North Indian';
          
          response = generateMealRecommendation(targetCalories, finalCuisine, mealType);
          setConversationState({});
        } else {
          response = "What type of cuisine would you prefer? (e.g., North Indian, South Indian, Bengali, etc.)";
          setConversationState({
            ...conversationState,
            waitingForCuisine: true,
          });
        }
      } else {
        response = "Please provide a calorie number. For example: '500 calories' or '500'";
      }
      return response;
    }

    // Check if waiting for cuisine input
    if (conversationState.waitingForCuisine) {
      const cuisine = extractCuisine(userMessage);
      if (cuisine) {
        const targetCalories = extractCalories(userMessage) || 500;
        const mealType = conversationState.requestedMealType || 'lunch';
        response = generateMealRecommendation(targetCalories, cuisine, mealType);
        setConversationState({});
      } else {
        response = "I couldn't identify the cuisine. Please specify a cuisine type (e.g., North Indian, South Indian, Bengali, Gujarati, etc.)";
      }
      return response;
    }

    // Handle comparison queries (e.g., "which has more calories, roti or naan?")
    if (/compare|which|more|less|difference|between/i.test(lowerMessage) && /calories?|protein|carbs?|fat/i.test(lowerMessage)) {
      const foods = extractMultipleFoods(userMessage);
      if (foods.length >= 2) {
        response = compareFoods(foods, userMessage);
        return response;
      }
    }

    // Handle range queries (e.g., "foods between 200-300 calories", "foods under 250 calories")
    if (/between|under|below|above|over|less than|more than|range/i.test(lowerMessage) && /\d+/.test(userMessage)) {
      const range = extractCalorieRange(userMessage);
      if (range) {
        response = getFoodsInRange(range.min, range.max, userMessage);
        return response;
      }
    }

    // Handle macro-specific queries (e.g., "high protein foods", "low carb options")
    if (/high|low|rich in|good source of|more|less/i.test(lowerMessage)) {
      if (/protein/i.test(lowerMessage)) {
        response = getFoodsByMacro('protein', lowerMessage.includes('high') || lowerMessage.includes('more'));
        return response;
      }
      if (/carb|carbs?/i.test(lowerMessage)) {
        response = getFoodsByMacro('carbs', lowerMessage.includes('low') || lowerMessage.includes('less'));
        return response;
      }
      if (/fat/i.test(lowerMessage)) {
        response = getFoodsByMacro('fat', lowerMessage.includes('low') || lowerMessage.includes('less'));
        return response;
      }
    }

    // Handle dietary preference queries (e.g., "vegetarian options", "non-veg foods")
    if (/vegetarian|veg|non.?veg|non.?vegetarian|eggetarian|egg/i.test(lowerMessage) && /option|food|meal|suggest|recommend/i.test(lowerMessage)) {
      const dietaryType = extractDietaryType(userMessage);
      const cuisine = extractCuisine(userMessage);
      const calories = extractCalories(userMessage);
      
      if (calories) {
        response = getFoodsByDietaryPreference(dietaryType, cuisine, calories);
      } else {
        response = getFoodsByDietaryPreference(dietaryType, cuisine);
      }
      return response;
    }

    // Handle "what can I eat" queries
    if (/what can i eat|what should i eat|what to eat|options|choices/i.test(lowerMessage)) {
      const calories = extractCalories(userMessage);
      const cuisine = extractCuisine(userMessage);
      const mealType = extractMealType(userMessage);
      
      if (calories) {
        if (mealType) {
          response = generateMealRecommendation(calories, cuisine || 'North Indian', mealType);
        } else {
          response = getFoodSuggestions(calories, cuisine);
        }
      } else {
        response = "I'd be happy to suggest foods! What calorie range are you looking for? (e.g., 300-500 calories)";
        setConversationState({ waitingForCalorie: true });
      }
      return response;
    }

    // Check for meal time requests
    const mealTimePatterns = {
      breakfast: /breakfast|morning meal|morning food|what to eat in morning|morning/i,
      lunch: /lunch|midday meal|afternoon meal|what to eat in afternoon|afternoon/i,
      dinner: /dinner|evening meal|night meal|what to eat at night|night/i,
      snack: /snack|evening snack|mid-morning snack|light food|quick bite/i,
    };

    for (const [mealType, pattern] of Object.entries(mealTimePatterns)) {
      if (pattern.test(userMessage)) {
        const calories = extractCalories(userMessage);
        if (calories) {
          const cuisine = extractCuisine(userMessage) || 'North Indian';
          response = generateMealRecommendation(calories, cuisine, mealType as any);
        } else {
          response = `Great! I can suggest a ${mealType} for you. What calorie range are you looking for? (e.g., 300-400 calories)`;
          setConversationState({
            waitingForCalorie: true,
            requestedMealType: mealType as any,
          });
        }
        return response;
      }
    }

    // Check for meal recommendation requests (without time)
    if (/suggest|recommend|give me|find me/i.test(userMessage) && /meal|food/i.test(userMessage)) {
      const calories = extractCalories(userMessage);
      const cuisine = extractCuisine(userMessage);
      
      if (calories) {
        if (cuisine) {
          response = generateMealRecommendation(calories, cuisine, 'lunch');
        } else {
          response = `I can suggest meals for ${calories} calories. What type of cuisine would you prefer? (e.g., North Indian, South Indian, etc.)`;
          setConversationState({
            waitingForCuisine: true,
          });
        }
      } else {
        response = `I'd be happy to suggest a meal! What calorie range are you looking for? (e.g., 300-500 calories)`;
        setConversationState({
          waitingForCalorie: true,
        });
      }
      return response;
    }

    // Check for food information requests FIRST (before calorie pattern)
    // This handles "calories in roti", "how many calories in roti", etc.
    const foodInfoPatterns = [
      /(?:how many|what are|tell me about|show me|give me info|info about|information about)\s+(?:calories?|nutrients?|nutrition)\s+(?:in|for|of)?\s*([^?]+)/i,
      /(?:calories?|nutrients?|nutrition)\s+(?:in|for|of)\s+([^?]+)/i,
      /(?:what|tell|show|give)\s+(?:me\s+)?(?:about|info|information)\s+([^?]+)/i,
      /(?:how\s+many\s+)?(?:calories?|protein|carbs?|fat)\s+(?:does|do|has|have|in|for)\s+([^?]+)/i,
    ];
    
    for (const pattern of foodInfoPatterns) {
      const foodMatch = userMessage.match(pattern);
      if (foodMatch && foodMatch[1]) {
        const foodName = foodMatch[1].trim().replace(/[?.,!]+$/, ''); // Remove trailing punctuation
        if (foodName.length > 1) {
          response = getFoodInfo(foodName);
          return response;
        }
      }
    }

    // Check for calorie-based meal requests (only if it has a number)
    const caloriePattern = /(\d+)\s*(?:calories?|cal)/i;
    if (caloriePattern.test(userMessage)) {
      const calories = extractCalories(userMessage);
      const cuisine = extractCuisine(userMessage);
      
      if (calories) {
        if (cuisine) {
          response = generateMealRecommendation(calories, cuisine, 'lunch');
        } else {
          response = `I can suggest meals for ${calories} calories. What type of cuisine would you prefer? (e.g., North Indian, South Indian, etc.)`;
          setConversationState({
            waitingForCuisine: true,
          });
        }
      }
      return response;
    }

    // Handle "list" or "show me" queries
    if (/list|show|give me|tell me about|what are/i.test(lowerMessage)) {
      const cuisine = extractCuisine(userMessage);
      const mealType = extractMealType(userMessage);
      const dietaryType = extractDietaryType(userMessage);
      
      if (cuisine || mealType || dietaryType !== 'both') {
        let filtered = foodDatabase;
        if (cuisine) filtered = filtered.filter(f => f.cuisine === cuisine);
        if (mealType) filtered = filtered.filter(f => f.suitableMealTypes.includes(mealType));
        if (dietaryType !== 'both') filtered = filtered.filter(f => f.dietaryType === dietaryType);
        
        if (filtered.length > 0) {
          const display = filtered.slice(0, 15);
          response = `🍽️ **Food Options:**\n\n`;
          display.forEach((food, idx) => {
            response += `${idx + 1}. ${food.emoji || '🍽️'} **${food.name}** - ${food.calories} kcal\n`;
          });
          if (filtered.length > 15) {
            response += `\n💡 Showing 15 of ${filtered.length} foods. Be more specific for better results!`;
          }
          return response;
        }
      }
    }

    // Direct food name search (check if message looks like a food query)
    // Remove common question words and punctuation
    const cleanedMessage = userMessage
      .replace(/^(what|how|tell|show|give|find|about|info|information)\s+/i, '')
      .replace(/[?.,!]+$/, '')
      .trim();
    
    // Try multiple search strategies
    let foundFoods = searchFoods(cleanedMessage);
    
    // If no results, try searching individual words
    if (foundFoods.length === 0 && cleanedMessage.split(' ').length > 1) {
      const words = cleanedMessage.split(' ').filter(w => w.length > 2);
      for (const word of words) {
        const wordResults = searchFoods(word);
        if (wordResults.length > 0) {
          foundFoods = wordResults;
          break;
        }
      }
    }
    
    // Try fuzzy matching - check if any food name contains the query or vice versa
    if (foundFoods.length === 0) {
      const lowerCleaned = cleanedMessage.toLowerCase();
      foundFoods = foodDatabase.filter(food => {
        const foodName = food.name.toLowerCase();
        return foodName.includes(lowerCleaned) || lowerCleaned.includes(foodName.split(' ')[0]);
      });
    }
    
    if (foundFoods.length > 0) {
      if (foundFoods.length === 1) {
        response = formatFoodInfo(foundFoods[0]);
      } else {
        response = `I found ${foundFoods.length} foods matching "${cleanedMessage}":\n\n`;
        foundFoods.slice(0, 8).forEach((food, idx) => {
          response += `${idx + 1}. ${food.emoji || '🍽️'} **${food.name}** - ${food.calories} kcal\n`;
          response += `   ${food.cuisine} | P: ${food.protein}g | C: ${food.carbs}g | F: ${food.fat}g\n\n`;
        });
        if (foundFoods.length > 8) {
          response += `\n💡 Showing 8 of ${foundFoods.length} results. Be more specific for a single food!`;
        } else {
          response += `\n💡 Ask about a specific food for detailed nutrition info!`;
        }
      }
      return response;
    }

    // Handle greeting and casual queries
    if (/hi|hello|hey|thanks|thank you|help|what can you do/i.test(lowerMessage)) {
      response = `👋 Hi! I'm Slay AI, your personal health coach! I can help you with:\n\n` +
        `🔍 **Food Information:**\n` +
        `• "How many calories in roti?"\n` +
        `• "Tell me about biryani"\n` +
        `• "Compare roti and naan"\n\n` +
        `🍽️ **Meal Recommendations:**\n` +
        `• "Suggest a meal for 500 calories"\n` +
        `• "What should I eat for breakfast?"\n` +
        `• "North Indian lunch for 400 calories"\n\n` +
        `📊 **Smart Queries:**\n` +
        `• "High protein foods"\n` +
        `• "Foods between 200-300 calories"\n` +
        `• "Vegetarian options under 250 calories"\n` +
        `• "Low carb South Indian foods"\n\n` +
        `💡 Try asking me anything about Indian food and nutrition!`;
      return response;
    }

    // Default response with helpful suggestions
    response = `I'm not sure I understood that. I can help you with:\n\n` +
      `• **Food Info:** "calories in roti", "tell me about biryani"\n` +
      `• **Comparisons:** "which has more calories, roti or naan?"\n` +
      `• **Meal Suggestions:** "suggest a meal for 500 calories"\n` +
      `• **Smart Filters:** "high protein foods", "foods under 250 calories"\n` +
      `• **Dietary Options:** "vegetarian options", "non-veg foods under 300 calories"\n\n` +
      `💡 Try rephrasing your question or ask me "help" for more examples!`;

    return response;
  };

  const extractCalories = (text: string): number | null => {
    // Try various patterns: "500 calories", "500 cal", "500", "around 500", "about 500"
    const patterns = [
      /(\d+)\s*(?:calories?|cal|kcal)/i,
      /(?:around|about|approximately|roughly)\s+(\d+)/i,
      /(\d+)\s*(?:calorie|cal)\s*(?:meal|food|diet)/i,
      /^(\d+)$/, // Just a number
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const calories = parseInt(match[1]);
        if (calories > 0 && calories < 5000) { // Sanity check
          return calories;
        }
      }
    }
    
    return null;
  };

  const extractCuisine = (text: string): string | null => {
    const cuisines = [
      'North Indian', 'South Indian', 'Bengali', 'Gujarati', 
      'Maharashtrian', 'Malayali', 'Andhra', 'Odia', 
      'Rajasthani', 'Bihari', 'North-Eastern', 'Kashmiri', 'Snacks'
    ];
    
    // Also check for common variations
    const cuisineAliases: Record<string, string> = {
      'north indian': 'North Indian',
      'south indian': 'South Indian',
      'bengali': 'Bengali',
      'gujarati': 'Gujarati',
      'maharashtrian': 'Maharashtrian',
      'kerala': 'Malayali',
      'malayali': 'Malayali',
      'andhra': 'Andhra',
      'odia': 'Odia',
      'rajasthani': 'Rajasthani',
      'bihari': 'Bihari',
      'northeastern': 'North-Eastern',
      'north eastern': 'North-Eastern',
      'kashmiri': 'Kashmiri',
      'snacks': 'Snacks',
    };
    
    const lowerText = text.toLowerCase();
    
    // Check exact matches first
    for (const cuisine of cuisines) {
      if (lowerText.includes(cuisine.toLowerCase())) {
        return cuisine;
      }
    }
    
    // Check aliases
    for (const [alias, cuisine] of Object.entries(cuisineAliases)) {
      if (lowerText.includes(alias)) {
        return cuisine;
      }
    }
    
    return null;
  };

  const extractMultipleFoods = (text: string): FoodItem[] => {
    const foods: FoodItem[] = [];
    const words = text.toLowerCase().split(/[,\s]+/);
    
    // Look for food names in the text
    for (const word of words) {
      if (word.length > 2) {
        const found = searchFoods(word);
        if (found.length > 0) {
          foods.push(...found.slice(0, 1)); // Take first match for each word
        }
      }
    }
    
    // Also try to extract food names using common patterns
    const foodPatterns = [
      /(?:roti|naan|paratha|dosa|idli|biryani|paneer|chicken|mutton|dal|rice|curry|samosa|pakora)/gi
    ];
    
    for (const pattern of foodPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          const found = searchFoods(match);
          if (found.length > 0 && !foods.some(f => f.id === found[0].id)) {
            foods.push(found[0]);
          }
        }
      }
    }
    
    return foods;
  };

  const compareFoods = (foods: FoodItem[], query: string): string => {
    if (foods.length < 2) {
      return "I need at least 2 foods to compare. Please mention both foods in your question.";
    }

    const lowerQuery = query.toLowerCase();
    let comparisonType = 'calories';
    if (lowerQuery.includes('protein')) comparisonType = 'protein';
    else if (lowerQuery.includes('carb')) comparisonType = 'carbs';
    else if (lowerQuery.includes('fat')) comparisonType = 'fat';

    let response = `📊 **Comparison:**\n\n`;
    
    foods.slice(0, 5).forEach((food, idx) => {
      const value = food[comparisonType as keyof FoodItem] as number;
      response += `${idx + 1}. ${food.emoji || '🍽️'} **${food.name}**\n`;
      response += `   • Calories: ${food.calories} kcal\n`;
      response += `   • Protein: ${food.protein}g\n`;
      response += `   • Carbs: ${food.carbs}g\n`;
      response += `   • Fat: ${food.fat}g\n\n`;
    });

    // Find the highest and lowest
    const sorted = [...foods].sort((a, b) => {
      const aVal = a[comparisonType as keyof FoodItem] as number;
      const bVal = b[comparisonType as keyof FoodItem] as number;
      return bVal - aVal;
    });

    if (sorted.length >= 2) {
      const highest = sorted[0];
      const lowest = sorted[sorted.length - 1];
      const highVal = highest[comparisonType as keyof FoodItem] as number;
      const lowVal = lowest[comparisonType as keyof FoodItem] as number;
      
      response += `💡 **${highest.name}** has the most ${comparisonType} (${highVal}${comparisonType === 'calories' ? ' kcal' : 'g'}), while **${lowest.name}** has the least (${lowVal}${comparisonType === 'calories' ? ' kcal' : 'g'}).\n`;
      response += `   Difference: ${highVal - lowVal}${comparisonType === 'calories' ? ' kcal' : 'g'}`;
    }

    return response;
  };

  const extractCalorieRange = (text: string): { min: number; max: number } | null => {
    // Patterns: "200-300", "between 200 and 300", "under 250", "above 200", etc.
    const rangeMatch = text.match(/(\d+)\s*[-–—]\s*(\d+)/);
    if (rangeMatch) {
      return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
    }

    const betweenMatch = text.match(/between\s+(\d+)\s+and\s+(\d+)/i);
    if (betweenMatch) {
      return { min: parseInt(betweenMatch[1]), max: parseInt(betweenMatch[2]) };
    }

    const underMatch = text.match(/(?:under|below|less than)\s+(\d+)/i);
    if (underMatch) {
      return { min: 0, max: parseInt(underMatch[1]) };
    }

    const overMatch = text.match(/(?:above|over|more than)\s+(\d+)/i);
    if (overMatch) {
      return { min: parseInt(overMatch[1]), max: 2000 };
    }

    return null;
  };

  const getFoodsInRange = (minCal: number, maxCal: number, query: string): string => {
    const foods = foodDatabase.filter(f => f.calories >= minCal && f.calories <= maxCal);
    
    if (foods.length === 0) {
      return `I couldn't find any foods between ${minCal}-${maxCal} calories. Try a different range!`;
    }

    // Sort by calories
    foods.sort((a, b) => a.calories - b.calories);

    const cuisine = extractCuisine(query);
    const filtered = cuisine ? foods.filter(f => f.cuisine === cuisine) : foods;

    const displayFoods = filtered.slice(0, 10);
    
    let response = `🍽️ **Foods between ${minCal}-${maxCal} calories${cuisine ? ` (${cuisine})` : ''}:**\n\n`;
    
    displayFoods.forEach((food, idx) => {
      response += `${idx + 1}. ${food.emoji || '🍽️'} **${food.name}** - ${food.calories} kcal\n`;
      response += `   P: ${food.protein}g | C: ${food.carbs}g | F: ${food.fat}g\n\n`;
    });

    if (filtered.length > 10) {
      response += `\n💡 Showing 10 of ${filtered.length} foods. Be more specific to narrow down results!`;
    }

    return response;
  };

  const getFoodsByMacro = (macro: 'protein' | 'carbs' | 'fat', isHigh: boolean): string => {
    const sorted = [...foodDatabase].sort((a, b) => {
      const aVal = a[macro];
      const bVal = b[macro];
      return isHigh ? bVal - aVal : aVal - bVal;
    });

    const topFoods = sorted.slice(0, 10);
    const label = isHigh ? 'High' : 'Low';
    
    let response = `🍽️ **Top 10 ${label} ${macro.charAt(0).toUpperCase() + macro.slice(1)} Foods:**\n\n`;
    
    topFoods.forEach((food, idx) => {
      response += `${idx + 1}. ${food.emoji || '🍽️'} **${food.name}**\n`;
      response += `   • ${macro.charAt(0).toUpperCase() + macro.slice(1)}: ${food[macro]}g\n`;
      response += `   • Calories: ${food.calories} kcal\n\n`;
    });

    return response;
  };

  const extractDietaryType = (text: string): 'veg' | 'non-veg' | 'eggetarian' | 'both' => {
    const lower = text.toLowerCase();
    if (lower.includes('non') && (lower.includes('veg') || lower.includes('vegetarian'))) return 'non-veg';
    if (lower.includes('egg')) return 'eggetarian';
    if (lower.includes('veg') || lower.includes('vegetarian')) return 'veg';
    return 'both';
  };

  const getFoodsByDietaryPreference = (
    dietaryType: 'veg' | 'non-veg' | 'eggetarian' | 'both',
    cuisine?: string | null,
    maxCalories?: number
  ): string => {
    let foods = foodDatabase;

    // Filter by dietary type
    if (dietaryType !== 'both') {
      foods = foods.filter(f => f.dietaryType === dietaryType);
    }

    // Filter by cuisine
    if (cuisine) {
      foods = foods.filter(f => f.cuisine === cuisine);
    }

    // Filter by calories
    if (maxCalories) {
      foods = foods.filter(f => f.calories <= maxCalories);
    }

    if (foods.length === 0) {
      return `I couldn't find any ${dietaryType !== 'both' ? dietaryType : ''} ${cuisine || ''} foods${maxCalories ? ` under ${maxCalories} calories` : ''}. Try different criteria!`;
    }

    // Sort by calories
    foods.sort((a, b) => a.calories - b.calories);
    const displayFoods = foods.slice(0, 10);

    let response = `🍽️ **${dietaryType !== 'both' ? dietaryType.charAt(0).toUpperCase() + dietaryType.slice(1) : ''} ${cuisine || ''} Food Options${maxCalories ? ` (under ${maxCalories} cal)` : ''}:**\n\n`;
    
    displayFoods.forEach((food, idx) => {
      response += `${idx + 1}. ${food.emoji || '🍽️'} **${food.name}** - ${food.calories} kcal\n`;
      response += `   ${food.cuisine} | P: ${food.protein}g | C: ${food.carbs}g | F: ${food.fat}g\n\n`;
    });

    if (foods.length > 10) {
      response += `\n💡 Showing 10 of ${foods.length} foods. Be more specific for better results!`;
    }

    return response;
  };

  const extractMealType = (text: string): 'breakfast' | 'lunch' | 'dinner' | 'snack' | null => {
    const lower = text.toLowerCase();
    if (/breakfast|morning/i.test(lower)) return 'breakfast';
    if (/lunch|midday/i.test(lower)) return 'lunch';
    if (/dinner|evening|night/i.test(lower)) return 'dinner';
    if (/snack/i.test(lower)) return 'snack';
    return null;
  };

  const getFoodSuggestions = (calories: number, cuisine?: string | null): string => {
    const foods = foodDatabase.filter(f => {
      const match = f.calories <= calories + 50 && f.calories >= calories - 100;
      if (cuisine) return match && f.cuisine === cuisine;
      return match;
    });

    if (foods.length === 0) {
      return `I couldn't find foods around ${calories} calories${cuisine ? ` for ${cuisine}` : ''}. Try a different calorie range!`;
    }

    foods.sort((a, b) => Math.abs(a.calories - calories) - Math.abs(b.calories - calories));
    const suggestions = foods.slice(0, 8);

    let response = `🍽️ **Food Suggestions (~${calories} calories${cuisine ? `, ${cuisine}` : ''}):**\n\n`;
    
    suggestions.forEach((food, idx) => {
      response += `${idx + 1}. ${food.emoji || '🍽️'} **${food.name}** - ${food.calories} kcal\n`;
      response += `   ${food.cuisine} | Suitable for: ${food.suitableMealTypes.join(', ')}\n\n`;
    });

    return response;
  };

  const getFoodInfo = (foodName: string): string => {
    const foods = searchFoods(foodName);
    if (foods.length === 0) {
      return `I couldn't find "${foodName}" in my database. Please try a different food name or check the spelling.`;
    }
    if (foods.length === 1) {
      return formatFoodInfo(foods[0]);
    }
    let response = `I found ${foods.length} foods matching "${foodName}":\n\n`;
    foods.slice(0, 5).forEach((food, idx) => {
      response += `${idx + 1}. ${formatFoodInfo(food)}\n\n`;
    });
    return response;
  };

  const formatFoodInfo = (food: FoodItem): string => {
    return `${food.emoji || '🍽️'} **${food.name}**\n\n` +
      `📊 **Nutrition per serving:**\n` +
      `• Calories: ${food.calories} kcal\n` +
      `• Protein: ${food.protein}g\n` +
      `• Carbs: ${food.carbs}g\n` +
      `• Fat: ${food.fat}g\n\n` +
      `🍽️ Serving: ${food.servingSize}\n` +
      `🌍 Cuisine: ${food.cuisine}\n` +
      `🥗 Suitable for: ${food.suitableMealTypes.join(', ')}`;
  };

  const generateMealRecommendation = (
    targetCalories: number,
    cuisine: string,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ): string => {
    let combinations = getMealCombinations(cuisine, mealType, 'both');
    
    // If no combinations found for this cuisine, try North Indian as fallback
    if (combinations.length === 0) {
      combinations = getMealCombinations('North Indian', mealType, 'both');
      if (combinations.length === 0) {
        return `I don't have ${cuisine} ${mealType} combinations in my database. Try asking for a different cuisine or meal type.`;
      }
      cuisine = 'North Indian'; // Update cuisine for display
    }

    // Find the closest match to target calories
    let bestMatch = combinations[0];
    let minDiff = Math.abs(bestMatch.totalCalories - targetCalories);

    for (const combo of combinations) {
      const diff = Math.abs(combo.totalCalories - targetCalories);
      if (diff < minDiff) {
        minDiff = diff;
        bestMatch = combo;
      }
    }

    let response = `🍽️ **${bestMatch.name}**\n\n`;
    response += `📊 **Total Nutrition:**\n`;
    response += `• Calories: ${bestMatch.totalCalories} kcal\n`;
    response += `• Protein: ${bestMatch.totalProtein}g\n`;
    response += `• Carbs: ${bestMatch.totalCarbs}g\n`;
    response += `• Fat: ${bestMatch.totalFat}g\n\n`;
    response += `🍽️ **Meal Items:**\n`;
    
    bestMatch.items.forEach((item, idx) => {
      response += `${idx + 1}. ${item.food.emoji || '🍽️'} ${item.food.name}`;
      if (item.portion !== 1) {
        response += ` (${item.portion} servings)`;
      }
      response += ` - ${Math.round(item.calories)} cal\n`;
    });

    if (Math.abs(bestMatch.totalCalories - targetCalories) > 50) {
      response += `\n💡 Note: This meal has ${bestMatch.totalCalories} calories, which is ${Math.abs(bestMatch.totalCalories - targetCalories)} calories ${bestMatch.totalCalories > targetCalories ? 'more' : 'less'} than your target.`;
    }

    return response;
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 500));

    const aiResponse = await processUserMessage(userMessage.content);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const capabilities = [
    {
      icon: '🔍',
      title: 'Food Information',
      description: 'Ask about calories, protein, carbs, and fat for any food in our database',
    },
    {
      icon: '🍽️',
      title: 'Meal Recommendations',
      description: 'Get personalized meal suggestions based on your calorie target',
    },
    {
      icon: '⏰',
      title: 'Time-Based Meals',
      description: 'Ask for breakfast, lunch, dinner, or snack recommendations',
    },
    {
      icon: '🌍',
      title: 'Cuisine Preferences',
      description: 'Get meal suggestions for your favorite Indian cuisines',
    },
  ];

  return (
    <div className="min-h-screen gradient-bg relative">
      {/* Close Button - Top Right */}
      {onClose && (
        <motion.button
          onClick={onClose}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all backdrop-blur-sm"
        >
          <X className="w-6 h-6" />
        </motion.button>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Capabilities */}
          <div className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <div className="glass rounded-3xl p-8 border border-white/10">
                <h2 className="text-3xl font-heading font-bold text-white mb-6">
                  What Slay AI Can Do
                </h2>
                <div className="space-y-6">
                  {capabilities.map((capability, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="text-4xl">{capability.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {capability.title}
                        </h3>
                        <p className="text-gray-300">
                          {capability.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-400/30">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    💡 Example Questions
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• "How many calories in roti?"</li>
                    <li>• "Suggest a meal for 500 calories"</li>
                    <li>• "What should I eat for breakfast?"</li>
                    <li>• "Tell me about biryani"</li>
                    <li>• "North Indian lunch for 400 calories"</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Mobile Phone Frame */}
          <div className="flex justify-center items-center py-8 lg:py-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative scale-75 sm:scale-90 lg:scale-100"
            >
              {/* Phone Frame/Bezel */}
              <div className="relative" style={{ width: '391px', height: '828px' }}>
                {/* Outer Frame Shadow */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl" 
                  style={{ 
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Inner Screen Area */}
                  <div 
                    className="bg-black rounded-[2.5rem] overflow-hidden relative" 
                    style={{ 
                      width: '375px', 
                      height: '812px',
                      boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.1)'
                    }}
                  >
                    {/* Status Bar / Notch Area */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/80 to-transparent z-20 flex items-center justify-center">
                      <div className="w-32 h-6 bg-black rounded-full flex items-center justify-between px-4">
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                        <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
                      </div>
                      <div className="absolute right-4 top-3 flex items-center gap-1 text-white text-xs">
                        <span>100%</span>
                        <div className="w-6 h-3 border border-white rounded-sm">
                          <div className="w-full h-full bg-white rounded-sm"></div>
                        </div>
                      </div>
                    </div>

                    {/* Screen Content */}
                    <div className="h-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 overflow-hidden relative">
                      {/* Chat Header */}
                      <div className="pt-12 pb-4 px-4 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm">Slay AI</h3>
                            <p className="text-xs text-gray-300">Your Health Coach</p>
                          </div>
                        </div>
                      </div>

                      {/* Messages Area */}
                      <div 
                        className="overflow-y-auto px-4 py-4 space-y-3" 
                        style={{ 
                          height: 'calc(812px - 200px)',
                          paddingBottom: '80px'
                        }}
                      >
                        {messages.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center text-center px-4"
                            style={{ minHeight: 'calc(812px - 200px)', paddingTop: '40px' }}
                          >
                            <div className="mb-6">
                              <img
                                src="/assets/slaycal-logo.svg"
                                alt="Slay AI Logo"
                                className="w-24 h-24 mx-auto mb-4"
                              />
                            </div>
                            <h2 className="text-xl font-heading font-bold text-white mb-2">
                              Ask Slay AI
                            </h2>
                            <p className="text-gray-400 text-sm mb-6 px-4">
                              Your personal health coach is ready to help!
                            </p>
                            <div className="flex flex-col gap-2 w-full max-w-xs">
                              {['Calories in roti?', '500 cal meal', 'Breakfast ideas'].map((suggestion, idx) => (
                                <motion.button
                                  key={idx}
                                  onClick={() => {
                                    setInput(suggestion);
                                    setTimeout(() => handleSend(), 100);
                                  }}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-full text-sm text-white border border-white/20 w-full"
                                >
                                  {suggestion}
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        ) : (
                          <>
                            {messages.map((message) => (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[85%] rounded-2xl px-3 py-2.5 ${
                                    message.type === 'user'
                                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                      : 'bg-white/10 text-white border border-white/20'
                                  }`}
                                >
                                  {message.type === 'ai' ? (
                                    <div className="whitespace-pre-wrap text-xs leading-relaxed">
                                      {message.content.split('**').map((part, idx) => 
                                        idx % 2 === 1 ? (
                                          <strong key={idx} className="text-yellow-400">{part}</strong>
                                        ) : (
                                          part
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-xs leading-relaxed">{message.content}</p>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                            {isTyping && (
                              <div className="flex justify-start">
                                <div className="bg-white/10 rounded-2xl px-3 py-2.5 border border-white/20">
                                  <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div ref={messagesEndRef} />
                          </>
                        )}
                      </div>

                      {/* Input Area */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 pb-8 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent">
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask Slay AI..."
                            className="flex-1 px-3 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none"
                            disabled={isTyping}
                          />
                          <motion.button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                          >
                            <Send className="w-4 h-4" />
                          </motion.button>
                        </div>
                        {/* Home Indicator (iPhone style) */}
                        <div className="w-32 h-1 bg-white/30 rounded-full mx-auto"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
