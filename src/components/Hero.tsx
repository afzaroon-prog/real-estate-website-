import React from 'react';
import { ArrowRight, Star, Award, MapPin, Search, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
// @ts-ignore
import luxuryMansionHero from '../assets/images/luxury_mansion_hero_1780966744145.png';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section id="hero-section" className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden pt-20">
      {/* Background Image with Dark Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={luxuryMansionHero}
          alt="Luxury Toronto Custom Mansion"
          className="w-full h-full object-cover scale-105 filter brightness-50"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        {/* Small Intro Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-8"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Proudly Serving Toronto & The Greater Toronto Area (GTA)</span>
        </motion.div>

        {/* Master Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-medium max-w-4.5xl tracking-tight leading-tight lg:leading-[1.12]"
        >
          Your Vision. Your Luxury.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 font-normal italic">
            Your Trusted Advisor.
          </span>
        </motion.h1>

        {/* Supporting Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 font-sans text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed font-light"
        >
          Expert real estate guidance backed by years of market mastery. Let’s list your house with a <strong>Free Home Evaluation</strong> or narrow down your dream home with <strong>Area Market Alerts</strong>.
        </motion.p>

        {/* Main CTA Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => onNavigate('evaluation')}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 outline-none hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-base rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            Request Free Home Evaluation
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          
          <button
            onClick={() => onNavigate('listings')}
            className="px-8 py-4 bg-zinc-900/80 backdrop-blur-md outline-none hover:bg-zinc-800 text-white font-semibold text-base rounded-xl transition-all border border-zinc-750 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4 text-emerald-400" />
            Search Live TRREB MLS® Registry
          </button>
        </motion.div>

        {/* Proof / Highlight Pillars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12 w-full max-w-5xl pt-10 border-t border-slate-800/60"
        >
          <div className="text-center">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-white mb-1.5 font-sans whitespace-nowrap">647-297-4080</div>
            <div className="text-xs text-slate-400 uppercase tracking-widest font-sans font-medium">Direct Broker Line</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-emerald-450 text-emerald-400 mb-1.5 font-sans">GTA-Wide</div>
            <div className="text-xs text-slate-400 uppercase tracking-widest font-sans font-medium">Specialized Coverage</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-3xl sm:text-4xl font-bold text-white mb-1.5 font-sans">100%</div>
            <div className="text-xs text-slate-400 uppercase tracking-widest font-sans font-medium">Satisfaction Focus</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-400 mb-1.5 font-sans">HomeLife Superstars</div>
            <div className="text-xs text-slate-400 uppercase tracking-widest font-sans font-medium">Eminent Brokerage</div>
          </div>
        </motion.div>

        {/* Quick Action Navigation Grid (Feature Cards) */}
        <div className="mt-24 w-full p-0 grid md:grid-cols-3 gap-6 text-left">
          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-neutral-950/60 backdrop-blur-md border border-zinc-900 p-6 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-5 border border-emerald-500/20">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-white mb-2">Live MLS® Map Search</h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Search all active Ontario real estate listings in real time using our live TRREB REALM MLS® connection across Halton, Peel, Mississauga, and Toronto.
              </p>
            </div>
            <button
              onClick={() => onNavigate('listings')}
              className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 outline-none uppercase tracking-wider group cursor-pointer"
            >
              Search Live Database
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-neutral-950/60 backdrop-blur-md border border-zinc-900 p-6 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-5 border border-emerald-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-medium text-white mb-2">Free Home Evaluation</h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Understand the real-time value of your asset. Submit coordinates, size, and layout for an official Comparative Market Analysis report.
              </p>
            </div>
            <button
              onClick={() => onNavigate('evaluation')}
              className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 outline-none uppercase tracking-wider group cursor-pointer"
            >
              Get Free Assessment
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-neutral-950/60 backdrop-blur-md border border-zinc-900 p-6 rounded-2xl flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 mb-5 border border-emerald-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="Neighborhood Alert text-lg font-serif font-medium text-white mb-2">Area Alerts signup</h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                Never lose an opportunity. Set custom alerts for your target neighbourhoods and receive off-market and freshly-listed property notifications.
              </p>
            </div>
            <button
              onClick={() => onNavigate('alert')}
              className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 outline-none uppercase tracking-wider group cursor-pointer"
            >
              Set Alerts
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
