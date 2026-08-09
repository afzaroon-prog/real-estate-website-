import React, { useState } from 'react';
import { HelpCircle, ChevronRight, ChevronLeft, Check, CheckCircle2, ShieldCheck, Home, FileText, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function EvaluationForm() {
  const [step, setStep] = useState<number>(1);
  
  // Evaluation Form State
  const [address, setAddress] = useState('');
  const [propertyType, setPropertyType] = useState('Detached House');
  const [beds, setBeds] = useState('4');
  const [baths, setBaths] = useState('3');
  
  const [sqft, setSqft] = useState('2000 - 2500');
  const [upgrades, setUpgrades] = useState('');
  const [timeline, setTimeline] = useState('1-3-months');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [contactMethod, setContactMethod] = useState('phone');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [honey, setHoney] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Nav actions
  const nextStep = () => {
    if (step === 1 && !address.trim()) return;
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;

    if (honey) {
      setIsSubmitted(true);
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
          "Form Type": "Free Home Evaluation Request",
          "Property Address": address,
          "Property Structure Type": propertyType,
          "Bedrooms": beds,
          "Bathrooms": baths,
          "Approximate Sq Footage": sqft,
          "Ideal Selling Timeline": timeline,
          "Upgrades & Condition": upgrades || "None listed",
          "Contact Name": name,
          "Email Address": email,
          "Phone Number": phone,
          "Preferred Contact Channel": contactMethod,
          _subject: `New Valuation Request: ${address}`,
          _captcha: "false",
          _honey: honey
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error("Failed to send submission. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while sending your request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setAddress('');
    setPropertyType('Detached House');
    setBeds('4');
    setBaths('3');
    setSqft('2000 - 2500');
    setUpgrades('');
    setTimeline('1-3-months');
    setName('');
    setEmail('');
    setPhone('');
    setContactMethod('phone');
    setHoney('');
    setStep(1);
    setIsSubmitted(false);
    setError(null);
  };

  return (
    <section id="evaluation-section" className="py-24 bg-black border-t border-zinc-900 relative overflow-hidden">
      
      {/* Background soft blur */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <div className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Sellers Advisory
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight">
            Free Professional Home Evaluation
          </h2>
          <p className="mt-3 text-sm text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            Planning to sell, or just curious about recent GTA market gains? Receive an official, obligation-free Comparative Market Analysis (CMA) report prepared directly by Haroon Afzal.
          </p>
        </div>

        {/* Wizard Panel */}
        <div className="bg-neutral-950 border border-zinc-900 p-6 sm:p-10 rounded-3xl shadow-2xl relative">
          
          {!isSubmitted ? (
            <>
              {/* Stepper Progress Indicator */}
              <div className="flex items-center justify-between mb-10 max-w-md mx-auto relative px-2">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black -translate-y-1/2 z-0" />
                <div
                  className="absolute top-1/2 left-0 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-300"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                />

                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      step >= 1 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-black border border-zinc-800 text-slate-500'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-2 text-slate-400 hidden sm:block">
                    Property Specs
                  </span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      step >= 2 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-black border border-zinc-800 text-slate-500'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-2 text-slate-400 hidden sm:block">
                    Details & Timeline
                  </span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      step >= 3 ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-black border border-zinc-800 text-slate-500'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-2 text-slate-400 hidden sm:block">
                    Contact Info
                  </span>
                </div>
              </div>

              {/* Wizard Form Content */}
              <form onSubmit={handleSubmit} className="space-y-6">
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
                
                {/* Step 1: Property Specs */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {/* Property Address */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
                        Property Street Address <span className="text-emerald-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. 123 Elmhurst Drive, Toronto, ON"
                        className="w-full bg-black border border-zinc-800 text-sm text-white py-3.5 px-4 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    {/* Property Type Grid */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                        Property Structure Type
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['Detached House', 'Semi-Detached', 'Townhouse', 'Condo / Apt'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setPropertyType(type)}
                            className={`py-3.5 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                              propertyType === type
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500'
                                : 'bg-black border-zinc-850 text-slate-400 hover:text-white hover:border-zinc-700'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Beds & Baths Choice */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
                          Bedrooms
                        </label>
                        <select
                          value={beds}
                          onChange={(e) => setBeds(e.target.value)}
                          className="w-full bg-black border border-zinc-800 text-sm text-slate-200 py-3.5 px-4 rounded-xl focus:outline-none cursor-pointer"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4 (Standard)</option>
                          <option value="5">5</option>
                          <option value="6+">6 or More</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
                          Bathrooms
                        </label>
                        <select
                          value={baths}
                          onChange={(e) => setBaths(e.target.value)}
                          className="w-full bg-black border border-zinc-800 text-sm text-slate-200 py-3.5 px-4 rounded-xl focus:outline-none cursor-pointer"
                        >
                          <option value="1">1</option>
                          <option value="1.5">1.5</option>
                          <option value="2">2</option>
                          <option value="3">3 (Standard)</option>
                          <option value="4">4</option>
                          <option value="5+">5 or More</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Details & Timeline */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {/* Approx Sqft */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
                        Approximate Sq Footage (Sq Ft)
                      </label>
                      <select
                        value={sqft}
                        onChange={(e) => setSqft(e.target.value)}
                        className="w-full bg-black border border-zinc-800 text-sm text-slate-200 py-3.5 px-4 rounded-xl focus:outline-none cursor-pointer"
                      >
                        <option value="Under 1000">Under 1,000</option>
                        <option value="1000 - 1500">1,000 - 1,500</option>
                        <option value="1500 - 2000">1,500 - 2,000</option>
                        <option value="2000 - 2500">2,000 - 2,500</option>
                        <option value="2500 - 3500">2,500 - 3,500</option>
                        <option value="3500 - 5000">3,500 - 5,000</option>
                        <option value="Over 5000">Over 5,000</option>
                      </select>
                    </div>

                    {/* Timeline Grid */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                        Ideal Selling Timeline
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { id: 'immediate', txt: 'Immediate' },
                          { id: '1-3-months', txt: '1-3 Months' },
                          { id: '3-6-months', txt: '3-6 Months' },
                          { id: 'just-curious', txt: 'Just Curious' }
                        ].map((tl) => (
                          <button
                            key={tl.id}
                            type="button"
                            onClick={() => setTimeline(tl.id)}
                            className={`py-3.5 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                              timeline === tl.id
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500'
                                : 'bg-black border-zinc-850 text-slate-400 hover:text-white hover:border-zinc-700'
                            }`}
                          >
                            {tl.txt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Upgrades Area */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
                        Upgrades, Condition or Features (Optional)
                      </label>
                      <textarea
                        value={upgrades}
                        onChange={(e) => setUpgrades(e.target.value)}
                        placeholder="e.g. Completed walk-out basement, upgraded master kitchen quartz island, brand new cedar deck..."
                        rows={4}
                        className="w-full bg-black border border-zinc-800 text-sm text-white py-3.5 px-4 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Contact Details */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                        Contact Name <span className="text-emerald-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-black border border-zinc-800 text-sm text-white py-3.5 px-4 rounded-xl focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                          Email Address <span className="text-emerald-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. john@example.com"
                          className="w-full bg-black border border-zinc-800 text-sm text-white py-3.5 px-4 rounded-xl focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                          Phone Number <span className="text-emerald-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 647-123-4567"
                          className="w-full bg-black border border-zinc-800 text-sm text-white py-3.5 px-4 rounded-xl focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Best Way to Reach */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
                        Preferred Contact Channel
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['phone', 'email', 'text', 'whatsapp'].map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setContactMethod(method)}
                            className={`py-3.5 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                              contactMethod === method
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500'
                                : 'bg-black border-zinc-850 text-slate-400 hover:text-white hover:border-zinc-700'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Disclosure details */}
                    <div className="flex items-start gap-2.5 p-3.5 bg-black/40 border border-zinc-850 rounded-xl mt-4">
                      <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-400 leading-normal font-light">
                        <strong>Privacy Safeguard</strong>: Your coordinates and contact metadata are securely saved and processed solely by Haroon Afzal representing HomeLife Superstars Real Estate. No automated spam or third-party lists occur.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Footer buttons row */}
                <div className="border-t border-zinc-900 pt-6 mt-8 flex justify-between items-center">
                  
                  {/* Left Back Arrow button */}
                  <div>
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="py-3 px-5 border border-zinc-800 hover:bg-zinc-900 rounded-xl font-semibold text-xs uppercase tracking-wider text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer outline-none"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </button>
                    )}
                  </div>

                  {/* Right Action button */}
                  <div className="flex flex-col items-end gap-2">
                    {error && (
                      <div className="text-rose-500 text-xs font-semibold mr-2 max-w-xs text-right">
                        {error}
                      </div>
                    )}
                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={step === 1 && !address.trim()}
                        className={`py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer outline-none ${
                          step === 1 && !address.trim()
                            ? 'bg-zinc-900 text-zinc-650 cursor-not-allowed'
                            : 'bg-emerald-500 hover:bg-emerald-400'
                        }`}
                      >
                        Continue
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`py-3.5 px-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer outline-none ${
                          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        {isSubmitting ? 'Submitting...' : 'Submit Evaluation Request'}
                      </button>
                    )}
                  </div>

                </div>

              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-6"
            >
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-white font-medium">Evaluation Request Submitted!</h3>
                <p className="text-sm text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
                  Thank you, <strong>{name}</strong>. Your property comparative market analysis files for <strong>{address}</strong> have been queued.
                </p>
              </div>

              {/* Review summary cards */}
              <div className="grid sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto bg-black p-5 rounded-2xl border border-zinc-850">
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase">Property Address</span>
                  <span className="text-xs text-white block mt-0.5 font-sans truncate font-medium">{address}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase">Layout Specs</span>
                  <span className="text-xs text-white block mt-0.5 font-sans font-medium">{beds} Beds / {baths} Baths ({propertyType})</span>
                </div>
                <div className="mt-2 text-left">
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase">Timeline Target</span>
                  <span className="text-xs text-emerald-400 block mt-0.5 capitalize font-medium">{timeline.replace('-', ' ')}</span>
                </div>
                <div className="mt-2 text-left">
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase">We'll Reach You via</span>
                  <span className="text-xs text-white block mt-0.5 capitalize font-medium">{contactMethod} &bull; {phone}</span>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-zinc-800 hover:bg-zinc-900 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-300 transition-colors cursor-pointer inline-block outline-none"
                >
                  Evaluate Another Property
                </button>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </section>
  );
}
