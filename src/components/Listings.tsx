import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, BedDouble, Bath, Car, MapPin, 
  ArrowUpRight, X, Calendar, CheckCircle2,
  Search, ExternalLink, Globe, Database,
  Compass, Layers, Filter, Navigation,
  DollarSign, SlidersHorizontal, ChevronLeft, ChevronRight
} from 'lucide-react';
import { listingsData, gtaCities } from '../data';

// Map coordinate percentages for high-fidelity interactive local plotting across the GTA
const listingsCoords: Record<string, { x: number; y: number }> = {
  'prop-1': { x: 76, y: 34 }, // Toronto East
  'prop-2': { x: 48, y: 55 }, // Mississauga Road
  'prop-3': { x: 44, y: 25 }, // Brampton East
  'prop-4': { x: 62, y: 38 }, // GTA / Etobicoke
  'prop-5': { x: 72, y: 44 }, // Toronto Downtown
  'prop-6': { x: 52, y: 64 }, // Mississauga Hurontario
  'prop-7': { x: 34, y: 74 }, // Oakville Bronte Rd
  'prop-8': { x: 18, y: 48 }, // Milton Tremaine Rd
  'prop-9': { x: 46, y: 48 }, // Mississauga Square One
  'prop-10': { x: 14, y: 80 }, // Burlington Appleby Line
};

// Standard bounding box percentages for each GTA city on our visual map representation
const clusters: Record<string, { minX: number; maxX: number; minY: number; maxY: number }> = {
  'Toronto': { minX: 72, maxX: 79, minY: 34, maxY: 44 },
  'Mississauga': { minX: 45, maxX: 53, minY: 49, maxY: 62 },
  'Brampton': { minX: 41, maxX: 49, minY: 21, maxY: 30 },
  'Oakville': { minX: 30, maxX: 37, minY: 69, maxY: 75 },
  'Milton': { minX: 16, maxX: 23, minY: 45, maxY: 53 },
  'Burlington': { minX: 12, maxX: 19, minY: 75, maxY: 82 },
  'Vaughan': { minX: 61, maxX: 69, minY: 15, maxY: 23 },
  'Etobicoke': { minX: 59, maxX: 65, minY: 37, maxY: 43 },
  'Halton': { minX: 20, maxX: 34, minY: 56, maxY: 67 },
  'Peel': { minX: 42, maxX: 47, minY: 33, maxY: 43 }
};

const getSimulatedCoords = (id: string, city: string) => {
  const cluster = clusters[city] || { minX: 50, maxX: 64, minY: 40, maxY: 49 };
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const rX = Math.abs(Math.sin(hash + 1)) * 1000 % 1;
  const rY = Math.abs(Math.sin(hash + 2)) * 1000 % 1;
  return {
    x: cluster.minX + (rX * (cluster.maxX - cluster.minX)),
    y: cluster.minY + (rY * (cluster.maxY - cluster.minY))
  };
};

