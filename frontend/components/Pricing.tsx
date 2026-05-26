"use client";

import { motion } from "framer-motion";
import { Check, Flame } from "lucide-react";

const PLANS = [
  {
    name: "Hobby",
    price: "0",
    desc: "Perfect for testing ideas and developing basic utility tools.",
    features: [
      "5 Extension generations / day",
      "Strict Manifest V3 output",
      "Downloadable ZIP compiler",
      "Standard JS/HTML validation"
    ],
    cta: "Start Free",
    popular: false
  },
  {
    name: "Pro",
    price: "29",
    desc: "Built for active developers, creators, and power builders.",
    features: [
      "Unlimited AI generations",
      "Iterative AI edits / modifications",
      "Full access to Live Simulator",
      "GitHub repo direct exports",
      "Security scanning dashboard",
      "Premium 24/7 priority support"
    ],
    cta: "Synthesize with Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "99",
    desc: "For agencies, scaling startups, and multi-member teams.",
    features: [
      "Everything in Pro tier",
      "One-click Chrome store uploads",
      "Custom security manifest templates",
      "Multi-seat collaborative history",
      "Custom Gemini model training integrations"
    ],
    cta: "Contact Sales",
    popular: false
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 w-full max-w-7xl mx-auto relative">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 font-display">
          Sleek Pricing for <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Power Creators</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Upgrade to unlock continuous prompt editing, real-time iframe tests, and direct repositories sync.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {PLANS.map((plan, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`rounded-2xl p-8 flex flex-col relative transition-all duration-300 ${
              plan.popular
                ? "bg-gradient-to-b from-violet-950/30 to-blue-950/20 border-2 border-violet-500 shadow-[0_0_40px_rgba(139,92,246,0.15)]"
                : "glass-panel"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-[0_4px_10px_rgba(139,92,246,0.5)]">
                <Flame className="w-3 h-3 fill-white" /> Recommended
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-200">{plan.name}</h3>
              <p className="text-xs text-gray-400 mt-2 min-h-8">{plan.desc}</p>
            </div>

            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-white">${plan.price}</span>
              <span className="text-gray-500 text-xs font-semibold">/ month</span>
            </div>

            <ul className="flex-1 space-y-3.5 mb-8">
              {plan.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed">
                  <Check className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                plan.popular
                  ? "bg-violet-600 text-white hover:bg-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.45)]"
                  : "bg-white/5 border border-white/15 text-gray-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
