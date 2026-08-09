import React, { useState } from 'react';
import { Mail, Compass, HelpCircle, Check, MapPin, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { gtaCities } from '../data';

export default function AreaAlertForm() {
  const [selectedCities, setSelectedCities] = useState<string[]>(['GTA']);
  const [propType, setPropType] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(600000);
  const [maxPrice, setMaxPrice] = useState<number>(1500000);
  const [beds, setBeds] = useState<number>(3);

  // User details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [honey, setHoney] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCity = (city: string) => {
    if (selectedCities.includes(city)) {
      if (selectedCities.length > 1) {
        setSelectedCities(selectedCities.filter((c) => c !== city));
      }
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || selectedCities.length === 0) return;

    if (honey) {
      setSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("https://formsubmit.co/ajax/0f01e15ef17827af6cec81e95f27853b", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "Form Type": "Area/Listing Alerts Request",
          "Target Areas/Cities": selectedCities.join(', '),
          "Structure Category": propType,
          "Minimum Bedrooms": `${beds}+`,
          "Budget Range": `$${(minPrice / 1000).toLocaleString()}k to ${maxPrice >= 3000000 ? 'No Limit' : `$${(maxPrice / 1000).toLocaleString()}k`}`,
          "Recipient Name": name,
          "Email Address": email,
          "Phone Number": phone,
          _subject: `New Area Alert Request: ${selectedCities.join(', ')}`,
          _captcha: "false",
          _honey: honey
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error("Failed to activate alerts. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while setting up your alerts.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSelectedCities(['GTA']);
    setPropType('all');
    setMinPrice(600000);
    setMaxPrice(1500000);
    setBeds(3);
    setHoney('');
    setError(null);
    setSubmitted(false);
  };

  return (
    <section id="alert-section" className="py-24 bg-black border-t border-zinc-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Acquisition Alerts
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight">
            Personalized GTA Area Alerts
          </h2>
          <p className="mt-4 text-sm text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            Gain property listing advantages. Register your target criteria, budget thresholds, and desired neighborhood locations to immediately receive off-market listings and MLS alerts under-the-radar.
          </p>
        </div>

        {/* Form panel container */}
        <div className="bg-neutral-950 border border-zinc-900 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Honeypot field */}
              <input
                type="text"
                name="_honey"
                value={honey}
                onChange={(e) => setHoney(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />
              
              {/* Part 1: Target Locations (Multi-select pill filters) */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3.5 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  Select Specialty Areas (Pick at least one)
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {gtaCities.map((city) => {
                    const isSelected = selectedCities.includes(city);
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => toggleCity(city)}
                        className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                            : 'bg-black text-slate-400 border-zinc-850 hover:text-white hover:border-zinc-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {city}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Part 2: Layout & Type Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
                    Structure Category
                  </label>
                  <select
                    value={propType}
                    onChange={(e) => setPropType(e.target.value)}
                    className="w-full bg-black border border-zinc-850 text-sm text-slate-200 py-3.5 px-4 rounded-xl focus:outline-none cursor-pointer"
                  >
                    <option value="all">Any Property Category</option>
                    <option value="residential-detached">Detached House</option>
                    <option value="residential-semi">Semi-Detached / Link</option>
                    <option value="residential-town">Townhome</option>
                    <option value="residential-condo">Condominium / Penthouse</option>
                    <option value="commercial-office">Commercial Office / Plot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
                    Minimum Bedrooms
                  </label>
                  <div className="grid grid-cols-5 bg-black p-1.5 rounded-xl border border-zinc-850">
                    {[1, 2, 3, 4, 5].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBeds(b)}
                        className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          beds === b
                            ? 'bg-emerald-500 text-slate-950'
                            : 'text-slate-400 hover:text-white bg-transparent outline-none border-none'
                        }`}
                      >
                        {b}+
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Part 3: Budget Range sliders */}
              <div className="grid sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2.5">
                    <span>MINIMUM BUDGET</span>
                    <span className="font-mono text-emerald-400 font-bold">${(minPrice / 1000).toLocaleString()}k</span>
                  </div>
                  <input
                    type="range"
                    min={300000}
                    max={2000000}
                    step={50000}
                    value={minPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setMinPrice(val);
                      if (val >= maxPrice) setMaxPrice(val + 50000);
                    }}
                    className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2.5">
                    <span>MAXIMUM LIMIT</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {maxPrice >= 3000000 ? 'No Limit' : `$${(maxPrice / 1000).toLocaleString()}k`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={minPrice + 50000}
                    max={3000000}
                    step={50000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              {/* Part 4: Personal Coordinates */}
              <div className="border-t border-zinc-900 pt-6 space-y-5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest">
                  Recipient Information
                </label>
                
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full bg-black border border-zinc-850 text-xs text-white p-3.5 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full bg-black border border-zinc-850 text-xs text-white p-3.5 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number"
                      className="w-full bg-black border border-zinc-850 text-xs text-white p-3.5 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 text-center sm:text-right flex flex-col items-center sm:items-end gap-2.5">
                {error && (
                  <div className="text-rose-500 text-xs font-semibold max-w-sm text-center sm:text-right">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 outline-none hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/10 transition-all inline-flex items-center gap-2 cursor-pointer ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  {isSubmitting ? 'Activating Alerts...' : 'Activate New Listing Alerts'}
                </button>
              </div>

            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-6"
            >
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-white font-medium">Area Alert Activated!</h3>
                <p className="text-sm text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
                  Congratulations <strong>{name}</strong>! You are now subscribed to get real-time lists. We will monitor the local registers closely for homes matching your parameters.
                </p>
              </div>

              {/* Summary specifications card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto bg-black p-5 rounded-2xl border border-zinc-850/60 text-xs">
                <div>
                  <span className="block text-slate-500 font-semibold uppercase tracking-wider">Target Enclaves</span>
                  <span className="text-white font-medium block mt-0.5 truncate">{selectedCities.join(', ')}</span>
                </div>
                <div>
                  <span className="block text-slate-500 font-semibold uppercase tracking-wider">Budget Scale</span>
                  <span className="text-white font-mono font-medium block mt-0.5">
                    ${(minPrice / 1000).toLocaleString()}k to {maxPrice >= 3000000 ? 'No Limit' : `$${(maxPrice / 1000).toLocaleString()}k`}
                  </span>
                </div>
                <div className="mt-2 text-left">
                  <span className="block text-slate-500 font-semibold uppercase tracking-wider">Bedrooms Filter</span>
                  <span className="text-white font-medium block mt-0.5">{beds}+ Bedrooms Required</span>
                </div>
                <div className="mt-2 text-left">
                  <span className="block text-slate-500 font-semibold uppercase tracking-wider">Recipient Contact</span>
                  <span className="text-emerald-400 font-medium block mt-0.5">{email} &bull; {phone}</span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border border-zinc-800 hover:bg-zinc-800 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-350 transition-colors cursor-pointer inline-block outline-none"
                >
                  Configure Another Alert
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}
