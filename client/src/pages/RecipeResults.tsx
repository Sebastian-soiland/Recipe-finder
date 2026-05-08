import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Users, ChefHat, Filter, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
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

export default function RecipeResults() {
  const [, navigate] = useLocation();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [sortBy, setSortBy] = useState<"match" | "time" | "difficulty">("match");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("");
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  const generateImageMutation = trpc.recipes.generatePreviewImage.useMutation();

  useEffect(() => {
    // Load recipes from session storage
    const stored = sessionStorage.getItem("recipeResults");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecipes(parsed);
        setFilteredRecipes(parsed);

        // Generate preview images for each recipe
        parsed.forEach((recipe: Recipe, index: number) => {
          if (!recipe.previewImageUrl) {
            generatePreviewImage(recipe, index);
          }
        });
      } catch (e) {
        console.error("Failed to load recipes:", e);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const generatePreviewImage = async (recipe: Recipe, index: number) => {
    setLoadingImages(prev => new Set(prev).add(recipe.title));

    try {
      const result = await generateImageMutation.mutateAsync({
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients.map(ing => ing.name),
      });

      if (result.url) {
        setRecipes(prev => {
          const updated = [...prev];
          updated[index] = { ...updated[index], previewImageUrl: result.url };
          return updated;
        });
        setFilteredRecipes(prev => {
          const updated = [...prev];
          const foundIndex = updated.findIndex(r => r.title === recipe.title);
          if (foundIndex >= 0) {
            updated[foundIndex] = { ...updated[foundIndex], previewImageUrl: result.url };
          }
          return updated;
        });
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setLoadingImages(prev => {
        const updated = new Set(prev);
        updated.delete(recipe.title);
        return updated;
      });
    }
  };

  useEffect(() => {
    let filtered = [...recipes];

    // Apply filters
    if (filterCategory) {
      filtered = filtered.filter(r => r.category === filterCategory);
    }
    if (filterDifficulty) {
      filtered = filtered.filter(r => r.difficulty === filterDifficulty);
    }

    // Apply sorting
    if (sortBy === "match") {
      filtered.sort((a, b) => parseFloat(b.matchScore) - parseFloat(a.matchScore));
    } else if (sortBy === "time") {
      filtered.sort((a, b) => (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime));
    } else if (sortBy === "difficulty") {
      const diffOrder = { easy: 0, medium: 1, hard: 2 };
      filtered.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
    }

    setFilteredRecipes(filtered);
  }, [recipes, sortBy, filterCategory, filterDifficulty]);

  const categories = Array.from(new Set(recipes.map(r => r.category)));
  const difficulties = ["easy", "medium", "hard"];

  const handleRecipeClick = (recipe: Recipe) => {
    sessionStorage.setItem("selectedRecipe", JSON.stringify(recipe));
    navigate("/recipe-detail");
  };

  return (
    <MemphisLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-2 border-black/20 hover:bg-mint-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl md:text-5xl font-black text-black drop-shadow-lg">
            YOUR RECIPES
          </h1>
        </div>

        {/* Filters and Sort */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-2 border-black/10 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-black" />
            <h2 className="text-lg font-black text-black">FILTERS & SORT</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-2">SORT BY</label>
              <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                <SelectTrigger className="border-2 border-black/20 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="time">Quickest</SelectItem>
                  <SelectItem value="difficulty">Easiest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">CATEGORY</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="border-2 border-black/20 rounded-lg">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">DIFFICULTY</label>
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="border-2 border-black/20 rounded-lg">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All levels</SelectItem>
                  {difficulties.map(diff => (
                    <SelectItem key={diff} value={diff}>
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  setFilterCategory("");
                  setFilterDifficulty("");
                }}
                className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-bold border-2 border-black/20 rounded-lg"
              >
                RESET
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <p className="text-lg font-bold text-black mb-6">
          Found {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? "s" : ""}
        </p>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe, index) => (
            <Card
              key={recipe.title}
              onClick={() => handleRecipeClick(recipe)}
              className="bg-white/95 backdrop-blur-sm border-2 border-black/10 overflow-hidden hover:shadow-xl transition-all cursor-pointer hover:scale-105 transform"
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-gradient-to-br from-mint-100 to-lilac-100 flex items-center justify-center overflow-hidden">
                {recipe.previewImageUrl ? (
                  <img
                    src={recipe.previewImageUrl}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                ) : Array.from(loadingImages).includes(recipe.title) ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-black" />
                  </div>
                ) : (
                  <ChefHat className="w-12 h-12 text-black/30" />
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Match Score Badge */}
                <div className="mb-3">
                  <Badge className="bg-yellow-200 text-black font-black border-2 border-black/30">
                    {recipe.matchScore}% MATCH
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-black mb-2 line-clamp-2">
                  {recipe.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                  {recipe.description}
                </p>

                {/* Category and Cuisine */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-mint-200 text-black font-semibold text-xs border border-black/20">
                    {recipe.category}
                  </Badge>
                  <Badge className="bg-lilac-200 text-black font-semibold text-xs border border-black/20">
                    {recipe.cuisine}
                  </Badge>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm font-semibold text-gray-700 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.prepTime + recipe.cookTime}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{recipe.servings} servings</span>
                  </div>
                  <Badge
                    className={`${
                      recipe.difficulty === "easy"
                        ? "bg-green-200"
                        : recipe.difficulty === "medium"
                        ? "bg-yellow-200"
                        : "bg-red-200"
                    } text-black font-bold`}
                  >
                    {recipe.difficulty}
                  </Badge>
                </div>

                {/* View Button */}
                <Button className="w-full bg-gradient-to-r from-yellow-300 to-yellow-200 hover:from-yellow-400 hover:to-yellow-300 text-black font-black border-2 border-black/20 rounded-lg">
                  VIEW RECIPE
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-black/10 p-12 text-center">
            <ChefHat className="w-16 h-16 text-black/30 mx-auto mb-4" />
            <p className="text-xl font-bold text-black mb-4">No recipes found</p>
            <p className="text-gray-700 mb-6">Try adjusting your filters or search with different ingredients</p>
            <Button
              onClick={() => navigate("/")}
              className="bg-mint-300 hover:bg-mint-400 text-black font-bold border-2 border-black/20 rounded-lg"
            >
              NEW SEARCH
            </Button>
          </Card>
        )}
      </div>
    </MemphisLayout>
  );
}
