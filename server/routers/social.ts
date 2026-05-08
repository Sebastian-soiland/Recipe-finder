import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

export const socialRouter = router({
  // Rate a recipe
  rateRecipe: protectedProcedure
    .input(
      z.object({
        recipeId: z.number(),
        rating: z.number().min(1).max(5),
        review: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      // In a real app, save to database
      return {
        success: true,
        message: "Rating saved!",
        rating: input.rating,
        review: input.review,
      };
    }),

  // Get recipe ratings
  getRecipeRatings: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      // In a real app, fetch from database
      return {
        recipeId: input,
        averageRating: 4.5,
        totalRatings: 127,
        ratings: [
          { rating: 5, count: 85 },
          { rating: 4, count: 30 },
          { rating: 3, count: 10 },
          { rating: 2, count: 2 },
          { rating: 1, count: 0 },
        ],
      };
    }),

  // Get trending recipes
  getTrendingRecipes: publicProcedure.query(async () => {
    // In a real app, fetch from database with trending logic
    return [
      {
        id: 1,
        title: "Spicy Thai Green Curry",
        trendingScore: 98,
        views: 5420,
        saves: 342,
        shares: 156,
      },
      {
        id: 2,
        title: "Mediterranean Quinoa Bowl",
        trendingScore: 95,
        views: 4890,
        saves: 298,
        shares: 142,
      },
      {
        id: 3,
        title: "Homemade Pasta Carbonara",
        trendingScore: 92,
        views: 4560,
        saves: 267,
        shares: 128,
      },
      {
        id: 4,
        title: "Vegan Buddha Bowl",
        trendingScore: 88,
        views: 4120,
        saves: 245,
        shares: 115,
      },
      {
        id: 5,
        title: "Korean Beef Bibimbap",
        trendingScore: 85,
        views: 3890,
        saves: 223,
        shares: 102,
      },
    ];
  }),

  // Share recipe
  shareRecipe: protectedProcedure
    .input(
      z.object({
        recipeId: z.number(),
        platform: z.enum(["twitter", "facebook", "whatsapp", "email"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=Check out this amazing recipe on Recipe Finder!`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=recipefinder.com/recipe/${input.recipeId}`,
        whatsapp: `https://wa.me/?text=Check out this recipe on Recipe Finder!`,
        email: `mailto:?subject=Check out this recipe&body=I found an amazing recipe on Recipe Finder!`,
      };

      return {
        success: true,
        shareUrl: shareUrls[input.platform],
        message: `Recipe shared on ${input.platform}!`,
      };
    }),

  // Get user's public profile
  getUserProfile: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      // In a real app, fetch from database
      return {
        userId: input,
        name: "John Doe",
        bio: "Food lover and home chef",
        recipesCreated: 42,
        followers: 156,
        following: 89,
        favoriteRecipes: 234,
        averageRating: 4.7,
      };
    }),

  // Follow/Unfollow user
  toggleFollow: protectedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      // In a real app, update database
      return {
        success: true,
        isFollowing: true,
        message: "User followed!",
      };
    }),

  // Get user's followers
  getFollowers: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      // In a real app, fetch from database
      return {
        userId: input,
        followers: [
          { id: 1, name: "Sarah M.", avatar: "🧑" },
          { id: 2, name: "James K.", avatar: "👨" },
          { id: 3, name: "Emma L.", avatar: "👩" },
        ],
        totalFollowers: 156,
      };
    }),

  // Get trending hashtags
  getTrendingHashtags: publicProcedure.query(async () => {
    return [
      { tag: "#EasyRecipes", count: 12400, trend: "up" },
      { tag: "#VeganFood", count: 9870, trend: "up" },
      { tag: "#HealthyEating", count: 8650, trend: "stable" },
      { tag: "#QuickDinner", count: 7320, trend: "up" },
      { tag: "#FoodPhotography", count: 6890, trend: "down" },
    ];
  }),

  // Create recipe collection
  createCollection: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        isPublic: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      return {
        success: true,
        collectionId: Math.random(),
        name: input.name,
        description: input.description,
        isPublic: input.isPublic,
        createdAt: new Date(),
      };
    }),

  // Add recipe to collection
  addToCollection: protectedProcedure
    .input(
      z.object({
        collectionId: z.number(),
        recipeId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      return {
        success: true,
        message: "Recipe added to collection!",
      };
    }),

  // Get user's collections
  getUserCollections: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

    return [
      {
        id: 1,
        name: "Weeknight Dinners",
        description: "Quick recipes for busy weeknights",
        recipeCount: 24,
        isPublic: true,
      },
      {
        id: 2,
        name: "Date Night Specials",
        description: "Impressive recipes for special occasions",
        recipeCount: 12,
        isPublic: false,
      },
      {
        id: 3,
        name: "Healthy Breakfast Ideas",
        description: "Nutritious breakfast options",
        recipeCount: 18,
        isPublic: true,
      },
    ];
  }),

  // Report recipe
  reportRecipe: publicProcedure
    .input(
      z.object({
        recipeId: z.number(),
        reason: z.enum(["inappropriate", "spam", "incorrect", "other"]),
        details: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // In a real app, save report to database
      return {
        success: true,
        message: "Thank you for your report. We'll review it shortly.",
      };
    }),

  // Get recipe comments
  getRecipeComments: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      // In a real app, fetch from database
      return {
        recipeId: input,
        comments: [
          {
            id: 1,
            userId: 1,
            userName: "Sarah M.",
            text: "This was amazing! Made it for dinner last night.",
            rating: 5,
            timestamp: new Date(Date.now() - 86400000),
            likes: 24,
          },
          {
            id: 2,
            userId: 2,
            userName: "James K.",
            text: "Great recipe! Added some extra spice to it.",
            rating: 5,
            timestamp: new Date(Date.now() - 172800000),
            likes: 18,
          },
        ],
        totalComments: 127,
      };
    }),

  // Add comment to recipe
  addComment: protectedProcedure
    .input(
      z.object({
        recipeId: z.number(),
        text: z.string(),
        rating: z.number().min(1).max(5).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      return {
        success: true,
        commentId: Math.random(),
        message: "Comment posted!",
      };
    }),
});
