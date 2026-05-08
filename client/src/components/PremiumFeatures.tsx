import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Utensils,
  Leaf,
  ShoppingCart,
  TrendingUp,
  Clock,
  Heart,
  Share2,
  Sparkles,
} from "lucide-react";

export const MealPlanCard = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="bg-gradient-to-br from-mint-200 to-mint-300 border-2 border-black/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/50 rounded-lg">
            <Utensils className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-black text-black text-lg">MEAL PLANS</h3>
            <p className="text-sm text-black/70 font-semibold">AI-powered planning</p>
          </div>
        </div>
        <Badge className="bg-yellow-300 text-black font-black">NEW</Badge>
      </div>

      <p className="text-black/80 font-semibold mb-4">
        Get personalized 7, 14, or 30-day meal plans with shopping lists
      </p>

      <Button
        onClick={() => setIsLoading(!isLoading)}
        disabled={isLoading}
        className="w-full bg-black hover:bg-black/80 text-white font-black border-2 border-black/20 rounded-lg py-2 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⏳</span>
            GENERATING...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            CREATE MEAL PLAN
          </>
        )}
      </Button>
    </Card>
  );
};

export const NutritionCard = () => {
  return (
    <Card className="bg-gradient-to-br from-lilac-200 to-lilac-300 border-2 border-black/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-black text-black text-lg">NUTRITION</h3>
            <p className="text-sm text-black/70 font-semibold">Health insights</p>
          </div>
        </div>
        <Badge className="bg-yellow-300 text-black font-black">PRO</Badge>
      </div>

      <p className="text-black/80 font-semibold mb-4">
        Detailed nutritional breakdown: calories, protein, carbs, fats, and more
      </p>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/50 rounded-lg p-2 text-center">
          <p className="text-xs font-bold text-black/60">CALORIES</p>
          <p className="text-lg font-black text-black">245</p>
        </div>
        <div className="bg-white/50 rounded-lg p-2 text-center">
          <p className="text-xs font-bold text-black/60">PROTEIN</p>
          <p className="text-lg font-black text-black">12g</p>
        </div>
      </div>
    </Card>
  );
};

export const DietaryFiltersCard = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const diets = ["Vegan", "Vegetarian", "Gluten-Free", "Keto", "Paleo"];

  return (
    <Card className="bg-gradient-to-br from-yellow-200 to-yellow-300 border-2 border-black/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/50 rounded-lg">
            <Leaf className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-black text-black text-lg">DIETARY FILTERS</h3>
            <p className="text-sm text-black/70 font-semibold">Your preferences</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {diets.map((diet) => (
          <Badge
            key={diet}
            onClick={() =>
              setSelected(
                selected.includes(diet)
                  ? selected.filter((d) => d !== diet)
                  : [...selected, diet]
              )
            }
            className={`cursor-pointer border-2 font-bold transition-all ${
              selected.includes(diet)
                ? "bg-black text-white border-black"
                : "bg-white text-black border-black/20 hover:bg-black/10"
            }`}
          >
            {diet}
          </Badge>
        ))}
      </div>

      <p className="text-sm text-black/70 font-semibold">
        {selected.length > 0
          ? `${selected.length} filter${selected.length > 1 ? "s" : ""} selected`
          : "Select dietary preferences"}
      </p>
    </Card>
  );
};

export const ShoppingListCard = () => {
  return (
    <Card className="bg-gradient-to-br from-peach-200 to-peach-100 border-2 border-black/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/50 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-black text-black text-lg">SHOPPING LIST</h3>
            <p className="text-sm text-black/70 font-semibold">Auto-generated</p>
          </div>
        </div>
        <Badge className="bg-yellow-300 text-black font-black">AUTO</Badge>
      </div>

      <p className="text-black/80 font-semibold mb-4">
        Automatically consolidate ingredients from recipes into organized shopping lists
      </p>

      <Button className="w-full bg-black hover:bg-black/80 text-white font-black border-2 border-black/20 rounded-lg py-2 flex items-center justify-center gap-2">
        <ShoppingCart className="w-4 h-4" />
        GENERATE LIST
      </Button>
    </Card>
  );
};

export const RecipeStatsCard = ({ recipe }: { recipe: any }) => {
  return (
    <div className="grid grid-cols-4 gap-2 mb-6">
      <div className="bg-mint-200 rounded-lg p-3 text-center border-2 border-black/10 hover:border-black/30 transition-all">
        <Clock className="w-4 h-4 text-black mx-auto mb-1" />
        <p className="text-xs font-bold text-black/60">PREP</p>
        <p className="text-sm font-black text-black">{recipe.prepTime}m</p>
      </div>

      <div className="bg-lilac-200 rounded-lg p-3 text-center border-2 border-black/10 hover:border-black/30 transition-all">
        <Clock className="w-4 h-4 text-black mx-auto mb-1" />
        <p className="text-xs font-bold text-black/60">COOK</p>
        <p className="text-sm font-black text-black">{recipe.cookTime}m</p>
      </div>

      <div className="bg-yellow-200 rounded-lg p-3 text-center border-2 border-black/10 hover:border-black/30 transition-all">
        <Utensils className="w-4 h-4 text-black mx-auto mb-1" />
        <p className="text-xs font-bold text-black/60">SERVES</p>
        <p className="text-sm font-black text-black">{recipe.servings}</p>
      </div>

      <div className="bg-peach-200 rounded-lg p-3 text-center border-2 border-black/10 hover:border-black/30 transition-all">
        <TrendingUp className="w-4 h-4 text-black mx-auto mb-1" />
        <p className="text-xs font-bold text-black/60">MATCH</p>
        <p className="text-sm font-black text-black">{recipe.matchScore}%</p>
      </div>
    </div>
  );
};

export const SocialShareCard = ({ recipe }: { recipe: any }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `Check out this amazing recipe: ${recipe.title}! 🍽️ #RecipeFinder`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-3">
      <Button
        onClick={handleShare}
        className="flex-1 bg-lilac-200 hover:bg-lilac-300 text-black font-black border-2 border-black/20 rounded-lg py-2 flex items-center justify-center gap-2 transition-all"
      >
        <Share2 className="w-4 h-4" />
        {copied ? "COPIED!" : "SHARE"}
      </Button>

      <Button className="flex-1 bg-yellow-200 hover:bg-yellow-300 text-black font-black border-2 border-black/20 rounded-lg py-2 flex items-center justify-center gap-2 transition-all">
        <Heart className="w-4 h-4" />
        SAVE
      </Button>
    </div>
  );
};

export default {
  MealPlanCard,
  NutritionCard,
  DietaryFiltersCard,
  ShoppingListCard,
  RecipeStatsCard,
  SocialShareCard,
};
