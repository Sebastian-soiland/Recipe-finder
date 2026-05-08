import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  ChefHat,
  Search,
  TrendingUp,
  Users,
  Heart,
  LogOut,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [, navigate] = useLocation();
  const { user, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "SEARCH", icon: Search, href: "/search" },
    { label: "TRENDING", icon: TrendingUp, href: "/trending" },
    { label: "COMMUNITY", icon: Users, href: "/community" },
  ];

  return (
    <header className="bg-gradient-to-r from-peach-100 to-mint-100 border-b-4 border-black/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <div className="p-2 bg-mint-300 rounded-lg border-2 border-black/20">
              <ChefHat className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-black text-black drop-shadow-sm">
              RECIPE FINDER
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                onClick={() => navigate(item.href)}
                className="bg-white hover:bg-gray-100 text-black font-black border-2 border-black/20 rounded-lg px-4 py-2 flex items-center gap-2 transition-all"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="animate-pulse">⏳</div>
            ) : user ? (
              <>
                <Button
                  onClick={() => navigate("/favorites")}
                  className="bg-lilac-200 hover:bg-lilac-300 text-black font-black border-2 border-black/20 rounded-lg px-4 py-2 flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  FAVORITES
                </Button>
                <Button
                  onClick={() => logout()}
                  className="bg-yellow-200 hover:bg-yellow-300 text-black font-black border-2 border-black/20 rounded-lg px-4 py-2 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  LOGOUT
                </Button>
              </>
            ) : (
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-mint-300 hover:bg-mint-400 text-black font-black border-2 border-black/20 rounded-lg px-4 py-2 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                LOGIN
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden bg-white hover:bg-gray-100 text-black font-black border-2 border-black/20 rounded-lg p-2"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            {navItems.map((item) => (
              <Button
                key={item.href}
                onClick={() => {
                  navigate(item.href);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-white hover:bg-gray-100 text-black font-black border-2 border-black/20 rounded-lg px-4 py-2 flex items-center gap-2 justify-start transition-all"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}

            {loading ? (
              <div className="animate-pulse">⏳</div>
            ) : user ? (
              <>
                <Button
                  onClick={() => {
                    navigate("/favorites");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-lilac-200 hover:bg-lilac-300 text-black font-black border-2 border-black/20 rounded-lg px-4 py-2 flex items-center gap-2 justify-start"
                >
                  <Heart className="w-4 h-4" />
                  FAVORITES
                </Button>
                <Button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-yellow-200 hover:bg-yellow-300 text-black font-black border-2 border-black/20 rounded-lg px-4 py-2 flex items-center gap-2 justify-start"
                >
                  <LogOut className="w-4 h-4" />
                  LOGOUT
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  window.location.href = getLoginUrl();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-mint-300 hover:bg-mint-400 text-black font-black border-2 border-black/20 rounded-lg px-4 py-2 flex items-center gap-2 justify-start"
              >
                <LogIn className="w-4 h-4" />
                LOGIN
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
