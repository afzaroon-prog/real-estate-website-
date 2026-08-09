import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// API route for live or simulated listings
app.get("/api/listings", async (req, res) => {
  const { 
    city = "All", 
    type = "All", 
    minPrice = "0",
    maxPrice = "4000000", 
    keyword = "",
    beds = "All",
    baths = "All",
    saleLease = "All",
    sortBy = "listDate"
  } = req.query;

  const cityStr = String(city);
  const typeStr = String(type);
  const keywordStr = String(keyword);
  const saleLeaseStr = String(saleLease);
  const bedsStr = String(beds);
  const bathsStr = String(baths);
  const sortByStr = String(sortBy);

  const ampreToken = process.env.AMPRE_API_TOKEN;
  const repliersKey = process.env.REPLIERS_API_KEY;

  // 1. Try Ampre (Direct PropTx / TRREB RESO API)
  if (ampreToken && ampreToken !== "YOUR_AMPRE_API_TOKEN" && ampreToken.trim() !== "") {
    let fetchUrl = "";
    try {
      const ampreUrl = (process.env.AMPRE_API_URL || "https://query.ampre.ca/odata").replace(/\/$/, "");
      console.log(`Fetching live listings from Ampre: City=${cityStr}, Type=${typeStr}, MinPrice=${minPrice}, MaxPrice=${maxPrice}, SaleLease=${saleLeaseStr}, Beds=${bedsStr}, Baths=${bathsStr}, SortBy=${sortByStr}`);

      // Build standard OData filter
      const filterParts = ["StandardStatus eq 'Active'"];
      
      // City (Title Case format since Ampre is case-sensitive and doesn't support tolower)
      if (cityStr && cityStr !== "All" && cityStr !== "GTA") {
        const formattedCity = cityStr.charAt(0).toUpperCase() + cityStr.slice(1).toLowerCase();
        filterParts.push(`contains(City, '${formattedCity}')`);
      }

      // Sale vs Lease (Transaction Type) using standard RESO values
      if (saleLeaseStr === "sale") {
        filterParts.push(`TransactionType eq 'For Sale'`);
      } else if (saleLeaseStr === "lease") {
        filterParts.push(`TransactionType eq 'For Lease'`);
      }

      // Price limits
      const minP = parseFloat(minPrice as string) || 0;
      const maxP = parseFloat(maxPrice as string) || 0;
      if (minP > 0) {
        filterParts.push(`ListPrice ge ${minP}`);
      }
      if (maxP > 0 && maxP < 4000000) {
        filterParts.push(`ListPrice le ${maxP}`);
      }

      // Bedrooms
      if (bedsStr && bedsStr !== "All") {
        const bedsNum = parseInt(bedsStr);
        if (!isNaN(bedsNum) && bedsNum > 0) {
          filterParts.push(`BedroomsTotal ge ${bedsNum}`);
        }
      }

      // Bathrooms
      if (bathsStr && bathsStr !== "All") {
        const bathsNum = parseFloat(bathsStr);
        if (!isNaN(bathsNum) && bathsNum > 0) {
          filterParts.push(`BathroomsTotalInteger ge ${bathsNum}`);
        }
      }

      // Property Type using standard RESO values (Case-sensitive)
      if (typeStr && typeStr !== "All") {
        if (typeStr === "condo") {
          filterParts.push(`(contains(PropertyType, 'Condo') or contains(PropertySubType, 'Condo') or contains(PropertySubType, 'Condominium') or contains(PropertyType, 'Condominium'))`);
        } else if (typeStr === "commercial") {
          filterParts.push(`contains(PropertyType, 'Commercial')`);
        } else if (typeStr === "townhome") {
          filterParts.push(`(contains(PropertySubType, 'Townhouse') or contains(PropertySubType, 'Townhome') or contains(PropertySubType, 'Row') or contains(PropertySubType, 'Twnhouse') or contains(PropertySubType, 'Multiplex'))`);
        } else if (typeStr === "residential") {
          filterParts.push(`(contains(PropertyType, 'Residential') or contains(PropertyType, 'Freehold') or contains(PropertySubType, 'Detached') or contains(PropertySubType, 'Semi-Detached'))`);
        }
      }

      // Keyword using case expansion (original, lower, upper, title) as tolower is not supported
      if (keywordStr && keywordStr.trim() !== "") {
        const kw = keywordStr.trim();
        const kwLower = kw.toLowerCase();
        const kwUpper = kw.toUpperCase();
        const kwTitle = kw.charAt(0).toUpperCase() + kw.slice(1).toLowerCase();
        filterParts.push(`(contains(PublicRemarks, '${kw}') or contains(UnparsedAddress, '${kw}') or contains(PublicRemarks, '${kwLower}') or contains(PublicRemarks, '${kwUpper}') or contains(PublicRemarks, '${kwTitle}'))`);
      }

      const filterValue = encodeURIComponent(filterParts.join(" and "));
      // We set $top=100 to return plenty of listings matching our exact criteria while adhering to Ampre's limit
      fetchUrl = `${ampreUrl}/Property?$filter=${filterValue}&$top=100&$expand=Media`;
      console.log(`Ampre Fetching: ${fetchUrl}`);

      const response = await fetch(fetchUrl, {
        headers: {
          "Authorization": `Bearer ${ampreToken}`,
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Ampre RESO API responded with status ${response.status}`);
      }

      const data = await response.json();
      const rawListings = data.value || data.listings || [];

      // Map Ampre (RESO Standard Fields) to our UI Schema
      const mappedListings = rawListings.map((item: any, index: number) => {
        const addressStr = item.UnparsedAddress || `${item.StreetNumber || ""} ${item.StreetName || ""} ${item.StreetSuffix || ""}`.trim() || "Address on Request";
        
        // Extract and deduplicate photos based on unique MediaObjectID / OriginatingSystemMediaKey to avoid duplicate photos
        const images: string[] = [];
        if (item.Media && Array.isArray(item.Media)) {
          const photoGroups: { [key: string]: any[] } = {};
          item.Media.forEach((m: any) => {
            if (m.MediaCategory === "Photo" && m.MediaURL) {
              const id = m.MediaObjectID || m.OriginatingSystemMediaKey || m.MediaKey;
              if (id) {
                if (!photoGroups[id]) {
                  photoGroups[id] = [];
                }
                photoGroups[id].push(m);
              }
            }
          });

          const sizeRank: { [key: string]: number } = {
            "Large": 1,
            "Largest": 2,
            "Medium": 3,
            "LargestNoWatermark": 4,
            "Thumbnail": 5
          };

          const uniquePhotos: any[] = [];
          for (const id in photoGroups) {
            const group = photoGroups[id];
            group.sort((a: any, b: any) => {
              const rankA = sizeRank[a.ImageSizeDescription] || 99;
              const rankB = sizeRank[b.ImageSizeDescription] || 99;
              return rankA - rankB;
            });
            uniquePhotos.push(group[0]);
          }

          // Sort by Order sequence
          uniquePhotos.sort((a: any, b: any) => (a.Order || 0) - (b.Order || 0));

          uniquePhotos.forEach((p: any) => {
            images.push(p.MediaURL);
          });
        }
        
        const mainImageUrl = images[0] || item.MediaURL || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

        let localType: "residential" | "condo" | "townhome" | "commercial" = "residential";
        const propType = (item.PropertyType || "").toLowerCase();
        const subType = (item.PropertySubType || "").toLowerCase();
        
        // Townhouses take priority to prevent Condo Townhouses from being incorrectly grouped as generic Condos
        if (subType.includes("townhouse") || subType.includes("townhome") || subType.includes("row") || subType.includes("twnhouse") || subType.includes("multiplex")) {
          localType = "townhome";
        } else if (subType.includes("condo") || subType.includes("condominium") || propType.includes("condo") || propType.includes("condominium")) {
          localType = "condo";
        } else if (propType.includes("commercial")) {
          localType = "commercial";
        }

        const features = item.InteriorFeatures || [];
        const cleanFeatures = Array.isArray(features) ? features.slice(0, 6) : ["Modern Architecture", "Prime Lot", "Spacious Layout"];

        const transType = (item.TransactionType || "").toLowerCase();
        const localStatus = transType.includes("lease") ? "for-lease" : "for-sale";

        return {
          id: item.ListingKey || item.ListingId || item.MLSNumber || `live-ampre-${index}`,
          title: item.PropertySubType ? `${item.PropertySubType} in ${item.City || "GTA"}` : `Property in ${item.City || "GTA"}`,
          price: parseFloat(item.ListPrice) || 999900,
          address: addressStr,
          city: item.City || "Toronto",
          imageUrl: mainImageUrl,
          images: images.length > 0 ? images : [mainImageUrl],
          beds: parseInt(item.BedroomsTotal) || 0,
          baths: parseFloat(item.BathroomsTotalInteger) || 0,
          garage: parseInt(item.ParkingSpacesTotal) || 1,
          sqft: parseInt(item.LivingArea || item.BuildingAreaTotal) || 1500,
          type: localType,
          status: localStatus,
          description: item.PublicRemarks || "An incredible opportunity to own this highly desirable property. Centrally located with high-end premium finishes throughout.",
          features: cleanFeatures,
          yearBuilt: parseInt(item.YearBuilt) || 2015,
          isLiveMLS: true
        };
      });

      // Post-filtering for strict match and safety
      let filteredListings = mappedListings;
      if (type && type !== "All") {
        filteredListings = filteredListings.filter((item: any) => item.type === type);
      }
      if (saleLease && saleLease !== "All") {
        const targetStatus = saleLease === "lease" ? "for-lease" : "for-sale";
        filteredListings = filteredListings.filter((item: any) => item.status === targetStatus);
      }

      // Sort Listings
      if (sortBy === "priceAsc") {
        filteredListings.sort((a: any, b: any) => a.price - b.price);
      } else if (sortBy === "priceDesc") {
        filteredListings.sort((a: any, b: any) => b.price - a.price);
      } else if (sortBy === "bedsDesc") {
        filteredListings.sort((a: any, b: any) => b.beds - a.beds);
      } else {
        // listDate or default - put higher listing key / newest ID first as a proxy for listing order
        filteredListings.sort((a: any, b: any) => b.id.localeCompare(a.id));
      }

      return res.json({
        listings: filteredListings,
        isLiveFeed: true,
        source: "ampre"
      });

    } catch (error: any) {
      console.error("Failed to query live Ampre RESO feed: ", error.message, error.stack);
      return res.json({
        listings: [],
        isLiveFeed: false
      });
    }
  }

  // 2. Try Repliers.io (legacy/alternative feed)
  if (repliersKey && repliersKey !== "YOUR_REPLIERS_API_KEY" && repliersKey.trim() !== "") {
    try {
      console.log(`Fetching live listings from Repliers.io for City: ${city}, Type: ${type}, Max Price: ${maxPrice}`);
      
      // Build search query params for Repliers.io
      const params = new URLSearchParams();
      params.append("status", "Active");
      params.append("resultsPerPage", "24");
      
      if (city && city !== "All") {
        params.append("city", city as string);
      } else {
        // Default to GTA area cities
        params.append("cities[]", "Toronto");
        params.append("cities[]", "Mississauga");
        params.append("cities[]", "Brampton");
        params.append("cities[]", "Oakville");
        params.append("cities[]", "Milton");
        params.append("cities[]", "Burlington");
        params.append("cities[]", "Vaughan");
      }

      if (maxPrice) {
        params.append("priceMax", maxPrice as string);
      }

      if (type && type !== "All") {
        // Map UI type to Repliers listing class/type
        if (type === "condo") {
          params.append("class", "Condo");
        } else if (type === "commercial") {
          params.append("class", "Commercial");
        } else {
          params.append("class", "Residential");
        }
      }

      if (keyword) {
        params.append("keywords", keyword as string);
      }

      // Query Repliers.io MLS Feed
      const response = await fetch(`https://api.repliers.io/listings?${params.toString()}`, {
        headers: {
          "REPLIERS-API-KEY": repliersKey,
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Repliers API responded with status ${response.status}`);
      }

      const data = await response.json();
      const rawListings = data.listings || [];

      // Map Repliers.io schema to our local high-quality UI schema
      const mappedListings = rawListings.map((item: any, index: number) => {
        const addressStr = `${item.address?.streetNumber || ""} ${item.address?.streetName || ""} ${item.address?.streetSuffix || ""}`.trim() || "Address on Request";
        const images = item.images || [];
        const imageUrl = images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
        
        let localType: "residential" | "condo" | "townhome" | "commercial" = "residential";
        if (item.class?.toLowerCase() === "condo") {
          localType = "condo";
        } else if (item.class?.toLowerCase() === "commercial") {
          localType = "commercial";
        } else if (item.details?.propertyType?.toLowerCase().includes("townhouse") || item.details?.propertyType?.toLowerCase().includes("townhome")) {
          localType = "townhome";
        }

        const features = item.details?.features || [];
        const cleanFeatures = Array.isArray(features) ? features.slice(0, 6) : ["Finished Basement", "Modern Appliances", "Great Location"];

        return {
          id: item.mlsNumber || `live-${index}`,
          title: item.details?.propertyType ? `${item.details.propertyType} in ${item.address?.city || "GTA"}` : `Exquisite Home in ${item.address?.city || "GTA"}`,
          price: parseFloat(item.listPrice) || 999900,
          address: addressStr,
          city: item.address?.city || "Mississauga",
          imageUrl,
          beds: parseInt(item.details?.numBedrooms) || 3,
          baths: parseFloat(item.details?.numBathrooms) || 2.5,
          garage: parseInt(item.details?.numParkingSpaces) || 1,
          sqft: parseInt(item.details?.sqft) || 1500,
          type: localType,
          status: "for-sale",
          description: item.details?.description || "A gorgeous and highly desirable listing that presents an incredible opportunity. Situated in a prime, high-demand neighborhood close to excellent schools, shopping centers, parks, transit, and major commuter arteries.",
          features: cleanFeatures,
          yearBuilt: parseInt(item.details?.yearBuilt) || 2015,
          isLiveMLS: true
        };
      });

      return res.json({
        listings: mappedListings,
        isLiveFeed: true,
        source: "repliers"
      });

    } catch (error: any) {
      console.error("Failed to query live Repliers feed, returning simulated data: ", error.message);
    }
  }

  // If no API Key/Token is configured, return fallback flag
  return res.json({
    listings: [],
    isLiveFeed: false
  });
});

async function startServer() {
  // Vite integration for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const isNumericPort = !isNaN(Number(PORT));
  if (isNumericPort) {
    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } else {
    app.listen(PORT as string, () => {
      console.log(`Server running on Passenger socket: ${PORT}`);
    });
  }
}

startServer();