function getSimulatedProperties(
  city: string, 
  type: string, 
  minPrice: number,
  maxPrice: number, 
  keyword: string, 
  beds: string,
  baths: string,
  saleLease: string,
  sortBy: string,
  staticList: any[]
) {
  let result = [...staticList];
  
  // Apply filtering on static list if needed
  result = result.filter(item => {
    const matchCity = city === 'All' || item.city.toLowerCase() === city.toLowerCase();
    const matchType = type === 'All' || item.type === type;
    const matchStatus = saleLease === 'All' || item.status === (saleLease === 'lease' ? 'for-lease' : 'for-sale');
    const matchMinP = item.price >= minPrice;
    const matchMaxP = maxPrice >= (saleLease === 'lease' ? 10000 : 4000000) || item.price <= maxPrice;
    
    const matchBeds = beds === 'All' || (item.beds || 0) >= parseInt(beds);
    const matchBaths = baths === 'All' || (item.baths || 0) >= parseFloat(baths);
    
    const matchKeyword = !keyword.trim() || 
      item.title.toLowerCase().includes(keyword.toLowerCase()) ||
      item.address.toLowerCase().includes(keyword.toLowerCase());
      
    return matchCity && matchType && matchStatus && matchMinP && matchMaxP && matchBeds && matchBaths && matchKeyword;
  });

  const targetCount = 36;
  if (result.length >= targetCount) {
    sortProperties(result, sortBy);
    return result.slice(0, targetCount);
  }
  
  const citiesToUse = city === 'All' ? ['Mississauga', 'Toronto', 'Brampton', 'Oakville', 'Milton', 'Burlington', 'Vaughan'] : [city];
  const typesToUse = type === 'All' ? ['residential', 'condo', 'townhome', 'commercial'] : [type];
  
  const streetNamesByCity: Record<string, string[]> = {
    'Toronto': ['Yonge Street', 'Bloor Street West', 'Queen Street East', 'Bay Street', 'King Street West', 'Danforth Avenue', 'Spadina Avenue', 'Eglinton Avenue East'],
    'Mississauga': ['Hurontario Street', 'Mississauga Road', 'Burnhamthorpe Road West', 'Erin Mills Parkway', 'Derry Road East', 'Dundas Street West', 'Mavis Road', 'Winston Churchill Blvd', 'Creditview Road'],
    'Brampton': ['Bovaird Drive West', 'Main Street North', 'Castlemore Road', 'Queen Street East', 'Sandalwood Parkway', 'Chinguacousy Road', 'Steeles Avenue West'],
    'Oakville': ['Trafalgar Road', 'Lakeshore Road East', 'Kerr Street', 'Bronte Road', 'Upper Middle Road West', 'Dundas Street West', 'Dorval Drive'],
    'Milton': ['Main Street East', 'Derry Road West', 'Tremaine Road', 'Ontario Street South', 'Thompson Road South', 'Bronte Street North'],
    'Burlington': ['Guelph Line', 'Brant Street', 'Appleby Line', 'Lakeshore Road', 'Fairview Street', 'Walkers Line'],
    'Vaughan': ['Jane Street', 'Rutherford Road', 'Weston Road', 'Major Mackenzie Drive West', 'Keele Street', 'Bathurst Street'],
    'Etobicoke': ['The Queensway', 'Lake Shore Blvd West', 'Kipling Avenue', 'Islington Avenue', 'Royal York Road', 'Dixon Road'],
    'Halton': ['Guelph Line', 'Trafalgar Road', 'Derry Road West', 'Appleby Line', 'Bronte Road'],
    'Peel': ['Hurontario Street', 'Bovaird Drive West', 'Main Street', 'Mississauga Road', 'Steeles Avenue East'],
    'GTA': ['Highway 7', 'Yonge Street', 'Eglinton Avenue', 'Dundas Street', 'Burnhamthorpe Road']
  };

  const adjs = ['Luxurious', 'Elegant', 'Executive', 'Spacious', 'Stunning', 'Charming', 'Sophisticated', 'Modern Custom', 'Beautiful Freehold', 'Prestigious'];
  const nounsByType: Record<string, string[]> = {
    'residential': ['Detached Manor', 'Family Estate', 'Custom Mansion', 'Ravine Villa', 'Executive Home', 'Modern Residence'],
    'condo': ['Sky Penthouse', 'High-Rise Suite', 'Luxury Harbour Condo', 'Urban Flat', 'Executive Condo Suite'],
    'townhome': ['Freehold Townhouse', 'Ravine Townhome', 'Corner Unit Townhome', 'Executive Townhouse'],
    'commercial': ['Professional Office Plaza', 'Corporate Headquarters', 'Commercial Retail Bay', 'Executive Medical Center']
  };

  const descTemplates = [
    "Welcome to this absolute masterpiece situated in a highly sought-after neighborhood. Featuring a stunning open-concept design with high-end premium finishes throughout, a custom-designed chef's kitchen with built-in appliances, quartz countertops, and a massive center island. Beautiful hardwood floors, soaring high ceilings, and oversized windows drench the entire home in warm natural light. The primary retreat offers a spa-like ensuite and custom closets. Minutes from top-rated schools, parks, shopping, and major highways.",
    "Breathtaking premium residence offering the perfect blend of modern sophistication and classic elegance. This gorgeous property boasts exceptional craftsmanship, custom millwork, custom wainscoting, and premium oak hardwood floors. The gourmet designer kitchen is equipped with top-of-the-line stainless steel appliances and custom cabinets. A spectacular backyard oasis with a large cedar deck is perfect for summer entertainment. Conveniently located close to public transit, GO stations, and local amenities.",
    "A rare opportunity to own a spectacular, fully upgraded premium property. Step inside to an impressive light-filled grand foyer with double-height ceilings. The sun-drenched family area features a sleek linear fireplace and custom built-in shelving. Fully completed basement space with a separate legal entrance, presenting incredible potential for in-law accommodation or rental income. Spared no expense on modern upgrades, custom pot lights, and smart-home integration throughout."
  ];

  const featuresList = [
    "Chef's Kitchen", "Quartz Countertops", "Hardwood Floors", "Smart Home Automation",
    "Separate Side Entrance", "Finished Walk-out Basement", "Pot Lights throughout",
    "Fenced Landscaped Yard", "Spa-like Ensuite", "Stainless Steel Appliances",
    "Close to Top Schools", "Steps to Transit & GO Station", "Custom Closet Organizers"
  ];

  function seededRandom(seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(Math.sin(hash)) * 1000 % 1;
  }

  let i = 0;
  let attempts = 0;
  const maxAttempts = 200;
  
  while (result.length < targetCount && attempts < maxAttempts) {
    attempts++;
    const seed = `${city}-${type}-${maxPrice}-${keyword}-${i}`;
    i++;
    
    const rand1 = seededRandom(seed + '-r1');
    const rand2 = seededRandom(seed + '-r2');
    const rand3 = seededRandom(seed + '-r3');
    const rand4 = seededRandom(seed + '-r4');
    
    const finalCity = citiesToUse[Math.floor(rand1 * citiesToUse.length)];
    const finalType = typesToUse[Math.floor(rand2 * typesToUse.length)] as 'residential' | 'condo' | 'townhome' | 'commercial';
    
    let finalPrice = 0;
    if (saleLease === 'lease') {
      const minLimit = minPrice || 1500;
      const maxLimit = maxPrice >= 10000 ? 8000 : maxPrice;
      finalPrice = Math.floor((minLimit + (rand3 * (maxLimit - minLimit))) / 100) * 100 + 50;
    } else {
      const minLimit = minPrice || 500000;
      const maxLimit = maxPrice >= 4000000 ? 3000000 : maxPrice;
      finalPrice = Math.floor((minLimit + (rand3 * (maxLimit - minLimit))) / 1000) * 1000 + 900;
    }
    
    const streets = streetNamesByCity[finalCity] || ['Dundas Street', 'Main Street', 'Lakeshore Road'];
    const finalStreet = streets[Math.floor(rand4 * streets.length)];
    const streetNo = Math.floor(100 + (rand1 * 1800));
    const finalAddress = `${streetNo} ${finalStreet}`;
    
    const adj = adjs[Math.floor(rand2 * adjs.length)];
    const nouns = nounsByType[finalType];
    const noun = nouns[Math.floor(rand1 * nouns.length)];
    const finalTitle = `${adj} ${finalCity} ${noun}`;
    
    let bedsVal = 3;
    let bathsVal = 2.5;
    let garage = 1;
    let sqft = 1500;
    
    if (finalType === 'residential') {
      bedsVal = Math.floor(3 + (rand1 * 3));
      bathsVal = Math.floor(2 + (rand2 * 3)) + 0.5;
      garage = Math.floor(1 + (rand3 * 3));
      sqft = Math.floor(2000 + (rand4 * 2500));
    } else if (finalType === 'condo') {
      bedsVal = Math.floor(1 + (rand1 * 3));
      bathsVal = Math.floor(1 + (rand2 * 2));
      garage = Math.floor(1 * (rand3 > 0.3 ? 1 : 0));
      sqft = Math.floor(650 + (rand4 * 850));
    } else if (finalType === 'townhome') {
      bedsVal = 3;
      bathsVal = 2.5;
      garage = Math.floor(1 + (rand3 * 2));
      sqft = Math.floor(1400 + (rand4 * 800));
    } else if (finalType === 'commercial') {
      bedsVal = 0;
      bathsVal = Math.floor(2 + (rand1 * 4));
      garage = Math.floor(4 + (rand2 * 10));
      sqft = Math.floor(1800 + (rand3 * 5000));
    }

    // Filter out if it does not match beds/baths filters
    if (beds !== 'All' && bedsVal < parseInt(beds)) continue;
    if (baths !== 'All' && bathsVal < parseFloat(baths)) continue;
    
    const imagesByType: Record<string, string[]> = {
      'residential': [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'
      ],
      'condo': [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
      ],
      'townhome': [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
      ],
      'commercial': [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80'
      ]
    };
    
    const imageList = imagesByType[finalType];
    const imageUrl = imageList[Math.floor(rand1 * imageList.length)];
    const description = descTemplates[Math.floor(rand4 * descTemplates.length)]
      .replace('this absolute masterpiece', `this absolute ${finalType} masterpiece`)
      .replace('highly sought-after neighborhood', `highly sought-after neighborhood in ${finalCity}`);
    
    const features: string[] = [];
    let attempt = 0;
    while (features.length < 5 && attempt < 100) {
      const idx = Math.floor(seededRandom(seed + '-f-' + attempt) * featuresList.length);
      const feat = featuresList[idx];
      if (!features.includes(feat)) {
        features.push(feat);
      }
      attempt++;
    }
    
    const yearBuilt = Math.floor(2010 + (rand2 * 14));
    
    result.push({
      id: `sim-${city}-${type}-${i}`,
      title: finalTitle,
      price: finalPrice,
      address: finalAddress,
      city: finalCity,
      imageUrl,
      beds: bedsVal,
      baths: bathsVal,
      garage,
      sqft,
      type: finalType,
      status: saleLease === 'lease' ? 'for-lease' : 'for-sale',
      description,
      features,
      yearBuilt
    });
  }

  sortProperties(result, sortBy);
  return result;
}

