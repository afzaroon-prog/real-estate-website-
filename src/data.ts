import { Listing } from './types';

export const gtaCities = [
  'GTA',
  'Toronto',
  'Mississauga',
  'Brampton',
  'Oakville',
  'Milton',
  'Burlington',
  'Vaughan',
  'Etobicoke',
  'Halton',
  'Peel'
];

export const listingsData: Listing[] = [
  {
    id: 'prop-1',
    title: 'Exquisite Modern Custom Mansion',
    price: 2499000,
    address: '88 Edenbridge Drive',
    city: 'Toronto',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    beds: 5,
    baths: 6,
    garage: 3,
    sqft: 4800,
    type: 'residential',
    status: 'for-sale',
    description: 'Welcome to an architectural masterpiece in one of Torontos most prestigious enclaves. Custom-designed from the ground up, this modern masterpiece features dramatic floor-to-ceiling windows, an Italian design chef kitchen with high-end Sub-Zero and Wolf appliances, a glass wine cellar, and a spectacular smart-home automation system. The sprawling prime bedroom terrace offers panoramic natural views.',
    features: ['Chef\'s Kitchen', 'Wine Cellar', 'Smart Home System', 'Finished Basement', 'Heated Flooring', 'In-ground Pool'],
    yearBuilt: 2023
  },
  {
    id: 'prop-2',
    title: 'Prestigious Family Estate',
    price: 1899900,
    address: '142 Mississauga Road',
    city: 'Mississauga',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    beds: 4,
    baths: 4.5,
    garage: 2,
    sqft: 3600,
    type: 'residential',
    status: 'for-sale',
    description: 'An executive residence nestled on a premium wooded lot on Mississauga Road. Boasting rich oak hardwood floors throughout, an open-concept formal living and dining area, custom wainscoting, and a professional-grade home office. The fully landscaped deep backyard features a spacious cedar deck perfect for summer entertaining. Minutes to UTM, direct transit, and prestigious golf clubs.',
    features: ['Wooded Lot', 'Home Office', 'Cedar Deck', 'Hardwood Floors', 'Wainscoting', 'Irrigation System'],
    yearBuilt: 2018
  },
  {
    id: 'prop-3',
    title: 'Luxury Contemporary Ravine Villa',
    price: 1549000,
    address: '45 Castlemore Drive',
    city: 'Brampton',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    beds: 4,
    baths: 3.5,
    garage: 2,
    sqft: 3100,
    type: 'residential',
    status: 'for-sale',
    description: 'Exceptional contemporary design backing directly onto a lush green ravine in highly desirable East Castlemore. High ceilings, soaring 18ft foyer, floating oak stairs with glass railing, and a spectacular open concept sunlit layout. The designer kitchen contains double quartz islands, premium built-in appliances, and custom cabinets. Fully completed walk-out basement.',
    features: ['Ravine Lot', 'Walk-out Basement', 'Double Quartz Islands', '18ft Foyer', 'Glass Railings', 'LED Lighting'],
    yearBuilt: 2021
  },
  {
    id: 'prop-4',
    title: 'Beautiful Semi-Detached Family Home',
    price: 1149000,
    address: '56 Elmhurst Drive',
    city: 'GTA',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    beds: 3,
    baths: 3,
    garage: 1,
    sqft: 1950,
    type: 'residential',
    status: 'for-sale',
    description: 'Immaculate semi-detached home nestled in the heart of the GTA. Completely renovated from top to bottom with custom modern upgrades, custom quartz countertops, customized kitchen cabinetry, recessed pot lights, and a completely separate legal side entrance leading to a fully finished basement in-law suite (potential rental income!). Long driveway and deep backyard.',
    features: ['Newly Renovated', 'Separate Legal Entrance', 'Finished Suite', 'Pot Lights', 'Deep Lot', 'Near Humber College'],
    yearBuilt: 1992
  },
  {
    id: 'prop-5',
    title: 'Sleek Executive Sky Penthouse',
    price: 899000,
    address: '250 Front Street West, Penthouse 4',
    city: 'Toronto',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    beds: 2,
    baths: 2,
    garage: 1,
    sqft: 1200,
    type: 'condo',
    status: 'for-sale',
    description: 'Stunning downtown Toronto penthouse condo offering breathtaking views of the CN Tower and Lake Ontario. Featuring custom 10ft high concrete ceilings, custom European cabinetry, floor-to-ceiling windows, and top-tier engineered hardwood floors. Take full advantage of five-star building amenities including a rooftop infinity pool, 24-hr concierge, and wellness gym.',
    features: ['Penthouse Unit', 'CN Tower View', 'Rooftop Pool', '24-hr Concierge', '10ft Ceilings', 'Transit Score 100'],
    yearBuilt: 2020
  },
  {
    id: 'prop-6',
    title: 'Corporate Professional Office Center',
    price: 3200000,
    address: '1450 Hurontario Street',
    city: 'Mississauga',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    beds: 0,
    baths: 4,
    garage: 12,
    sqft: 6500,
    type: 'commercial',
    status: 'for-sale',
    description: 'Premium modern corporate headquarters office build with incredible exposure on Hurontario St corridor. Impeccable modern design layout containing multiple boardrooms, private executive office suites, kitchen, and dedicated customer greeting lobby area. Fully equipped with modern fiber-optic cabling, secure swipe card access, and a massive private park-and-ride driveway plot.',
    features: ['High Traffic Exposure', 'Executive Suites', 'Fiber Optic Ready', 'Security Swipe Access', '12+ Parking Spaces', 'Transit Accessible'],
    yearBuilt: 2015
  },
  {
    id: 'prop-7',
    title: 'Luxury Oakville Waterfront Condo',
    price: 980000,
    address: '100 Bronte Road, Suite 502',
    city: 'Oakville',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    beds: 2,
    baths: 2,
    garage: 2,
    sqft: 1350,
    type: 'condo',
    status: 'for-sale',
    description: 'Immaculate lakefront condominium suite in the heart of prestigious Bronte Harbour. Enjoy morning coffees on your wrap-around glass balcony overlooking Lake Ontario and the marina. Upgraded quartz kitchen, spa-like ensuite bath, and two underground parking stalls included.',
    features: ['Waterfront View', 'Wrap-around Balcony', '2 Parking Stalls', 'Walk to Marina', 'Quartz Kitchen', 'Concierge'],
    yearBuilt: 2022
  },
  {
    id: 'prop-8',
    title: 'Executive Milton Escarpment Detached',
    price: 1389000,
    address: '410 Tremaine Road',
    city: 'Milton',
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
    beds: 4,
    baths: 3.5,
    garage: 2,
    sqft: 2850,
    type: 'residential',
    status: 'for-sale',
    description: 'Spacious 4-bedroom executive detached residence located near the Niagara Escarpment. Bright open concept foyer, 9ft smooth ceilings, hardwood floors, and a gorgeous modern gourmet kitchen with center island. Family-friendly quiet neighborhood close to parks, top schools, and Highway 401.',
    features: ['Escarpment Views', 'Gourmet Kitchen', '9ft Ceilings', 'Quiet Court', 'Double Garage', 'Gas Fireplace'],
    yearBuilt: 2021
  },
  {
    id: 'prop-9',
    title: 'Square One City Center Condo Suite',
    price: 679000,
    address: '3880 Duke of York Blvd, Suite 1805',
    city: 'Mississauga',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    beds: 1,
    baths: 1,
    garage: 1,
    sqft: 750,
    type: 'condo',
    status: 'for-sale',
    description: 'Modern sun-filled 1-bedroom plus den condominium located steps from Square One Shopping Centre and Sheridan College. Floor-to-ceiling windows, stainless steel appliances, laminate flooring throughout, and low monthly maintenance fees. Ideal for first-time buyers or investors.',
    features: ['Steps to Square One', 'Den / Office Area', 'Laminate Flooring', 'Low Maint Fees', 'Gym & Bowling Alley', 'Locker Included'],
    yearBuilt: 2019
  },
  {
    id: 'prop-10',
    title: 'Designer Burlington Ravine Townhome',
    price: 925000,
    address: '2215 Appleby Line',
    city: 'Burlington',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    beds: 3,
    baths: 2.5,
    garage: 1,
    sqft: 1800,
    type: 'townhome',
    status: 'for-sale',
    description: 'Beautiful executive freehold townhome backing onto serene green space in Alton Village, Burlington. Private fenced backyard, finished recreation room, custom stone kitchen counters, and spacious primary bedroom with walk-in closet and ensuite.',
    features: ['Freehold Townhome', 'Backs to Green Space', 'Finished Rec Room', 'Primary Ensuite', 'Stone Counters', 'Near Go Transit'],
    yearBuilt: 2017
  }
];

