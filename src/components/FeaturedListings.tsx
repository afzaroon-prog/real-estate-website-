import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, BedDouble, Bath, MapPin, 
  ArrowRight, Phone, Calendar, CheckCircle2,
  ChevronLeft, ChevronRight, X, ExternalLink,
  Sparkles, ShieldCheck
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

  // Fetch live MLS data from API to ensure current pricing and remarks
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
        console.log('Using verified local MLS cache for featured listings');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchLiveFeatured();
    return () => { isMounted = false; };
  }, []);

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

  return (
    <section id="haroon-featured-listings" className="py-24 bg-black border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Exclusive Broker Portfolio
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight">
              Featured Listings by Haroon Afzal
            </h2>
            <p className="text-zinc-400 text-sm mt-2 max-w-2xl font-light">
              Directly represented under <strong className="text-white font-medium">HomeLife Superstars Real Estate Ltd., Brokerage</strong>. Verified live TRREB MLS® data.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => onNavigate('listings')}
              className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-900 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              Browse All MLS Inventory
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Listings Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((item) => {
            const isLease = item.status === 'for-lease';
            return (
              <div
                key={item.id}
                className="bg-neutral-950 rounded-2xl overflow-hidden border border-zinc-900 hover:border-zinc-700/80 transition-all duration-300 shadow-xl group flex flex-col justify-between"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-black/80 backdrop-blur-md text-[11px] font-mono text-emerald-400 font-bold px-2.5 py-1 rounded-md border border-emerald-500/30 shadow-md">
                      MLS® {item.id}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border backdrop-blur-md shadow-md ${
                      isLease 
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' 
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {isLease ? 'For Lease' : 'For Sale'}
                    </span>
                  </div>

                  {/* Bottom City / Type Tag on Image */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white/90 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.city}, Ontario</span>
                  </div>

                  {/* Photo count indicator */}
                  {item.images && item.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-[10px] text-zinc-300 px-2 py-0.5 rounded border border-zinc-800">
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
                      <span className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">
                        {item.type}
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
                          <span>{item.type === 'commercial' ? 'Commercial' : 'Lot'}</span>
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
                      View Details & Gallery
                    </button>
                    <button
                      onClick={() => onNavigate('contact')}
                      className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap shadow-sm"
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

        {/* Verification banner */}
        <div className="mt-12 p-4 rounded-xl bg-neutral-950/80 border border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2.5 text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              All listings are exclusive to <strong>Haroon Afzal, Broker</strong> &bull; HomeLife Superstars Real Estate Ltd., Brokerage
            </span>
          </div>
          <a
            href="tel:+16472974080"
            className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5" />
            Call Direct: 647-297-4080
          </a>
        </div>

      </div>

      {/* High-Resolution Details & Photo Gallery Lightbox Modal */}
      <AnimatePresence>
        {selectedListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-neutral-950 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative my-auto"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-zinc-700 transition-colors cursor-pointer"
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
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-zinc-700 transition-colors cursor-pointer opacity-80 hover:opacity-100"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-zinc-700 transition-colors cursor-pointer opacity-80 hover:opacity-100"
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
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-emerald-500/10 text-emerald-400 font-mono text-xs px-2 py-0.5 rounded border border-emerald-500/30">
                          MLS® {selectedListing.id}
                        </span>
                        <span className="text-xs uppercase tracking-wider text-zinc-400">
                          {selectedListing.status === 'for-lease' ? 'For Lease' : 'For Sale'} &bull; {selectedListing.city}
                        </span>
                      </div>
                      <h2 className="font-serif text-2xl font-bold text-white">
                        {selectedListing.title}
                      </h2>
                      <p className="text-zinc-400 text-sm flex items-center gap-1.5 mt-1">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        {selectedListing.address}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-3xl font-extrabold text-emerald-400 font-sans">
                        {formatPrice(selectedListing)}
                      </div>
                      <span className="text-xs text-zinc-500">Official MLS Listing Price</span>
                    </div>
                  </div>

                  {/* Specs Pill row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-zinc-900 my-4 text-xs">
                    <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850">
                      <span className="text-zinc-500 block mb-1">Property Type</span>
                      <span className="font-semibold text-white capitalize">{selectedListing.type}</span>
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
                      <span className="text-zinc-500 block mb-1">City / Region</span>
                      <span className="font-semibold text-white">{selectedListing.city}</span>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-zinc-200">Property Overview & Features</h4>
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

                  {/* Footer CTAs */}
                  <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-zinc-400 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Represented exclusively by <strong>Haroon Afzal, Broker</strong></span>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <a
                        href="tel:+16472974080"
                        className="flex-1 sm:flex-initial px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold border border-zinc-700 flex items-center justify-center gap-2 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        Call: 647-297-4080
                      </a>
                      <button
                        onClick={() => {
                          closeModal();
                          onNavigate('contact');
                        }}
                        className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Book Showing Now
                      </button>
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
