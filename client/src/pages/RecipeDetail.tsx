import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, Heart, Share2, ArrowLeft, Printer } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import MemphisLayout from "@/components/MemphisLayout";

interface Recipe {
  title: string;
  description: string;
  cuisine: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Array<{ name: string; quantity: number; unit: string }>;
  instructions: string[];
  matchScore: string;
  previewImageUrl?: string;
}

export default function RecipeDetail() {
  const [, navigate] = useLocation();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [servings, setServings] = useState(4);
  const [isFavorited, setIsFavorited] = useState(false);
  const { user } = useAuth();

  const addFavoriteMutation = trpc.favorites.add.useMutation({
    onSuccess: () => {
      setIsFavorited(true);
      toast.success("Added to favorites!");
    },
  });

  const removeFavoriteMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      setIsFavorited(false);
      toast.success("Removed from favorites");
    },
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedRecipe");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecipe(parsed);
        setServings(parsed.servings || 4);
      } catch (e) {
        console.error("Failed to load recipe:", e);
        navigate("/results");
      }
    } else {
      navigate("/results");
    }
  }, [navigate]);

  const handleFavoriteToggle = () => {
    if (!user) {
      toast.error("Please log in to save favorites");
      return;
    }

    if (isFavorited) {
      removeFavoriteMutation.mutate(1); // In real app, would use recipe ID from DB
    } else {
      addFavoriteMutation.mutate(1); // In real app, would use recipe ID from DB
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share && recipe) {
      navigator.share({
        title: recipe.title,
        text: `Check out this ${recipe.difficulty} ${recipe.cuisine} recipe: ${recipe.title}`,
      });
    } else {
      toast.info("Share feature not available on this device");
    }
  };

  const scaledIngredients = recipe
    ? recipe.ingredients.map(ing => ({
        ...ing,
        quantity: (ing.quantity * servings) / recipe.servings,
      }))
    : [];

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-peach-100 via-peach-50 to-peach-100 flex items-center justify-center">
        <ChefHat className="w-12 h-12 animate-spin text-black" />
      </div>
    );
  }

  return (
    <MemphisLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/results")}
            className="border-2 border-black/20 hover:bg-mint-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl md:text-5xl font-black text-black drop-shadow-lg flex-1">
            {recipe.title}
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Image and Actions */}
          <div className="lg:col-span-2">
            {/* Recipe Image */}
            <Card className="bg-gradient-to-br from-mint-100 to-lilac-100 border-2 border-black/10 overflow-hidden mb-6 h-96 flex items-center justify-center">
              {recipe.previewImageUrl ? (
                <img
                  src={recipe.previewImageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ChefHat className="w-24 h-24 text-black/20" />
              )}
            </Card>

            {/* Description */}
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-black/10 p-6 mb-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {recipe.description}
              </p>
            </Card>

            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-mint-200/80 border-2 border-black/20 p-4 text-center">
                <Clock className="w-6 h-6 text-black mx-auto mb-2" />
                <p className="text-sm font-bold text-black">
                  {recipe.prepTime + recipe.cookTime}m
                </p>
                <p className="text-xs text-gray-700">Total Time</p>
              </Card>
              <Card className="bg-lilac-200/80 border-2 border-black/20 p-4 text-center">
                <Users className="w-6 h-6 text-black mx-auto mb-2" />
                <p className="text-sm font-bold text-black">{recipe.servings}</p>
                <p className="text-xs text-gray-700">Servings</p>
              </Card>
              <Card className="bg-yellow-200/80 border-2 border-black/20 p-4 text-center">
                <Badge className="bg-white text-black font-black mx-auto block">
                  {recipe.difficulty}
                </Badge>
                <p className="text-xs text-gray-700 mt-2">Difficulty</p>
              </Card>
              <Card className="bg-white border-2 border-black/20 p-4 text-center">
                <Badge className="bg-yellow-200 text-black font-black mx-auto block">
                  {recipe.matchScore}%
                </Badge>
                <p className="text-xs text-gray-700 mt-2">Match</p>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button
                onClick={handleFavoriteToggle}
                disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
                className={`flex-1 font-black border-2 border-black/20 rounded-lg ${
                  isFavorited
                    ? "bg-red-200 hover:bg-red-300 text-black"
                    : "bg-white hover:bg-gray-100 text-black"
                }`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isFavorited ? "fill-current" : ""}`} />
                {isFavorited ? "FAVORITED" : "FAVORITE"}
              </Button>
              <Button
                onClick={handleShare}
                className="flex-1 bg-mint-300 hover:bg-mint-400 text-black font-black border-2 border-black/20 rounded-lg"
              >
                <Share2 className="w-5 h-5 mr-2" />
                SHARE
              </Button>
              <Button
                onClick={handlePrint}
                className="flex-1 bg-lilac-200 hover:bg-lilac-300 text-black font-black border-2 border-black/20 rounded-lg"
              >
                <Printer className="w-5 h-5 mr-2" />
                PRINT
              </Button>
            </div>

            {/* Instructions */}
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-black/10 p-6">
              <h2 className="text-2xl font-black text-black mb-6 drop-shadow-sm">
                INSTRUCTIONS
              </h2>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-200 border-2 border-black/30 rounded-full flex items-center justify-center font-black text-black">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{instruction}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Ingredients */}
          <div>
            <Card className="bg-white/95 backdrop-blur-sm border-2 border-black/10 p-6 sticky top-8">
              <h2 className="text-2xl font-black text-black mb-4 drop-shadow-sm">
                INGREDIENTS
              </h2>

              {/* Servings Adjuster */}
              <div className="mb-6 pb-6 border-b-2 border-black/10">
                <label className="block text-sm font-bold text-black mb-2">
                  SERVINGS
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="bg-mint-200 hover:bg-mint-300 text-black font-bold border-2 border-black/20 rounded-lg w-10 h-10 p-0"
                  >
                    −
                  </Button>
                  <input
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 border-2 border-black/20 rounded-lg text-center font-bold"
                  />
                  <Button
                    onClick={() => setServings(servings + 1)}
                    className="bg-mint-200 hover:bg-mint-300 text-black font-bold border-2 border-black/20 rounded-lg w-10 h-10 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Ingredients List */}
              <div className="space-y-3">
                {scaledIngredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-peach-50 border border-black/10 rounded-lg hover:bg-peach-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 w-5 h-5 border-2 border-black/30 rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-black">
                        {ingredient.quantity.toFixed(2)} {ingredient.unit}
                      </p>
                      <p className="text-sm text-gray-700">{ingredient.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Category and Cuisine Badges */}
              <div className="mt-6 pt-6 border-t-2 border-black/10 space-y-2">
                <Badge className="block w-full text-center bg-mint-200 text-black font-bold border-2 border-black/20 py-2">
                  {recipe.category}
                </Badge>
                <Badge className="block w-full text-center bg-lilac-200 text-black font-bold border-2 border-black/20 py-2">
                  {recipe.cuisine}
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .fixed,
          button,
          .sticky {
            display: none !important;
          }
        }
      `}</style>
    </MemphisLayout>
  );
}
