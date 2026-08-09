import React, { useState } from 'react';
import { Mail, Phone, Printer, MapPin, Building2, Send, CheckCircle2, Navigation, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [msg, setMsg] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [honey, setHoney] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !subject.trim() || !msg.trim()) return;
    
    if (honey) {
      setIsSent(true);
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
          name: name,
          email: email,
          phone: phone,
          subject: subject,
          message: msg,
          _subject: `New HomeLife Contact: ${subject}`,
          _captcha: "false",
          _honey: honey
        })
      });

      if (response.ok) {
        setIsSent(true);
      } else {
        throw new Error("Failed to send message. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while sending your message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMsg('');
    setHoney('');
    setIsSent(false);
    setError(null);
  };

  return (
    <section id="contact-section" className="py-24 bg-black border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section header */}
        <div className="max-w-3xl mb-16">
          <div className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Inquire or Connect
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight">
            Schedule an Appointment with Haroon
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 font-light leading-relaxed">
            Have questions about listed properties, buying opportunities, or marketing commissions? Call direct, write an email, or visit our local brokerage headquarters in Toronto.
          </p>
        </div>

        {/* Outer Split layout */}
        <div id="contact-split" className="grid p-0 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Coordinates & Visual Map (5 cols) */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            
            {/* Quick Contact Deck */}
            <div className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-900 shadow-xl space-y-6">
              
              <h3 className="font-serif text-xl text-white font-medium mb-2 border-b border-zinc-905 pb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-500" />
                Office Headquarters
              </h3>

              <div className="space-y-4.5">
                {/* Physical Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-emerald-400 flex-shrink-0 border border-zinc-900">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Office Address</span>
                    <span className="text-slate-300 text-sm font-medium leading-relaxed block mt-0.5">
                      HomeLife Superstars Real Estate Ltd., Brokerage<br />
                      23 Westmore Drive, Unit 102<br />
                      Toronto, Ontario M9V 3Y7
                    </span>
                  </div>
                </div>

                {/* Direct Phone */}
                <a href="tel:+16472974080" className="flex items-start gap-4 hover:bg-zinc-900/40 p-1.5 -m-1.5 rounded-xl transition-all group">
                   <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-emerald-400 flex-shrink-0 border border-zinc-900 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Direct Mobile Line</span>
                    <span className="text-white text-base font-bold block mt-0.5 group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                      647-297-4080
                    </span>
                  </div>
                </a>

                {/* Office Line */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-emerald-400 flex-shrink-0 border border-zinc-900">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Brokerage Office</span>
                    <span className="text-slate-300 text-sm font-medium block mt-0.5 whitespace-nowrap">
                      416-740-4000
                    </span>
                  </div>
                </div>

                {/* Fax Line */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-emerald-400 flex-shrink-0 border border-zinc-900">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Fax Number</span>
                    <span className="text-slate-300 text-sm font-medium block mt-0.5 whitespace-nowrap">
                      416-740-8314
                    </span>
                  </div>
                </div>

                {/* Email Address */}
                <a href="mailto:info@haroonafzal.com" className="flex items-start gap-4 hover:bg-zinc-900/40 p-1.5 -m-1.5 rounded-xl transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-emerald-400 flex-shrink-0 border border-zinc-900 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Brokerage Email</span>
                    <span className="text-slate-300 text-sm font-medium block mt-0.5 group-hover:text-emerald-400 transition-colors">
                      info@haroonafzal.com
                    </span>
                  </div>
                </a>
              </div>

            </div>

            {/* Visual Interactive Map Representation */}
            <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-3xl relative overflow-hidden h-64 flex flex-col justify-between shadow-lg">
              
              {/* Map grid lines SVG decoration */}
              <div className="absolute inset-0 bg-[radial-gradient(#27272a_1.5px,transparent_1px)] [background-size:16px_16px] opacity-35" />
              
              {/* Fake road SVG paths representing Toronto coordinates */}
              <div className="absolute inset-0 z-0">
                <svg className="w-full h-full text-zinc-800/40" xmlns="http://www.w3.org/2000/svg">
                  {/* Highway 27 / Westmore road paths */}
                  <line x1="10%" y1="0%" x2="40%" y2="100%" stroke="currentColor" strokeWidth="8" />
                  <line x1="0%" y1="30%" x2="100%" y2="80%" stroke="currentColor" strokeWidth="6" />
                  <line x1="0%" y1="60%" x2="100%" y2="20%" stroke="currentColor" strokeWidth="4" strokeDasharray="5,5" />
                  {/* Humber river contour representation */}
                  <path d="M 0 10 Q 150 180 300 120 T 500 240" fill="none" stroke="#2563eb" strokeWidth="4" className="opacity-20 paint-order-normal" />
                </svg>
              </div>

              {/* Pin marker container */}
              <div className="absolute top-[45%] left-[55%] -translate-x-1/2 -translate-y-1/2 z-10 text-center flex flex-col items-center">
                <div className="relative">
                  {/* Ripple effect */}
                  <span className="absolute -top-1 -left-1 inline-flex rounded-full h-8 w-8 bg-emerald-500/30 animate-ping" />
                  <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center shadow-lg">
                    <Navigation className="w-3.5 h-3.5 text-slate-950 rotate-45" />
                  </div>
                </div>
                {/* Micro badge indicator */}
                <div className="mt-2 bg-black/95 text-[10px] font-bold text-white uppercase tracking-wider px-2 py-0.5 rounded border border-zinc-900 shadow-md whitespace-nowrap">
                  23 Westmore Dr.
                </div>
              </div>

              {/* Compass heading indicator */}
              <div className="relative z-10 flex items-center justify-end">
                <div className="bg-black border border-zinc-900 px-3 py-1.5 rounded-full text-[10px] font-bold text-zinc-400 flex items-center gap-1.5 uppercase font-sans">
                  <Navigation className="w-3 h-3 text-emerald-500" />
                  <span>Toronto Enclave Hub</span>
                </div>
              </div>

              <div className="relative z-10 flex justify-between items-center bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-zinc-900">
                <div className="text-left">
                  <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Office Coordinates</span>
                  <span className="text-xs text-white block mt-0.5 font-sans">Westmore Drive & Highway 27</span>
                </div>
                <a
                  href="https://google.com/maps/search/?api=1&query=23+Westmore+Drive+Unit+102+Toronto+Ontario+M9V+3Y7"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1 cursor-pointer no-underline"
                >
                  Get Route
                </a>
              </div>

            </div>

          </div>

          {/* Right Column: Direct Messaging Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-950 p-6 sm:p-10 rounded-3xl border border-zinc-900 shadow-2xl relative h-full">
              
              {!isSent ? (
                <form onSubmit={handleSendMessage} className="space-y-6">
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
                  <h3 className="font-serif text-lg font-medium text-white mb-6">
                    Drop a Message
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                        Your Full Name <span className="text-emerald-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-black border border-zinc-900 focus:border-emerald-500 text-xs text-white p-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                        Phone Number <span className="text-emerald-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="647-123-4567"
                        className="w-full bg-black border border-zinc-900 focus:border-emerald-500 text-xs text-white p-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                      Email Address <span className="text-emerald-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-black border border-zinc-900 focus:border-emerald-500 text-xs text-white p-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Inquiring on Castlemore ravine villa"
                      className="w-full bg-black border border-zinc-900 focus:border-emerald-500 text-xs text-white p-3.5 rounded-xl focus:outline-none focus:ring-1 focus:border-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                      Your Message <span className="text-emerald-500">*</span>
                    </label>
                    <textarea
                      required
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      placeholder="Write your detailed questions or schedule request details here..."
                      rows={5}
                      className="w-full bg-black border border-zinc-900 focus:border-emerald-500 text-xs text-white p-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/20 resize-none"
                    />
                  </div>

                  {error && (
                    <div className="text-rose-500 text-xs font-semibold text-right mb-2">
                      {error}
                    </div>
                  )}

                  <div className="pt-2 text-right">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer outline-none ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>

                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 space-y-6 flex flex-col justify-center h-full"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 animate-bounce text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl text-white font-medium">Message Sent!</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto font-light leading-relaxed">
                      Thank you for contacting Haroon Afzal, Real Estate Broker. Your query regarding <strong>{subject}</strong> has been transmitted successfully.
                    </p>
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={handleReset}
                      className="text-xs text-emerald-400 font-semibold hover:underline bg-transparent border-none outline-none cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
