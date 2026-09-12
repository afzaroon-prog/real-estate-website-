import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Listings from './components/Listings';
import Calculators from './components/Calculators';
import EvaluationForm from './components/EvaluationForm';
import AreaAlertForm from './components/AreaAlertForm';
import ContactSection from './components/ContactSection';
import AboutAndReviews from './components/AboutAndReviews';
import FeaturedListings from './components/FeaturedListings';
import Profile from './components/Profile';
import BuyingInfo from './components/BuyingInfo';
import SellingInfo from './components/SellingInfo';
import HomeLifeLogo from './components/HomeLifeLogo';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Phone, Mail } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');

  // Multi-route navigational controller
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div id="full-site-wrapper" className="min-h-screen bg-black text-slate-100 font-sans flex flex-col justify-between">
      
      {/* Universal Sticky Header Navigation */}
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Dynamic Workspace with page transitions */}
      <main className={`flex-grow ${activeSection !== 'home' ? 'pt-[155px] sm:pt-[175px] lg:pt-[145px] xl:pt-[135px]' : ''}`}>
        <AnimatePresence mode="wait">
          {activeSection === 'home' && (
            <motion.div
              key="home-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* 1. Immersive Hero Background Slider Dashboard */}
              <Hero onNavigate={handleNavigate} />

              {/* 2. Haroon Afzal's Featured Real MLS Listings */}
              <FeaturedListings onNavigate={handleNavigate} />

              {/* 3. About credentials, Broker Experience and Client Reviews */}
              <AboutAndReviews />

              {/* 3. Streamlined Contact Information deck */}
              <ContactSection />
            </motion.div>
          )}

          {activeSection === 'profile' && (
            <motion.div
              key="profile-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <Profile onNavigate={handleNavigate} />
            </motion.div>
          )}

          {activeSection === 'buying-info' && (
            <motion.div
              key="buying-info-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <BuyingInfo onNavigate={handleNavigate} />
            </motion.div>
          )}

          {activeSection === 'selling-info' && (
            <motion.div
              key="selling-info-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <SellingInfo onNavigate={handleNavigate} />
            </motion.div>
          )}

          {activeSection === 'listings' && (
            <motion.div
              key="listings-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <Listings />
            </motion.div>
          )}

          {activeSection === 'calculators' && (
            <motion.div
              key="calc-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <Calculators />
            </motion.div>
          )}

          {activeSection === 'evaluation' && (
            <motion.div
              key="eval-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <EvaluationForm />
            </motion.div>
          )}

          {activeSection === 'alert' && (
            <motion.div
              key="alert-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <AreaAlertForm />
            </motion.div>
          )}

          {activeSection === 'contact' && (
            <motion.div
              key="contact-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <ContactSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Structured Legal, Compliance and Contact Footer */}
      <footer id="main-footer" className="bg-black border-t border-zinc-900 pt-16 pb-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-zinc-900 pb-12 mb-10">
            
            {/* Branding Column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-lg">
                  HA
                </div>
                <span className="font-serif font-extrabold text-xl text-white">Haroon Afzal</span>
                <span className="text-[10px] font-sans font-bold bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 border border-emerald-500/25 rounded">
                  Broker
                </span>
              </div>
              <p className="text-slate-400 text-xs font-light max-w-sm leading-relaxed font-sans">
                Dedicated consultative real estate representation in Toronto & the GTA under HomeLife Superstars Real Estate Ltd., Brokerage. Providing precise valuation models and new listings matching alerts.
              </p>
              <div className="mt-3 h-32 flex items-center">
                <HomeLifeLogo variant="color" className="h-28 w-auto shadow-md" />
              </div>
              <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                Office: 23 Westmore Drive, Unit 102, Toronto, ON M9V 3Y7
              </div>
            </div>

            {/* Quick Navigation column */}
            <div className="space-y-3.5">
              <span className="block font-bold text-white uppercase text-[10px] tracking-wider font-sans">
                Real Estate Services
              </span>
              <div className="flex flex-col gap-2 font-medium">
                <button onClick={() => handleNavigate('listings')} className="text-left text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">
                  Browse Active Inventory
                </button>
                <button onClick={() => handleNavigate('evaluation')} className="text-left text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">
                  Comparative Valuation CMA
                </button>
                <button onClick={() => handleNavigate('alert')} className="text-left text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">
                  Personal Area Alert Signup
                </button>
                <button onClick={() => handleNavigate('calculators')} className="text-left text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">
                  Mortgage & LTT Calculators
                </button>
              </div>
            </div>

            {/* Contact quick targets */}
            <div className="space-y-3.5">
              <span className="block font-bold text-white uppercase text-[10px] tracking-wider font-sans">
                Professional Contact
              </span>
              <div className="flex flex-col gap-2">
                <a href="tel:+16472974080" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 font-sans font-semibold whitespace-nowrap">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="whitespace-nowrap">Direct: 647-297-4080</span>
                </a>
                <span className="text-slate-500 flex items-center gap-1.5 font-sans whitespace-nowrap">
                  Office: 416-740-4000
                </span>
                <a href="mailto:info@haroonafzal.com" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 font-sans whitespace-nowrap">
                  <Mail className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  info@haroonafzal.com
                </a>
              </div>
            </div>

          </div>

          {/* Legal Compliance Disclaimer block */}
          <div className="text-slate-500 text-[10px] space-y-4 leading-relaxed font-light font-sans max-w-5xl">
            <p>
              <strong>Broker Disclaimer Notice</strong>: Haroon Afzal is a fully licensed Real Estate Broker registered under RECO (Real Estate Council of Ontario) representing HomeLife Superstars Real Estate Ltd., Brokerage. Any properties, listings, and metadata detailed on this platform are deemed highly reliable but not fully guaranteed to match changing hourly market indexes.
            </p>
            <p>
              <strong>Solicitation Notice</strong>: The material contained within is intended purely as general real estate information. This is NOT an active solicitation of sellers, or buyers who are currently locked under exclusive written representation contracts with alternative real estate firms in Canada.
            </p>
            <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center text-slate-600 gap-4">
              <span className="whitespace-nowrap">&copy; 2026 Haroon Afzal, Real Estate Broker &bull; HomeLife Superstars Real Estate Ltd. Brokerage. All rights reserved.</span>
              <div className="flex items-center gap-4">
                <span className="hover:text-emerald-500 transition-colors cursor-help">RECO Registered</span>
                <span>ON CREA / OREA Compliant</span>
              </div>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
