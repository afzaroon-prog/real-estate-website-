import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, BedDouble, Bath, MapPin, 
  ArrowRight, Phone, Calendar, CheckCircle2,
  ChevronLeft, ChevronRight, X, Sparkles, ShieldCheck,
  Search, SlidersHorizontal, MessageSquare, ChevronDown
} from 'lucide-react';
import { haroonFeaturedListings } from '../data';
import { Listing } from '../types';

interface FeaturedListingsProps {
  onNavigate: (sectionId: string) => void;
}

export default function FeaturedListings({ onNavigate }: FeaturedListingsProps) {
  const [listings, setListings] = useState<Listing[]>(haroonFeaturedListings);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(9);

  // Fetch live MLS data from API to ensure live pricing, photos, and status
  useEffect(() => {
    let isMounted = true;
    async function fetchLiveFeatured() {
      try {
        setLoading(true);
        const res = await fetch('/api/listings?featured=true');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.listings && data.listings.length > 0) {
            setListings(data.listings);
          }
        }
      } catch (err) {
        console.log('Using verified local MLS portfolio cache for featured listings');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchLiveFeatured();
    return () => { isMounted = false; };
  }, []);

  // Compute city counts
  const cityCounts = useMemo(() => {
    const counts: { [key: string]: number } = {
      All: listings.length,
      Brampton: 0,
      Toronto: 0,
      Mississauga: 0,
      Oakville: 0
    };
    listings.forEach(l => {
      const c = (l.city || '').toLowerCase();
      if (c.includes('brampton')) counts.Brampton++;
      else if (c.includes('toronto')) counts.Toronto++;
      else if (c.includes('mississauga')) counts.Mississauga++;
      else if (c.includes('oakville')) counts.Oakville++;
    });
    return counts;
  }, [listings]);

  // Filter listings based on active city, property type, and search query
  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      // City filter
      if (selectedCity !== 'All') {
        const c = (l.city || '').toLowerCase();
        if (!c.includes(selectedCity.toLowerCase())) return false;
      }

      // Property type filter
      if (selectedType !== 'All') {
        if (selectedType === 'residential' && l.type !== 'residential') return false;
        if (selectedType === 'condo' && l.type !== 'condo') return false;
        if (selectedType === 'townhome' && l.type !== 'townhome') return false;
        if (selectedType === 'commercial' && l.type !== 'commercial') return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = (l.title || '').toLowerCase().includes(q);
        const matchAddr = (l.address || '').toLowerCase().includes(q);
        const matchMls = (l.id || '').toLowerCase().includes(q);
        const matchCity = (l.city || '').toLowerCase().includes(q);
        if (!matchTitle && !matchAddr && !matchMls && !matchCity) return false;
      }

      return true;
    });
  }, [listings, selectedCity, selectedType, searchQuery]);

  // Reset pagination when filter criteria changes
  useEffect(() => {
    setVisibleCount(9);
  }, [selectedCity, selectedType, searchQuery]);

  const displayedListings = filteredListings.slice(0, visibleCount);

  const openModal = (listing: Listing) => {
    setSelectedListing(listing);
    setActivePhotoIdx(0);
  };

  const closeModal = () => {
    setSelectedListing(null);
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedListing || !selectedListing.images) return;
    setActivePhotoIdx((prev) => (prev + 1) % selectedListing.images.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedListing || !selectedListing.images) return;
    setActivePhotoIdx((prev) => (prev - 1 + selectedListing.images.length) % selectedListing.images.length);
  };

  const formatPrice = (listing: Listing) => {
    if (listing.status === 'for-lease') {
      return `$${listing.price.toLocaleString()} / mo`;
    }
    return `$${listing.price.toLocaleString()}`;
  };

  const cityTabs = [
    { id: 'All', label: 'All Portfolio', count: cityCounts.All },
    { id: 'Brampton', label: 'Brampton', count: cityCounts.Brampton },
    { id: 'Toronto', label: 'Toronto', count: cityCounts.Toronto },
    { id: 'Mississauga', label: 'Mississauga', count: cityCounts.Mississauga },
    { id: 'Oakville', label: 'Oakville', count: cityCounts.Oakville },
  ];

  return (
    <section id="haroon-featured-listings" className="py-24 bg-black border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Exclusive Broker &amp; Brokerage Portfolio
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight">
              Featured Listings by Haroon Afzal
            </h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-2xl font-light">
              Direct personal listings and premier active for-sale properties from <strong className="text-white font-medium">HomeLife Superstars Real Estate Ltd., Brokerage</strong> across Brampton, Toronto, Mississauga, and Oakville.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('listings')}
              className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-900 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              Browse All TRREB MLS®
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
            <a
              href="tel:+16472974080"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs tracking-wide transition-all flex items-center gap-2 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              Direct: 647-297-4080
            </a>
          </div>
        </div>

        {/* City Filter Navigation Bar */}
        <div className="bg-neutral-950/80 border border-zinc-800/80 rounded-2xl p-2.5 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* City Segmented Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {cityTabs.map(tab => {
              const isActive = selectedCity === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCity(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-bold' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-zinc-850 text-zinc-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Filters / Search */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Property Type Dropdown */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-black/80 text-zinc-300 text-xs rounded-xl px-3 py-2 border border-zinc-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="All">All Property Types</option>
              <option value="residential">Detached &amp; Freehold</option>
              <option value="condo">Condo Apartments</option>
              <option value="townhome">Townhouses</option>
              <option value="commercial">Commercial &amp; Business</option>
            </select>

            {/* Keyword Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search street, MLS®..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/80 text-zinc-300 placeholder-zinc-500 text-xs rounded-xl pl-8 pr-3 py-2 border border-zinc-800 focus:outline-none focus:border-emerald-500 w-36 sm:w-44"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Listings Count Bar */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-6 px-1">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-white">{displayedListings.length}</strong> of <strong className="text-white">{filteredListings.length}</strong> active properties</span>
            {selectedCity !== 'All' && (
              <span className="text-zinc-500">&bull; in {selectedCity}</span>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-zinc-400 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Live TRREB MLS® Feed Active</span>
          </div>
        </div>

        {/* Listings Cards Grid */}
        {displayedListings.length === 0 ? (
          <div className="text-center py-20 bg-neutral-950 rounded-2xl border border-zinc-900">
            <Building2 className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-serif text-white">No properties matched this filter</h3>
            <p className="text-zinc-400 text-xs mt-1">Try resetting the city or property type filters.</p>
            <button
              onClick={() => { setSelectedCity('All'); setSelectedType('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-xs text-emerald-400 rounded-xl border border-zinc-800 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedListings.map((item) => {
              const isLease = item.status === 'for-lease';
              const isDirect = item.isExclusive || item.id === 'W13585394' || item.id === 'W13763512' || item.id === 'X13589254';

              return (
                <div
                  key={item.id}
                  className={`bg-neutral-950 rounded-2xl overflow-hidden border transition-all duration-300 shadow-xl group flex flex-col justify-between ${
                    isDirect 
                      ? 'border-amber-500/40 ring-1 ring-amber-500/20 hover:border-amber-500/70' 
                      : 'border-zinc-900 hover:border-zinc-700/80'
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden aspect-[16/10] bg-zinc-900 cursor-pointer" onClick={() => openModal(item)}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="bg-black/80 backdrop-blur-md text-[11px] font-mono text-emerald-400 font-bold px-2.5 py-1 rounded-md border border-emerald-500/30 shadow-md">
                        MLS® {item.id}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        {isDirect ? (
                          <span className="bg-gradient-to-r from-amber-500/90 to-amber-600/90 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
                            ★ Direct Listing
                          </span>
                        ) : (
                          <span className="bg-black/75 backdrop-blur-md text-zinc-300 border border-zinc-700/70 text-[10px] font-medium tracking-wider px-2 py-0.5 rounded-md">
                            Superstars Portfolio
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom City / Type Tag on Image */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white/95 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.city}, Ontario</span>
                    </div>

                    {/* Photo count indicator */}
                    {item.images && item.images.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-[10px] text-zinc-300 px-2 py-0.5 rounded border border-zinc-800">
                        {item.images.length} Photos
                      </div>
                    )}
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Price Header */}
                      <div className="flex items-baseline justify-between mb-1.5">
                        <span className="text-2xl font-bold font-sans text-white tracking-tight">
                          {formatPrice(item)}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">
                          {item.propertySubType || item.type}
                        </span>
                      </div>

                      {/* Title & Address */}
                      <h3 className="font-serif text-lg font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 font-light line-clamp-1">
                        {item.address}
                      </p>

                      {/* Key Specs Bar */}
                      <div className="grid grid-cols-3 gap-2 py-3 mt-4 border-y border-zinc-900/80 text-xs text-zinc-300">
                        {item.beds > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <BedDouble className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{item.beds} Beds</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="truncate">{item.type === 'commercial' ? 'Commercial' : 'Property'}</span>
                          </div>
                        )}

                        {item.baths > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <Bath className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{item.baths} Baths</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-zinc-500">
                            <span>—</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="truncate">{item.city}</span>
                        </div>
                      </div>

                      {/* Remarks snippet */}
                      <p className="text-xs text-zinc-400 font-light mt-3 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => openModal(item)}
                        className="flex-1 py-2.5 px-3 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 hover:text-white text-xs font-semibold rounded-xl transition-colors border border-zinc-800 text-center cursor-pointer"
                      >
                        View Details &amp; Photos
                      </button>
                      <button
                        onClick={() => {
                          openModal(item);
                        }}
                        className="py-2.5 px-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Book Showing
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredListings.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 9)}
              className="px-8 py-3.5 bg-neutral-950 hover:bg-neutral-900 text-white font-semibold text-xs rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Load More Properties</span>
              <span className="text-zinc-500">({filteredListings.length - visibleCount} remaining)</span>
              <ChevronDown className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        )}

        {/* Verification banner */}
        <div className="mt-14 p-5 rounded-2xl bg-neutral-950/90 border border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-3 text-zinc-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-medium text-white">
                Direct Buyer Representation by <strong>Haroon Afzal, Broker</strong>
              </p>
              <p className="text-[11px] text-zinc-400 font-light mt-0.5">
                HomeLife Superstars Real Estate Ltd., Brokerage &bull; Authorized TRREB MLS® Real-Time Feed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/16472974080?text=Hi%20Haroon,%20I'm%20interested%20in%20one%20of%20your%20featured%20listings"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-emerald-400 font-semibold rounded-xl border border-zinc-800 flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp
            </a>
            <a
              href="tel:+16472974080"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              Call 647-297-4080
            </a>
          </div>
        </div>

      </div>

      {/* High-Resolution Details & Photo Gallery Lightbox Modal */}
      <AnimatePresence>
        {selectedListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-neutral-950 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative my-auto"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center border border-zinc-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Body */}
              <div className="overflow-y-auto flex-1 p-6 space-y-6">
                
                {/* Photo Carousel */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-black border border-zinc-900 group">
                  <img
                    src={selectedListing.images ? selectedListing.images[activePhotoIdx] : selectedListing.imageUrl}
                    alt={selectedListing.title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />

                  {/* Left/Right Carousel arrows */}
                  {selectedListing.images && selectedListing.images.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center border border-zinc-700 transition-colors cursor-pointer opacity-85 hover:opacity-100"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center border border-zinc-700 transition-colors cursor-pointer opacity-85 hover:opacity-100"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-zinc-800">
                        {activePhotoIdx + 1} / {selectedListing.images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Photo Thumbnails */}
                {selectedListing.images && selectedListing.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {selectedListing.images.map((imgUrl, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePhotoIdx(i)}
                        className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          activePhotoIdx === i ? 'border-emerald-500 scale-105' : 'border-zinc-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Details Section */}
                <div className="border-t border-zinc-900 pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="bg-emerald-500/10 text-emerald-400 font-mono text-xs px-2.5 py-0.5 rounded border border-emerald-500/30">
                          MLS® {selectedListing.id}
                        </span>
                        <span className="text-xs uppercase tracking-wider text-zinc-400">
                          {selectedListing.status === 'for-lease' ? 'For Lease' : 'For Sale'} &bull; {selectedListing.city}
                        </span>
                        {selectedListing.isExclusive && (
                          <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded border border-amber-500/30 font-semibold">
                            Direct Representation
                          </span>
                        )}
                      </div>
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                        {selectedListing.title}
                      </h2>
                      <p className="text-zinc-400 text-sm flex items-center gap-1.5 mt-1">
                        <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                        {selectedListing.address}, {selectedListing.city}, Ontario
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-3xl font-extrabold text-emerald-400 font-sans">
                        {formatPrice(selectedListing)}
                      </div>
                      <span className="text-xs text-zinc-500">Official TRREB MLS® Price</span>
                    </div>
                  </div>

                  {/* Specs Pill row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-zinc-900 my-4 text-xs">
                    <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850">
                      <span className="text-zinc-500 block mb-1">Property Style</span>
                      <span className="font-semibold text-white capitalize">{selectedListing.propertySubType || selectedListing.type}</span>
                    </div>
                    <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850">
                      <span className="text-zinc-500 block mb-1">Bedrooms</span>
                      <span className="font-semibold text-white">{selectedListing.beds > 0 ? selectedListing.beds : '—'}</span>
                    </div>
                    <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850">
                      <span className="text-zinc-500 block mb-1">Bathrooms</span>
                      <span className="font-semibold text-white">{selectedListing.baths > 0 ? selectedListing.baths : '—'}</span>
                    </div>
                    <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850">
                      <span className="text-zinc-500 block mb-1">Brokerage</span>
                      <span className="font-semibold text-white truncate block">HomeLife Superstars</span>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-zinc-200">Property Overview &amp; Public Remarks</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed font-light whitespace-pre-line">
                      {selectedListing.description}
                    </p>
                  </div>

                  {/* Features highlights */}
                  {selectedListing.features && selectedListing.features.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-900">
                      <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Highlights</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedListing.features.map((feat, idx) => (
                          <span key={idx} className="bg-zinc-900 text-zinc-300 text-xs px-2.5 py-1 rounded-lg border border-zinc-800">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Schedule / Contact Agent Box */}
                  <div className="mt-6 p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Interested in this property?</div>
                        <div className="text-sm text-white font-medium mt-0.5">
                          Schedule a private showing or request complete disclosure with <strong>Haroon Afzal</strong>.
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <a
                          href={`https://wa.me/16472974080?text=Hi%20Haroon,%20I'm%20interested%20in%20MLS%C2%AE%20${selectedListing.id}%20at%20${encodeURIComponent(selectedListing.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-semibold rounded-xl border border-zinc-700 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                        <a
                          href="tel:+16472974080"
                          className="flex-1 sm:flex-initial px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold border border-zinc-700 flex items-center justify-center gap-2 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          Call: 647-297-4080
                        </a>
                        <button
                          onClick={() => {
                            closeModal();
                            onNavigate('contact');
                          }}
                          className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg whitespace-nowrap"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          Book Showing
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
