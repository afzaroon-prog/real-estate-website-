import React from 'react';
import { motion } from 'motion/react';
import { 
  Award, ShieldCheck, Languages, Calendar, Briefcase, 
  TrendingUp, Users, HeartHandshake, MapPin, BadgeCheck,
  Phone, Mail, CheckCircle2, ChevronRight
} from 'lucide-react';
// @ts-ignore
import haroonPortrait from '../assets/images/haroon_portrait_1781030027352.png.png';

interface ProfileProps {
  onNavigate: (sectionId: string) => void;
}

export default function Profile({ onNavigate }: ProfileProps) {
  const specializations = [
    {
      title: 'Residential Listing Strategy',
      desc: 'Executing custom-tailored marketing protocols, staging advice, and pricing indexes to secure top market values.',
      icon: Briefcase
    },
    {
      title: 'First-Time Buyer Guidance',
      desc: 'Expert steering through financing, CMHC qualifiers, hidden fees, and Ontario Land Transfer Tax rebates.',
      icon: HeartHandshake
    },
    {
      title: 'Multi-Unit & In-Law Suites',
      desc: 'Sourcing and listing properties with secondary suites or duplex layouts (such as separate side entries in the GTA) for rental yield or family co-habitation.',
      icon: TrendingUp
    },
    {
      title: 'GTA Market Assessments',
      desc: 'Formulating rigorous, data-driven Comparative Market Analysis (CMA) reports anchored on real-time sub-market indicators.',
      icon: Award
    }
  ];

  const credentials = [
    'Registered Real Estate Broker under RECO (Real Estate Council of Ontario)',
    'Active Member of TRREB (Toronto Regional Real Estate Board)',
    'Proud Member of OREA (Ontario Real Estate Association)',
    'Proud Member of CREA (Canadian Real Estate Association)',
    'Elite Top-Producer at HomeLife Superstars Real Estate Ltd. Brokerage',
    'Recognized Local Specialist for Toronto, Mississauga, Brampton & the general GTA'
  ];

  const languages = [
    { code: 'EN', name: 'English', level: 'Native / Professional' },
    { code: 'UR', name: 'Urdu', level: 'Fluent / Core Community Native' },
    { code: 'PB', name: 'Punjabi', level: 'Fluent / Conversational Expert' },
    { code: 'HI', name: 'Hindi', level: 'Fluent / Conversational' }
  ];

  return (
    <div id="profile-container" className="pt-28 pb-24 bg-black relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Simple Breadcrumb-style Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-emerald-500/80 uppercase font-bold tracking-widest mb-6">
          <span>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">Broker Profile</span>
        </div>

        {/* Section 1: Split Intro Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-20">
          
           {/* Column 1: Portrait & Core Metrics Card (L: 5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-zinc-900 bg-zinc-950 shadow-2xl">
              <img
                src={haroonPortrait}
                alt="Haroon Afzal Broker portrait"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              {/* Bottom Card Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-black/90 backdrop-blur-md p-5 rounded-xl border border-zinc-900 shadow-lg">
                <div className="text-emerald-400 font-bold text-xs uppercase tracking-widest font-sans mb-1 flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  Haroon Afzal
                </div>
                <div className="text-xs text-slate-300 font-sans font-light tracking-wide">
                  Licensed Real Estate Broker &bull; Ontario
                </div>
                <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-1">
                  HomeLife Superstars Real Estate Ltd. Brokerage
                </div>
              </div>
            </div>

            {/* Quick Metrics Multi-Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-center">
                <span className="block text-2xl font-extrabold text-white font-serif">20+</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block mt-1 font-sans">Years Active</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-center">
                <span className="block text-2xl font-extrabold text-white font-serif">100%</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block mt-1 font-sans">Client Care</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-center">
                <span className="block text-2xl font-extrabold text-white font-serif">GTA</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block mt-1 font-sans">Core Focus</span>
              </div>
            </div>

            {/* Direct Connect Card */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4">
              <h4 className="font-serif text-base text-white font-medium">Connect Direct with Haroon</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Leverage immediate advice directly from a licensed Broker without passing through junior assistants.
              </p>
              <div className="space-y-2.5 pt-2">
                <a 
                  href="tel:+16472974080" 
                  className="flex items-center gap-2 text-xs text-slate-300 hover:text-emerald-400 transition-colors bg-black p-3 rounded-lg border border-zinc-900 hover:border-emerald-500/25 cursor-pointer font-sans font-semibold whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <span className="whitespace-nowrap">Call: 647-297-4080</span>
                </a>
                <a 
                  href="mailto:info@haroonafzal.com" 
                  className="flex items-center gap-2 text-xs text-slate-300 hover:text-emerald-400 transition-colors bg-black p-3 rounded-lg border border-zinc-900 hover:border-emerald-500/25 cursor-pointer font-sans"
                >
                  <Mail className="w-4 h-4 text-emerald-500" />
                  <span>Email: info@haroonafzal.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Narrative Biography & Philosophy (R: 7 columns) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Official Real Estate Broker Profile
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl text-white font-medium tracking-tight mt-2 leading-tight">
                My Promise: Clear Diagnostics, Strategic Advantage
              </h1>
              <p className="text-lg text-slate-300 font-light font-serif italic">
                "Real estate transactions are highly complex capital exchanges. You deserve meticulous, data-driven strategy — not high-pressure sales narratives."
              </p>
            </div>

            {/* Narrative Blocks */}
            <div className="space-y-5 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              <p>
                As a fully registered and veteran Real Estate Broker specializing in **Toronto, Mississauga, Brampton, Vaughan, and the wider GTA**, Haroon Afzal has built a sterling professional reputation anchored in absolute structural integrity, precise contractual execution, and deep analytical market insight.
              </p>
              <p>
                Representing the prominent brokerage **HomeLife Superstars Real Estate Ltd., Brokerage**, Haroon does not simply list properties — he crafts customized transactional plans. From locating robust equity in detached homes in the GTA to organizing detached family dwellings with high-yield separate legal suite entries, his focus centers on shielding clients from costly errors while capitalizing on local market gains.
              </p>
              <p>
                Haroon's clients benefit from an extensive framework of sub-market diagnostics. Instead of speculating on home values, he provides a meticulous Comparative Market Analysis (CMA) report to help list clients price with confidence, and buyer clients purchase at mathematically sound thresholds.
              </p>
            </div>

            {/* Sub-section: Multi-lingual Advantage */}
            <div className="space-y-4 pt-4 border-t border-zinc-900">
              <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
                <Languages className="w-5 h-5 text-emerald-500" />
                Multi-Lingual Community Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                By acknowledging that real estate negotiations require deep semantic and cultural resonance, Haroon conducts and closes transactions fluently across multiple community languages.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {languages.map((lang) => (
                  <div key={lang.code} className="bg-zinc-950 border border-zinc-900 p-3.5 rounded-xl text-center">
                    <span className="block text-sm font-bold text-emerald-400 font-sans tracking-wide">{lang.name}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-section: Compliance & Accreditations list */}
            <div className="space-y-4 pt-6 border-t border-zinc-900">
              <h3 className="font-serif text-lg text-white font-medium flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                Licensure & Compliance Accreditations
              </h3>
              <div className="grid sm:grid-cols-2 gap-3.5">
                {credentials.map((cred, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-400 leading-normal font-light">
                      {cred}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Section 2: Specialty Areas Bento-Grid */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest font-mono">My Specialties</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium tracking-tight mt-1">
              Core Practice Practice Specializations
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specializations.map((spec, idx) => {
              const IconComp = spec.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-4 hover:border-emerald-500/20 transition-all group hover:bg-zinc-900"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base text-white font-medium tracking-wide">
                    {spec.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    {spec.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Professional Call to Action Banner */}
        <div className="bg-gradient-to-r from-zinc-950 to-black border border-zinc-900 rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-zinc-900/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium tracking-tight">
              Ready to Align your Real Estate Direction?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light">
              Whether you need to register a custom search matching notification via the personalized **Area Alert**, prepare an official **Comparative Market Evaluation (CMA)** for your listing, or simply consult on mortgage options—I am here to protect your equity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('evaluation')}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer"
              >
                Request Free CMA Evaluation
              </button>
              <button
                onClick={() => onNavigate('alert')}
                className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-zinc-900 border border-zinc-900 hover:border-emerald-500/40 text-emerald-400 font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                Activate Area Alerts
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
