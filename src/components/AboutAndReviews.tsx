import React, { useState } from 'react';
import { testimonials, faqQuestions } from '../data';
import { Quote, Plus, Minus, UserCheck, Award, MessageSquare, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import haroonPortrait from '../assets/images/haroon_portrait_1781030027352.png.png';

export default function AboutAndReviews() {
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [expandedFaqIdx, setExpandedFaqIdx] = useState<number | null>(null);

  const prevReview = () => {
    setActiveReviewIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setActiveReviewIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const toggleFaq = (idx: number) => {
    setExpandedFaqIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="about-reviews-section" className="py-24 bg-black border-t border-zinc-900 relative">
      
      {/* Light spots deco */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Visual Partition Block 1: About Haroon Bio & Credentials */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-24">
          
          {/* Visual Illustration/Avatar side (5 columns) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-zinc-800 bg-zinc-900 shadow-2xl">
              <img
                src={haroonPortrait}
                alt="Haroon Afzal Real Estate Broker"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              {/* Credentials card badge overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-zinc-900/90 backdrop-blur-md p-5 rounded-xl border border-zinc-800 shadow-lg">
                <div className="text-emerald-400 font-bold text-xs uppercase tracking-widest font-sans mb-1">
                  Haroon Afzal
                </div>
                <div className="text-xs text-slate-350 font-sans tracking-wide">
                  Licensed Real Estate Broker &bull; Ontario
                </div>
                <div className="text-[10px] text-slate-500 font-sans tracking-wide uppercase mt-1">
                  HomeLife Superstars Real Estate Ltd. Brokerage
                </div>
              </div>
            </div>

            {/* Exp badges floating */}
            <div className="absolute -top-4 -right-4 bg-emerald-500 text-slate-950 rounded-xl px-4.5 py-3 shadow-xl shadow-emerald-500/10 font-bold border border-emerald-400/25">
              <span className="block text-2xl font-extrabold tracking-tight text-center leading-none">20+</span>
              <span className="text-[9px] uppercase tracking-wider block text-center mt-1">Years active</span>
            </div>
          </div>

          {/* About description text side (7 columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">
              Professional Profile
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight">
              Honest Advice. Unmatched Experience.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              <p>
                As a fully registered and veteran Real Estate Broker specializing across <strong>Toronto, Mississauga, Brampton, Vaughan, and the wider GTA</strong>, Haroon Afzal has built a stellar reputation anchored on absolute integrity, precise contract execution, and deep market insight.
              </p>
              <p>
                Working actively under the premier brokerage <strong>HomeLife Superstars Real Estate Ltd. Brokerage</strong>, Haroon possesses the rare capacity to identify hidden equity inside complex residential transactions and commercial plots. Whether managing a custom detached mansion transition or orchestrating a duplex in-law suite build list in the GTA, Haroon delivers meticulous advice designed strictly to secure high-tier results.
              </p>
              <p className="text-slate-400 font-sans">
                "My mission is simple: to make client real estate objectives entirely clear, safe, and highly lucrative. No high-pressure sales pitches, just logical data patterns, transparent listings, and direct support."
              </p>
            </div>

            {/* Specialties Icon metrics row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-900">
              <div className="space-y-1.5">
                <div className="text-emerald-400 flex items-center gap-1">
                  <UserCheck className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-bold">Consultative</span>
                </div>
                <span className="text-xs text-slate-400 block font-light leading-normal">Obligation-free evaluations.</span>
              </div>
              <div className="space-y-1.5">
                <div className="text-emerald-400 flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-bold">Eminent</span>
                </div>
                <span className="text-xs text-slate-400 block font-light leading-normal">Top performance in HomeLife Superstars.</span>
              </div>
              <div className="space-y-1.5">
                <div className="text-emerald-400 flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-bold">Local GTA Expert</span>
                </div>
                <span className="text-xs text-slate-400 block font-light leading-normal">Rooted inside GTA enclaves.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Visual Partition Block 2: Interactive Review Slider (Testimonials) */}
        <div className="bg-neutral-950 border border-zinc-900 rounded-3xl p-6 sm:p-10 mb-24 shadow-xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">
            
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mb-6">
              <Quote className="w-6 h-6" />
            </div>

            {/* Testimonials Slideshow */}
            <div className="min-h-[170px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReviewIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <p className="font-serif italic text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto">
                    "{testimonials[activeReviewIdx].quote}"
                  </p>
                  <div>
                    <h4 className="text-sm font-semibold text-white tracking-wide font-sans">
                      {testimonials[activeReviewIdx].name}
                    </h4>
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-sans font-semibold mt-0.5 block">
                      Verified Client &bull; {testimonials[activeReviewIdx].location}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Switch Arrows */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={prevReview}
                className="p-3 bg-black border border-zinc-800 hover:border-emerald-500 text-slate-400 hover:text-white rounded-full transition-colors focus:outline-none cursor-pointer"
                title="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveReviewIdx(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeReviewIdx === idx ? 'w-5 bg-emerald-500' : 'w-2 bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextReview}
                className="p-3 bg-black border border-zinc-800 hover:border-emerald-500 text-slate-400 hover:text-white rounded-full transition-colors focus:outline-none cursor-pointer"
                title="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Visual Partition Block 3: Interactive Collapsible FAQ Area */}
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-emerald-400">
                <HelpCircle className="w-5 h-5" />
              </div>
            </div>
            <h3 className="font-serif text-2xl text-white font-medium tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 font-light">
              Clarify procedural real estate, valuation, and transaction tax topics in Ontario.
            </p>
          </div>

          <div id="faq-accordions" className="space-y-4">
            {faqQuestions.map((item, idx) => {
              const isOpen = expandedFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-neutral-950 border border-zinc-900 hover:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left py-5 px-6 flex items-center justify-between font-serif text-sm sm:text-base font-semibold text-white focus:outline-none cursor-pointer hover:bg-neutral-900/45"
                  >
                    <span>{item.question}</span>
                    <div className="ml-4 flex-shrink-0 text-emerald-400">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden bg-black/20 border-t border-zinc-900"
                      >
                        <p className="px-6 py-5 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
