import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  MessageCircle,
  Heart,
  Share2,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import MemphisLayout from "@/components/MemphisLayout";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Community() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"featured" | "followers" | "collections">("featured");

  const topChefs = [
    {
      id: 1,
      name: "Chef Sarah",
      bio: "Home chef & food blogger",
      followers: 2341,
      recipes: 156,
      rating: 4.9,
      avatar: "👩‍🍳",
      isFollowing: false,
    },
    {
      id: 2,
      name: "James Kitchen",
      bio: "Vegan cooking enthusiast",
      followers: 1876,
      recipes: 124,
      rating: 4.8,
      avatar: "👨‍🍳",
      isFollowing: true,
    },
    {
      id: 3,
      name: "Emma's Table",
      bio: "Mediterranean recipes",
      followers: 1654,
      recipes: 98,
      rating: 4.9,
      avatar: "👩",
      isFollowing: false,
    },
  ];

  const featuredRecipes = [
    {
      id: 1,
      title: "Thai Green Curry",
      chef: "Chef Sarah",
      rating: 4.9,
      saves: 342,
      comments: 87,
      image: "🍛",
    },
    {
      id: 2,
      title: "Vegan Buddha Bowl",
      chef: "James Kitchen",
      rating: 4.8,
      saves: 298,
      comments: 64,
      image: "🥗",
    },
    {
      id: 3,
      title: "Pasta Carbonara",
      chef: "Emma's Table",
      rating: 4.9,
      saves: 267,
      comments: 52,
      image: "🍝",
    },
  ];

  return (
    <MemphisLayout showDecorations={true}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-mint-300 rounded-lg">
              <Users className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-5xl font-black text-black drop-shadow-lg">
              COMMUNITY
            </h1>
          </div>

          <p className="text-lg text-black/70 font-bold">
            Connect with food lovers, share recipes, and discover culinary inspiration
          </p>
        </div>

        {/* Top Chefs Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-black mb-6 drop-shadow-sm flex items-center gap-2">
            <Trophy className="w-8 h-8" />
            TOP CHEFS
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {topChefs.map((chef) => (
              <Card
                key={chef.id}
                className="bg-gradient-to-br from-white to-gray-50 border-2 border-black/10 p-6 hover:shadow-xl transition-all"
              >
                {/* Chef Avatar */}
                <div className="text-6xl text-center mb-4">{chef.avatar}</div>

                {/* Chef Info */}
                <h3 className="text-2xl font-black text-black text-center mb-1">
                  {chef.name}
                </h3>
                <p className="text-sm text-black/60 font-bold text-center mb-4">
                  {chef.bio}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-mint-200 rounded-lg p-2 text-center">
                    <p className="text-xs font-bold text-black/60">FOLLOWERS</p>
                    <p className="text-lg font-black text-black">
                      {(chef.followers / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div className="bg-lilac-200 rounded-lg p-2 text-center">
                    <p className="text-xs font-bold text-black/60">RECIPES</p>
                    <p className="text-lg font-black text-black">{chef.recipes}</p>
                  </div>
                  <div className="bg-yellow-200 rounded-lg p-2 text-center">
                    <p className="text-xs font-bold text-black/60">RATING</p>
                    <p className="text-lg font-black text-black">{chef.rating}★</p>
                  </div>
                </div>

                {/* Follow Button */}
                <Button
                  className={`w-full font-black border-2 rounded-lg py-2 flex items-center justify-center gap-2 transition-all ${
                    chef.isFollowing
                      ? "bg-black text-white border-black"
                      : "bg-mint-300 hover:bg-mint-400 text-black border-black/20"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  {chef.isFollowing ? "FOLLOWING" : "FOLLOW"}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {(["featured", "followers", "collections"] as const).map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-black border-2 rounded-lg px-6 py-2 transition-all ${
                activeTab === tab
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black/20 hover:border-black/40"
              }`}
            >
              {tab.toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Featured Recipes */}
        {activeTab === "featured" && (
          <div className="space-y-4 mb-16">
            {featuredRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="bg-gradient-to-r from-white to-gray-50 border-2 border-black/10 p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-6">
                  {/* Recipe Image */}
                  <div className="text-6xl">{recipe.image}</div>

                  {/* Recipe Info */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-black mb-2">
                      {recipe.title}
                    </h3>
                    <p className="text-black/70 font-bold mb-4">by {recipe.chef}</p>

                    {/* Stats */}
                    <div className="flex gap-6 mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-black text-black" />
                        <span className="font-black text-black">{recipe.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-black" />
                        <span className="font-black text-black">{recipe.saves}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-black" />
                        <span className="font-black text-black">{recipe.comments}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button className="bg-black hover:bg-black/80 text-white font-black border-2 border-black/20 rounded-lg px-6 py-2">
                        VIEW
                      </Button>
                      <Button className="bg-mint-300 hover:bg-mint-400 text-black font-black border-2 border-black/20 rounded-lg px-6 py-2 flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        SAVE
                      </Button>
                      <Button className="bg-lilac-200 hover:bg-lilac-300 text-black font-black border-2 border-black/20 rounded-lg px-6 py-2 flex items-center gap-2">
                        <Share2 className="w-4 h-4" />
                        SHARE
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Followers Tab */}
        {activeTab === "followers" && (
          <div className="mb-16">
            <p className="text-black/70 font-bold mb-6">
              {user
                ? "Your followers and following"
                : "Sign in to see your followers"}
            </p>
            {!user && (
              <Card className="bg-yellow-200 border-2 border-black/10 p-8 text-center">
                <p className="text-lg font-bold text-black mb-4">
                  Sign in to connect with the community
                </p>
                <Button className="bg-black hover:bg-black/80 text-white font-black border-2 border-black/20 rounded-lg px-8 py-2">
                  SIGN IN
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* Collections Tab */}
        {activeTab === "collections" && (
          <div className="mb-16">
            <p className="text-black/70 font-bold mb-6">
              {user ? "Your recipe collections" : "Sign in to create collections"}
            </p>
            {user && (
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    name: "Weeknight Dinners",
                    recipes: 24,
                    color: "bg-mint-200",
                  },
                  {
                    name: "Date Night Specials",
                    recipes: 12,
                    color: "bg-lilac-200",
                  },
                  {
                    name: "Healthy Breakfast",
                    recipes: 18,
                    color: "bg-yellow-200",
                  },
                ].map((collection) => (
                  <Card
                    key={collection.name}
                    className={`${collection.color} border-2 border-black/10 p-6 hover:shadow-lg transition-all cursor-pointer`}
                  >
                    <h3 className="text-xl font-black text-black mb-2">
                      {collection.name}
                    </h3>
                    <p className="text-black/70 font-bold">
                      {collection.recipes} recipes
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-mint-300 via-lilac-200 to-yellow-200 rounded-2xl border-2 border-black/20 p-12 text-center">
          <h2 className="text-3xl font-black text-black mb-4 drop-shadow-lg">
            SHARE YOUR CULINARY CREATIONS
          </h2>

          <p className="text-lg text-black/70 font-bold mb-6 max-w-2xl mx-auto">
            Join our community of food lovers. Share your recipes, get feedback, and
            inspire others!
          </p>

          <Button className="bg-black hover:bg-black/80 text-white font-black border-2 border-black/20 rounded-lg px-8 py-3 flex items-center justify-center gap-2 mx-auto">
            <Zap className="w-4 h-4" />
            SHARE RECIPE
          </Button>
        </div>
      </div>
    </MemphisLayout>
  );
}
