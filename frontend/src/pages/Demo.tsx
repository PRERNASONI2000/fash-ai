import { useMemo, useState } from 'react';
import { CreditCard } from 'lucide-react';

const plans = [
  {
    id: 'free',
    title: 'Free',
    description: 'Best for getting started with a trial of the platform.',
    monthlyRate: 'Free',
    annualRate: 'Free',
    badge: null,
    buttonLabel: 'Current Plan',
    features: ['40 one-time trial credits', 'Basic access', 'Community support'],
  },
  {
    id: 'essential',
    title: 'Essential',
    description: 'Perfect for creators who want reliable monthly output.',
    monthlyRate: '$7',
    annualRate: '$6.3',
    badge: null,
    buttonLabel: 'Subscribe',
    features: ['4,000 credits / month', 'Up to ~50 videos', 'Up to ~13 characters'],
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Designed for frequent creators and agile teams.',
    monthlyRate: '$14.5',
    annualRate: '$13',
    badge: 'Most Value',
    buttonLabel: 'Subscribe',
    features: ['12,000 credits / month', 'Up to ~150 videos', 'Up to ~40 characters'],
  },
  {
    id: 'infinite',
    title: 'Infinite',
    description: 'The best option for creators who need maximum bandwidth.',
    monthlyRate: '$28',
    annualRate: '$24',
    badge: null,
    buttonLabel: 'Subscribe',
    features: ['24,000 credits / month', 'Up to ~300 videos', 'Up to ~80 characters'],
  },
  {
    id: 'wonder',
    title: 'Wonder',
    description: 'For power users that want the premium suite.',
    monthlyRate: '$120',
    annualRate: '$108',
    badge: 'Best Value',
    buttonLabel: 'Subscribe',
    features: ['106,000 credits / month', 'Up to ~1,300 videos', 'Up to ~353 characters'],
  },
];

const faqItems = [
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes. You can cancel anytime and keep access until the end of your current billing cycle.',
  },
  {
    question: 'Do my credits roll over each month?',
    answer: 'Credits reset at the end of each cycle for both monthly and annual plans.',
  },
];

export function Subscription() {
  const [planMode, setPlanMode] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const planSummary = useMemo(
    () => plans.map((plan) => ({
      ...plan,
      rate: planMode === 'monthly' ? plan.monthlyRate : plan.annualRate,
    })),
    [planMode]
  );

  const currentPlan = planSummary.find((plan) => plan.id === 'free');

  return (
    <div className="min-h-screen bg-[#050506] text-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 rounded-[32px] border border-white/10 bg-[#09090b]/80 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 shadow-inner">
                <CreditCard className="mr-2 h-4 w-4 text-fuchsia-400" />
                Subscription
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">Powerful plans for every creator</h1>
              <p className="mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">
                Choose between monthly and annual billing. Upgrade smoothly, compare features, and open plan details in a polished modal.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[28px] border border-white/10 bg-[#111118] p-6 shadow-[0_20px_40px_rgba(15,23,42,0.3)]">
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Current Plan</p>
                <p className="mt-4 text-2xl font-semibold text-white">{currentPlan?.title}</p>
                <p className="mt-2 text-sm text-zinc-400">{currentPlan?.description}</p>
                <div className="mt-6 rounded-2xl bg-gradient-to-r from-fuchsia-500/20 to-pink-500/10 p-4 text-sm text-zinc-200">
                  <div className="flex items-center justify-between">
                    <span>Credits left</span>
                    <span className="font-semibold">40 / 40</span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-full rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-[#111118] p-6 shadow-[0_20px_40px_rgba(15,23,42,0.3)]">
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Additional Credits</p>
                <p className="mt-4 text-4xl font-bold text-white">0</p>
                <p className="mt-2 text-sm text-zinc-400">$15 / pack / month</p>
                <button className="mt-6 inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                  Upgrade To Advanced To Unlock
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 rounded-[32px] border border-white/10 bg-[#09090b]/80 p-8 shadow-[0_20px_64px_rgba(0,0,0,0.22)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Plans</p>
              <h2 className="mt-3 text-3xl font-bold text-white">Monthly or annual billing.</h2>
            </div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 text-sm">
              <button
                type="button"
                onClick={() => setPlanMode('monthly')}
                className={`rounded-full px-5 py-2 transition ${planMode === 'monthly' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-300 hover:bg-white/5 hover:text-white'}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setPlanMode('annual')}
                className={`rounded-full px-5 py-2 transition ${planMode === 'annual' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-300 hover:bg-white/5 hover:text-white'}`}
              >
                Annual
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-5">
            {planSummary.map((plan) => (
              <div
                key={plan.id}
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111118] p-6 transition duration-300 ease-out hover:-translate-y-1 hover:border-fuchsia-500/40 hover:shadow-[0_20px_50px_rgba(139,92,246,0.18)]"
              >
                {plan.badge && (
                  <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-gradient-to-r from-fuchsia-500 to-pink-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-fuchsia-500/20">
                    {plan.badge}
                  </div>
                )}
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">{plan.title}</p>
                <p className="mt-4 text-4xl font-semibold text-white">{plan.rate}<span className="text-base font-medium text-zinc-400">{plan.title !== 'Free' ? ' / seat/mo' : ''}</span></p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{plan.description}</p>
                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-emerald-400">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`mt-8 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${plan.id === 'free' ? 'border border-white/10 bg-white/5 text-white hover:bg-white/10' : 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg shadow-fuchsia-500/25 hover:opacity-95'}`}
                >
                  {plan.buttonLabel}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] border border-white/10 bg-[#09090b]/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Credits</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">40 / 40</h3>
              </div>
              <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-zinc-200">Free tier</div>
            </div>
            <div className="mt-6 rounded-3xl bg-white/5 p-5">
              <div className="flex items-center justify-between text-sm text-zinc-300">
                <span>Used</span>
                <span>0</span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-8/12 rounded-full bg-fuchsia-500" />
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#09090b]/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">FAQs</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">Frequently asked</h3>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {faqItems.map((item, index) => (
                <div key={item.question} className="rounded-3xl border border-white/10 bg-[#111118] p-5 transition hover:border-fuchsia-500/30">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="flex w-full items-center justify-between text-left text-sm font-medium text-white"
                  >
                    <span>{item.question}</span>
                    <span className="text-xl text-fuchsia-400">{activeFaq === index ? '−' : '+'}</span>
                  </button>
                  {activeFaq === index && (
                    <p className="mt-4 text-sm leading-6 text-zinc-400">{item.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#0c0c12] p-8 shadow-2xl shadow-black/60 transition duration-300 ease-out">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Plan details</p>
                <h2 className="mt-2 text-3xl font-bold text-white">{planSummary.find((plan) => plan.id === selectedPlan)?.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:bg-white/10"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Price</p>
                <p className="mt-4 text-4xl font-semibold text-white">{planSummary.find((plan) => plan.id === selectedPlan)?.rate}</p>
                <p className="mt-2 text-sm text-zinc-400">Billed {planMode === 'monthly' ? 'monthly' : 'annually'}.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Action</p>
                <button className="mt-4 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95">
                  Continue to checkout
                </button>
              </div>
            </div>
            <div className="mt-6 rounded-[24px] border border-white/10 bg-[#0b0b11] p-6">
              <p className="text-sm font-medium text-white">Plan highlights</p>
              <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                {planSummary.find((plan) => plan.id === selectedPlan)?.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="text-emerald-400">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
