import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Star,
  Flame,
} from "lucide-react";
import MemphisLayout from "@/components/MemphisLayout";
import { trpc } from "@/lib/trpc";

export default function Trending() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"day" | "week" | "month">("week");
  
  // Fetch trending recipes
  const { data: trendingRecipes, isLoading } = trpc.social.getTrendingRecipes.useQuery();

  return (
    <MemphisLayout showDecorations={true}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-300 rounded-lg">
              <Flame className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-5xl font-black text-black drop-shadow-lg">
              TRENDING NOW
            </h1>
          </div>

          <p className="text-lg text-black/70 font-bold mb-6">
            Discover the hottest recipes everyone's cooking right now
          </p>

          {/* Timeframe Selector */}
          <div className="flex gap-3">
            {(["day", "week", "month"] as const).map((timeframe) => (
              <Button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`font-black border-2 rounded-lg px-6 py-2 transition-all ${
                  selectedTimeframe === timeframe
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-black/20 hover:border-black/40"
                }`}
              >
                {timeframe.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Trending Recipes Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="font-bold text-black/70 mt-4">Loading trending recipes...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trendingRecipes?.map((recipe, index) => (
              <Card
                key={recipe.id}
                className="bg-gradient-to-r from-white to-gray-50 border-2 border-black/10 p-6 hover:shadow-xl transition-all"
              >
                {/* Rank Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center font-black text-lg border-2 border-black/20 ${
                        index === 0
                          ? "bg-yellow-300 text-black"
                          : index === 1
                          ? "bg-gray-300 text-black"
                          : index === 2
                          ? "bg-orange-200 text-black"
                          : "bg-mint-200 text-black"
                      }`}
                    >
                      #{index + 1}
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-black">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-bold text-green-600">
                          Trending {index === 0 ? "🔥" : "↑"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Badge className="bg-yellow-300 text-black font-black">
                    {recipe.trendingScore}% TRENDING
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-mint-200 rounded-lg p-3 text-center border-2 border-black/10">
                    <Eye className="w-4 h-4 text-black mx-auto mb-1" />
                    <p className="text-xs font-bold text-black/60">VIEWS</p>
                    <p className="text-lg font-black text-black">
                      {(recipe.views / 1000).toFixed(1)}K
                    </p>
                  </div>

                  <div className="bg-lilac-200 rounded-lg p-3 text-center border-2 border-black/10">
                    <Heart className="w-4 h-4 text-black mx-auto mb-1" />
                    <p className="text-xs font-bold text-black/60">SAVES</p>
                    <p className="text-lg font-black text-black">
                      {recipe.saves}
                    </p>
                  </div>

                  <div className="bg-yellow-200 rounded-lg p-3 text-center border-2 border-black/10">
                    <Share2 className="w-4 h-4 text-black mx-auto mb-1" />
                    <p className="text-xs font-bold text-black/60">SHARES</p>
                    <p className="text-lg font-black text-black">
                      {recipe.shares}
                    </p>
                  </div>

                  <div className="bg-peach-200 rounded-lg p-3 text-center border-2 border-black/10">
                    <Star className="w-4 h-4 text-black mx-auto mb-1" />
                    <p className="text-xs font-bold text-black/60">RATING</p>
                    <p className="text-lg font-black text-black">4.8★</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-black hover:bg-black/80 text-white font-black border-2 border-black/20 rounded-lg py-2 flex items-center justify-center gap-2">
                    VIEW RECIPE
                  </Button>

                  <Button className="flex-1 bg-mint-300 hover:bg-mint-400 text-black font-black border-2 border-black/20 rounded-lg py-2 flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" />
                    SAVE
                  </Button>

                  <Button className="flex-1 bg-lilac-200 hover:bg-lilac-300 text-black font-black border-2 border-black/20 rounded-lg py-2 flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    SHARE
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Trending Hashtags Section */}
        <div className="mt-20 mb-12">
          <h2 className="text-3xl font-black text-black mb-6 drop-shadow-sm">
            TRENDING HASHTAGS
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { tag: "#EasyRecipes", count: "12.4K" },
              { tag: "#VeganFood", count: "9.8K" },
              { tag: "#HealthyEating", count: "8.6K" },
              { tag: "#QuickDinner", count: "7.3K" },
              { tag: "#FoodPhotography", count: "6.8K" },
            ].map((item) => (
              <Card
                key={item.tag}
                className="bg-gradient-to-br from-mint-200 to-lilac-200 border-2 border-black/10 p-4 text-center hover:shadow-lg transition-all cursor-pointer"
              >
                <p className="font-black text-black text-lg">{item.tag}</p>
                <p className="text-sm text-black/60 font-bold">{item.count} posts</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Spotlight */}
        <div className="bg-gradient-to-r from-yellow-200 via-mint-200 to-lilac-200 rounded-2xl border-2 border-black/20 p-12 text-center mb-12">
          <h2 className="text-3xl font-black text-black mb-4 drop-shadow-lg">
            COMMUNITY SPOTLIGHT
          </h2>

          <p className="text-lg text-black/70 font-bold mb-6 max-w-2xl mx-auto">
            Join thousands of food lovers sharing their culinary creations. Your recipe
            could be featured next!
          </p>

          <Button className="bg-black hover:bg-black/80 text-white font-black border-2 border-black/20 rounded-lg px-8 py-3 flex items-center justify-center gap-2 mx-auto">
            <MessageCircle className="w-4 h-4" />
            SHARE YOUR RECIPE
          </Button>
        </div>
      </div>
    </MemphisLayout>
  );
}
