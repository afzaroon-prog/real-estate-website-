import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Building2, HelpCircle } from 'lucide-react';
import HomeLifeLogo from './HomeLifeLogo';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'profile', label: 'My Profile' },
    { id: 'buying-info', label: 'Buying Information' },
    { id: 'selling-info', label: 'Selling Information' },
    { id: 'listings', label: 'MLS® Live Search' },
    { id: 'calculators', label: 'Financial Tools' },
    { id: 'evaluation', label: 'Free Valuation' },
    { id: 'alert', label: 'Area Alert' },
    { id: 'contact', label: 'Contact Me' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      id="app-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-zinc-900 shadow-lg py-2'
          : 'bg-black/90 sm:bg-gradient-to-b sm:from-black/90 sm:to-black/30 py-3 sm:py-3.5 border-b border-zinc-900/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Branding */}
          <div
            id="navbar-branding"
            className="flex flex-col justify-center cursor-pointer max-w-[280px] sm:max-w-[340px] whitespace-nowrap"
            onClick={() => handleItemClick('home')}
          >
            <div className="flex flex-col">
              <span className="font-serif font-extrabold text-xl sm:text-2xl text-white leading-tight tracking-wide whitespace-nowrap">
                Haroon Afzal
              </span>
              <span className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-widest text-emerald-400 mt-0.5">
                Broker
              </span>
            </div>
            <div className="text-[9px] sm:text-[10px] font-sans text-slate-400 uppercase tracking-wider flex flex-col gap-0.5 mt-1">
              <div className="flex items-center gap-1">
                <Building2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-emerald-500/80" />
                HomeLife Superstars Real Estate Ltd. Brokerage
              </div>
              <HomeLifeLogo variant="color" className="h-14 sm:h-16 w-auto mt-1.5 shadow-md" />
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2.5 px-2 flex-grow justify-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`text-[10px] xl:text-[11px] font-bold uppercase tracking-wider transition-colors relative py-1.5 px-1.5 sm:px-2 rounded-md hover:bg-white/5 whitespace-nowrap ${
                  activeSection === item.id
                    ? 'text-emerald-400 bg-emerald-500/5'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-1.5 right-1.5 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Call Direct Action */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              id="call-us-button"
              href="tel:16472974080"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 outline-none hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs px-3.5 py-2.5 rounded-lg shadow-md transition-all border border-emerald-400/20 group hover:shadow-lg hover:shadow-emerald-500/10 whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
              <span className="whitespace-nowrap">Direct: 647-297-4080</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href="tel:16472974080"
              className="p-2 bg-slate-800 text-emerald-400 rounded-lg hover:bg-slate-700 sm:hidden transition-colors"
              title="Call Haroon"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="lg:hidden bg-black border-t border-zinc-850 px-4 pt-4 pb-6 shadow-2xl absolute w-full top-full left-0 animate-fade-in"
        >
          <div className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-item-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center ${
                  activeSection === item.id
                    ? 'bg-emerald-500/10 text-emerald-400 font-semibold border-l-2 border-emerald-500'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-3 px-4">
            <a
              href="tel:16472974080"
              className="flex items-center justify-center gap-2 w-full text-slate-950 bg-emerald-500 hover:bg-emerald-400 py-3 rounded-xl font-semibold text-center shadow-lg transition-all whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              <span className="whitespace-nowrap">Direct: 647-297-4080</span>
            </a>
            <div className="text-center text-[11px] text-slate-400 mt-2 font-sans flex flex-col items-center gap-2">
              <span>Office: 416-740-4000 &bull; HomeLife Superstars Real Estate Ltd.</span>
              <HomeLifeLogo variant="color" className="h-24 w-auto mt-1.5 shadow-md" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
