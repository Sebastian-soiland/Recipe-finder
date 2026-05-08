import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Search, ChefHat } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import MemphisLayout from "@/components/MemphisLayout";
import { MealPlanCard, NutritionCard, DietaryFiltersCard, ShoppingListCard } from "@/components/PremiumFeatures";

const COMMON_INGREDIENTS = [
  "Chicken", "Beef", "Pork", "Fish", "Salmon", "Shrimp", "Crab", "Lobster",
  "Eggs", "Milk", "Cheese", "Butter", "Yogurt", "Cream",
  "Tomato", "Onion", "Garlic", "Bell Pepper", "Broccoli", "Spinach", "Carrot", "Potato",
  "Rice", "Pasta", "Bread", "Flour", "Oats",
  "Olive Oil", "Soy Sauce", "Vinegar", "Honey", "Salt", "Pepper",
  "Basil", "Oregano", "Thyme", "Cumin", "Paprika", "Cinnamon",
  "Lemon", "Lime", "Apple", "Banana", "Strawberry", "Blueberry",
  "Beans", "Lentils", "Chickpeas", "Tofu", "Tempeh",
  "Mushroom", "Zucchini", "Cucumber", "Lettuce", "Avocado",
  "Coconut Milk", "Peanut Butter", "Almonds", "Walnuts",
];

