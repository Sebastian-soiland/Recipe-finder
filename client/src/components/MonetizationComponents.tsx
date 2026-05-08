import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/**
 * Monetization UI Components
 * - Premium subscription display
 * - Affiliate links
 * - Sponsored recipes
 * - Ad slots
 */

// ===== PREMIUM SUBSCRIPTION BANNER =====
export function PremiumBanner() {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg mb-6">
      <h3 className="text-2xl font-bold mb-2">✨ Go Premium</h3>
      <p className="mb-4">Unlock unlimited recipes, meal planning, and ad-free browsing!</p>
      <Button className="bg-white text-purple-600 hover:bg-gray-100">
        Upgrade Now - $4.99/month
      </Button>
    </div>
  );
}

// ===== AFFILIATE LINKS COMPONENT =====
export function AffiliateLinks({ ingredients }: { ingredients: string[] }) {
  const affiliates = [
    {
      name: 'Amazon',
      icon: '🛒',
      url: `https://amazon.com/s?k=${encodeURIComponent(ingredients.join(' '))}`,
      commission: '1-5%',
    },
    {
      name: 'Instacart',
      icon: '🛍️',
      url: `https://www.instacart.com/search?q=${encodeURIComponent(ingredients.join(' '))}`,
      commission: '5-10%',
    },
    {
      name: 'Blue Apron',
      icon: '📦',
      url: 'https://www.blueapron.com/?utm_source=recipe-finder',
      commission: '$35-50',
    },
    {
      name: 'Walmart',
      icon: '🏪',
      url: `https://www.walmart.com/search?q=${encodeURIComponent(ingredients.join(' '))}`,
      commission: '2-5%',
    },
  ];

  return (
    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
      <h4 className="font-bold text-lg mb-3">🛒 Buy Ingredients</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {affiliates.map((affiliate) => (
          <a
            key={affiliate.name}
            href={affiliate.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border-2 border-yellow-300 rounded-lg p-3 text-center hover:bg-yellow-100 transition"
          >
            <div className="text-2xl mb-1">{affiliate.icon}</div>
            <div className="font-semibold text-sm">{affiliate.name}</div>
            <div className="text-xs text-gray-600">{affiliate.commission}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ===== SPONSORED RECIPE BADGE =====
export function SponsoredBadge({ sponsor, logo }: { sponsor: string; logo?: string }) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded">
      <div className="flex items-center gap-2">
        {logo && <img src={logo} alt={sponsor} className="h-6" />}
        <span className="text-sm font-semibold text-blue-700">
          ✨ Sponsored by {sponsor}
        </span>
      </div>
    </div>
  );
}

// ===== PRICING PLANS =====
export function PricingPlans() {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      features: [
        'Basic recipe search',
        'Limited AI (5/day)',
        'Trending recipes',
        'Ads included',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$4.99/mo',
      features: [
        'Unlimited searches',
        'Unlimited AI',
        'Meal planning',
        'Nutrition tracking',
        'No ads',
        'Priority support',
      ],
      highlighted: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99/mo',
      features: [
        'Everything in Premium',
        'Video tutorials',
        'Expert consultations',
        'Custom meal plans',
        'VIP community',
        '24/7 support',
      ],
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 my-12">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={`p-6 ${
            plan.highlighted ? 'ring-2 ring-purple-500 transform scale-105' : ''
          }`}
        >
          <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
          <div className="text-3xl font-bold text-purple-600 mb-4">{plan.price}</div>
          <ul className="space-y-2 mb-6">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            className={`w-full ${
              plan.highlighted
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          >
            {plan.id === 'free' ? 'Get Started' : 'Upgrade'}
          </Button>
        </Card>
      ))}
    </div>
  );
}

// ===== AD SLOT COMPONENT =====
export function AdSlot({ slotId }: { slotId: string }) {
  return (
    <div
      id={slotId}
      className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 my-4 text-center text-gray-500 text-sm"
    >
      {/* Google AdSense ads will be injected here */}
      Advertisement
    </div>
  );
}

// ===== FEATURED SPONSORS =====
export function FeaturedSponsors() {
  const sponsors = [
    {
      name: 'KitchenAid',
      logo: '🥄',
      description: 'Perfect Stand Mixer Recipes',
    },
    {
      name: 'Instant Pot',
      logo: '⏲️',
      description: 'Quick Pressure Cooker Meals',
    },
    {
      name: 'Ninja',
      logo: '🥤',
      description: 'Smoothie & Blender Recipes',
    },
    {
      name: 'Le Creuset',
      logo: '🍲',
      description: 'Dutch Oven Classics',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 my-8">
      <h3 className="text-2xl font-bold mb-6">✨ Sponsored Collections</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.name}
            className="bg-white rounded-lg p-4 border-2 border-blue-200 hover:border-blue-500 transition cursor-pointer"
          >
            <div className="text-3xl mb-2">{sponsor.logo}</div>
            <h4 className="font-bold text-lg">{sponsor.name}</h4>
            <p className="text-sm text-gray-600">{sponsor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== MONETIZATION INFO BANNER =====
export function MonetizationInfo() {
  return (
    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
      <h4 className="font-bold text-green-900 mb-2">💰 How We Make Money</h4>
      <ul className="text-sm text-green-800 space-y-1">
        <li>✓ Premium subscriptions help us keep the app free</li>
        <li>✓ Affiliate links earn us small commissions</li>
        <li>✓ Sponsored recipes from trusted brands</li>
        <li>✓ Ads support free users</li>
      </ul>
    </div>
  );
}