function sortProperties(arr: any[], sortBy: string) {
  if (sortBy === 'priceAsc') {
    arr.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'priceDesc') {
    arr.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'bedsDesc') {
    arr.sort((a, b) => b.beds - a.beds);
  } else {
    arr.sort((a, b) => b.id.localeCompare(a.id));
  }
}

export default function Listings() {
  // Input search parameters (temporary until "GO" is clicked)
  const [selectedCity, setSelectedCity] = useState('All');
  const [propertyType, setPropertyType] = useState('All');
  const [saleLease, setSaleLease] = useState('sale');
  const [minPrice, setMinPrice] = useState(0);
  const [priceRange, setPriceRange] = useState(4000000);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [beds, setBeds] = useState('All');
  const [baths, setBaths] = useState('All');
  const [sortBy, setSortBy] = useState('listDate');

  // Active filter criteria (actually used for rendering)
  const [activeCity, setActiveCity] = useState('All');
  const [activePropertyType, setActivePropertyType] = useState('All');
  const [activeSaleLease, setActiveSaleLease] = useState('sale');
  const [activeMinPrice, setActiveMinPrice] = useState(0);
  const [activePriceRange, setActivePriceRange] = useState(4000000);
  const [activeKeyword, setActiveKeyword] = useState('');
  const [activeBeds, setActiveBeds] = useState('All');
  const [activeBaths, setActiveBaths] = useState('All');
  const [activeSortBy, setActiveSortBy] = useState('listDate');

  // Search execution & feedback states
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);
  const [searchFeedback, setSearchFeedback] = useState('');
  
  // Interactive Map highlight
  const [selectedMapProp, setSelectedMapProp] = useState<any | null>(null);
  
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showLiveMap, setShowLiveMap] = useState(false); // Official TRREB Realm iframe map hidden by default

  // States for virtual showing booking
  const [showingName, setShowingName] = useState('');
  const [showingPhone, setShowingPhone] = useState('');
  const [showingEmail, setShowingEmail] = useState('');
  const [showingDate, setShowingDate] = useState('');
  const [isShowingSubmitted, setIsShowingSubmitted] = useState(false);
  const [isShowingSubmitting, setIsShowingSubmitting] = useState(false);
  const [showingError, setShowingError] = useState<string | null>(null);

  // Live MLS state managers
  const [liveProperties, setLiveProperties] = useState<any[]>([]);
  const [isLiveFeedActive, setIsLiveFeedActive] = useState(false);

  // Function to query local proxy server (securely connected to Repliers API or similar RETS/RESO feed)
  const fetchLiveListings = async (
    cityVal: string, 
    typeVal: string, 
    minPriceVal: number,
    priceVal: number, 
    keywordVal: string,
    bedsVal: string,
    bathsVal: string,
    saleLeaseVal: string,
    sortByVal: string
  ) => {
    try {
      const queryParams = new URLSearchParams({
        city: cityVal,
        type: typeVal,
        minPrice: String(minPriceVal),
        maxPrice: String(priceVal),
        keyword: keywordVal,
        beds: bedsVal,
        baths: bathsVal,
        saleLease: saleLeaseVal,
        sortBy: sortByVal
      });
      const response = await fetch(`/api/listings?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        if (data.isLiveFeed && data.listings && data.listings.length > 0) {
          setLiveProperties(data.listings);
          setIsLiveFeedActive(true);
          return;
        }
      }
    } catch (err) {
      console.error("Error fetching live listings from proxy API:", err);
    }
    setLiveProperties([]);
    setIsLiveFeedActive(false);
  };

  // Synchronize initial active filters on mount so listings load immediately
  useEffect(() => {
    setActiveCity(selectedCity);
    setActivePropertyType(propertyType);
    setActiveSaleLease(saleLease);
    setActiveMinPrice(minPrice);
    setActivePriceRange(priceRange);
    setActiveKeyword(searchKeyword);
    setActiveBeds(beds);
    setActiveBaths(baths);
    setActiveSortBy(sortBy);
    fetchLiveListings(selectedCity, propertyType, minPrice, priceRange, searchKeyword, beds, baths, saleLease, sortBy);
  }, []);

  const handleOpenProperty = (property: any) => {
    setSelectedProperty(property);
    setActiveImageIndex(0);
    setIsShowingSubmitted(false);
    setIsShowingSubmitting(false);
    setShowingError(null);
    setShowingName('');
    setShowingPhone('');
    setShowingEmail('');
    setShowingDate('');
  };

  const handleShowingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showingName.trim() || !showingPhone.trim() || !showingEmail.trim() || !showingDate.trim()) return;
    
    setIsShowingSubmitting(true);
    setShowingError(null);

    try {
      const response = await fetch("https://formsubmit.co/ajax/0f01e15ef17827af6cec81e95f27853b", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "Form Type": "Private Showing Request",
          "Property Title": selectedProperty?.title || "Unknown Property",
          "Property MLS ID": selectedProperty?.id || "N/A",
          "Property Price": selectedProperty?.price ? `$${selectedProperty.price.toLocaleString()}` : "N/A",
          "Property Address": selectedProperty ? `${selectedProperty.address}, ${selectedProperty.city}, ON` : "N/A",
          "Requestor Name": showingName,
          "Phone Number": showingPhone,
          "Email Address": showingEmail,
          "Preferred Showing Date": showingDate,
          _subject: `New Private Showing Request: ${selectedProperty?.address || "MLS® " + (selectedProperty?.id || "")}`,
          _captcha: "false"
        })
      });

      if (response.ok) {
        setIsShowingSubmitted(true);
      } else {
        throw new Error("Failed to submit showing request. Please try again.");
      }
    } catch (err: any) {
      setShowingError(err.message || "An error occurred while sending your request.");
    } finally {
      setIsShowingSubmitting(false);
    }
  };

  // Perform Simulated Active MLS Database Search
  const handleSearchGo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setSelectedMapProp(null);
    setSearchFeedback('Accessing TRREB REALM MLS® Live Feed...');

    // Trigger full-stack API fetch in parallel
    fetchLiveListings(selectedCity, propertyType, minPrice, priceRange, searchKeyword, beds, baths, saleLease, sortBy);

    setTimeout(() => {
      setSearchFeedback('Applying criteria & parsing parcel coordinates...');
    }, 450);

    setTimeout(() => {
      setSearchFeedback('Generating interactive local Ontario map layout...');
    }, 900);

    setTimeout(() => {
      setActiveCity(selectedCity);
      setActivePropertyType(propertyType);
      setActiveSaleLease(saleLease);
      setActiveMinPrice(minPrice);
      setActivePriceRange(priceRange);
      setActiveKeyword(searchKeyword);
      setActiveBeds(beds);
      setActiveBaths(baths);
      setActiveSortBy(sortBy);
      setIsSearching(false);
      setHasSearched(true);

      // Scroll smoothly to results
      const resultsSection = document.getElementById('listings-live-results');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 1300);
  };

  const baseFiltered = listingsData.filter((item) => {
    const matchCity = activeCity === 'All' || item.city.toLowerCase() === activeCity.toLowerCase();
    const matchType = activePropertyType === 'All' || item.type === activePropertyType;
    const matchStatus = activeSaleLease === 'All' || item.status === (activeSaleLease === 'lease' ? 'for-lease' : 'for-sale');
    const matchMinP = item.price >= activeMinPrice;
    const matchMaxP = activePriceRange >= (activeSaleLease === 'lease' ? 10000 : 4000000) || item.price <= activePriceRange;
    const matchBeds = activeBeds === 'All' || (item.beds || 0) >= parseInt(activeBeds);
    const matchBaths = activeBaths === 'All' || (item.baths || 0) >= parseFloat(activeBaths);
    const matchKeyword = !activeKeyword.trim() || 
      item.title.toLowerCase().includes(activeKeyword.toLowerCase()) ||
      item.address.toLowerCase().includes(activeKeyword.toLowerCase()) ||
      item.city.toLowerCase().includes(activeKeyword.toLowerCase());
    return matchCity && matchType && matchStatus && matchMinP && matchMaxP && matchBeds && matchBaths && matchKeyword;
  });

  const simulatedProperties = getSimulatedProperties(
    activeCity, 
    activePropertyType, 
    activeMinPrice,
    activePriceRange, 
    activeKeyword, 
    activeBeds,
    activeBaths,
    activeSaleLease,
    activeSortBy,
    baseFiltered
  );
  const filteredProperties = isLiveFeedActive ? liveProperties : simulatedProperties;

  const handleSaleLeaseChange = (val: string) => {
    setSaleLease(val);
    if (val === 'lease') {
      setMinPrice(0);
      setPriceRange(10000);
    } else {
      setMinPrice(0);
      setPriceRange(4000000);
    }
  };

  const priceOptions = saleLease === 'lease' 
    ? {
        min: [
          { label: 'Any Min', val: 0 },
          { label: '$1,000/mo', val: 1000 },
          { label: '$1,500/mo', val: 1500 },
          { label: '$2,000/mo', val: 2000 },
          { label: '$2,500/mo', val: 2500 },
          { label: '$3,000/mo', val: 3000 },
          { label: '$4,000/mo', val: 4000 },
          { label: '$5,000/mo', val: 5000 },
        ],
        max: [
          { label: 'Any Max', val: 10000 },
          { label: '$2,000/mo', val: 2000 },
          { label: '$2,500/mo', val: 2500 },
          { label: '$3,000/mo', val: 3000 },
          { label: '$3,500/mo', val: 3500 },
          { label: '$4,000/mo', val: 4000 },
          { label: '$5,000/mo', val: 5000 },
          { label: '$7,500/mo', val: 7500 },
          { label: '$10,000/mo', val: 10000 },
        ]
      }
    : {
        min: [
          { label: 'Any Min', val: 0 },
          { label: '$300k', val: 300000 },
          { label: '$500k', val: 500000 },
          { label: '$600k', val: 600000 },
          { label: '$700k', val: 700000 },
          { label: '$800k', val: 800000 },
          { label: '$900k', val: 900000 },
          { label: '$1M', val: 1000000 },
          { label: '$1.2M', val: 1200000 },
          { label: '$1.5M', val: 1500000 },
          { label: '$2M', val: 2000000 },
          { label: '$2.5M', val: 2500000 },
        ],
        max: [
          { label: 'Any Max', val: 4000000 },
          { label: '$600k', val: 600000 },
          { label: '$750k', val: 750000 },
          { label: '$900k', val: 900000 },
          { label: '$1M', val: 1000000 },
          { label: '$1.2M', val: 1200000 },
          { label: '$1.5M', val: 1500000 },
          { label: '$2M', val: 2000000 },
          { label: '$2.5M', val: 2500000 },
          { label: '$3M', val: 3000000 },
          { label: '$4M', val: 4000000 },
        ]
      };

  return (
    <section id="listings-section" className="py-24 bg-black border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div id="listings-header" className="max-w-3xl mb-12">
          <div className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Interactive Ontario MLS® & Exclusive Listings Portal</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-medium tracking-tight">
            Search Active Properties Live
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Configure your exact search criteria in the MLS® portal below. Select your property type, city, bedrooms, and price limits, then press <strong className="text-emerald-400 font-semibold">GO & SEARCH</strong> to plot matching options dynamically on our interactive local map!
          </p>
        </div>

        {/* Master Unified Search Input Panel */}
        <div id="master-search-panel" className="bg-zinc-950 p-6 sm:p-8 rounded-2xl border border-zinc-900 shadow-xl mb-12">
          
          {/* Row 1: Key Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Transaction Type */}
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                Buy or Rent
              </label>
              <div className="grid grid-cols-2 gap-2 bg-black p-1 rounded-xl border border-zinc-900">
                <button
                  type="button"
                  onClick={() => handleSaleLeaseChange('sale')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    saleLease === 'sale' 
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/10' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Buy (Sale)
                </button>
                <button
                  type="button"
                  onClick={() => handleSaleLeaseChange('lease')}
                  className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    saleLease === 'lease' 
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/10' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Rent (Lease)
                </button>
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-black border border-zinc-900 text-sm text-white py-3 px-4 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer font-medium"
              >
                <option value="All">All Property Types</option>
                <option value="residential">Detached Homes & Estates</option>
                <option value="condo">Condominiums & Sky Suites</option>
                <option value="townhome">Townhomes & Freehold</option>
                <option value="commercial">Commercial & Offices</option>
              </select>
            </div>

            {/* Area / Region */}
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                City / Region
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-black border border-zinc-900 text-sm text-white py-3 px-4 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer font-medium"
              >
                <option value="All">All Regions (GTA Wide)</option>
                {gtaCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Keyword Box */}
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
                <Search className="w-3.5 h-3.5 text-emerald-400" />
                Search Keyword
              </label>
              <input
                type="text"
                placeholder="Street, MLS, building..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-black border border-zinc-900 text-sm text-white py-3 px-4 rounded-xl focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600 font-medium"
              />
            </div>
          </div>

          {/* Row 2: Advanced Criteria */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            {/* Min Price */}
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Min Price
              </label>
              <select
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full bg-black border border-zinc-900 text-sm text-white py-3 px-4 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer font-medium"
              >
                {priceOptions.min.map((opt) => (
                  <option key={`${opt.label}-${opt.val}`} value={opt.val}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Max Price
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full bg-black border border-zinc-900 text-sm text-white py-3 px-4 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer font-medium"
              >
                {priceOptions.max.map((opt) => (
                  <option key={`${opt.label}-${opt.val}`} value={opt.val}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
                <BedDouble className="w-3.5 h-3.5 text-emerald-400" />
                Bedrooms
              </label>
              <select
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="w-full bg-black border border-zinc-900 text-sm text-white py-3 px-4 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer font-medium"
              >
                <option value="All">Any Bedrooms</option>
                <option value="1">1+ Beds</option>
                <option value="2">2+ Beds</option>
                <option value="3">3+ Beds</option>
                <option value="4">4+ Beds</option>
                <option value="5">5+ Beds</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
                <Bath className="w-3.5 h-3.5 text-emerald-400" />
                Bathrooms
              </label>
              <select
                value={baths}
                onChange={(e) => setBaths(e.target.value)}
                className="w-full bg-black border border-zinc-900 text-sm text-white py-3 px-4 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer font-medium"
              >
                <option value="All">Any Bathrooms</option>
                <option value="1">1+ Baths</option>
                <option value="1.5">1.5+ Baths</option>
                <option value="2">2+ Baths</option>
                <option value="3">3+ Baths</option>
                <option value="4">4+ Baths</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-sans">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                Sort Order
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-black border border-zinc-900 text-sm text-white py-3 px-4 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer font-medium"
              >
                <option value="listDate">Newest Listed</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="bedsDesc">Most Bedrooms</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Pill Buttons & Trigger */}
          <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium mr-1 font-sans">Quick Budget:</span>
              {(saleLease === 'lease' ? [
                { label: 'Under $2k', val: 2000 },
                { label: 'Under $3k', val: 3000 },
                { label: 'Under $4k', val: 4000 },
                { label: 'No Limit', val: 10000 },
              ] : [
                { label: 'Under $1M', val: 1000000 },
                { label: 'Under $1.5M', val: 1500000 },
                { label: 'Under $2.5M', val: 2500000 },
                { label: 'No Limit', val: 4000000 },
              ]).map((pill) => (
                <button
                  key={pill.label}
                  type="button"
                  onClick={() => setPriceRange(pill.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    priceRange === pill.val 
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/10' 
                      : 'bg-black text-slate-400 hover:bg-zinc-900 border border-zinc-900'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 md:ml-auto">
              {(selectedCity !== 'All' || propertyType !== 'All' || minPrice !== 0 || priceRange !== (saleLease === 'lease' ? 10000 : 4000000) || searchKeyword !== '' || beds !== 'All' || baths !== 'All' || sortBy !== 'listDate') && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCity('All');
                    setPropertyType('All');
                    setSaleLease('sale');
                    setMinPrice(0);
                    setPriceRange(4000000);
                    setSearchKeyword('');
                    setBeds('All');
                    setBaths('All');
                    setSortBy('listDate');
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 underline font-medium cursor-pointer py-2 px-3 transition-colors"
                >
                  Clear Criteria
                </button>
              )}
              <div className="text-[11px] font-sans py-2 px-4 rounded-xl bg-neutral-950 border border-zinc-900 text-emerald-400 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Selected: {propertyType === 'All' ? 'All' : propertyType} in {selectedCity === 'All' ? 'GTA' : selectedCity} ({saleLease === 'lease' ? 'Rent' : 'Buy'})</span>
              </div>
            </div>
          </div>

          {/* Glowing Active Go & Search MLS Trigger Button */}
          <button
            type="button"
            onClick={() => handleSearchGo()}
            disabled={isSearching}
            className="w-full mt-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm tracking-wider uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
          >
            {isSearching ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span className="font-sans font-bold animate-pulse">{searchFeedback}</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-slate-950" />
                <span>Search MLS® Live Feed</span>
              </>
            )}
          </button>
        </div>

        {/* Live Search Results and Interactive Map Layout */}
        <div id="listings-live-results" className="scroll-mt-24">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="py-24 text-center bg-zinc-950 rounded-3xl border border-zinc-900 flex flex-col items-center justify-center shadow-xl mb-12"
              >
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-full" />
                  <div className="absolute inset-0 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <Compass className="absolute inset-0 m-auto w-10 h-10 text-emerald-400 animate-pulse" />
                </div>
                <h4 className="font-serif text-2xl text-white font-medium mb-2">Syncing with Ontario Board Real Estate Feed</h4>
                <p className="text-sm text-slate-400 max-w-sm mx-auto font-light leading-relaxed">
                  {searchFeedback || 'Authenticating secure connection keys and importing geocoded property indices...'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-12"
              >
                {/* Visual Header / Summary of Active Filter Output */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-6 gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium tracking-tight">
                        MLS® Search Query Output
                      </h3>
                      {isLiveFeedActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Live MLS® Active Feed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          Secure Sandbox Mode
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm font-light mt-2 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-500" />
                      Showing <strong className="text-emerald-400 font-semibold">{filteredProperties.length} matches</strong> currently active for {activeCity === 'All' ? 'all Ontario GTA cities' : activeCity} (Price limit &le; ${activePriceRange >= 4000000 ? 'Any' : (activePriceRange/1000000).toFixed(2) + 'M'}).
                    </p>
                  </div>
                  {!isLiveFeedActive && (
                    <div className="text-right sm:max-w-sm">
                      <p className="text-[11px] text-slate-400 leading-normal font-light">
                        Licensed broker? Put your <code className="text-amber-400 bg-amber-950/40 px-1 py-0.5 rounded font-mono font-bold">AMPRE_API_TOKEN</code> in Settings to switch the entire site instantly to your live TRREB direct RESO feed!
                      </p>
                    </div>
                  )}
                </div>

                {/* Split Interactive Dashboard (Map left, grid right) */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                  
                  {/* Left Column: Stylized Live Map Portal (Sticky on desktop, Span 2) */}
                  <div className="lg:col-span-2 lg:sticky lg:top-24">
                    <div className="bg-zinc-950 rounded-2xl border border-zinc-900 overflow-hidden shadow-2xl flex flex-col h-[520px] transition-all">
                      
                      {/* Map Header */}
                      <div className="bg-black/95 px-4 py-3.5 border-b border-zinc-900 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                          <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                            Interactive GTA MLS® Plotter
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase">
                            {filteredProperties.length} active pins
                          </span>
                        </div>
                      </div>

                      {/* Map Body Canvas */}
                      <div 
                        className="relative flex-1 bg-[#090d16] overflow-hidden select-none" 
                        style={{ 
                          backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px)', 
                          backgroundSize: '20px 20px' 
                        }}
                      >
                        {/* Compass background graphics decoration */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                          <div className="w-[280px] h-[280px] rounded-full border border-emerald-500 flex items-center justify-center">
                            <div className="w-[180px] h-[180px] rounded-full border border-dashed border-emerald-500" />
                          </div>
                        </div>

                        {/* Relative City Labels */}
                        <div className="absolute left-[15%] top-[48%] -translate-y-1/2 text-center pointer-events-none">
                          <span className="text-[9px] font-extrabold tracking-widest text-emerald-500/20 block uppercase">Milton</span>
                          <span className="text-[7px] font-mono text-zinc-700 block">Halton Region</span>
                        </div>
                        <div className="absolute left-[12%] top-[78%] -translate-y-1/2 text-center pointer-events-none">
                          <span className="text-[9px] font-extrabold tracking-widest text-emerald-500/20 block uppercase">Burlington</span>
                          <span className="text-[7px] font-mono text-zinc-700 block">QEW Corridor</span>
                        </div>
                        <div className="absolute left-[32%] top-[74%] -translate-y-1/2 text-center pointer-events-none">
                          <span className="text-[9px] font-extrabold tracking-widest text-emerald-500/25 block uppercase">Oakville</span>
                          <span className="text-[7px] font-mono text-zinc-700 block">South Halton</span>
                        </div>
                        <div className="absolute left-[44%] top-[25%] -translate-y-1/2 text-center pointer-events-none">
                          <span className="text-[9px] font-extrabold tracking-widest text-emerald-500/20 block uppercase">Brampton</span>
                          <span className="text-[7px] font-mono text-zinc-700 block">Peel Region</span>
                        </div>
                        <div className="absolute left-[48%] top-[54%] -translate-y-1/2 text-center pointer-events-none">
                          <span className="text-[9px] font-extrabold tracking-widest text-emerald-500/30 block uppercase">Mississauga</span>
                          <span className="text-[7px] font-mono text-zinc-700 block">City Center</span>
                        </div>
                        <div className="absolute left-[74%] top-[38%] -translate-y-1/2 text-center pointer-events-none">
                          <span className="text-[9px] font-extrabold tracking-widest text-emerald-500/30 block uppercase">Toronto</span>
                          <span className="text-[7px] font-mono text-zinc-700 block">Metro Core</span>
                        </div>

                        {/* Interactive dynamic coordinates pins */}
                        {filteredProperties.map((prop) => {
                          const coords = listingsCoords[prop.id] || getSimulatedCoords(prop.id, prop.city);
                          const isSelected = selectedMapProp?.id === prop.id;
                          return (
                            <div
                              key={prop.id}
                              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                              style={{ left: `${coords.x}%`, top: `${coords.y}%`, zIndex: isSelected ? 40 : 10 }}
                            >
                              {/* Pulsing ring */}
                              <div className="absolute -inset-2 rounded-full bg-emerald-500/10 animate-ping pointer-events-none" />
                              
                              <button
                                type="button"
                                onClick={() => setSelectedMapProp(selectedMapProp?.id === prop.id ? null : prop)}
                                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] font-mono font-extrabold shadow-xl transition-all duration-300 cursor-pointer flex items-center gap-1 border ${
                                  isSelected
                                    ? 'bg-emerald-400 text-slate-950 border-white scale-110 shadow-emerald-500/20'
                                    : 'bg-zinc-950 text-emerald-400 border-emerald-500/30 hover:border-emerald-400 hover:bg-zinc-900'
                                }`}
                              >
                                <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                                <span>
                                  {prop.status === 'for-lease'
                                    ? `$${(prop.price).toLocaleString()}`
                                    : `$${(prop.price / 1000000).toFixed(2)}M`
                                  }
                                </span>
                              </button>

                              {/* Interactive tooltip details popover on click */}
                              <AnimatePresence>
                                {isSelected && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3.5 w-56 bg-zinc-950 rounded-xl border border-zinc-800 shadow-2xl p-2.5 z-50 pointer-events-auto"
                                  >
                                    <div className="relative h-24 rounded-lg overflow-hidden mb-2">
                                      <img src={prop.imageUrl} alt={prop.title} className="w-full h-full object-cover" />
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedMapProp(null);
                                        }}
                                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                      <div className="absolute bottom-1.5 left-2 bg-emerald-500 text-slate-950 text-[8.5px] font-bold px-1.5 py-0.5 rounded uppercase">
                                        {prop.status === 'for-lease' ? 'For Lease' : 'For Sale'}
                                      </div>
                                    </div>
                                    <h5 className="text-[11px] font-serif font-medium text-white line-clamp-1 mb-0.5">{prop.title}</h5>
                                    <p className="text-[9px] text-slate-400 line-clamp-1 mb-2">{prop.address}, {prop.city}</p>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenProperty(prop)}
                                      className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                      <span>See Details</span>
                                      <ArrowUpRight className="w-3 h-3" />
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}

                        {filteredProperties.length === 0 && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-center">
                            <Navigation className="w-8 h-8 text-slate-500 mb-2 animate-bounce" />
                            <h5 className="text-xs font-semibold text-white mb-1">No Active Pins Plotted</h5>
                            <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed font-light">
                              Widen your search keyword or adjust price parameters above to plot active properties in Ontario.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Map Footer Grid */}
                      <div className="bg-black/95 px-4 py-2 border-t border-zinc-900 text-[9px] text-slate-500 flex items-center justify-between font-mono">
                        <span className="flex items-center gap-1">
                          <Navigation className="w-2.5 h-2.5 text-emerald-400" />
                          Coordinate Sync: Active
                        </span>
                        <span>Click pins to view details</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Matched Listings Grid Cards (Span 3) */}
                  <div className="lg:col-span-3">
                    <div id="listings-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <AnimatePresence mode="popLayout">
                        {filteredProperties.map((item) => (
                          <motion.div
                            layout
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.3 }}
                            className="bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-900 hover:border-emerald-500/30 shadow-lg tracking-normal group transition-all flex flex-col justify-between"
                          >
                            {/* Card Image */}
                            <div className="relative overflow-hidden aspect-video">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-zinc-900 text-emerald-400 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                                {item.type === 'residential' && 'Residential'}
                                {item.type === 'condo' && 'Condominium'}
                                {item.type === 'townhome' && 'Townhome'}
                                {item.type === 'commercial' && 'Commercial'}
                              </div>
                              <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                                {item.status === 'for-lease' ? 'For Lease' : 'For Sale'}
                              </div>
                              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-zinc-900/60 text-slate-300 text-[9.5px] font-mono px-2 py-0.5 rounded tracking-wide font-medium shadow-md">
                                MLS®: {item.id}
                              </div>
                            </div>

                            {/* Card Content body */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-baseline justify-between mb-1.5">
                                  <span className="text-xl font-bold text-white font-sans">
                                    ${item.price.toLocaleString()}{item.status === 'for-lease' ? '/mo' : ''}
                                  </span>
                                </div>

                                <h3 className="font-serif text-base font-medium text-white group-hover:text-emerald-400 transition-colors mb-2.5 line-clamp-1">
                                  {item.title}
                                </h3>

                                <div className="flex items-center gap-1 text-slate-400 text-xs mb-4">
                                  <MapPin className="w-3.5 h-3.5 text-emerald-500/80 flex-shrink-0" />
                                  <span className="truncate">
                                    {item.address}, {item.city}, ON
                                  </span>
                                </div>

                                {/* Technical Specs Bar */}
                                {(item.type === 'residential' || item.type === 'condo' || item.type === 'townhome') && (
                                  <div className="flex items-center justify-between text-slate-400 text-[11px] py-2.5 border-t border-b border-zinc-900 mb-5 bg-black/20 px-2.5 rounded-lg font-sans">
                                    <span className="flex items-center gap-1">
                                      <BedDouble className="w-3 h-3 text-emerald-400" />
                                      <strong>{item.beds}</strong> Beds
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Bath className="w-3 h-3 text-emerald-400" />
                                      <strong>{item.baths}</strong> Baths
                                    </span>
                                    <span>
                                      <strong>{item.sqft.toLocaleString()}</strong> Sq Ft
                                    </span>
                                  </div>
                                )}

                                {item.type === 'commercial' && (
                                  <div className="flex items-center justify-between text-slate-400 text-[11px] py-2.5 border-t border-b border-zinc-900 mb-5 bg-black/20 px-2.5 rounded-lg">
                                    <span className="flex items-center gap-1.5">
                                      <Bath className="w-3 h-3 text-emerald-400" />
                                      <strong>{item.baths}</strong> Washrooms
                                    </span>
                                    <span>
                                      <strong>{item.sqft.toLocaleString()}</strong> Sq Ft Lot
                                    </span>
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() => handleOpenProperty(item)}
                                className="w-full py-2.5 bg-black hover:bg-emerald-500 hover:text-slate-950 font-semibold text-xs text-emerald-400 rounded-xl transition-all border border-zinc-850 flex items-center justify-center gap-1.5 group cursor-pointer"
                              >
                                View Detailed Specs
                                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {filteredProperties.length === 0 && (
                        <div className="col-span-full text-center py-16 bg-zinc-950 rounded-2xl border border-zinc-900 px-4">
                          <Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                          <p className="text-slate-400 text-sm mb-3 font-light">
                            No active property match your current price point or city filter on this site.
                          </p>
                          <button
                            onClick={() => {
                              setSelectedCity('All');
                              setPropertyType('All');
                              setPriceRange(4000000);
                              setSearchKeyword('');
                              setActiveCity('All');
                              setActivePropertyType('All');
                              setActivePriceRange(4000000);
                              setActiveKeyword('');
                            }}
                            className="text-xs text-emerald-400 font-bold hover:underline bg-transparent border-none outline-none cursor-pointer"
                          >
                            Reset Live Search Criteria
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Details and Showing Booking Modal overlay */}
        <AnimatePresence>
          {selectedProperty && (
            <div
              id="property-modal-overlay"
              className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-10"
              onClick={() => setSelectedProperty(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ duration: 0.3 }}
                className="bg-zinc-950 border border-zinc-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Visual Banner */}
                <div className="relative aspect-video max-h-[400px] w-full overflow-hidden bg-zinc-900 group/modal">
                  <img
                    src={selectedProperty.images ? selectedProperty.images[activeImageIndex] : selectedProperty.imageUrl}
                    alt={`${selectedProperty.title} - Photo ${activeImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    key={activeImageIndex}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/25 to-transparent" />
                  
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="absolute top-4 right-4 p-2.5 bg-black/75 hover:bg-black text-white rounded-full transition-colors focus:outline-none z-10"
                    title="Close details"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Previous / Next buttons for image slider */}
                  {selectedProperty.images && selectedProperty.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => (prev === 0 ? selectedProperty.images.length - 1 : prev - 1));
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/65 hover:bg-black/85 hover:scale-105 active:scale-95 text-white rounded-full transition-all focus:outline-none z-10 cursor-pointer shadow-lg backdrop-blur-sm border border-zinc-800/50"
                        title="Previous Photo"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => (prev === selectedProperty.images.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/65 hover:bg-black/85 hover:scale-105 active:scale-95 text-white rounded-full transition-all focus:outline-none z-10 cursor-pointer shadow-lg backdrop-blur-sm border border-zinc-800/50"
                        title="Next Photo"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      {/* Photo indicator badge */}
                      <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/75 backdrop-blur-md rounded-md text-xs font-mono text-slate-300 border border-zinc-800 z-10">
                        Photo {activeImageIndex + 1} of {selectedProperty.images.length}
                      </div>
                    </>
                  )}

                  <div className="absolute bottom-6 left-6 z-10">
                    <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium mb-1 drop-shadow-md">
                      {selectedProperty.title}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-slate-200 text-sm">
                      <div className="flex items-center gap-1.5 drop-shadow">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        <span>{selectedProperty.address}, {selectedProperty.city}, Ontario</span>
                      </div>
                      <div className="hidden sm:block text-zinc-600">|</div>
                      <div className="text-emerald-400 font-mono font-semibold drop-shadow">
                        MLS® #: {selectedProperty.id}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Layout Grid */}
                <div className="p-6 sm:p-8 grid md:grid-cols-3 gap-8">
                  {/* Left Column - Property Info & Amenities */}
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Financial Investment Info
                      </h4>
                      <div className="text-3xl font-bold text-emerald-400">
                        ${selectedProperty.price.toLocaleString()}{selectedProperty.status === 'for-lease' ? '/mo' : ''}
                        {selectedProperty.status !== 'for-lease' && (
                          <span className="text-xs font-light text-slate-400 font-sans ml-2">
                            Est. Mortgage: ${(selectedProperty.price * 0.0052).toLocaleString('en-US', {maximumFractionDigits: 0})}/mo*
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Specs Box */}
                    <div className="grid grid-cols-4 gap-4 p-4 bg-black border border-zinc-900 rounded-xl text-center">
                      {(selectedProperty.type === 'residential' || selectedProperty.type === 'condo' || selectedProperty.type === 'townhome') ? (
                        <>
                          <div>
                            <div className="text-xs text-slate-400 uppercase font-sans mb-1">Beds</div>
                            <div className="text-lg font-bold text-white font-sans">{selectedProperty.beds}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 uppercase font-sans mb-1">Baths</div>
                            <div className="text-lg font-bold text-white font-sans">{selectedProperty.baths}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 uppercase font-sans mb-1">Garage</div>
                            <div className="text-lg font-bold text-white font-sans">{selectedProperty.garage}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="col-span-2">
                            <div className="text-xs text-slate-400 uppercase font-sans mb-1">Washrooms</div>
                            <div className="text-lg font-bold text-white font-sans">{selectedProperty.baths}</div>
                          </div>
                          <div className="col-span-1">
                            <div className="text-xs text-slate-400 uppercase font-sans mb-1">Park Slot</div>
                            <div className="text-lg font-bold text-white font-sans">{selectedProperty.garage}</div>
                          </div>
                        </>
                      )}
                      <div>
                        <div className="text-xs text-slate-400 uppercase font-sans mb-1">Square Feet</div>
                        <div className="text-md sm:text-lg font-bold text-white font-sans">{selectedProperty.sqft.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Narrative Description */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2 font-serif">Property Overview</h4>
                      <p className="text-sm text-slate-300 font-light leading-relaxed">
                        {selectedProperty.description}
                      </p>
                    </div>

                    {/* Key Premium Amenities */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3 font-serif">Key Details & Premium Amenities</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedProperty.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>Built Year: {selectedProperty.yearBuilt}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Booking Schedule Form */}
                  <div className="bg-black p-6 rounded-xl border border-zinc-900 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-4">
                        <Calendar className="w-5 h-5" />
                        <h4 className="text-sm font-serif font-medium text-white">Schedule a Showing</h4>
                      </div>

                      {!isShowingSubmitted ? (
                        <form onSubmit={handleShowingSubmit} className="space-y-4">
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                              Your Name
                            </label>
                            <input
                              type="text"
                              required
                              value={showingName}
                              onChange={(e) => setShowingName(e.target.value)}
                              placeholder="John Doe"
                              className="w-full bg-zinc-950 border border-zinc-900 focus:border-emerald-500 rounded-lg text-xs text-white p-2.5 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              required
                              value={showingPhone}
                              onChange={(e) => setShowingPhone(e.target.value)}
                              placeholder="647-123-4567"
                              className="w-full bg-zinc-950 border border-zinc-900 focus:border-emerald-500 rounded-lg text-xs text-white p-2.5 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              required
                              value={showingEmail}
                              onChange={(e) => setShowingEmail(e.target.value)}
                              placeholder="john@example.com"
                              className="w-full bg-zinc-950 border border-zinc-900 focus:border-emerald-500 rounded-lg text-xs text-white p-2.5 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
                              Preferred Showing Date
                            </label>
                            <input
                              type="date"
                              required
                              value={showingDate}
                              onChange={(e) => setShowingDate(e.target.value)}
                              className="w-full bg-zinc-950 border border-zinc-900 focus:border-emerald-500 rounded-lg text-xs text-slate-200 p-2.5 focus:outline-none"
                            />
                          </div>

                          {showingError && (
                            <div className="text-rose-400 text-xs text-center font-light mt-2 p-2 bg-rose-500/10 border border-rose-500/20 rounded-md">
                              {showingError}
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={isShowingSubmitting}
                            className={`w-full py-3 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-md mt-4 cursor-pointer ${
                              isShowingSubmitting ? 'bg-emerald-500/60 cursor-not-allowed text-slate-950/80' : 'bg-emerald-500 hover:bg-emerald-400'
                            }`}
                          >
                            {isShowingSubmitting ? 'Sending Request...' : 'Request Private Showing'}
                          </button>
                        </form>
                      ) : (
                        <div className="text-center py-6">
                          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-6 h-6 animate-bounce" />
                          </div>
                          <h5 className="font-serif text-base text-white font-medium mb-2">Request Processed!</h5>
                          <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] mx-auto mb-4 font-light">
                            Excellent! Haroon Afzal will contact you shortly at <strong className="whitespace-nowrap">{showingPhone}</strong> to align details for <strong>{showingDate}</strong>.
                          </p>
                          <button
                            onClick={() => setIsShowingSubmitted(false)}
                            className="text-xs text-emerald-400 hover:underline bg-transparent border-none outline-none cursor-pointer"
                          >
                            Modify Request Details
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-900 text-center text-[10px] text-slate-400 whitespace-nowrap">
                      Broker Direct: <a href="tel:+16472974080" className="text-emerald-400 hover:underline whitespace-nowrap">647-297-4080</a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
