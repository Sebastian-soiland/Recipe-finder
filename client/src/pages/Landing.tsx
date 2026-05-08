import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChefHat,
  Sparkles,
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  Star,
  Check,
  Flame,
  Heart,
  Share2,
} from "lucide-react";
import { useLocation } from "wouter";
import MemphisLayout from "@/components/MemphisLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Landing() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const features = [
    {
      icon: "🔍",
      title: "Smart Ingredient Matching",
      description: "Tell us what you have or what you want. AI finds perfect recipes instantly.",
    },
    {
      icon: "🤖",
      title: "AI-Powered Generation",
      description: "Personalized recipes created just for you with detailed instructions.",
    },
    {
      icon: "📸",
      title: "AI Food Photography",
      description: "Beautiful, appetizing preview images for every recipe.",
    },
    {
      icon: "🌍",
      title: "All Cuisines & Categories",
      description: "From appetizers to desserts, breakfast to dinner—everything covered.",
    },
    {
      icon: "⭐",
      title: "Community Ratings",
      description: "See what other food lovers think. Share your own reviews.",
    },
    {
      icon: "🔥",
      title: "Trending Recipes",
      description: "Discover what's hot right now in the Recipe Finder community.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Home Chef",
      text: "Recipe Finder saved my dinner night! I had random ingredients and got the perfect meal in seconds.",
      rating: 5,
    },
    {
      name: "James K.",
      role: "Busy Professional",
      text: "The AI suggestions are incredible. I've discovered recipes I never would have thought of.",
      rating: 5,
    },
    {
      name: "Emma L.",
      role: "Food Blogger",
      text: "The community features make it so fun to share and discover new recipes with others.",
      rating: 5,
    },
  ];

  return (
    <MemphisLayout showDecorations={true} showHeader={false}>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-20 pt-8 pb-12">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <Badge className="bg-mint-300 text-black font-black border-2 border-black/20 px-4 py-2 text-sm">
                🍳 AI-POWERED RECIPE DISCOVERY
              </Badge>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-black mb-6 drop-shadow-lg leading-tight">
              RECIPE FINDER
            </h1>

            <p className="text-xl md:text-2xl text-black/70 font-bold mb-8 max-w-3xl mx-auto">
              Tell us what ingredients you have or what you want to find. Our AI generates
              personalized recipes instantly. No more "what's for dinner?" moments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={() => navigate("/search")}
                className="bg-mint-300 hover:bg-mint-400 text-black font-black border-2 border-black/20 rounded-lg px-8 py-4 text-lg flex items-center justify-center gap-2 transform hover:scale-105 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                START DISCOVERING
                <ArrowRight className="w-5 h-5" />
              </Button>

              {!user && (
                <Button
                  onClick={() => (window.location.href = getLoginUrl())}
                  className="bg-lilac-200 hover:bg-lilac-300 text-black font-black border-2 border-black/20 rounded-lg px-8 py-4 text-lg flex items-center justify-center gap-2 transform hover:scale-105 transition-all"
                >
                  SIGN IN
                </Button>
              )}
            </div>
          </div>

          {/* Hero Image */}
          <div className="mb-12 rounded-2xl overflow-hidden border-4 border-black/20 shadow-2xl">
            <img
              src="/manus-storage/hero-main.png"
              alt="Recipe Finder Hero"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-5xl font-black text-black text-center mb-12 drop-shadow-lg">
            WHY RECIPE FINDER?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 border-2 border-black/10 p-6 hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-black text-black mb-3">{feature.title}</h3>
                <p className="text-black/70 font-bold">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="mb-20">
          <h2 className="text-5xl font-black text-black text-center mb-12 drop-shadow-lg">
            EXPLORE EVERYTHING
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Trending */}
            <Card className="bg-gradient-to-br from-yellow-200 to-orange-100 border-2 border-black/10 p-8 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
              onClick={() => navigate("/trending")}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-yellow-300 rounded-lg">
                  <Flame className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-3xl font-black text-black">TRENDING RECIPES</h3>
              </div>
              <p className="text-black/70 font-bold mb-4">
                Discover what's hot right now. See trending recipes, popular hashtags, and
                community favorites.
              </p>
              <div className="flex items-center gap-2 text-black font-black">
                View Trending <ArrowRight className="w-4 h-4" />
              </div>
            </Card>

            {/* Community */}
            <Card className="bg-gradient-to-br from-mint-200 to-cyan-100 border-2 border-black/10 p-8 hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
              onClick={() => navigate("/community")}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-mint-300 rounded-lg">
                  <Users className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-3xl font-black text-black">COMMUNITY</h3>
              </div>
              <p className="text-black/70 font-bold mb-4">
                Connect with food lovers worldwide. Follow top chefs, share recipes, and
                build collections.
              </p>
              <div className="flex items-center gap-2 text-black font-black">
                Join Community <ArrowRight className="w-4 h-4" />
              </div>
            </Card>
          </div>
        </div>

        {/* Premium Features */}
        <div className="mb-20">
          <h2 className="text-5xl font-black text-black text-center mb-12 drop-shadow-lg">
            PREMIUM FEATURES
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-lilac-200 to-purple-100 border-2 border-black/10 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-black" />
                <h3 className="text-2xl font-black text-black">AI Meal Planning</h3>
              </div>
              <p className="text-black/70 font-bold mb-4">
                Get personalized meal plans for the week based on your preferences and dietary needs.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-black font-bold">
                  <Check className="w-4 h-4" /> Weekly meal plans
                </div>
                <div className="flex items-center gap-2 text-black font-bold">
                  <Check className="w-4 h-4" /> Shopping lists
                </div>
                <div className="flex items-center gap-2 text-black font-bold">
                  <Check className="w-4 h-4" /> Nutrition tracking
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-peach-200 to-orange-100 border-2 border-black/10 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-black" />
                <h3 className="text-2xl font-black text-black">Dietary Filters</h3>
              </div>
              <p className="text-black/70 font-bold mb-4">
                Find recipes matching your dietary preferences and restrictions instantly.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-black font-bold">
                  <Check className="w-4 h-4" /> Vegan & vegetarian
                </div>
                <div className="flex items-center gap-2 text-black font-bold">
                  <Check className="w-4 h-4" /> Gluten-free & keto
                </div>
                <div className="flex items-center gap-2 text-black font-bold">
                  <Check className="w-4 h-4" /> Allergy-friendly
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-200 to-lime-100 border-2 border-black/10 p-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-black" />
                <h3 className="text-2xl font-black text-black">Nutrition Info</h3>
              </div>
              <p className="text-black/70 font-bold mb-4">
                Track calories, macros, and nutritional information for every recipe.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-black font-bold">
                  <Check className="w-4 h-4" /> Calorie counts
                </div>
                <div className="flex items-center gap-2 text-black font-bold">
                  <Check className="w-4 h-4" /> Macro breakdown
                </div>
                <div className="flex items-center gap-2 text-black font-bold">
                  <Check className="w-4 h-4" /> Health insights
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-mint-300 to-teal-100 border-2 border-black/10 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="w-6 h-6 text-black" />
                <h3 className="text-2xl font-black text-black">Save & Share</h3>
              </div>
              <p className="text-black/70 font-bold mb-4">
                Build your recipe collection and share with friends and family.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-black font-bold">
                  <Check className="w-4 h-4" /> Save favorites
                </div>
                <div className="flex items-center gap-2 text-black font-bold">
                  <Check className="w-4 h-4" /> Create collections
                </div>
                <div className="flex items-center gap-2 text-black font-bold">
                  <Check className="w-4 h-4" /> Share with friends
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-5xl font-black text-black text-center mb-12 drop-shadow-lg">
            LOVED BY FOOD LOVERS
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 border-2 border-black/10 p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-black/70 font-bold mb-4 italic">"{testimonial.text}"</p>

                <div>
                  <p className="font-black text-black">{testimonial.name}</p>
                  <p className="text-sm text-black/60 font-bold">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-mint-300 via-lilac-200 to-yellow-200 rounded-2xl border-4 border-black/20 p-16 text-center mb-12">
          <h2 className="text-5xl font-black text-black mb-6 drop-shadow-lg">
            READY TO DISCOVER YOUR NEXT FAVORITE RECIPE?
          </h2>

          <p className="text-xl text-black/70 font-bold mb-8 max-w-2xl mx-auto">
            Join thousands of food lovers discovering amazing recipes powered by AI.
          </p>

          <Button
            onClick={() => navigate("/search")}
            className="bg-black hover:bg-black/80 text-white font-black border-2 border-black/20 rounded-lg px-12 py-4 text-lg flex items-center justify-center gap-2 transform hover:scale-105 transition-all mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            START NOW
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Footer */}
        <footer className="border-t-2 border-black/10 pt-12 pb-8 text-center">
          <p className="text-black/60 font-bold mb-4">
            © 2026 Recipe Finder. All rights reserved. Made with ❤️ for food lovers everywhere.
          </p>
          <p className="text-black/50 font-bold text-sm">
            Contact: Sebastian.soiland@gmail.com
          </p>
        </footer>
      </div>
    </MemphisLayout>
  );
}
