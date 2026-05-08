import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, recipes, favorites, searchHistory, Recipe, InsertRecipe, Favorite, InsertSearchHistory } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Recipe queries
export async function createRecipe(recipe: InsertRecipe): Promise<Recipe | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(recipes).values(recipe);
  const id = (result as any).insertId;
  return db.select().from(recipes).where(eq(recipes.id, id)).then(rows => rows[0] || null);
}

export async function getRecipesByIngredients(limit = 10): Promise<Recipe[]> {
  const db = await getDb();
  if (!db) return [];

  // Get recipes ordered by match score (descending)
  return db.select().from(recipes).orderBy(desc(recipes.matchScore)).limit(limit);
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getRecipesByCategory(category: string, limit = 20): Promise<Recipe[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(recipes).where(eq(recipes.category, category)).limit(limit);
}

// Favorites queries
export async function addFavorite(userId: number, recipeId: number): Promise<Favorite | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(favorites).values({ userId, recipeId });
  const id = (result as any).insertId;
  return db.select().from(favorites).where(eq(favorites.id, id)).then(rows => rows[0] || null);
}

export async function removeFavorite(userId: number, recipeId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.recipeId, recipeId)));
  return true;
}

export async function getUserFavorites(userId: number): Promise<Recipe[]> {
  const db = await getDb();
  if (!db) return [];

  const favoriteRecipes = await db
    .select({ recipe: recipes })
    .from(favorites)
    .innerJoin(recipes, eq(favorites.recipeId, recipes.id))
    .where(eq(favorites.userId, userId));

  return favoriteRecipes.map(f => f.recipe);
}

export async function isFavorite(userId: number, recipeId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.recipeId, recipeId)))
    .limit(1);

  return result.length > 0;
}

// Search history queries
export async function recordSearch(userId: number, ingredients: string[], resultsCount: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(searchHistory).values({
    userId,
    ingredients,
    resultsCount,
  });
}

export async function getUserSearchHistory(userId: number, limit = 10): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(searchHistory).where(eq(searchHistory.userId, userId)).orderBy(desc(searchHistory.createdAt)).limit(limit);
}
