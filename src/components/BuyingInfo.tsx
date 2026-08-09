import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ShieldCheck, FileText, Landmark, 
  HelpCircle, Sparkles, Scale, Info, Check, Calculator, 
  ChevronRight, Compass, GraduationCap, DollarSign, ListTodo
} from 'lucide-react';

interface BuyingInfoProps {
  onNavigate: (sectionId: string) => void;
}

type TabType = 'guide' | 'first-time' | 'closing-costs' | 'realtor-value' | 'calculator';

export default function BuyingInfo({ onNavigate }: BuyingInfoProps) {
  const [activeTab, setActiveTab] = useState<TabType>('guide');

  // Calculator State
  const [purchasePrice, setPurchasePrice] = useState<number>(850000);
  const [isToronto, setIsToronto] = useState<boolean>(false);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);

  // Helper to calculate Ontario Provincial Land Transfer Tax (LTT)
  const calculateOntarioLTT = (price: number): number => {
    let ltt = 0;
    if (price <= 55000) {
      ltt = price * 0.005;
    } else if (price <= 250000) {
      ltt = (55000 * 0.005) + ((price - 55000) * 0.01);
    } else if (price <= 400000) {
      ltt = (55000 * 0.005) + ((250000 - 55000) * 0.01) + ((price - 250000) * 0.015);
    } else if (price <= 2000000) {
      ltt = (55000 * 0.005) + ((250000 - 55000) * 0.01) + ((400000 - 250000) * 0.015) + ((price - 400000) * 0.02);
    } else {
      ltt = (55000 * 0.005) + ((250000 - 55000) * 0.01) + ((400000 - 250000) * 0.015) + ((2000000 - 400000) * 0.02) + ((price - 2000000) * 0.025);
    }
    return ltt;
  };

  // Helper to calculate Toronto Municipal Land Transfer Tax (MLTT)
  // Brackets are roughly identical to the Ontario rates for residential properties
  const calculateTorontoMLTT = (price: number): number => {
    if (!isToronto) return 0;
    let mltt = 0;
    if (price <= 55000) {
      mltt = price * 0.005;
    } else if (price <= 250000) {
      mltt = (55000 * 0.005) + ((price - 55000) * 0.01);
    } else if (price <= 400000) {
      mltt = (55000 * 0.005) + ((250000 - 55000) * 0.01) + ((price - 250000) * 0.015);
    } else if (price <= 2000000) {
      mltt = (55000 * 0.005) + ((250000 - 55000) * 0.01) + ((400000 - 250000) * 0.015) + ((price - 400000) * 0.02);
    } else {
      mltt = (55000 * 0.005) + ((250000 - 55000) * 0.01) + ((400000 - 250000) * 0.015) + ((2000000 - 400000) * 0.02) + ((price - 2000000) * 0.025);
    }
    return mltt;
  };

  // Calculations
  const provLTT = calculateOntarioLTT(purchasePrice);
  const munMLTT = calculateTorontoMLTT(purchasePrice);

  // Rebates
  const provRebate = isFirstTime ? Math.min(provLTT, 4000) : 0;
  const munRebate = (isFirstTime && isToronto) ? Math.min(munMLTT, 4475) : 0;

  const finalProvLTT = Math.max(0, provLTT - provRebate);
  const finalMunMLTT = Math.max(0, munMLTT - munRebate);
  const totalLTT = finalProvLTT + finalMunMLTT;

  // Other closing cost estimates
  const legalFees = 1850; // default average
  const titleInsurance = 450;
  const homeInspection = 550;
  const adjustmentAndDisb = 600;
  const totalOtherCosts = legalFees + titleInsurance + homeInspection + adjustmentAndDisb;
  const totalClosingCosts = totalLTT + totalOtherCosts;

  const menuItems: { id: TabType; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'guide', label: 'Step-by-Step Buying Guide', icon: Compass },
    { id: 'first-time', label: 'First-Time Buyer Benefits', icon: GraduationCap },
    { id: 'closing-costs', label: 'Closing Costs Checklist', icon: ListTodo },
    { id: 'realtor-value', label: 'Why Buy with a Broker', icon: ShieldCheck },
    { id: 'calculator', label: 'Closing Cost Calculator', icon: Calculator }
  ];

  return (
    <div id="buying-info-container" className="pt-28 pb-24 bg-black relative overflow-hidden text-slate-300">
      
      {/* Visual lighting background ambiance */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Simple Breadcrumb-style Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-emerald-500 uppercase font-bold tracking-widest mb-6">
          <span>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">Buying Information</span>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            A Comprehensive Resource Matrix
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-white font-medium tracking-tight mt-3 leading-tight">
            Acquisition Intelligence &amp; Strategy
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-light mt-4 leading-relaxed">
            Real estate purchasing represents major wealth redistribution. Whether you are navigating your absolute first GTA acquisition, seeking out high-yield multi-family structures in the GTA, or optimizing land transfer tax structures—knowledge is your principal shield.
          </p>
        </div>

        {/* Outer Shell Grid with Sub-tab Navigation */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Column (Sidebar on desktop) */}
          <div className="lg:col-span-4 space-y-3 bg-black p-4 rounded-2xl border border-zinc-850">
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider px-3 block mb-1">
              Select Information Matrix
            </span>
            <div className="flex flex-col gap-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl text-xs sm:text-sm font-sans tracking-wide transition-all border cursor-pointer ${
                      activeTab === item.id
                        ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/5'
                        : 'bg-black text-slate-300 border-zinc-900 hover:border-zinc-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${activeTab === item.id ? 'text-slate-950' : 'text-emerald-500'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 bg-black rounded-xl border border-zinc-900 mt-4 space-y-3">
              <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500 block">Personal Consultation</span>
              <p className="text-[11px] text-slate-400 leading-normal font-light">
                Need customized financial models or an active sub-market scan? Get immediate broker diagnostic help.
              </p>
              <button
                onClick={() => onNavigate('contact')}
                className="w-full text-center py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-emerald-400 font-semibold text-[11px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Inquire With Haroon
              </button>
            </div>
          </div>

          {/* Dynamic Content Panel */}
          <div className="lg:col-span-8 bg-black border border-zinc-850 rounded-2xl p-6 sm:p-8 min-h-[580px] shadow-2xl">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Step-by-Step Buying Guide */}
              {activeTab === 'guide' && (
                <motion.div
                  key="guide-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
                    <Compass className="w-6 h-6 text-emerald-500" />
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl text-white font-medium">Acquisition Process Pipeline</h2>
                      <p className="text-xs text-slate-404 font-light">The tactical progression of purchasing Ontario residential property</p>
                    </div>
                  </div>

                  <div className="relative border-l border-emerald-500/20 pl-6 ml-3.5 mt-8 space-y-8">
                    
                    {/* Step 1 */}
                    <div className="relative">
                      <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-emerald-500 border-4 border-black flex items-center justify-center font-bold text-[8px] text-slate-950 font-sans">
                        1
                      </span>
                      <h3 className="font-serif text-base text-white font-medium">Financial Anchoring &amp; Mortgage Pre-Approval</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light mt-1">
                        Do not shop blindly. Arrange meetings with certified lenders or mortgage specialists to formally declare your debt servicing ratios (GDS / TDS), run credit index summaries, and establish a firm, mathematically sound purchase cap with a pre-approval certificate.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative">
                      <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-zinc-800 border-4 border-black flex items-center justify-center font-bold text-[8px] text-emerald-400 font-sans">
                        2
                      </span>
                      <h3 className="font-serif text-base text-white font-medium">Define Structural &amp; Location Parameters</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light mt-1">
                        Identify building layout necessities. Are you prioritizing a high-density commuter condo, a multi-unit investment property, or a classic GTA detached home requiring specific elements like legal basement layouts with separate side entrances?
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative">
                      <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-zinc-800 border-4 border-black flex items-center justify-center font-bold text-[8px] text-emerald-400 font-sans">
                        3
                      </span>
                      <h3 className="font-serif text-base text-white font-medium">Precise Market Scanning &amp; Showings</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light mt-1">
                        Haroon coordinates comprehensive property screenings matching your exact parameters. Access MLS databanks plus internal off-market databases, verifying physical build health, sub-neighborhood comps, and transit accessibility links.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="relative">
                      <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-zinc-800 border-4 border-black flex items-center justify-center font-bold text-[8px] text-emerald-400 font-sans">
                        4
                      </span>
                      <h3 className="font-serif text-base text-white font-medium">Structuring a Formidable Offer (APS)</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light mt-1">
                        We draft the official *Agreement of Purchase and Sale (APS)*. This standard legal document defines your target Purchase Price, the earnest funds deposit, desired fixtures, and protective conditions (such as Financing, Home Inspection, and Status Certificate review for condos).
                      </p>
                    </div>

                    {/* Step 5 */}
                    <div className="relative">
                      <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-zinc-800 border-4 border-black flex items-center justify-center font-bold text-[8px] text-emerald-400 font-sans">
                        5
                      </span>
                      <h3 className="font-serif text-base text-white font-medium">Home Inspection &amp; Condition Fulfillments</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light mt-1">
                        Once the offer is accepted conditionally, we systematically execute tests. A licensed home inspector assesses roofing, foundation walls, electrical panels, and HVAC systems. Upon secure underwriting and inspection approvals, we sign the Notice of Fulfillment (NOF) to set the agreement firm.
                      </p>
                    </div>

                    {/* Step 6 */}
                    <div className="relative">
                      <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-zinc-800 border-4 border-black flex items-center justify-center font-bold text-[8px] text-emerald-400 font-sans">
                        6
                      </span>
                      <h3 className="font-serif text-base text-white font-medium">Legal Review and Retainer</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light mt-1">
                        Your real estate lawyer reviews the firm Agreement. They coordinate the title search, prepare closing documentation, compute land transfer fee structures, verify title insurance protections, and organize fund transfers on key day.
                      </p>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* Tab 2: First-Time Home Buyer Benefits */}
              {activeTab === 'first-time' && (
                <motion.div
                  key="first-time-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
                    <GraduationCap className="w-6 h-6 text-emerald-500" />
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl text-white font-medium">First-Time Buyer Relief Initiatives</h2>
                      <p className="text-xs text-slate-404 font-light">Federal and Provincial government support structures for first purchases</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                    The Canadian and Ontario governments provide extensive capital concessions to first-time buyers. Understanding these rules represents instant, direct financial savings:
                  </p>

                  <div className="grid sm:grid-cols-2 gap-5 pt-2">
                    
                    {/* Benefit 1 */}
                    <div className="bg-black/50 border border-zinc-850 p-5 rounded-xl space-y-2">
                      <span className="text-2xl block text-emerald-400">01</span>
                      <h4 className="font-serif text-base text-white font-medium">Ontario LTT Rebate</h4>
                      <p className="text-xs text-slate-400 font-light leading-relaxed">
                        First-time buyers are eligible for a maximum Provincial Land Transfer Tax refund of **$4,000**. On properties priced up to $368,000, this reduces your LTT completely to $0. On more expensive homes, it directly offsets $4,000 off your closing balance.
                      </p>
                    </div>

                    {/* Benefit 2 */}
                    <div className="bg-black/50 border border-zinc-850 p-5 rounded-xl space-y-2">
                      <span className="text-2xl block text-emerald-400">02</span>
                      <h4 className="font-serif text-base text-white font-medium">Toronto MLTT Rebate</h4>
                      <p className="text-xs text-slate-400 font-light leading-relaxed">
                        Purchasing inside Toronto's borders? You can claim an additional Municipal Land Transfer Tax refund capped up to **$4,475**. Combined with the provincial rebate, first-time Toronto acquirements save up to **$8,475** directly on tax day.
                      </p>
                    </div>

                    {/* Benefit 3 */}
                    <div className="bg-black/50 border border-zinc-850 p-5 rounded-xl space-y-2">
                      <span className="text-2xl block text-emerald-400">03</span>
                      <h4 className="font-serif text-base text-white font-medium">Home Buyers' Plan (HBP)</h4>
                      <p className="text-xs text-slate-400 font-light leading-relaxed">
                        Withdraw up to **$60,000** tax-free from your Registered Retirement Savings Plan (RRSP) to formulate your down payment. You have 15 years to repay this capital back to your RRSP account, allowing you to use pre-tax savings safely.
                      </p>
                    </div>

                    {/* Benefit 4 */}
                    <div className="bg-black/50 border border-zinc-850 p-5 rounded-xl space-y-2">
                      <span className="text-2xl block text-emerald-400">04</span>
                      <h4 className="font-serif text-base text-white font-medium">Home Buyers' Tax Credit</h4>
                      <p className="text-xs text-slate-404 leading-relaxed text-slate-400 font-light">
                        The federal program allows a non-refundable tax credit of **$10,000**. This converts to direct physical savings of up to **$1,500** on your yearly tax filing to compensate for initial legal or inspection disbursements.
                      </p>
                    </div>

                  </div>
                </motion.div>
              )}              {/* Tab 3: Closing Costs Checklist */}
              {activeTab === 'closing-costs' && (
                <motion.div
                  key="closing-costs-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
                    <ListTodo className="w-6 h-6 text-emerald-500" />
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl text-white font-medium">Expected Closing Cost Checklist</h2>
                      <p className="text-xs text-slate-400 font-light">Anticipating auxiliary expenses due upon final title transfer</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                    Closing fees represent the supplementary liquidity required on key hand-over day. Buyers must reserve between **1.5% and 4%** of the home price for these elements:
                  </p>

                  <div className="space-y-3 pt-2">
                    
                    {/* Item 1 */}
                    <div className="flex items-start gap-3 bg-black/40 p-4 rounded-xl border border-zinc-850">
                      <div className="p-1 px-2 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] mt-0.5">
                        LTT
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm text-white font-medium font-sans">Land Transfer Taxes (Provincial &amp; Municipal)</h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal font-light">
                          Usually the single largest expense. Calculated as a tiered percentage scale of your home value. If purchasing inside the City of Toronto boundary, you pay both Provincial LTT and Municipal MLTT.
                        </p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-start gap-3 bg-black/40 p-4 rounded-xl border border-zinc-850">
                      <div className="p-1 px-2 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] mt-0.5">
                        FEES
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm text-white font-medium font-sans">Legal Fees &amp; Disbursements</h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal font-light">
                          Expected range: **$1,500 - $2,550** depending on file complexity. Covers drafting of mortgage registry, execution of title searches, deed registration, and legal disbursement admin tasks.
                        </p>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-start gap-3 bg-black/40 p-4 rounded-xl border border-zinc-850">
                      <div className="p-1 px-2 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] mt-0.5">
                        INS
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm text-white font-medium font-sans">Title Insurance Protection</h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal font-light">
                          Usually ranges from **$300 - $650**. Protects you and your mortgage lender from issues like survey errors, construction liens, or existing zoning/permit violations from past owners.
                        </p>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-start gap-3 bg-black/40 p-4 rounded-xl border border-zinc-850">
                      <div className="p-1 px-2 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] mt-0.5">
                        ADJ
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm text-white font-medium font-sans">Pre-Paid adjustment Costs</h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal font-light">
                          Varies. If the seller has pre-paid local property taxes or common fuel costs past the closing day, your lawyer adjusts the final payment to compensate the seller on a pro-rated basis.
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* Tab 4: Why Buy with a Broker */}
              {activeTab === 'realtor-value' && (
                <motion.div
                  key="realtor-value-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl text-white font-medium">The Power of Registered Representation</h2>
                      <p className="text-xs text-slate-400 font-light">How professional broker diagnostics safeguard your home purchase</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                    Some buyers mistakenly believe they can save money by dealing directly with listing agents. Doing so means entering a dual representation dynamic or leaving yourself entirely unrepresented. Here is how Haroon protects your interests:
                  </p>

                  <div className="space-y-4 pt-2">
                    
                    {/* Benefit Item */}
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mt-1 text-[10px]">&bull;</div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm text-white font-semibold font-sans">Fiduciary Shield Guarantee</h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal font-light">
                          Listing agents are legally bound to protect the *seller's* target profit. By retaining Haroon as your dedicated buyer rep, his sole legal fiduciary duty is to secure the absolute lowest price and safest terms for *you*.
                        </p>
                      </div>
                    </div>

                    {/* Benefit Item */}
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mt-1 text-[10px]">&bull;</div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm text-white font-semibold font-sans">Comprehensive CMA Modeling</h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal font-light">
                          Before making an offer, we conduct a structured Comparative Market Analysis. This mathematical modeling parses past sales, days on market, and neighborhood benchmarks so you do not overpay.
                        </p>
                      </div>
                    </div>

                    {/* Benefit Item */}
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mt-1 text-[10px]">&bull;</div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm text-white font-semibold font-sans">Meticulous Contract Drafting</h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal font-light">
                          We use robust protective clauses to ensure you are not left holding responsibility for pre-existing structural issues, illegal renovations, or outstanding property tax back-credits.
                        </p>
                      </div>
                    </div>

                    {/* Benefit Item */}
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mt-1 text-[10px]">&bull;</div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm text-white font-semibold font-sans">Zero out-of-Pocket Brokerage Cost</h4>
                        <p className="text-[11px] sm:text-xs text-slate-404 leading-normal text-slate-400 font-light">
                          In standard Ontario real estate protocols, buyer representation fees are compensated directly from the seller's pre-arranged list commission. You receive premium structural Broker guidance at **$0 upfront cost**.
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* Tab 5: Real-Time Land Transfer Tax & Closing Cost Calculator */}
              {activeTab === 'calculator' && (
                <motion.div
                  key="calculator-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
                    <Calculator className="w-6 h-6 text-emerald-500" />
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl text-white font-medium">Real-Time Closing Capital Modeler</h2>
                      <p className="text-xs text-slate-400 font-light">Calculate your Ontario &amp; Toronto Land Transfer Taxes and total liquidity offsets</p>
                    </div>
                  </div>

                  {/* Calculator Input Fields */}
                  <div className="grid sm:grid-cols-3 gap-4 bg-black p-4 rounded-xl border border-zinc-850">
                    
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400 font-medium font-bold">
                        Purchase Price ($)
                      </label>
                      <input
                        type="number"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-black border border-zinc-805 border-zinc-800 focus:border-emerald-500 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400 font-medium font-bold">
                        Property Location
                      </label>
                      <select
                        value={isToronto ? 'toronto' : 'ontario'}
                        onChange={(e) => setIsToronto(e.target.value === 'toronto')}
                        className="w-full bg-black border border-zinc-800 focus:border-emerald-500 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="ontario">Ontario (Outside Toronto)</option>
                        <option value="toronto">Toronto (Inc. Municipal LTT)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 flex flex-col justify-end">
                      <label className="flex items-center gap-2 cursor-pointer bg-black border border-zinc-800 hover:border-zinc-705 hover:border-zinc-700 px-3 py-2 rounded-lg text-slate-300 select-none pb-2.5 h-full">
                        <input
                          type="checkbox"
                          checked={isFirstTime}
                          onChange={(e) => setIsFirstTime(e.target.checked)}
                          className="w-4 h-4 accent-emerald-500 rounded border-zinc-800 cursor-pointer"
                        />
                        <span className="text-[11px] font-sans font-medium">First-Time Buyer?</span>
                      </label>
                    </div>

                  </div>

                  {/* Pricing Output breakdown schema */}
                  <div className="grid sm:grid-cols-2 gap-6 pt-2">
                    
                    {/* Column 1: Tax Breakdown */}
                    <div className="space-y-3 bg-black p-5 rounded-xl border border-zinc-900">
                      <h4 className="text-xs uppercase tracking-widest text-slate-400 font-mono font-bold pb-2 border-b border-zinc-850">
                        1. Tax Calculations
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center text-slate-400 font-light">
                          <span>Provincial LTT (Ontario)</span>
                          <span className="text-slate-200">${provLTT.toLocaleString()}</span>
                        </div>
                        {isFirstTime && (
                          <div className="flex justify-between items-center text-emerald-400/90 font-light">
                            <span>Provincial Rebate (First-Time Offset)</span>
                            <span>-${provRebate.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {isToronto && (
                          <>
                            <div className="flex justify-between items-center text-slate-400 font-light pt-1 border-t border-zinc-900">
                              <span>Municipal LTT (Toronto)</span>
                              <span className="text-slate-200">${munMLTT.toLocaleString()}</span>
                            </div>
                            {isFirstTime && (
                              <div className="flex justify-between items-center text-emerald-400/90 font-light">
                                <span>Municipal Rebate (First-Time Offset)</span>
                                <span>-${munRebate.toLocaleString()}</span>
                              </div>
                            )}
                          </>
                        )}

                        <div className="flex justify-between items-center text-white font-bold pt-2 border-t border-zinc-800 mt-2 font-sans">
                          <span>Net Land Transfer Tax Due</span>
                          <span className="text-emerald-400">${provLTT.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Other Closing Costs */}
                    <div className="space-y-3 bg-black p-5 rounded-xl border border-zinc-900">
                      <h4 className="text-xs uppercase tracking-widest text-slate-400 font-mono font-bold pb-2 border-b border-zinc-850">
                        2. Capital &amp; Admin Estimates
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center text-slate-400 font-light">
                          <span>Legal Fees, Deeds &amp; Retainer</span>
                          <span className="text-slate-200">${legalFees.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400 font-light">
                          <span>Title Insurance Protection</span>
                          <span className="text-slate-200">${titleInsurance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400 font-light">
                          <span>Certified Home Inspection Check</span>
                          <span className="text-slate-200">${homeInspection.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400 font-light">
                          <span>Utility/Tax adjustments</span>
                          <span className="text-slate-200">${adjustmentAndDisb.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center text-white font-bold pt-2 border-t border-zinc-800 mt-2 font-sans">
                          <span>Estimated Admin Disbursements</span>
                          <span className="text-emerald-400">${totalOtherCosts.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Summary Total Bar */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 shadow-inner">
                    <div className="text-center sm:text-left">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                        Direct Closing Liquidity Needed
                      </span>
                      <p className="text-[11px] text-slate-400 font-light font-sans mt-0.5">
                        Excluding your physical mortgage down payment percentage.
                      </p>
                    </div>
                    <div className="text-center sm:text-right">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                        ${totalClosingCosts.toLocaleString()}
                      </span>
                      <span className="block text-[9px] uppercase font-mono text-slate-500 tracking-wider mt-0.5">
                        Provincial Tax + Fee Estimates
                      </span>
                    </div>
                  </div>

                  {/* Disclosure Note */}
                  <div className="flex gap-2 text-[10px] text-slate-500 font-sans leading-normal font-light pt-2 italic">
                    <Info className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Disclaimer: These formulas serve purely as professional estimates. Actual municipal structures, adjustments, tax rebates and legal disbursements are final only upon detailed reviews and binding executions governed by your real estate legal representation.
                    </span>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
