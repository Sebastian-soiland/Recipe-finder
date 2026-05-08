import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { createRecipe, getRecipesByIngredients, getRecipeById, getRecipesByCategory, addFavorite, removeFavorite, getUserFavorites, isFavorite, recordSearch } from "./db";
import { TRPCError } from "@trpc/server";
import { premiumRouter } from "./routers/premium";
import { socialRouter } from "./routers/social";
import { monetizationRouter } from "./routers/monetization";

export const appRouter = router({
  system: systemRouter,
  premium: premiumRouter,
  social: socialRouter,
  monetization: monetizationRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Recipe routers
  recipes: router({
    // Search recipes by ingredients
    search: publicProcedure
      .input(z.object({
        ingredients: z.array(z.string()).min(1),
        cuisine: z.string().optional(),
        difficulty: z.enum(["easy", "medium", "hard"]).optional(),
        maxCookTime: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          // Generate recipes using AI
          const ingredientsList = input.ingredients.join(", ");
          const cuisineHint = input.cuisine ? `Cuisine: ${input.cuisine}. ` : "";
          const difficultyHint = input.difficulty ? `Difficulty: ${input.difficulty}. ` : "";
          const timeHint = input.maxCookTime ? `Maximum cooking time: ${input.maxCookTime} minutes. ` : "";

          const prompt = `You are a creative chef. Generate 5 diverse recipes using these ingredients: ${ingredientsList}. ${cuisineHint}${difficultyHint}${timeHint}Cover different food categories (main course, appetizer, dessert, breakfast, lunch, dinner, snack, beverage, sauce, soup, salad, side dish, bread, pasta, rice, seafood, meat, vegetarian, vegan). For EACH recipe, provide a JSON object with this exact structure:
{
  "title": "Recipe Name",
  "description": "Brief description",
  "cuisine": "Cuisine type",
  "category": "main course|appetizer|dessert|breakfast|lunch|dinner|snack|beverage|sauce|soup|salad|side dish|bread|pasta|rice|seafood|meat|vegetarian|vegan",
  "difficulty": "easy|medium|hard",
  "prepTime": 15,
  "cookTime": 30,
  "servings": 4,
  "ingredients": [{"name": "ingredient", "quantity": 2, "unit": "cups"}],
  "instructions": ["Step 1", "Step 2", "Step 3"]
}

Return ONLY valid JSON objects, one per line, no markdown, no explanations.`;

          const response = await invokeLLM({
            messages: [
              { role: "system", content: "You are a professional chef AI that generates creative recipes. Always respond with valid JSON only." },
              { role: "user", content: prompt },
            ],
          });

          const content = response.choices[0]?.message.content || "";
          const recipes: any[] = [];

          // Parse multiple JSON objects from response
          const contentStr = typeof content === 'string' ? content : '';
          const lines = contentStr.split("\n").filter((line: string) => line.trim());
          for (const line of lines) {
            try {
              const recipe = JSON.parse(line);
              if (recipe.title && recipe.ingredients && recipe.instructions) {
                // Calculate match score based on ingredient overlap
                const recipeIngredients = recipe.ingredients.map((ing: any) => ing.name.toLowerCase());
                const userIngredients = input.ingredients.map(ing => ing.toLowerCase());
                const matches = recipeIngredients.filter((ing: string) => 
                  userIngredients.some(userIng => ing.includes(userIng) || userIng.includes(ing))
                ).length;
                const matchScore = (matches / Math.max(recipeIngredients.length, userIngredients.length)) * 100;

                recipe.matchScore = matchScore.toFixed(2);
                recipes.push(recipe);
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }

          // Record search if user is logged in
          if (ctx.user) {
            await recordSearch(ctx.user.id, input.ingredients, recipes.length);
          }

          return recipes.sort((a, b) => parseFloat(b.matchScore) - parseFloat(a.matchScore));
        } catch (error) {
          console.error("Recipe search error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate recipes",
          });
        }
      }),

    // Get recipe by ID
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return getRecipeById(input);
      }),

    // Get recipes by category
    getByCategory: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        return getRecipesByCategory(input);
      }),

    // Generate preview image for a recipe
    generatePreviewImage: publicProcedure
      .input(z.object({
        title: z.string(),
        description: z.string(),
        ingredients: z.array(z.string()),
      }))
      .mutation(async ({ input }) => {
        try {
          const prompt = `Create an appetizing, vibrant food photography image of "${input.title}". ${input.description}. Key ingredients: ${input.ingredients.join(", ")}. Professional food photography, well-lit, appetizing presentation, colorful and vibrant.`;

          const result = await generateImage({ prompt });
          return { url: result.url };
        } catch (error) {
          console.error("Image generation error:", error);
          // Return a placeholder if generation fails
          return { url: "" };
        }
      }),
  }),

  // Favorites routers
  favorites: router({
    // Add to favorites
    add: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return addFavorite(ctx.user.id, input);
      }),

    // Remove from favorites
    remove: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return removeFavorite(ctx.user.id, input);
      }),

    // Get user's favorites
    list: protectedProcedure
      .query(async ({ ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return getUserFavorites(ctx.user.id);
      }),

    // Check if recipe is favorited
    isFavorited: protectedProcedure
      .input(z.number())
      .query(async ({ input, ctx }) => {
        if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
        return isFavorite(ctx.user.id, input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
