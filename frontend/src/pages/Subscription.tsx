//subscription.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, FileText, ChevronDown } from 'lucide-react';

export function Subscription() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to load profile');
        }
        setName(data.name || '');
      } catch (err: any) {
        setError(err.message || 'Unable to load profile');
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const avatarLetter = name?.trim()?.charAt(0)?.toUpperCase() || 'U';
  const workspaceName = name ? `${name}'s Workspace` : 'My Workspace';

  const getPrice = (monthlyPrice: number) => {
    if (isAnnual) {
      return (monthlyPrice * 0.5).toFixed(2);
    }
    return monthlyPrice.toString();
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

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-zinc-200 dark:border-white/10 border-t-violet-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-xl border border-red-500/20 bg-red-50 dark:bg-red-500/10 px-6 py-4 text-sm text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="text-zinc-900 dark:text-white px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xl font-bold text-white shadow-md shadow-violet-500/20">
            {avatarLetter}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">{workspaceName}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your subscription and billing</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Subscription</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="border border-zinc-200 dark:border-white/[0.07] rounded-2xl bg-white dark:bg-[#17171b] p-5 md:col-span-2 shadow-sm">
              <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-2">Current Plan</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Free</p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl px-5 py-2 text-sm font-semibold transition hover:bg-zinc-700 dark:hover:bg-zinc-100 shadow-sm"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>

            <div className="border border-zinc-200 dark:border-white/[0.07] rounded-2xl bg-zinc-50 dark:bg-white/[0.03] p-5 shadow-sm">
              <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mb-2">Additional Credits Pack</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">0</p>
              <p className="text-xs text-zinc-400 mb-6">$15 / pack / month</p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl px-3 py-2 text-xs font-semibold transition hover:bg-zinc-700 dark:hover:bg-zinc-100 shadow-sm"
                >
                  Unlock with Advanced
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">My Credits</h2>
          </div>
          <div className="border border-zinc-200 dark:border-white/[0.07] rounded-2xl bg-white dark:bg-[#17171b] p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-zinc-900 dark:text-white">Credits left</span>
              <span className="text-zinc-300 dark:text-zinc-600">·</span>
              <span className="text-xs text-zinc-400">Refill at the end of each billing cycle.</span>
              <button className="text-xs text-zinc-400 underline transition hover:text-zinc-600 dark:hover:text-zinc-300">Read more</button>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-zinc-900 dark:text-white">40</span>
                <span className="text-lg text-zinc-400 dark:text-zinc-500">/40</span>
              </div>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(true)}
                className="border border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-white/[0.04] hover:bg-zinc-100 dark:hover:bg-white/[0.08] text-zinc-900 dark:text-white rounded-xl px-4 py-2 text-sm font-semibold transition shadow-sm"
              >
                + Add Credits
              </button>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-white/10 overflow-hidden">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500" />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Recent Invoices</h2>
          </div>
          <div className="border border-zinc-200 dark:border-white/[0.07] rounded-2xl bg-white dark:bg-[#17171b] p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-white/[0.06] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <FileText className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
            </div>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No invoices yet</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">They will appear here once you make a purchase.</p>
          </div>
        </div>
      </div>

      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4" onClick={() => setShowUpgradeModal(false)}>
          <div className="w-full max-w-5xl rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#17171b] shadow-2xl shadow-black/20 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="border-b border-zinc-200 dark:border-white/[0.07] p-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">Upgrade Plan</p>
                <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">Choose the perfect plan for your workspace</h2>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-white/[0.04] text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition text-sm"
              >
                ✕
              </button>
            </div>

            {/* Billing Toggle */}
            <div className="border-b border-zinc-200 dark:border-white/[0.07] p-6 flex items-center justify-center gap-4">
              <div className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-100 dark:bg-white/[0.04] p-1">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${!isAnnual
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`rounded-lg px-5 py-2 text-sm font-semibold transition ${isAnnual
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                >
                  Annually
                </button>
              </div>
              {isAnnual && (
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  50% OFF
                </span>
              )}
            </div>

            {/* Plans Grid */}
            <div className="border-b border-zinc-200 dark:border-white/[0.07] p-8">
              <div className="grid gap-4 grid-cols-4">
                {/* Essential */}
                <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-white/[0.03] p-6">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-4">Essential</p>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">${getPrice(7)}<span className="text-sm font-medium text-zinc-400">/mo</span></p>
                  <p className="text-xs text-zinc-400 mb-6">4,000 credits/month</p>
                  <button className="w-full rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black py-2.5 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition shadow-sm">
                    Subscribe
                  </button>
                </div>

                {/* Advanced */}
                <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-white/[0.03] p-6">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-4">Advanced</p>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">${getPrice(14.5)}<span className="text-sm font-medium text-zinc-400">/mo</span></p>
                  <p className="text-xs text-zinc-400 mb-6">12,000 credits/month</p>
                  <button className="w-full rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black py-2.5 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition shadow-sm">
                    Subscribe
                  </button>
                </div>

                {/* Infinite - Most Popular */}
                <div className="rounded-2xl border-2 border-fuchsia-400/60 dark:border-fuchsia-500/40 bg-white dark:bg-white/[0.04] p-6 relative shadow-md shadow-fuchsia-500/10">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-block rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-3 py-1 text-[10px] font-bold text-white tracking-wide shadow-sm">
                      MOST POPULAR
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-fuchsia-500 uppercase tracking-wide mb-4">Infinite</p>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">${getPrice(28)}<span className="text-sm font-medium text-zinc-400">/mo</span></p>
                  <p className="text-xs text-zinc-400 mb-6">24,000 credits/month</p>
                  <button className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white py-2.5 text-sm font-semibold hover:opacity-90 transition shadow-sm shadow-fuchsia-500/25">
                    Subscribe
                  </button>
                </div>

                {/* Wonder - Best Value */}
                <div className="rounded-2xl border-2 border-emerald-400/50 dark:border-emerald-500/30 bg-white dark:bg-white/[0.04] p-6 relative shadow-md shadow-emerald-500/10">
                  <div className="absolute -top-3 right-4">
                    <span className="inline-block rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white tracking-wide shadow-sm">
                      BEST VALUE
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-4">Wonder</p>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">${getPrice(120)}<span className="text-sm font-medium text-zinc-400">/mo</span></p>
                  <p className="text-xs text-zinc-400 mb-6">106,000 credits/month</p>
                  <button className="w-full rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black py-2.5 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition shadow-sm">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Add-ons Section */}
            <div className="border-b border-zinc-200 dark:border-white/[0.07] p-8">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-5">Optional Add-ons</h3>
              <div className="grid gap-4 grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-white/[0.03] p-6">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Extra Credit Pack 1</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-2 mb-1">${getPrice(15)}<span className="text-sm font-medium text-zinc-400">/month</span></p>
                  <p className="text-xs text-zinc-400 mb-5">5,000 credits/month</p>
                  <button className="w-full rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black py-2.5 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition shadow-sm">
                    Subscribe
                  </button>
                </div>

                <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-white/[0.03] p-6">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Extra Credit Pack 2</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-2 mb-1">${getPrice(25)}<span className="text-sm font-medium text-zinc-400">/month</span></p>
                  <p className="text-xs text-zinc-400 mb-5">10,000 credits/month</p>
                  <button className="w-full rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black py-2.5 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition shadow-sm">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="p-8">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-5">Frequently Asked Questions</h3>
              <div className="space-y-2">
                {faqData.map((faq, index) => (
                  <div key={index} className="rounded-xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50 dark:bg-white/[0.03] overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition"
                    >
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white text-left">{faq.question}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-zinc-400 transition-transform flex-shrink-0 ml-4 ${expandedFaq === index ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expandedFaq === index && (
                      <div className="border-t border-zinc-200 dark:border-white/[0.07] px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
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