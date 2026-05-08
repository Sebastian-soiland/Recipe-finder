import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

export const premiumRouter = router({
  // Generate meal plans (7-day, 14-day, 30-day)
  generateMealPlan: publicProcedure
    .input(
      z.object({
        days: z.number().min(1).max(30),
        dietary: z.array(z.string()).optional(),
        cuisine: z.string().optional(),
        servings: z.number().default(2),
      })
    )
    .mutation(async ({ input }) => {
      const dietaryText = input.dietary?.length
        ? `Dietary restrictions: ${input.dietary.join(", ")}`
        : "";
      const cuisineText = input.cuisine ? `Preferred cuisine: ${input.cuisine}` : "";

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a professional meal planner. Create a diverse, balanced meal plan with variety and nutrition in mind.
            ${dietaryText}
            ${cuisineText}
            
            Return a JSON object with this structure:
            {
              "days": [
                {
                  "day": 1,
                  "breakfast": "recipe name",
                  "lunch": "recipe name",
                  "dinner": "recipe name",
                  "snack": "recipe name"
                }
              ],
              "shoppingList": ["ingredient1", "ingredient2", ...],
              "tips": ["tip1", "tip2", ...]
            }`,
          },
          {
            role: "user",
            content: `Create a ${input.days}-day meal plan for ${input.servings} servings. Make it exciting and diverse!`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "meal_plan",
            strict: true,
            schema: {
              type: "object",
              properties: {
                days: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      day: { type: "number" },
                      breakfast: { type: "string" },
                      lunch: { type: "string" },
                      dinner: { type: "string" },
                      snack: { type: "string" },
                    },
                    required: ["day", "breakfast", "lunch", "dinner", "snack"],
                  },
                },
                shoppingList: { type: "array", items: { type: "string" } },
                tips: { type: "array", items: { type: "string" } },
              },
              required: ["days", "shoppingList", "tips"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0].message.content;
      const jsonContent = typeof content === "string" ? content : "{}";
      return JSON.parse(jsonContent);
    }),

  // Get nutritional information for recipes
  getNutritionInfo: publicProcedure
    .input(
      z.object({
        recipeName: z.string(),
        ingredients: z.array(z.string()),
        servings: z.number().default(1),
      })
    )
    .query(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a nutrition expert. Analyze recipes and provide accurate nutritional information.
            Return a JSON object with nutritional data per serving.`,
          },
          {
            role: "user",
            content: `Calculate nutritional information for "${input.recipeName}" with ingredients: ${input.ingredients.join(", ")}. For ${input.servings} serving(s).
            
            Return JSON with: calories, protein (g), carbs (g), fat (g), fiber (g), sodium (mg), and key nutrients.`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "nutrition_info",
            strict: true,
            schema: {
              type: "object",
              properties: {
                calories: { type: "number" },
                protein: { type: "number" },
                carbs: { type: "number" },
                fat: { type: "number" },
                fiber: { type: "number" },
                sodium: { type: "number" },
                keyNutrients: { type: "array", items: { type: "string" } },
              },
              required: [
                "calories",
                "protein",
                "carbs",
                "fat",
                "fiber",
                "sodium",
              ],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0].message.content;
      const jsonContent = typeof content === "string" ? content : "{}";
      return JSON.parse(jsonContent);
    }),

  // Filter recipes by dietary restrictions
  filterByDietary: publicProcedure
    .input(
      z.object({
        recipes: z.array(z.any()),
        dietary: z.array(
          z.enum([
            "vegan",
            "vegetarian",
            "gluten-free",
            "dairy-free",
            "nut-free",
            "keto",
            "paleo",
            "low-carb",
          ])
        ),
      })
    )
    .query(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a dietary expert. Filter recipes based on dietary restrictions.
            Return a JSON array of recipe IDs that match the dietary requirements.`,
          },
          {
            role: "user",
            content: `Filter these recipes for: ${input.dietary.join(", ")}
            Recipes: ${JSON.stringify(input.recipes)}
            
            Return JSON array of matching recipe indices.`,
          },
        ],
      });

      const content = response.choices[0].message.content;
      const jsonContent = typeof content === "string" ? content : "[]";
      const indices = JSON.parse(jsonContent);
      return input.recipes.filter((_, i) => indices.includes(i));
    }),

  // Generate shopping list from recipes
  generateShoppingList: publicProcedure
    .input(
      z.object({
        recipes: z.array(
          z.object({
            ingredients: z.array(
              z.object({
                name: z.string(),
                quantity: z.number(),
                unit: z.string(),
              })
            ),
          })
        ),
      })
    )
    .query(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a shopping list organizer. Consolidate ingredients and organize by grocery store sections.
            Return a JSON object with organized shopping list.`,
          },
          {
            role: "user",
            content: `Create a consolidated shopping list from these recipes: ${JSON.stringify(input.recipes)}
            
            Organize by sections: Produce, Dairy, Meat, Pantry, Frozen, Beverages, etc.
            Combine duplicate ingredients and sum quantities.`,
          },
        ],
      });

      const content = response.choices[0].message.content;
      const jsonContent = typeof content === "string" ? content : "{}";
      return JSON.parse(jsonContent);
    }),

  // Get recipe recommendations based on user preferences
  getRecommendations: protectedProcedure
    .input(
      z.object({
        favoriteRecipes: z.array(z.string()).optional(),
        dietary: z.array(z.string()).optional(),
        cuisine: z.string().optional(),
        limit: z.number().default(5),
      })
    )
    .query(async ({ input, ctx }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a recipe recommendation engine. Based on user preferences, suggest similar recipes.
            Consider dietary restrictions, cuisine preferences, and favorite recipes.`,
          },
          {
            role: "user",
            content: `User ${ctx.user.id} likes: ${input.favoriteRecipes?.join(", ") || "various recipes"}
            Dietary: ${input.dietary?.join(", ") || "none"}
            Cuisine: ${input.cuisine || "any"}
            
            Recommend ${input.limit} recipes they would love. Return JSON array with recipe suggestions.`,
          },
        ],
      });

      const content = response.choices[0].message.content;
      const jsonContent = typeof content === "string" ? content : "[]";
      return JSON.parse(jsonContent);
    }),

  // Calculate recipe cost estimate
  calculateRecipeCost: publicProcedure
    .input(
      z.object({
        recipeName: z.string(),
        ingredients: z.array(z.string()),
        servings: z.number().default(1),
      })
    )
    .query(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a culinary cost analyst. Estimate recipe costs based on average market prices.
            Return JSON with total cost and cost per serving.`,
          },
          {
            role: "user",
            content: `Estimate the cost of "${input.recipeName}" with ingredients: ${input.ingredients.join(", ")}
            For ${input.servings} serving(s).
            
            Return JSON with: totalCost, costPerServing, ingredients with individual costs.`,
          },
        ],
      });

      const content = response.choices[0].message.content;
      const jsonContent = typeof content === "string" ? content : "{}";
      return JSON.parse(jsonContent);
    }),
});
