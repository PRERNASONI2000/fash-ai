// Support.tsx
// Support page with FAQ, Documentation, Chat, and Feature Requests
// TODO: Integrate with backend API for chat at /api/support/chat
// TODO: Integrate with backend API for feature requests at /api/support/feature-request

import { useState } from 'react'
import { MessageCircle, FileText, Lightbulb, HelpCircle, ChevronDown } from 'lucide-react'

export function Support() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  const faqs = [
    {
      q: 'How many credits does each tool use?',
      a: 'Each tool has different credit requirements. Product to Model uses 5 credits, Try On uses 3, and other tools range from 2-8 credits based on processing complexity.'
    },
    {
      q: 'Can I keep the same AI model across campaigns?',
      a: 'Yes! You can save your AI models and reuse them across multiple campaigns. They remain in your library indefinitely for future use.'
    },
    {
      q: 'What resolution are my exports?',
      a: 'Exports are available in multiple resolutions: Full HD (1080p), 2K (2560x1440), and 4K (3840x2160), depending on your subscription plan.'
    },
    {
      q: 'Do I own the images I generate?',
      a: 'Yes, all images you generate are yours to own and use commercially. You have full rights to generated content under your account.'
    },
    {
      q: 'Can I match a specific brand aesthetic?',
      a: 'Absolutely! Our customization tools allow you to match specific brand colors, styles, and aesthetics across all your generated content.'
    },
  ]

  const supportSections = [
    { icon: FileText, title: 'Documentation', desc: 'Complete guides and tutorials', color: 'from-blue-500 to-blue-600' },
    { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with our support team', color: 'from-green-500 to-green-600' },
    { icon: Lightbulb, title: 'Feature Request', desc: 'Suggest new features', color: 'from-amber-500 to-amber-600' },
  ]

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#f2eee6] to-[#faf9f7] dark:from-[#121212] dark:to-[#1a1a1a] transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#b5652a] to-[#d97a40] mb-6 shadow-lg">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#b5652a] to-[#d97a40] bg-clip-text text-transparent mb-4">
            Support & Help
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Get answers to common questions and reach out to our support team for assistance
          </p>
        </div>

        {/* Support Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {supportSections.map((section, idx) => {
            const Icon = section.icon
            return (
              <div
                key={idx}
                onMouseEnter={() => setIsHovering(idx)}
                onMouseLeave={() => setIsHovering(-1)}
                className={`group relative p-8 rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] backdrop-blur-sm transition-all duration-300 ease-out hover:shadow-xl hover:shadow-[rgba(181,101,42,0.15)] dark:hover:shadow-black/30 hover:border-[#b5652a] dark:hover:border-[#d97a40] hover:-translate-y-1 cursor-pointer`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#b5652a]/10 to-[#d97a40]/10 dark:from-[#d97a40]/20 dark:to-[#b5652a]/20 group-hover:shadow-lg transition-all duration-300 mb-4">
                    <Icon className="h-6 w-6 text-[#b5652a] dark:text-[#d97a40]" />
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {section.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Find answers to commonly asked questions about FashAI Studio
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="group border border-zinc-200 dark:border-white/10 rounded-2xl bg-white dark:bg-white/[0.03] overflow-hidden hover:shadow-lg hover:shadow-[rgba(181,101,42,0.1)] transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full px-8 py-5 flex items-start justify-between hover:bg-white/50 dark:hover:bg-white/[0.05] transition-colors duration-300"
                >
                  <span className="flex-1 text-left font-semibold text-zinc-900 dark:text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#b5652a] dark:text-[#d97a40] flex-shrink-0 ml-4 transition-transform duration-300 ${
                      expandedFAQ === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedFAQ === idx && (
                  <div className="px-8 py-5 border-t border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02]">
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Documentation Section */}
        <div className="mb-16">
          <div className="relative rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.05] overflow-hidden hover:shadow-2xl hover:shadow-[rgba(181,101,42,0.2)] dark:hover:shadow-black/40 transition-all duration-300"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#b5652a]/5 to-[#d97a40]/5 dark:from-[#d97a40]/10 dark:to-[#b5652a]/10" />

            <div className="relative p-12">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex-shrink-0">
                  <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                    Documentation
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                    Deep dives into every tool, credits system, and best practices for getting the most out of FashAI Studio
                  </p>
                  <button className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95">
                    Browse Documentation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="mb-16">
          <div className="relative rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.05] overflow-hidden hover:shadow-2xl hover:shadow-[rgba(181,101,42,0.2)] dark:hover:shadow-black/40 transition-all duration-300"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#b5652a]/5 to-[#d97a40]/5 dark:from-[#d97a40]/10 dark:to-[#b5652a]/10" />

            <div className="relative p-12">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex-shrink-0">
                  <MessageCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                    Chat with Us
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                    Use chat with the studio team. Mon-Fri, 9-6 CET. We usually reply within a few hours during business hours
                  </p>
                  <button className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95">
                    Start a Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Request Section */}
        <div className="mb-8">
          <div className="relative rounded-3xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.05] overflow-hidden hover:shadow-2xl hover:shadow-[rgba(181,101,42,0.2)] dark:hover:shadow-black/40 transition-all duration-300"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#b5652a]/5 to-[#d97a40]/5 dark:from-[#d97a40]/10 dark:to-[#b5652a]/10" />

            <div className="relative p-12">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex-shrink-0">
                  <Lightbulb className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                    Feature Request
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                    Shape the roadmap - tell us what to build next. Your feedback directly influences our product development
                  </p>
                  <button className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95">
                    Suggest a Feature
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
