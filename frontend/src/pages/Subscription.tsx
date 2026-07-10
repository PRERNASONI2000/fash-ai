//subscription.tsx
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, FileText, ChevronDown } from 'lucide-react';
// import { useUserData } from '../hooks/useUserData';
import { useAuth } from '../context/AuthContext';
import { useFetch } from '../hooks/useFetch';

const API_URL = import.meta.env.VITE_API_URL;

interface Plan {
  _id: string;
  name: string;
  type: 'plan' | 'addon';
  credits: number;
  price: number;
  recurring: boolean;
  billingCycle?: string;
  features?: string[];
}

interface PlansResponse {
  plans: Plan[];
  addons: Plan[];
}

export function Subscription() {
  const { user, isLoading, error } = useAuth();
  // const { userData, isLoading, error } = useUserData();
  const { data: plansData, loading: plansLoading, error: plansError } = useFetch<PlansResponse>(`${API_URL}/api/plans`);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  // const navigate = useNavigate();

  const name = user?.name;
  const avatarLetter = name?.trim()?.charAt(0)?.toUpperCase() || 'U';
  const workspaceName = name ? `${name}'s Workspace` : 'My Workspace';
  const currentPlanName = user?.activePlan?.name?.replace('Fashion Studio ', '') || 'Free';
  const creditsLeft = user?.credits ?? 0;
  const creditsTotal = user?.activePlan?.credits || creditsLeft || 0;
  const addonCreditsTotal = user?.purchasedAddons?.reduce((sum, addon) => sum + (addon.credits || 0), 0) ?? 0;

  const getPrice = (monthlyPrice: number) => {
    if (isAnnual) {
      return (monthlyPrice * 0.5).toFixed(2);
    }
    return monthlyPrice.toString();
  };

  const getPlanLabel = (plan: Plan) => plan.name.replace('Fashion Studio ', '');

  const getPlanCreditsLabel = (plan: Plan) => {
    if (plan.features?.[0]) return plan.features[0];
    if (plan.credits > 0) {
      return plan.recurring ? `${plan.credits} credits/month` : `${plan.credits} credits`;
    }
    return plan.features?.join(', ') || '';
  };

  const getAddonCreditsLabel = (plan: Plan) => {
    if (plan.features?.[0]) return plan.features[0];
    return plan.credits > 0 ? `${plan.credits} credits` : '';
  };

  const plans = plansData?.plans ?? [];
  const addons = plansData?.addons ?? [];

  const handleSubscribe = async (planId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ planId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to start checkout');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout redirect error:', err);
    }
  };


  const faqData = [
    {
      question: 'Can I cancel my subscription any time?',
      answer: 'Yes — you can cancel anytime and continue to use your plan until the end of your billing cycle.',
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'Open your account settings, choose billing, and select cancel. Our support team can also help with cancellation.',
    },
    // {
    //   question: 'Do my monthly credits roll over?',
    //   answer: 'No. Monthly credits refresh at the start of the next billing cycle, so it's best to use them before the end of the month.',
    // },
    // {
    //   question: 'What's the difference between monthly and annual plans?',
    //   answer: 'Annual plans save you 50% and are billed once per year, while monthly plans give you more flexibility with recurring monthly billing.',
    // },
  ];

  if (isLoading || plansLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-[#050506]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 dark:border-white/10 border-t-[#d97a40]" />
      </div>
    );
  }

  if (error || plansError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-[#050506]">
        <div className="text-red-400">{error || plansError}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-zinc-900 dark:text-white px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#b5652a] to-[#d97a40] text-xl font-bold text-white shadow-[0_4px_16px_rgba(181,101,42,0.35)]">
            {avatarLetter}
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{workspaceName}</h1>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Subscription</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-zinc-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#18181b] p-5 md:col-span-2">
              <p className="text-xs text-zinc-400 mb-3">Current Plan</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">{currentPlanName}</p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-gradient-to-r from-[#b5652a] to-[#d97a40] hover:opacity-90 text-white rounded-lg px-4 py-2 text-sm font-semibold transition shadow-[0_2px_10px_rgba(181,101,42,0.3)]"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>

            <div className="border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50 dark:bg-[#111] p-5">
              <p className="text-xs text-zinc-400 mb-2">Additional Credits Pack</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{addonCreditsTotal}</p>
              <p className="text-xs text-zinc-400 mb-8">$15/Pack/month</p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-gradient-to-r from-[#b5652a] to-[#d97a40] hover:opacity-90 text-white rounded-lg px-3 py-2 text-xs font-semibold transition shadow-[0_2px_8px_rgba(181,101,42,0.25)]"
                >
                  Upgrade To Advanced To Unlock
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">My Credits</h2>
          </div>
          <div className="border border-zinc-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#18181b] p-5">
            <div className="mb-6 flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-900 dark:text-white">Credits left</span>
              <span className="text-zinc-400">•</span>
              <span className="text-xs text-zinc-400">Your monthly credits refill at the end of each cycle.</span>
              <button className="text-xs text-zinc-400 underline transition hover:text-zinc-300">Read more</button>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-zinc-900 dark:text-white">{creditsLeft}</span>
                <span className="text-xl text-zinc-400">/{creditsTotal}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(true)}
                className="bg-gradient-to-r from-[#b5652a] to-[#d97a40] hover:opacity-90 text-white rounded-lg px-4 py-2 text-sm font-semibold transition shadow-[0_2px_10px_rgba(181,101,42,0.25)]"
              >
                + Add Credits
              </button>
            </div>
            <div className="h-2.5 w-full rounded-full bg-green-500" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Recent Invoices</h2>
          </div>
          <div className="border border-zinc-200 dark:border-white/10 rounded-xl bg-white dark:bg-[#18181b] p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
            <FileText className="h-8 w-8 text-zinc-600 mb-4" />
            <p className="text-sm text-zinc-400">You don't have any invoices yet. They will appear here once you make a purchase.</p>
          </div>
        </div>
      </div>

      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4" onClick={() => setShowUpgradeModal(false)}>
          <div className="w-full max-w-5xl rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0F0F14] shadow-2xl max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="border-b border-zinc-200 dark:border-white/10 p-8 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-widest text-zinc-400 mb-2">Upgrade Plan</p>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Choose the perfect plan for your workspace</h2>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Billing Toggle */}
            <div className="border-b border-zinc-200 dark:border-white/10 p-6 flex items-center justify-between">
              <div />
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#18181b] p-1">
                  <button
                    onClick={() => setIsAnnual(false)}
                    className={`rounded-full px-6 py-2 text-sm font-semibold transition ${!isAnnual
                        ? 'bg-white text-black shadow-sm dark:shadow-none'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                      }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setIsAnnual(true)}
                    className={`rounded-full px-6 py-2 text-sm font-semibold transition ${isAnnual
                        ? 'bg-white text-black shadow-sm dark:shadow-none'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                      }`}
                  >
                    Annually
                  </button>
                </div>
                {isAnnual && (
                  <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-300">
                    50% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Plans Grid */}
            <div className="border-b border-zinc-200 dark:border-white/10 p-8">
              <div className="grid gap-6 grid-cols-4">
                {plans.map((plan, index) => (
                  <div
                    key={plan._id}
                    className={
                      index === 2
                        ? 'rounded-xl border border-fuchsia-500/50 bg-white dark:bg-[#18181b] p-6 relative'
                        : index === 3
                          ? 'rounded-xl border border-lime-500/50 bg-white dark:bg-[#18181b] p-6 relative'
                          : 'rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#18181b] p-6'
                    }
                  >
                    {index === 2 && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="inline-block rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-1 text-xs font-bold text-white">
                          MOST POPULAR
                        </span>
                      </div>
                    )}
                    {index === 3 && (
                      <div className="absolute -top-3 right-4">
                        <span className="inline-block rounded-full bg-lime-500 px-4 py-1 text-xs font-bold text-black">
                          BEST VALUE
                        </span>
                      </div>
                    )}
                    <p className="text-sm font-semibold text-zinc-400 mb-4">{getPlanLabel(plan)}</p>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
                      ${getPrice(plan.price)}
                      <span className="text-lg text-zinc-500 dark:text-zinc-400">
                        {plan.recurring ? '/mo' : ''}
                      </span>
                    </p>
                    <p className="text-xs text-zinc-400 mb-6">{getPlanCreditsLabel(plan)}</p>
                    <button
                      type="button"
                      onClick={() => handleSubscribe(plan._id)}
                      className={
                      index === 2
                        ? 'w-full rounded-lg bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white py-2 text-sm font-semibold hover:opacity-90 transition'
                        : 'w-full rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black py-2 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition'
                    }
                    >
                      Subscribe
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons Section */}
            <div className="border-b border-white/10 p-8">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Optional Add-ons</h3>
              <div className="grid gap-6 grid-cols-2">
                {addons.map((addon) => (
                  <div key={addon._id} className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#18181b] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-semibold text-zinc-400">{getPlanLabel(addon)}</p>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-2">
                          ${getPrice(addon.price)}
                          <span className="text-sm text-zinc-500 dark:text-zinc-400">/month</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 mb-4">{getAddonCreditsLabel(addon)}</p>
                    <button
                      type="button"
                      onClick={() => handleSubscribe(addon._id)}
                      className="w-full rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black py-2 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition"
                    >
                      Subscribe
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="p-8">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {faqData.map((faq, index) => (
                  <div key={index} className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#18181b]">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition"
                    >
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white text-left">{faq.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-zinc-400 transition-transform ${expandedFaq === index ? 'transform rotate-180' : ''
                          }`}
                      />
                    </button>
                    {expandedFaq === index && (
                      <div className="border-t border-zinc-200 dark:border-white/10 p-4 text-sm text-zinc-600 dark:text-zinc-300">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}