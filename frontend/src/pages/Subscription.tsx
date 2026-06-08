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
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-[#050506]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 dark:border-white/10 border-t-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-[#050506]">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-zinc-900 dark:text-white px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
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
              <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-8">Free</p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg px-4 py-2 text-sm font-semibold transition hover:bg-zinc-800 dark:hover:bg-zinc-100"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>

            <div className="border border-zinc-200 dark:border-white/10 rounded-xl bg-zinc-50 dark:bg-[#111] p-5">
              <p className="text-xs text-zinc-400 mb-2">Additional Credits Pack</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">0</p>
              <p className="text-xs text-zinc-400 mb-8">$15/Pack/month</p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg px-3 py-2 text-xs font-semibold transition hover:bg-zinc-800 dark:hover:bg-zinc-100"
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
                <span className="text-4xl font-bold text-zinc-900 dark:text-white">40</span>
                <span className="text-xl text-zinc-400">/40</span>
              </div>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(true)}
                className="bg-white text-black rounded-lg px-4 py-2 text-sm font-semibold transition hover:bg-zinc-100"
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
                {/* Essential */}
                <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#18181b] p-6">
                  <p className="text-sm font-semibold text-zinc-400 mb-4">Essential</p>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">${getPrice(7)}<span className="text-lg text-zinc-500 dark:text-zinc-400">/mo</span></p>
                  <p className="text-xs text-zinc-400 mb-6">4,000 credits/month</p>
                  <button className="w-full rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black py-2 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition">
                    Subscribe
                  </button>
                </div>

                {/* Advanced */}
                <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#18181b] p-6">
                  <p className="text-sm font-semibold text-zinc-400 mb-4">Advanced</p>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">${getPrice(14.5)}<span className="text-lg text-zinc-500 dark:text-zinc-400">/mo</span></p>
                  <p className="text-xs text-zinc-400 mb-6">12,000 credits/month</p>
                  <button className="w-full rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black py-2 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition">
                    Subscribe
                  </button>
                </div>

                {/* Infinite - Most Popular */}
                <div className="rounded-xl border border-fuchsia-500/50 bg-white dark:bg-[#18181b] p-6 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="inline-block rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-1 text-xs font-bold text-white">
                      MOST POPULAR
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-zinc-400 mb-4">Infinite</p>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">${getPrice(28)}<span className="text-lg text-zinc-500 dark:text-zinc-400">/mo</span></p>
                  <p className="text-xs text-zinc-400 mb-6">24,000 credits/month</p>
                  <button className="w-full rounded-lg bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white py-2 text-sm font-semibold hover:opacity-90 transition">
                    Subscribe
                  </button>
                </div>

                {/* Wonder - Best Value */}
                <div className="rounded-xl border border-lime-500/50 bg-white dark:bg-[#18181b] p-6 relative">
                  <div className="absolute -top-3 right-4">
                    <span className="inline-block rounded-full bg-lime-500 px-4 py-1 text-xs font-bold text-black">
                      BEST VALUE
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-zinc-400 mb-4">Wonder</p>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">${getPrice(120)}<span className="text-lg text-zinc-500 dark:text-zinc-400">/mo</span></p>
                  <p className="text-xs text-zinc-400 mb-6">106,000 credits/month</p>
                  <button className="w-full rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black py-2 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Add-ons Section */}
            <div className="border-b border-white/10 p-8">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Optional Add-ons</h3>
              <div className="grid gap-6 grid-cols-2">
                {/* Add-on 1 */}
                <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#18181b] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-zinc-400">Extra Credit Pack 1</p>
                      <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-2">${getPrice(15)}<span className="text-sm text-zinc-500 dark:text-zinc-400">/month</span></p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4">5,000 credits/month</p>
                  <button className="w-full rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black py-2 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition">
                    Subscribe
                  </button>
                </div>

                {/* Add-on 2 */}
                <div className="rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#18181b] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-zinc-400">Extra Credit Pack 2</p>
                      <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-2">${getPrice(25)}<span className="text-sm text-zinc-500 dark:text-zinc-400">/month</span></p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4">10,000 credits/month</p>
                  <button className="w-full rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black py-2 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition">
                    Subscribe
                  </button>
                </div>
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