import React, { useState, useEffect } from 'react';
import { Calculator, HelpCircle, CheckCircle, Percent, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

export default function Calculators() {
  const [activeTab, setActiveTab] = useState<'mortgage' | 'ltt'>('mortgage');

  // --- Mortgage Calculator State ---
  const [homePrice, setHomePrice] = useState<number>(1150000);
  const [downPayment, setDownPayment] = useState<number>(230000);
  const [interestRate, setInterestRate] = useState<number>(4.8);
  const [amortization, setAmortization] = useState<number>(25);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [mortgagePrincipal, setMortgagePrincipal] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);

  // --- LTT Calculator State ---
  const [purchasePrice, setPurchasePrice] = useState<number>(1150000);
  const [isToronto, setIsToronto] = useState<boolean>(true);
  const [isFirstTimeBuyer, setIsFirstTimeBuyer] = useState<boolean>(true);
  const [provincialTax, setProvincialTax] = useState<number>(0);
  const [torontoTax, setTorontoTax] = useState<number>(0);
  const [provincialRebate, setProvincialRebate] = useState<number>(0);
  const [torontoRebate, setTorontoRebate] = useState<number>(0);
  const [totalTaxDue, setTotalTaxDue] = useState<number>(0);

  // Calculate Mortgage on input changes
  useEffect(() => {
    let principal = homePrice - downPayment;
    if (principal < 0) principal = 0;
    setMortgagePrincipal(principal);

    const monthlyRate = (interestRate / 100) / 12;
    const totalPayments = amortization * 12;

    if (monthlyRate === 0) {
      const payment = totalPayments > 0 ? principal / totalPayments : 0;
      setMonthlyPayment(payment);
      setTotalInterest(0);
      setTotalCost(principal);
    } else {
      const x = Math.pow(1 + monthlyRate, totalPayments);
      const payment = (principal * monthlyRate * x) / (x - 1);
      
      if (!isNaN(payment) && isFinite(payment)) {
        setMonthlyPayment(payment);
        const totalPaid = payment * totalPayments;
        setTotalCost(totalPaid);
        setTotalInterest(totalPaid - principal);
      } else {
        setMonthlyPayment(0);
        setTotalCost(0);
        setTotalInterest(0);
      }
    }
  }, [homePrice, downPayment, interestRate, amortization]);

  // Calculate Land Transfer Tax (LTT)
  useEffect(() => {
    // 1. Provincial Land Transfer Tax (Ontario)
    // Up to $55k: 0.5%
    // $55k to $250k: 1.0% (tax amount is $1,950 total on first 250k)
    // $250k to $400k: 1.5% (tax amount is $4,200 total on first 400k)
    // $400k to $2M: 2.0%
    // Over $2M: 2.5%
    let prov = 0;
    if (purchasePrice <= 55000) {
      prov = purchasePrice * 0.005;
    } else if (purchasePrice <= 250000) {
      prov = (55000 * 0.005) + ((purchasePrice - 55000) * 0.01);
    } else if (purchasePrice <= 400000) {
      prov = (55000 * 0.005) + ((250000 - 55000) * 0.01) + ((purchasePrice - 250000) * 0.015);
    } else if (purchasePrice <= 2000000) {
      prov = (55000 * 0.005) + ((250000 - 55000) * 0.01) + ((400000 - 250000) * 0.015) + ((purchasePrice - 400000) * 0.02);
    } else {
      prov = (55000 * 0.005) + ((250000 - 55000) * 0.01) + ((400000 - 250000) * 0.015) + ((2000000 - 400000) * 0.02) + ((purchasePrice - 2000000) * 0.025);
    }

    setProvincialTax(prov);

    // 2. Municipal Land Transfer Tax (Toronto)
    // Same brackets as Ontario provincial tax
    let tor = 0;
    if (isToronto) {
      if (purchasePrice <= 55000) {
        tor = purchasePrice * 0.005;
      } else if (purchasePrice <= 250000) {
        tor = (55000 * 0.005) + ((purchasePrice - 55000) * 0.01);
      } else if (purchasePrice <= 400000) {
        tor = (55000 * 0.005) + ((250000 - 55000) * 0.01) + ((purchasePrice - 250000) * 0.015);
      } else if (purchasePrice <= 2000000) {
        tor = (55000 * 0.005) + ((250000 - 55000) * 0.01) + ((400000 - 250000) * 0.015) + ((purchasePrice - 400000) * 0.02);
      } else {
        tor = (55000 * 0.005) + ((250000 - 55000) * 0.01) + ((400000 - 250000) * 0.015) + ((2000000 - 400000) * 0.02) + ((purchasePrice - 2000000) * 0.025);
      }
    }
    setTorontoTax(tor);

    // 3. Rebates for First Time Buyers
    // Provincial rebate: max $4,000
    // Toronto rebate: max $4,475
    let provReb = 0;
    let torReb = 0;

    if (isFirstTimeBuyer) {
      provReb = Math.min(prov, 4000);
      if (isToronto) {
        torReb = Math.min(tor, 4475);
      }
    }

    setProvincialRebate(provReb);
    setTorontoRebate(torReb);

    // Net tax due
    const totalDue = prov + tor - provReb - torReb;
    setTotalTaxDue(totalDue < 0 ? 0 : totalDue);

  }, [purchasePrice, isToronto, isFirstTimeBuyer]);


  return (
    <section id="calculators-section" className="py-24 bg-black border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Financial Empowerment Tools
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight">
            Ontario Real Estate Calculators
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 font-light leading-relaxed">
            Obtain immediate clarity on home ownership transaction costs. Toggle cleanly below to estimate your <strong>down-payment mortgage schedule</strong> or compute your exact <strong>Ontario Land Transfer Tax obligations</strong> and first-time buyer rebates.
          </p>
        </div>

        {/* Dynamic Nav Switch Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-zinc-950 p-1 rounded-2xl border border-zinc-900 flex gap-1">
            <button
              onClick={() => setActiveTab('mortgage')}
              className={`px-6 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'mortgage'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Mortgage Payment Estimator
            </button>
            <button
              onClick={() => setActiveTab('ltt')}
              className={`px-6 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2.5 cursor-pointer ${
                activeTab === 'ltt'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Percent className="w-4 h-4" />
              Land Transfer Tax (Ontario & Toronto)
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Accent light decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {activeTab === 'mortgage' && (
            <div className="grid lg:grid-cols-12 gap-10">
              
              {/* Inputs Column */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="text-lg font-serif font-medium text-white mb-5">Mortgage Inputs</h3>
                </div>

                {/* Home Price Input */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                    <span>PROPERTY PURCHASE PRICE</span>
                    <span className="text-emerald-400 font-mono font-bold">${homePrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={300000}
                    max={3000000}
                    step={25000}
                    value={homePrice}
                    onChange={(e) => {
                      const newPrice = Number(e.target.value);
                      setHomePrice(newPrice);
                      // Adjust down payment automatically if it exceeds price
                      if (downPayment >= newPrice) {
                        setDownPayment(Math.floor(newPrice * 0.2));
                      }
                    }}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mb-2"
                  />
                  <input
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-black border border-zinc-900 rounded-xl text-sm text-white p-3 focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>

                {/* Down Payment Input */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                    <span>DOWN PAYMENT AMOUNT</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      ${downPayment.toLocaleString()} ({((downPayment / homePrice) * 100 || 0).toFixed(1)}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={Math.floor(homePrice * (homePrice > 1000000 ? 0.2 : 0.05))} // min down payment safety
                    max={homePrice - 50000}
                    step={5000}
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mb-2"
                  />
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-black border border-zinc-900 rounded-xl text-sm text-white p-3 focus:outline-none focus:border-emerald-500 font-mono font-semibold"
                  />
                </div>

                {/* Interest Rate */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                      INTEREST RATE (%)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.1"
                      max="15"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full bg-black border border-zinc-900 rounded-xl text-sm text-white p-3 focus:outline-none focus:border-emerald-500 font-mono font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                      AMORTIZATION
                    </label>
                    <select
                      value={amortization}
                      onChange={(e) => setAmortization(Number(e.target.value))}
                      className="w-full bg-black border border-zinc-900 rounded-xl text-sm text-slate-200 p-3 focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value={15}>15 Years</option>
                      <option value={20}>20 Years</option>
                      <option value={25}>25 Years (Standard)</option>
                      <option value={30}>30 Years</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Spacer divider */}
              <div className="hidden lg:block lg:col-span-1 border-r border-zinc-900 py-10" />

              {/* Outputs Column */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-serif font-medium text-white mb-5">Estimated Payments</h3>
                </div>

                {/* Primary Payment Indicator */}
                <div className="bg-black/60 p-6 rounded-2xl border border-zinc-850/60 mb-6 text-center lg:text-left">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">
                    Estimated Monthly Payment
                  </span>
                  <span className="font-sans text-4xl sm:text-5xl font-extrabold text-emerald-400 block tracking-tight">
                    ${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-2 block font-light">
                    Based on a total mortgage balance of <strong>${mortgagePrincipal.toLocaleString()}</strong> at <strong>{interestRate}%</strong>.
                  </span>
                </div>

                {/* Granular Breakdown Row */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-black/30 rounded-xl border border-zinc-850/40">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Total Interest Payable
                    </span>
                    <span className="text-lg font-bold text-white font-sans font-mono block">
                      ${totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="p-4 bg-black/30 rounded-xl border border-zinc-850/40">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Total Lifecycle Payment
                    </span>
                    <span className="text-lg font-bold text-white font-sans font-mono block">
                      ${totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                {/* Advisory Notice */}
                <div className="text-[11px] text-slate-500 bg-black/20 p-4 border border-zinc-850/20 rounded-xl font-light">
                  *This calculation acts strictly as a professional estimate. Interest rates, mortgage insurance (CMHC premiums if down payment is below 20%), and property appraisal valuations can modify amortization specifics. Standardize your qualifications by booking a mortgage pre-approval consultation with Haroon.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ltt' && (
            <div className="grid lg:grid-cols-12 gap-10">
              
              {/* Inputs Column */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="text-lg font-serif font-medium text-white mb-5">Transaction Details</h3>
                </div>

                {/* Purchase Price Input */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                    <span>PROPERTY PURCHASE PRICE</span>
                    <span className="text-emerald-400 font-mono font-bold">${purchasePrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={300000}
                    max={3000000}
                    step={25000}
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mb-2"
                  />
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-black border border-zinc-900 rounded-xl text-sm text-white p-3 focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>

                {/* Municipal Boundaries Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                    Is Property Located in the City of Toronto?
                  </label>
                  <p className="text-[11px] text-slate-404 text-slate-400 mb-3 font-light">
                    The City of Toronto imposes an additional municipal land transfer tax identical to the Ontario provincial scale. Regions like Mississauga, Brampton, and Vaughan ONLY pay provincial tax.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIsToronto(true)}
                      className={`py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors border ${
                        isToronto
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500'
                          : 'bg-black border-zinc-850 text-slate-400 hover:text-white'
                      }`}
                    >
                      Yes (Inside Toronto)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsToronto(false)}
                      className={`py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-colors border ${
                        !isToronto
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500'
                          : 'bg-black border-zinc-850 text-slate-400 hover:text-white'
                      }`}
                    >
                      No (Brampton, Miss, Vaughan, etc.)
                    </button>
                  </div>
                </div>

                {/* First-Time Buyer Toggle */}
                <div className="pt-2">
                  <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-zinc-850">
                    <div>
                      <span className="block text-sm font-semibold text-white">First-Time Home Buyer?</span>
                      <span className="block text-[10px] text-slate-404 text-slate-400 font-light mt-0.5">
                        Qualifies for Provincial (max $4,000) and Municipal (max $4,475) rebate credits.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isFirstTimeBuyer}
                        onChange={(e) => setIsFirstTimeBuyer(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 peer-checked:after:bg-black after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Spacer divider */}
              <div className="hidden lg:block lg:col-span-1 border-r border-zinc-900 py-10" />

              {/* Outputs Column */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-serif font-medium text-white mb-5">Calculated Tax Statement</h3>
                </div>

                {/* Final Tax Net Obligation */}
                <div className="bg-black/60 p-6 rounded-2xl border border-zinc-850/60 mb-6 text-center lg:text-left">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">
                    Net Land Transfer Tax Due
                  </span>
                  <span className="font-sans text-4xl sm:text-5xl font-extrabold text-emerald-400 block tracking-tight">
                    ${totalTaxDue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  {isFirstTimeBuyer && (provincialRebate > 0 || torontoRebate > 0) && (
                    <span className="text-[11px] text-emerald-400 mt-2 block font-semibold">
                      Excellent! Incorporating ${(provincialRebate + torontoRebate).toLocaleString()} in first-time buyer credits!
                    </span>
                  )}
                </div>

                {/* Granular Breakdown Lists */}
                <div className="space-y-3.5 mb-6 text-sm font-semibold">
                  <div className="flex justify-between items-center py-2.5 border-b border-zinc-850">
                    <span className="text-slate-450 text-slate-400 font-light">Ontario Provincial Land Transfer Tax</span>
                    <span className="font-semibold text-white font-mono">${provincialTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>

                  {isToronto && (
                    <div className="flex justify-between items-center py-2.5 border-b border-zinc-850">
                      <span className="text-slate-450 text-slate-400 font-light">Toronto Municipal Land Transfer Tax</span>
                      <span className="font-semibold text-white font-mono">${torontoTax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  {isFirstTimeBuyer && provincialRebate > 0 && (
                    <div className="flex justify-between items-center py-2.5 border-b border-zinc-850 text-emerald-400">
                      <span className="font-light animate-pulse">First-Time Buyer Provincial Rebate (Ontario)</span>
                      <span className="font-semibold font-mono">-${provincialRebate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  {isFirstTimeBuyer && isToronto && torontoRebate > 0 && (
                    <div className="flex justify-between items-center py-2.5 border-b border-zinc-850 text-emerald-400">
                      <span className="font-light animate-pulse">First-Time Buyer Municipal Rebate (Toronto)</span>
                      <span className="font-semibold font-mono">-${torontoRebate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-3 text-base font-bold bg-black/30 px-3.5 rounded-xl border border-zinc-850/40">
                    <span className="text-white font-serif">Total Transactions Tax Impact</span>
                    <span className="text-emerald-400 font-mono">${totalTaxDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Explanation */}
                <div className="text-[11px] text-slate-500 bg-black/20 p-4 border border-zinc-850/20 rounded-xl font-light leading-normal">
                  Ontario's progressive scale applies land transfer duty upon closing of Title. First-time buyer rebates apply solely to properties representing principal residential use where the applicant is at least 18 years of age and has never owned real property globally.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