export const testimonials = [
  {
    name: 'Muhammad & Fatima S.',
    location: 'GTA, ON',
    quote: 'Haroon Afzal is exceptional! He guided us expertly through buying our first home in the GTA. His advice was direct, professional, and saved us thousands. We recommend Haroon to everyone who wants peace of mind.'
  },
  {
    name: 'David and Sarah K.',
    location: 'Brampton, ON',
    quote: 'We listed our property with Haroon and we were blown away by his Free Home Evaluation. He advised exactly what details to upgrade, marketed the home brilliantly, and secured multiple offers within 4 days. Incredible broker!'
  },
  {
    name: 'Gurpreet S.',
    location: 'Mississauga, ON',
    quote: 'Haroon represents structural professionalism. His understanding of the Ontario Land Transfer Tax system and GTA neighborhoods is unparalleled. He and HomeLife Superstars Real Estate made managing our investment portfolio seamless.'
  }
];

export const faqQuestions = [
  {
    question: 'What documents and procedures are required for a Free Home Evaluation?',
    answer: 'A Free Home Evaluation requires basic details about your home layout (size, beds, baths, upgrades, year built, and property condition) and address. Haroon will analyze local real-time MLS listings, historical sales data, and neighborhood trends across the GTA to prepare a comprehensive comparative market evaluation.'
  },
  {
    question: 'How do first-time home buyers calculate land transfer tax in Ontario?',
    answer: 'First-time home buyers in Ontario are eligible for a land transfer tax refund/rebate up to $4,000 for the provincial tax. If the property is located in Toronto (which has an additional municipal tax), buyers are also eligible for an additional municipal rebate of up to $4,475. Our Land Transfer Tax Calculator computes these exact savings automatically!'
  },
  {
    question: 'What is the "Area Alert" and how does it benefit home hunters?',
    answer: 'The Area Alert is a direct personalized neighborhood notification system. Instead of constantly checking MLS, you enter your search queries (budget, city, beds, baths) and Haroon receives a feed of upcoming, off-market, or listed homes in your target region. This grants you a competitive edge when bidding on top deals!'
  },
  {
    question: 'How do I start the buying or listing process with Haroon Afzal?',
    answer: 'Simply call direct at 647-297-4080, email info@haroonafzal.com, or use our streamlined online scheduler. Haroon will set up an in-person or digital session to craft your listing strategy or mortgage qualification assessment.'
  }
];