export default function IngredientInput() {
  const [searchMode, setSearchMode] = useState<"have" | "want">("have");
  const [haveIngredients, setHaveIngredients] = useState<string[]>([]);
  const [wantIngredients, setWantIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [cuisine, setCuisine] = useState<string>("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "">("")
  const [maxCookTime, setMaxCookTime] = useState<string>("");
  const [, navigate] = useLocation();

  const searchMutation = trpc.recipes.search.useMutation({
    onSuccess: (data) => {
      // Store results in session storage and navigate
      sessionStorage.setItem("recipeResults", JSON.stringify(data));
      sessionStorage.setItem("searchMode", searchMode);
      sessionStorage.setItem("haveIngredients", JSON.stringify(haveIngredients));
      sessionStorage.setItem("wantIngredients", JSON.stringify(wantIngredients));
      navigate("/results");
    },
  });

  const currentIngredients = searchMode === "have" ? haveIngredients : wantIngredients;
  const setCurrentIngredients = searchMode === "have" ? setHaveIngredients : setWantIngredients;

  const handleAddIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim();
    if (trimmed && !currentIngredients.includes(trimmed)) {
      setCurrentIngredients([...currentIngredients, trimmed]);
      setInputValue("");
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setCurrentIngredients(currentIngredients.filter(i => i !== ingredient));
  };

  const handleSearch = () => {
    const searchIngredients = searchMode === "have" ? haveIngredients : wantIngredients;
    if (searchIngredients.length === 0) return;

    // Store search mode for results page
    sessionStorage.setItem("searchMode", searchMode);

    searchMutation.mutate({
      ingredients: searchIngredients,
      cuisine: cuisine || undefined,
      difficulty: difficulty as "easy" | "medium" | "hard" | undefined,
      maxCookTime: maxCookTime ? parseInt(maxCookTime) : undefined,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient(inputValue);
    }
  };

  const filteredSuggestions = COMMON_INGREDIENTS.filter(
    ing => ing.toLowerCase().includes(inputValue.toLowerCase()) && !currentIngredients.includes(ing)
  ).slice(0, 5);

  return (
    <MemphisLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="w-12 h-12 text-black drop-shadow-lg" />
            <h1 className="text-5xl md:text-6xl font-black text-black drop-shadow-lg tracking-tight">
              RECIPE FINDER
            </h1>
          </div>
          <p className="text-lg text-gray-700 font-medium">
            Tell us what ingredients you have, and we'll find the perfect recipes for you
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-black/10 p-8">
          {/* Search Mode Selector */}
          <div className="mb-8 pb-8 border-b-2 border-black/10">
            <label className="block text-lg font-black text-black mb-4 drop-shadow-sm">
              SEARCH MODE
            </label>
            <div className="flex gap-4">
              <Button
                onClick={() => setSearchMode("have")}
                className={`flex-1 font-black border-2 border-black/20 rounded-lg py-3 ${
                  searchMode === "have"
                    ? "bg-mint-300 hover:bg-mint-400 text-black"
                    : "bg-white hover:bg-gray-100 text-black"
                }`}
              >
                🍽️ I HAVE THESE
              </Button>
              <Button
                onClick={() => setSearchMode("want")}
                className={`flex-1 font-black border-2 border-black/20 rounded-lg py-3 ${
                  searchMode === "want"
                    ? "bg-lilac-200 hover:bg-lilac-300 text-black"
                    : "bg-white hover:bg-gray-100 text-black"
                }`}
              >
                🔍 I WANT TO FIND
              </Button>
            </div>
            <p className="text-sm text-gray-700 mt-3 font-semibold">
              {searchMode === "have"
                ? "Find recipes using ingredients you already have"
                : "Find recipes that contain specific ingredients you're looking for"}
            </p>
          </div>

        {/* Ingredient Input Section */}
          <div className="mb-8">
            <label className="block text-xl font-black text-black mb-4 drop-shadow-sm">
              {searchMode === "have" ? "ADD INGREDIENTS YOU HAVE" : "ADD INGREDIENTS YOU WANT"}
            </label>
            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                placeholder="Type an ingredient..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border-2 border-black/20 focus:border-black/40 rounded-lg text-base"
              />
              <Button
                onClick={() => handleAddIngredient(inputValue)}
                className="bg-mint-300 hover:bg-mint-400 text-black font-bold border-2 border-black/20 rounded-lg"
              >
                Add
              </Button>
            </div>

            {/* Suggestions */}
            {filteredSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filteredSuggestions.map(suggestion => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddIngredient(suggestion)}
                    className="border-2 border-black/20 hover:bg-yellow-100 text-black font-semibold"
                  >
                    + {suggestion}
                  </Button>
                ))}
              </div>
            )}

            {/* Selected Ingredients */}
            {currentIngredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentIngredients.map(ingredient => (
                  <Badge
                    key={ingredient}
                    className="bg-lilac-200 text-black font-bold border-2 border-black/30 px-3 py-2 text-base flex items-center gap-2 rounded-full"
                  >
                    {ingredient}
                    <X
                      className="w-4 h-4 cursor-pointer hover:opacity-70"
                      onClick={() => handleRemoveIngredient(ingredient)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 pb-8 border-b-2 border-black/10">
            <div>
              <label className="block text-sm font-black text-black mb-2 drop-shadow-sm">
                CUISINE (OPTIONAL)
              </label>
              <Select value={cuisine} onValueChange={setCuisine}>
                <SelectTrigger className="border-2 border-black/20 focus:border-black/40 rounded-lg">
                  <SelectValue placeholder="Any cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any cuisine</SelectItem>
                  <SelectItem value="Italian">Italian</SelectItem>
                  <SelectItem value="Asian">Asian</SelectItem>
                  <SelectItem value="Mexican">Mexican</SelectItem>
                  <SelectItem value="Indian">Indian</SelectItem>
                  <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                  <SelectItem value="American">American</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="Thai">Thai</SelectItem>
                  <SelectItem value="Japanese">Japanese</SelectItem>
                  <SelectItem value="Middle Eastern">Middle Eastern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-black text-black mb-2 drop-shadow-sm">
                DIFFICULTY
              </label>
              <Select value={difficulty} onValueChange={(val: any) => setDifficulty(val)}>
                <SelectTrigger className="border-2 border-black/20 focus:border-black/40 rounded-lg">
                  <SelectValue placeholder="Any level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any level</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-black text-black mb-2 drop-shadow-sm">
                MAX COOK TIME (MIN)
              </label>
              <Input
                type="number"
                placeholder="e.g., 30"
                value={maxCookTime}
                onChange={(e) => setMaxCookTime(e.target.value)}
                className="border-2 border-black/20 focus:border-black/40 rounded-lg"
              />
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={currentIngredients.length === 0 || searchMutation.isPending}
            className="w-full bg-gradient-to-r from-yellow-300 to-yellow-200 hover:from-yellow-400 hover:to-yellow-300 text-black font-black text-lg py-6 border-3 border-black/30 rounded-lg shadow-lg transition-all disabled:opacity-50"
          >
            {searchMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                SEARCHING...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                FIND RECIPES
              </>
            )}
          </Button>

          {searchMutation.isError && (
            <div className="mt-4 p-4 bg-red-100 border-2 border-red-300 rounded-lg text-red-700 font-semibold">
              Failed to search recipes. Please try again.
            </div>
          )}
        </Card>

        {/* Premium Features Section */}
        <div className="mt-16 mb-12">
          <h2 className="text-3xl font-black text-black text-center mb-8 drop-shadow-sm">PREMIUM FEATURES</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <MealPlanCard />
            <NutritionCard />
            <DietaryFiltersCard />
            <ShoppingListCard />
          </div>
        </div>
      </div>
    </MemphisLayout>
  );
}