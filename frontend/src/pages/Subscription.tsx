//subscription.tsx
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, FileText, ChevronDown, Check, ArrowRight } from 'lucide-react';
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

  // const getPlanCreditsLabel = (plan: Plan) => {
  //   if (plan.features?.[0]) return plan.features[0];
  //   if (plan.credits > 0) {
  //     return plan.recurring ? `${plan.credits} credits/month` : `${plan.credits} credits`;
  //   }
  //   return plan.features?.join(', ') || '';
  // };

  const getAddonCreditsLabel = (plan: Plan) => {
    if (plan.features?.[0]) return plan.features[0];
    return plan.credits > 0 ? `${plan.credits} credits` : '';
  };

  const plans = plansData?.plans ?? [];
  const addons = plansData?.addons ?? [];

  const findPlanByKeyword = (keyword: string) =>
    plans.find((plan) => getPlanLabel(plan).toLowerCase().includes(keyword.toLowerCase()));

  const upgradeDisplayPlans = [
    {
      key: 'basic',
      title: 'BASIC',
      monthlyPrice: 19,
      cta: 'Start Basic Plan',
      features: [
        '200 monthly credits',
        'Top-up additional credits if needed*',
        'All core AI fashion tools (Product-to-Model, Model Swap, Try-On, Model Creation, AI Image Editing)',
        'Up to 4K image generation and upscaling',
        'Growing library of ready-to-use AI fashion models and backgrounds',
        'AI videos (720p)',
        'Invite 2 team members',
        'Up to 3 simultaneous generations',
        'Chat support',
      ],
      footer: '*Top-ups cost $0.10 per credit (100-credit minimum) and stay valid for 12 months.',
      highlight: false as const,
      badges: [] as string[],
    },
    {
      key: 'pro',
      title: 'PRO',
      monthlyPrice: 49,
      cta: 'Start Pro Plan',
      features: [
        'Everything in Basic',
        '750 monthly + 50 daily credits*',
        'Most realistic AI image generation capabilities',
        'AI videos (1080p) with advanced controls',
        'Invite 5 team members',
        'Up to 6 simultaneous generations',
        'Priority support',
      ],
      footer: '*Daily credits reset every 24 hours and are used before monthly credits and any top-ups.',
      highlight: true as const,
      badges: ['POPULAR'],
    },
    {
      key: 'agency',
      title: 'AGENCY',
      monthlyPrice: 99,
      cta: 'Start Agency Plan',
      features: [
        'Everything in Pro',
        '1,500 monthly + 100 daily credits*',
        'Upload or create custom Face References',
        'Invite 10 team members',
        'Up to 11 simultaneous generations',
        'Priority feature requests',
      ],
      footer: '*Daily credits reset every 24 hours and are used before monthly credits and any top-ups.',
      highlight: false as const,
      badges: ['Standard', '2x Credits'],
    },
  ];

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4 py-6" onClick={() => setShowUpgradeModal(false)}>
          <div className="w-full max-w-6xl rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0F0F14] shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 z-10 border-b border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-[#0F0F14]/95 backdrop-blur-sm p-6 sm:p-8">
              <div className="relative flex flex-col items-center text-center">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="absolute right-0 top-0 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition text-2xl"
                >
                  ✕
                </button>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Choose Your Plan</h2>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Simple pricing that scales with your team</p>

                {/* Billing Toggle */}
                <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#18181b] p-1">
                  <button
                    onClick={() => setIsAnnual(true)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${isAnnual
                        ? 'bg-gradient-to-r from-[#b5652a] to-[#d97a40] text-white shadow-sm'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                      }`}
                  >
                    Yearly billing
                  </button>
                  <button
                    onClick={() => setIsAnnual(false)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${!isAnnual
                        ? 'bg-gradient-to-r from-[#b5652a] to-[#d97a40] text-white shadow-sm'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                      }`}
                  >
                    Monthly billing
                  </button>
                </div>
                <p className="mt-3 text-xs text-zinc-400">
                  {isAnnual ? 'You\'re saving with yearly billing' : 'Switch to yearly to save 2 months'}
                </p>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="border-b border-zinc-200 dark:border-white/10 p-6 sm:p-8">
              <div className="grid gap-6 md:grid-cols-3">
                {upgradeDisplayPlans.map((displayPlan) => {
                  const matchedPlan = findPlanByKeyword(displayPlan.key);
                  const priceSource = matchedPlan?.price ?? displayPlan.monthlyPrice;

                  return (
                    <div
                      key={displayPlan.key}
                      className={
                        displayPlan.highlight
                          ? 'group relative flex flex-col rounded-2xl border-2 border-[#d97a40]/70 bg-white dark:bg-[#18181b] p-6 shadow-[0_8px_30px_rgba(181,101,42,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#b5652a] hover:shadow-[0_16px_40px_rgba(181,101,42,0.28)]'
                          : 'group relative flex flex-col rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#18181b] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#b5652a]/60 hover:shadow-[0_14px_36px_rgba(181,101,42,0.18)]'
                      }
                    >
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold uppercase tracking-wide text-zinc-900 dark:text-white">
                          {displayPlan.title}
                        </p>
                        {displayPlan.badges.map((badge) => (
                          <span
                            key={badge}
                            className={
                              badge === 'POPULAR'
                                ? 'rounded-full bg-[#b5652a]/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#b5652a] dark:bg-[#d97a40]/20 dark:text-[#d97a40]'
                                : 'rounded-full border border-zinc-200 dark:border-white/15 bg-white dark:bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-300'
                            }
                          >
                            {badge}
                          </span>
                        ))}
                      </div>

                      <p className="mb-5 text-zinc-900 dark:text-white">
                        <span className="text-4xl font-bold">${getPrice(priceSource)}</span>
                        <span className="ml-1 text-sm text-zinc-500 dark:text-zinc-400">/ month</span>
                      </p>

                      <button
                        type="button"
                        disabled={!matchedPlan}
                        onClick={() => matchedPlan && handleSubscribe(matchedPlan._id)}
                        className={
                          displayPlan.highlight
                            ? 'mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#b5652a] to-[#d97a40] py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(181,101,42,0.35)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
                            : 'mb-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-zinc-900 dark:border-white bg-white dark:bg-transparent py-3 text-sm font-semibold text-zinc-900 dark:text-white transition group-hover:border-[#b5652a] group-hover:text-[#b5652a] dark:group-hover:border-[#d97a40] dark:group-hover:text-[#d97a40] disabled:cursor-not-allowed disabled:opacity-50'
                        }
                      >
                        {displayPlan.cta}
                        <ArrowRight size={16} />
                      </button>

                      <ul className="mb-5 flex-1 space-y-3">
                        {displayPlan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300">
                            <Check
                              size={16}
                              className="mt-0.5 shrink-0 text-emerald-500"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <p className="mt-auto text-xs leading-relaxed text-zinc-400">
                        {displayPlan.footer}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add-ons Section */}
            <div className="border-b border-zinc-200 dark:border-white/10 bg-gradient-to-b from-[#faf9f7] to-[#f2eee6]/60 dark:from-[#141414] dark:to-[#0F0F14] px-6 py-8 sm:px-8">
              <div className="mb-6 text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b5652a] dark:text-[#d97a40]">Extras</p>
                <h3 className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">Optional Add-ons</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Boost your workspace with flexible credit packs</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {addons.map((addon) => (
                  <div key={addon._id} className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#b5652a]/50 hover:shadow-[0_14px_36px_rgba(181,101,42,0.16)] dark:border-white/10 dark:bg-[#18181b] dark:hover:border-[#d97a40]/50">
                    <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#b5652a]/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 dark:bg-[#d97a40]/15" />
                    <div className="relative mb-4 flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#b5652a] dark:text-[#d97a40]">{getPlanLabel(addon)}</p>
                        <p className="mt-2 text-zinc-900 dark:text-white">
                          <span className="text-3xl font-bold">${getPrice(addon.price)}</span>
                          <span className="ml-1 text-sm text-zinc-500 dark:text-zinc-400">/month</span>
                        </p>
                      </div>
                      <span className="rounded-full border border-[#b5652a]/20 bg-[#b5652a]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#b5652a] dark:border-[#d97a40]/25 dark:bg-[#d97a40]/15 dark:text-[#d97a40]">
                        Add-on
                      </span>
                    </div>
                    <p className="relative mb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{getAddonCreditsLabel(addon)}</p>
                    <button
                      type="button"
                      onClick={() => handleSubscribe(addon._id)}
                      className="relative w-full rounded-xl border-2 border-zinc-900 bg-white py-2.5 text-sm font-semibold text-zinc-900 transition hover:border-[#b5652a] hover:text-[#b5652a] dark:border-white dark:bg-transparent dark:text-white dark:hover:border-[#d97a40] dark:hover:text-[#d97a40]"
                    >
                      Subscribe
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="px-6 py-8 sm:px-8">
              <div className="mb-6 text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b5652a] dark:text-[#d97a40]">Support</p>
                <h3 className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">Frequently Asked Questions</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Quick answers about billing and subscriptions</p>
              </div>
              <div className="space-y-3">
                {faqData.map((faq, index) => (
                  <div
                    key={index}
                    className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 dark:bg-[#18181b] ${
                      expandedFaq === index
                        ? 'border-[#b5652a]/50 shadow-[0_10px_28px_rgba(181,101,42,0.12)] dark:border-[#d97a40]/50'
                        : 'border-zinc-200 hover:border-[#b5652a]/30 dark:border-white/10 dark:hover:border-[#d97a40]/30'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-[#b5652a]/5 dark:hover:bg-[#d97a40]/10 sm:p-5"
                    >
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white">{faq.question}</span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#b5652a] transition-transform duration-300 dark:text-[#d97a40] ${expandedFaq === index ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                    {expandedFaq === index && (
                      <div className="border-t border-zinc-200 bg-[#faf9f7]/80 px-4 py-4 text-sm leading-relaxed text-zinc-600 dark:border-white/10 dark:bg-[#111] dark:text-zinc-300 sm:px-5">
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