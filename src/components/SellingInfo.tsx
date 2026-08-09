import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ShieldCheck, FileText, Landmark, 
  HelpCircle, Sparkles, Scale, Info, Check, Calculator, 
  ChevronRight, Compass, GraduationCap, DollarSign, ListTodo,
  TrendingUp, Image, Eye, PenTool, Key
} from 'lucide-react';

interface SellingInfoProps {
  onNavigate: (sectionId: string) => void;
}

type TabType = 'guide' | 'value-max' | 'marketing' | 'broker-value' | 'calculator';

export default function SellingInfo({ onNavigate }: SellingInfoProps) {
  const [activeTab, setActiveTab] = useState<TabType>('guide');

  // Calculator State
  const [salePrice, setSalePrice] = useState<number>(950050);
  const [commissionRate, setCommissionRate] = useState<number>(5.0); // combine percentage (listing + buyer agent)
  const [isHstOnCommission, setIsHstOnCommission] = useState<boolean>(true); // HST is 13% in Ontario
  const [legalFees, setLegalFees] = useState<number>(1650);
  const [preListingInvestments, setPreListingInvestments] = useState<number>(2500); // cleaning, staging, painting
  const [mortgageDischarge, setMortgageDischarge] = useState<number>(300); // discharge or admin fee

  // Calculations
  const rawCommission = salePrice * (commissionRate / 100);
  const hstTax = isHstOnCommission ? rawCommission * 0.13 : 0;
  const totalCommission = rawCommission + hstTax;
  
  const totalSellingCosts = totalCommission + legalFees + preListingInvestments + mortgageDischarge;
  const netProceeds = Math.max(0, salePrice - totalSellingCosts);

  const menuItems: { id: TabType; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'guide', label: 'Step-by-Step Selling Guide', icon: Compass },
    { id: 'value-max', label: 'Value Maximization Strategy', icon: Sparkles },
    { id: 'marketing', label: 'Premium Marketing Plan', icon: Image },
    { id: 'broker-value', label: 'The Fiduciary Advantage', icon: ShieldCheck },
    { id: 'calculator', label: 'Net Proceeds Calculator', icon: Calculator }
  ];

  return (
    <div id="selling-info-container" className="pt-28 pb-24 bg-black relative overflow-hidden text-slate-300">
      
      {/* Visual lighting background ambiance */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Simple Breadcrumb-style Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-emerald-500 uppercase font-bold tracking-widest mb-6">
          <span>Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">Selling Information</span>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Maximizing Equity &amp; Execution
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-white font-medium tracking-tight mt-3 leading-tight">
            Asset Liquidation &amp; Premium Pricing Strategy
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-light mt-4 leading-relaxed">
            Acquiring real estate is about establishing parameters, but liquidating real estate is about supreme theater and strategic leverage. Selling your GTA home is any professional asset manager's test: listing at the perfect inflection point, staging to unlock mental ownership triggers, and generating maximum buyer pool urgency.
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
              <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500 block">Immediate Home Valuation</span>
              <p className="text-[11px] text-slate-404 text-slate-400 leading-normal font-light">
                Want to know your home's actual real-time value on the MLS registry? Submit a direct valuation analysis query.
              </p>
              <button
                onClick={() => onNavigate('evaluation')}
                className="w-full text-center py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-emerald-400 font-semibold text-[11px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Get Free Evaluation
              </button>
            </div>
          </div>

          {/* Dynamic Content Panel */}
          <div className="lg:col-span-8 bg-black border border-zinc-850 rounded-2xl p-6 sm:p-8 min-h-[580px] shadow-2xl">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Step-by-Step Selling Guide */}
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
                      <h2 className="font-serif text-xl sm:text-2xl text-white font-medium">Selling Process Pipeline</h2>
                      <p className="text-xs text-slate-400 font-light">The strategic progression to prepare, launch, and close your GTA home sale</p>
                    </div>
                  </div>

                  <div className="relative border-l border-emerald-500/20 pl-6 ml-3.5 mt-8 space-y-8">
                    
                    {/* Step 1 */}
                    <div className="relative">
                      <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-emerald-500 border-4 border-black flex items-center justify-center font-bold text-[8px] text-slate-950 font-sans">
                        1
                      </span>
                      <h3 className="font-serif text-base text-white font-medium">Comparative Market Audit &amp; Objectives</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light mt-1">
                        First, we analyze precise localized metrics. We review active comps, historic expired listing files, and recent closed sales to understand active market momentum. We define your goals, whether that means prioritizing an ultra-fast closing date or capturing the absolute absolute top-market price.
                      </p>
                    </div>

                     {/* Step 2 */}
                    <div className="relative">
                      <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-zinc-800 border-4 border-black flex items-center justify-center font-bold text-[8px] text-emerald-400 font-sans">
                        2
                      </span>
                      <h3 className="font-serif text-base text-white font-medium">Preserving Equity (Repairs &amp; Staging Prep)</h3>
                      <p className="text-xs sm:text-sm text-slate-405 text-slate-400 leading-relaxed font-light mt-1">
                        Do not list a home showing visible wear. Haroon organizes light high-ROI cosmetic updates: repairing drywall cracks, adding fresh neutral coats of paint, updating high-visibility light fixtures, professional deep cleans, and layout staging.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative">
                      <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-zinc-800 border-4 border-black flex items-center justify-center font-bold text-[8px] text-emerald-400 font-sans">
                        3
                      </span>
                      <h3 className="font-serif text-base text-white font-medium">Establishing Listing Strategy &amp; Pricing Models</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light mt-1">
                        We deploy custom pricing mechanisms tailored to market context. In seller-favored regimes, we may price slightly below market value with a firm offer-presentation date to provoke bidding clusters. In balanced regimes, we locate precise comparative sweet spots.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="relative">
                      <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-zinc-800 border-4 border-black flex items-center justify-center font-bold text-[8px] text-emerald-400 font-sans">
                        4
                      </span>
                      <h3 className="font-serif text-base text-white font-medium">Dynamic Multi-Channel Listing Launch</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light mt-1">
                        Our listings go live with flawless media assets—ultra-high-definition professional photos, 4K video walk-throughs, 3D floor plans and high-reach geographical social media campaigns targeting buyers on TRREB MLS, REALTOR.ca, and localized broker registers.
                      </p>
                    </div>

                    {/* Step 5 */}
                    <div className="relative">
                      <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-zinc-800 border-4 border-black flex items-center justify-center font-bold text-[8px] text-emerald-400 font-sans">
                        5
                      </span>
                      <h3 className="font-serif text-base text-white font-medium">Urgency Negotiation &amp; Offer Structuring</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light mt-1">
                        When offers arrive, Haroon's deep fiduciary expertise coordinates the layout. We verify buyer pre-approval certificates, cross-reference condition thresholds (such as financing or home inspections), and drive maximum leverage with counter-proposals to push prices upward.
                      </p>
                    </div>

                    {/* Step 6 */}
                    <div className="relative">
                      <span className="absolute -left-[35px] top-0 w-5 h-5 rounded-full bg-zinc-800 border-4 border-black flex items-center justify-center font-bold text-[8px] text-emerald-400 font-sans">
                        6
                      </span>
                      <h3 className="font-serif text-base text-white font-medium">Fulfilling Conditions &amp; Firm Closing</h3>
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-light mt-1">
                        We safely manage the interval. Upon deposit confirmation and condition waivers, the contract locks firm. Your solicitor coordinates mortgage registry discharges, tax adjustment allocations, and title deed updates. You hand over keys and receive capital deposits on closing day.
                      </p>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* Tab 2: Value Maximization Strategy */}
              {activeTab === 'value-max' && (
                <motion.div
                  key="value-max-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
                    <Sparkles className="w-6 h-6 text-emerald-500" />
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl text-white font-medium">Value Maximization Blueprint (High ROI Prep)</h2>
                      <p className="text-xs text-slate-404 font-light">Highly economical, targeted property updates yielding premium sale results</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                    Most homeowners overspend on large structural renovations that fail to break even on sale day. Instead, Haroon guides listing clients through high-leverage micro-adjustments designed to create massive psychological buyer impacts:
                  </p>

                  <div className="grid sm:grid-cols-2 gap-5 pt-2">
                    
                    {/* Strategy 1 */}
                    <div className="bg-black/50 border border-zinc-850 p-5 rounded-xl space-y-2">
                      <span className="text-2xl block text-emerald-400">01</span>
                      <h4 className="font-serif text-base text-white font-medium">Premium Neutral Painting</h4>
                      <p className="text-xs text-slate-402 leading-relaxed text-slate-400 font-light">
                        Colors represent direct emotion. Bold, dark, or personalized focus walls narrow a home's immediate appeal. Repainting with high-tier designer neutrals (whites, soft creams, warm warm-grays) brightens rooms, increases square footage perception, and yields up to **300% direct ROI**.
                      </p>
                    </div>

                    {/* Strategy 2 */}
                    <div className="bg-black/50 border border-zinc-850 p-5 rounded-xl space-y-2">
                      <span className="text-2xl block text-emerald-400">02</span>
                      <h4 className="font-serif text-base text-white font-medium">High-Output Lighting Upgrades</h4>
                      <p className="text-xs text-slate-402 leading-relaxed text-slate-400 font-light">
                        Dim and poorly balanced lighting repels prospective buyers. Replace dated fixtures with bright modern chic elements (matte-black or brass accents). Swap dated yellow incandescent bulbs with clean 3000K-4000K LED options to present crisp architectural features.
                      </p>
                    </div>

                    {/* Strategy 3 */}
                    <div className="bg-black/50 border border-zinc-850 p-5 rounded-xl space-y-2">
                      <span className="text-2xl block text-emerald-400">03</span>
                      <h4 className="font-serif text-base text-white font-medium">Curb Appeal and Entry Theater</h4>
                      <p className="text-xs text-slate-402 leading-relaxed text-slate-400 font-light">
                        First impressions lock within 10 seconds of arrival. Mow lawns, clear driveways, paint front entrance doors, and add modern numbering. Emphasize separate side entrances clearly since GTA multi-generational families prioritize clean basement privacy structures.
                      </p>
                    </div>

                    {/* Strategy 4 */}
                    <div className="bg-black/50 border border-zinc-850 p-5 rounded-xl space-y-2">
                      <span className="text-2xl block text-emerald-400">04</span>
                      <h4 className="font-serif text-base text-white font-medium">Decluttering and Clean Visuals</h4>
                      <p className="text-xs text-slate-402 leading-relaxed text-slate-400 font-light">
                        Prospective buyers must mentally insert their lives into your layout. Store secondary furniture, clear bathroom and kitchen countertops completely, empty closets by at least 40% to showcase abundance of storage, and arrange deep professional cleans.
                      </p>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* Tab 3: Premium Marketing Plan */}
              {activeTab === 'marketing' && (
                <motion.div
                  key="marketing-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
                    <Image className="w-6 h-6 text-emerald-500" />
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl text-white font-medium">Our Elite Marketing Campaign</h2>
                      <p className="text-xs text-slate-404 font-light">Injecting premium visual assets to capture modern qualified buyer interest</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                    Simply launching a property listing on MLS with low-resolution mobile photographs is an enormous threat to your equity. Outstanding marketing generates high desire and direct competition. Here is our meticulous baseline campaign for every listing:
                  </p>

                  <div className="space-y-3 pt-2">
                    
                    {/* Item 1 */}
                    <div className="flex items-start gap-4 bg-black/40 p-4 rounded-xl border border-zinc-850">
                      <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                        <Eye className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm text-white font-semibold font-sans">High-Definition Stills &amp; Drone Media</h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal font-light">
                          Our listing package coordinates professional wide-angle HDR interior and exterior photography, plus high-altitude dynamic drone footage to emphasize neighborhood topography, lot sizes, school proximities, and travel link metrics.
                        </p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-start gap-4 bg-black/40 p-4 rounded-xl border border-zinc-850">
                      <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                        <PenTool className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm text-white font-semibold font-sans">Dynamic Virtual Tours &amp; Floor Plans</h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal font-light">
                          Provide out-of-town, international, or high-intent buyers with seamless Matterport 3D virtual strolls and exact structural floor layouts. This limits showings to high-level buyers and builds direct biddings.
                        </p>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-start gap-4 bg-black/40 p-4 rounded-xl border border-zinc-850">
                      <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm text-white font-semibold font-sans">Socio-Analytical Digital Targeting</h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal font-light">
                          We do not wait passively for buyers on REALTOR.ca. We run targeted digital advertisements on Instagram, Facebook, and Google Ads, directing prospective buyers to premium customized single-property landing portals.
                        </p>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-start gap-4 bg-black/40 p-4 rounded-xl border border-zinc-850">
                      <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                        <Key className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm text-white font-semibold font-sans">High-Exposure Broker Showings &amp; Events</h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal font-light">
                          Haroon hosts calculated Broker Open Houses to expose your listings directly inside top-tier private groups. We follow up systemically with every guest to convert interest fields into hard legal agreements.
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* Tab 4: Fiduciary Advantage */}
              {activeTab === 'broker-value' && (
                <motion.div
                  key="broker-value-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl text-white font-medium">The Premium Fiduciary Shield</h2>
                      <p className="text-xs text-slate-404 font-light">How professional broker representation secures your capital reserves</p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                    Some homeowners seek to sell on their own (FSBO) to bypass professional commissions. However, Canadian statistics show FSBO sales typically secure **10% to 15% less** than broker-orchestrated negotiations, while carrying enormous legal liabilities. Haroon offers bulletproof protection throughout:
                  </p>

                  <div className="space-y-4 pt-2">
                    
                    {/* Benefit Item */}
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mt-1 text-[10px]">&bull;</div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm text-white font-semibold font-sans">Supreme Buyer Urgency Management</h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal font-light">
                          Unrepresented sellers often expose their emotional and financial pressure. Direct negotiation is a psychological game. Haroon operates as a strategic protective barrier, filtering out low-ballers and holding buyer agents accountable.
                        </p>
                      </div>
                    </div>

                    {/* Benefit Item */}
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mt-1 text-[10px]">&bull;</div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm text-white font-semibold font-sans">Complete MLS Urgency &amp; Reach</h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal font-light">
                          Over 92% of reliable buyer transactions utilize real estate agents licensed under the TRREB. By placing your listing across all premium MLS databases, we trigger direct alerts to thousands of active agents representing immediate qualified buyers.
                        </p>
                      </div>
                    </div>

                    {/* Benefit Item */}
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mt-1 text-[10px]">&bull;</div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm text-white font-semibold font-sans">Flawless RECO Compliance &amp; Contracts</h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal font-light">
                          Real estate contracts carry enormous binding strength. Errors in deposit timelines, warranty descriptions, or disclosure compliance checklist items can trigger massive litigation. Haroon constructs airtight corporate agreements.
                        </p>
                      </div>
                    </div>

                    {/* Benefit Item */}
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mt-1 text-[10px]">&bull;</div>
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-sm text-white font-semibold font-sans">A Elite Top-Producer Network</h4>
                        <p className="text-[11px] sm:text-xs text-slate-400 leading-normal font-light">
                          Working within the elite command structure under **HomeLife Superstars Real Estate Ltd., Brokerage**, Haroon shares previews with thousands of active, top-performing agents, often unlocking solid buyers before going live.
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* Tab 5: Net Proceeds of Sale Calculator */}
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
                      <h2 className="font-serif text-xl sm:text-2xl text-white font-medium">Net Proceeds of Sale Modeler</h2>
                      <p className="text-xs text-slate-404 font-light">Estimate your total transactional disbursements and dynamic net cash returns</p>
                    </div>
                  </div>

                  {/* Calculator Inputs */}
                  <div className="grid sm:grid-cols-3 gap-4 bg-black p-4 rounded-xl border border-zinc-850">
                    
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400 font-medium font-bold">
                        Target Sale Price ($)
                      </label>
                      <input
                        type="number"
                        value={salePrice}
                        onChange={(e) => setSalePrice(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400 font-medium whitespace-nowrap">
                        Realtor Comm. (Listing + Buyer %)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-400 font-medium">
                        Pre-Listing Updates ($)
                      </label>
                      <input
                        type="number"
                        value={preListingInvestments}
                        onChange={(e) => setPreListingInvestments(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                      />
                    </div>

                  </div>

                  {/* Secondary Details Inputs Row */}
                  <div className="grid sm:grid-cols-3 gap-4 bg-black/40 p-4 rounded-xl border border-zinc-900/60">
                    
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 font-medium">
                        Legal Fees &amp; Admin ($)
                      </label>
                      <input
                        type="number"
                        value={legalFees}
                        onChange={(e) => setLegalFees(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-slate-500 font-medium">
                        Mortgage Registry/Discharge ($)
                      </label>
                      <input
                        type="number"
                        value={mortgageDischarge}
                        onChange={(e) => setMortgageDischarge(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5 flex flex-col justify-end">
                      <label className="flex items-center gap-2 cursor-pointer bg-black/40 border border-zinc-850 hover:border-zinc-800 px-3 py-2 rounded-lg text-slate-300 select-none pb-2.5 h-10">
                        <input
                          type="checkbox"
                          checked={isHstOnCommission}
                          onChange={(e) => setIsHstOnCommission(e.target.checked)}
                          className="w-4 h-4 accent-emerald-500 rounded border-zinc-850 cursor-pointer"
                        />
                        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-450 text-slate-400 font-bold">Add 13% HST on Comm.?</span>
                      </label>
                    </div>

                  </div>

                  {/* Calculation Breakdown */}
                  <div className="grid sm:grid-cols-2 gap-6 pt-2">
                    
                    {/* Column 1: Commission Details */}
                    <div className="space-y-3 bg-black/45 p-5 rounded-xl border border-zinc-900/40">
                      <h4 className="text-xs uppercase tracking-widest text-slate-400 font-mono font-bold pb-2 border-b border-zinc-850">
                        1. Professional Brokerage Fee
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center text-slate-404 text-slate-400 font-light">
                          <span>Base Commission Rate ({commissionRate}%)</span>
                          <span className="text-slate-200">${rawCommission.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                        {isHstOnCommission && (
                          <div className="flex justify-between items-center text-slate-404 text-slate-400 font-light">
                            <span>Ontario HST (13% on service fee)</span>
                            <span className="text-slate-300">${hstTax.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-white font-bold pt-2 border-t border-zinc-850 mt-2 font-sans">
                          <span>Total Brokerage Service Cost</span>
                          <span className="text-emerald-400">${totalCommission.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Other Outflows */}
                    <div className="space-y-3 bg-black/45 p-5 rounded-xl border border-zinc-900/40">
                      <h4 className="text-xs uppercase tracking-widest text-slate-400 font-mono font-bold pb-2 border-b border-zinc-850">
                        2. Transaction Adjustments
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center text-slate-404 text-slate-400 font-light">
                          <span>Pre-Listing Preparations</span>
                          <span className="text-slate-200">${preListingInvestments.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-404 text-slate-400 font-light">
                          <span>Barrister Legal Charges &amp; Deeds</span>
                          <span className="text-slate-200">${legalFees.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-404 text-slate-400 font-light">
                          <span>Mortgage Discharge Registry Fee</span>
                          <span className="text-slate-200">${mortgageDischarge.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center text-white font-bold pt-2 border-t border-zinc-850 mt-2 font-sans">
                          <span>Auxiliary Transition Sum</span>
                          <span className="text-emerald-400">${(preListingInvestments + legalFees + mortgageDischarge).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Summary Net proceeds block */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 shadow-inner">
                    <div className="text-center sm:text-left">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                        Estimated Net Transactional Capital
                      </span>
                      <p className="text-[11px] text-slate-400 font-light font-sans mt-0.5">
                        Your direct net proceeds of sale before current mortgage balance pay-downs.
                      </p>
                    </div>
                    <div className="text-center sm:text-right">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                        ${netProceeds.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                      </span>
                      <span className="block text-[9px] uppercase font-mono text-slate-500 tracking-wider mt-0.5">
                        Sale Price Minus Commissions &amp; Fees
                      </span>
                    </div>
                  </div>

                  {/* Disclosure Note */}
                  <div className="flex gap-2 text-[10px] text-slate-500 font-sans leading-normal font-light pt-2 italic">
                    <Info className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Disclaimer: This tool calculates tentative transactional projections. Net returns do not formulate final binding figures. HST taxes, legal disbursements, mortgage pre-payment penalties, and property tax adjustments are verified as accurate strictly on key-day execution by your licensed legal and mortgage representatives.
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
