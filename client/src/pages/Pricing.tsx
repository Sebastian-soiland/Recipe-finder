import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MemphisLayout } from '@/components/MemphisLayout';

export default function Pricing() {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying Recipe Finder',
      features: [
        'Basic recipe search',
        'Limited AI generations (5/day)',
        'View trending recipes',
        'Basic community features',
        'Ads included',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$4.99',
      period: '/month',
      description: 'Unlimited recipes and features',
      features: [
        'Unlimited recipe searches',
        'Unlimited AI generations',
        'AI meal planning',
        'Nutrition tracking',
        'Dietary filtering',
        'Shopping list generation',
        'Recipe collections',
        'Ad-free experience',
        'Priority support',
      ],
      cta: 'Upgrade to Premium',
      highlighted: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      description: 'Everything for serious home chefs',
      features: [
        'Everything in Premium',
        'Advanced meal planning',
        'Personalized recommendations',
        'Recipe video tutorials',
        'Cooking tips & tricks',
        'Expert chef consultations',
        'Custom dietary plans',
        'VIP community access',
        '24/7 priority support',
      ],
      cta: 'Upgrade to Pro',
      highlighted: false,
    },
  ];

  return (
    <MemphisLayout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-black drop-shadow-lg">
            CHOOSE YOUR PLAN
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            Start free, upgrade anytime
          </p>
          <p className="text-gray-600">
            All plans include access to our AI-powered recipe discovery
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`p-8 flex flex-col transition-all ${
                plan.highlighted
                  ? 'ring-4 ring-purple-500 transform scale-105 shadow-2xl'
                  : 'hover:shadow-lg'
              }`}
            >
              {/* Badge */}
              {plan.highlighted && (
                <div className="bg-purple-500 text-white text-center py-2 rounded-lg mb-4 font-bold">
                  MOST POPULAR
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>

              {/* Price */}
              <div className="mb-4">
                <span className="text-5xl font-bold text-purple-600">
                  {plan.price}
                </span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6 flex-grow">{plan.description}</p>

              {/* CTA Button */}
              <Button
                className={`w-full mb-6 py-3 text-lg font-bold ${
                  plan.highlighted
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-black'
                }`}
              >
                {plan.cta}
              </Button>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <span className="text-green-500 font-bold text-xl mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-r from-mint-200 to-lilac-200 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-black">
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-lg mb-2">Can I upgrade or downgrade anytime?</h4>
              <p className="text-gray-700">
                Yes! You can change your plan at any time. Changes take effect on your next billing cycle.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-2">Is there a free trial?</h4>
              <p className="text-gray-700">
                Yes! Start with our Free plan to try all basic features. Upgrade to Premium or Pro whenever you're ready.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-700">
                We accept all major credit cards (Visa, Mastercard, American Express) through Stripe.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-700">
                Absolutely! Cancel your subscription anytime with no questions asked. You'll have access until the end of your billing period.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-2">Do you offer refunds?</h4>
              <p className="text-gray-700">
                We offer a 7-day money-back guarantee if you're not satisfied with your Premium or Pro subscription.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-black">
            FEATURE COMPARISON
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-purple-100">
                  <th className="border-2 border-purple-300 p-4 text-left font-bold">Feature</th>
                  <th className="border-2 border-purple-300 p-4 text-center font-bold">Free</th>
                  <th className="border-2 border-purple-300 p-4 text-center font-bold">Premium</th>
                  <th className="border-2 border-purple-300 p-4 text-center font-bold">Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Recipe Search', free: '✓', premium: '✓', pro: '✓' },
                  { feature: 'AI Generations/Day', free: '5', premium: 'Unlimited', pro: 'Unlimited' },
                  { feature: 'Meal Planning', free: '✗', premium: '✓', pro: '✓' },
                  { feature: 'Nutrition Tracking', free: '✗', premium: '✓', pro: '✓' },
                  { feature: 'Dietary Filtering', free: '✗', premium: '✓', pro: '✓' },
                  { feature: 'Shopping Lists', free: '✗', premium: '✓', pro: '✓' },
                  { feature: 'Video Tutorials', free: '✗', premium: '✗', pro: '✓' },
                  { feature: 'Expert Consultations', free: '✗', premium: '✗', pro: '✓' },
                  { feature: 'Ad-Free', free: '✗', premium: '✓', pro: '✓' },
                  { feature: 'Priority Support', free: '✗', premium: '✓', pro: '✓' },
                ].map((row) => (
                  <tr key={row.feature} className="hover:bg-gray-50">
                    <td className="border-2 border-gray-300 p-4 font-semibold">{row.feature}</td>
                    <td className="border-2 border-gray-300 p-4 text-center">{row.free}</td>
                    <td className="border-2 border-gray-300 p-4 text-center text-purple-600 font-bold">
                      {row.premium}
                    </td>
                    <td className="border-2 border-gray-300 p-4 text-center text-purple-600 font-bold">
                      {row.pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-yellow-200 to-peach-200 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-black">
            READY TO GET STARTED?
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Join thousands of home chefs discovering amazing recipes
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg font-bold">
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </MemphisLayout>
  );
}
