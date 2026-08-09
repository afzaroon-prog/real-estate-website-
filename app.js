var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"));
var import_path = __toESM(require("path"));
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = process.env.PORT || 3e3;
app.use(import_express.default.json());
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
  if (ampreToken && ampreToken !== "YOUR_AMPRE_API_TOKEN" && ampreToken.trim() !== "") {
    let fetchUrl = "";
    try {
      const ampreUrl = (process.env.AMPRE_API_URL || "https://query.ampre.ca/odata").replace(/\/$/, "");
      console.log(`Fetching live listings from Ampre: City=${cityStr}, Type=${typeStr}, MinPrice=${minPrice}, MaxPrice=${maxPrice}, SaleLease=${saleLeaseStr}, Beds=${bedsStr}, Baths=${bathsStr}, SortBy=${sortByStr}`);
      const filterParts = ["StandardStatus eq 'Active'"];
      if (cityStr && cityStr !== "All" && cityStr !== "GTA") {
        const formattedCity = cityStr.charAt(0).toUpperCase() + cityStr.slice(1).toLowerCase();
        filterParts.push(`contains(City, '${formattedCity}')`);
      }
      if (saleLeaseStr === "sale") {
        filterParts.push(`TransactionType eq 'For Sale'`);
      } else if (saleLeaseStr === "lease") {
        filterParts.push(`TransactionType eq 'For Lease'`);
      }
      const minP = parseFloat(minPrice) || 0;
      const maxP = parseFloat(maxPrice) || 0;
      if (minP > 0) {
        filterParts.push(`ListPrice ge ${minP}`);
      }
      if (maxP > 0 && maxP < 4e6) {
        filterParts.push(`ListPrice le ${maxP}`);
      }
      if (bedsStr && bedsStr !== "All") {
        const bedsNum = parseInt(bedsStr);
        if (!isNaN(bedsNum) && bedsNum > 0) {
          filterParts.push(`BedroomsTotal ge ${bedsNum}`);
        }
      }
      if (bathsStr && bathsStr !== "All") {
        const bathsNum = parseFloat(bathsStr);
        if (!isNaN(bathsNum) && bathsNum > 0) {
          filterParts.push(`BathroomsTotalInteger ge ${bathsNum}`);
        }
      }
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
      if (keywordStr && keywordStr.trim() !== "") {
        const kw = keywordStr.trim();
        const kwLower = kw.toLowerCase();
        const kwUpper = kw.toUpperCase();
        const kwTitle = kw.charAt(0).toUpperCase() + kw.slice(1).toLowerCase();
        filterParts.push(`(contains(PublicRemarks, '${kw}') or contains(UnparsedAddress, '${kw}') or contains(PublicRemarks, '${kwLower}') or contains(PublicRemarks, '${kwUpper}') or contains(PublicRemarks, '${kwTitle}'))`);
      }
      const filterValue = encodeURIComponent(filterParts.join(" and "));
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
      const mappedListings = rawListings.map((item, index) => {
        const addressStr = item.UnparsedAddress || `${item.StreetNumber || ""} ${item.StreetName || ""} ${item.StreetSuffix || ""}`.trim() || "Address on Request";
        const images = [];
        if (item.Media && Array.isArray(item.Media)) {
          const photoGroups = {};
          item.Media.forEach((m) => {
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
          const sizeRank = {
            "Large": 1,
            "Largest": 2,
            "Medium": 3,
            "LargestNoWatermark": 4,
            "Thumbnail": 5
          };
          const uniquePhotos = [];
          for (const id in photoGroups) {
            const group = photoGroups[id];
            group.sort((a, b) => {
              const rankA = sizeRank[a.ImageSizeDescription] || 99;
              const rankB = sizeRank[b.ImageSizeDescription] || 99;
              return rankA - rankB;
            });
            uniquePhotos.push(group[0]);
          }
          uniquePhotos.sort((a, b) => (a.Order || 0) - (b.Order || 0));
          uniquePhotos.forEach((p) => {
            images.push(p.MediaURL);
          });
        }
        const mainImageUrl = images[0] || item.MediaURL || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
        let localType = "residential";
        const propType = (item.PropertyType || "").toLowerCase();
        const subType = (item.PropertySubType || "").toLowerCase();
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
      let filteredListings = mappedListings;
      if (type && type !== "All") {
        filteredListings = filteredListings.filter((item) => item.type === type);
      }
      if (saleLease && saleLease !== "All") {
        const targetStatus = saleLease === "lease" ? "for-lease" : "for-sale";
        filteredListings = filteredListings.filter((item) => item.status === targetStatus);
      }
      if (sortBy === "priceAsc") {
        filteredListings.sort((a, b) => a.price - b.price);
      } else if (sortBy === "priceDesc") {
        filteredListings.sort((a, b) => b.price - a.price);
      } else if (sortBy === "bedsDesc") {
        filteredListings.sort((a, b) => b.beds - a.beds);
      } else {
        filteredListings.sort((a, b) => b.id.localeCompare(a.id));
      }
      return res.json({
        listings: filteredListings,
        isLiveFeed: true,
        source: "ampre"
      });
    } catch (error) {
      console.error("Failed to query live Ampre RESO feed: ", error.message, error.stack);
      return res.json({
        listings: [],
        isLiveFeed: false
      });
    }
  }
  if (repliersKey && repliersKey !== "YOUR_REPLIERS_API_KEY" && repliersKey.trim() !== "") {
    try {
      console.log(`Fetching live listings from Repliers.io for City: ${city}, Type: ${type}, Max Price: ${maxPrice}`);
      const params = new URLSearchParams();
      params.append("status", "Active");
      params.append("resultsPerPage", "24");
      if (city && city !== "All") {
        params.append("city", city);
      } else {
        params.append("cities[]", "Toronto");
        params.append("cities[]", "Mississauga");
        params.append("cities[]", "Brampton");
        params.append("cities[]", "Oakville");
        params.append("cities[]", "Milton");
        params.append("cities[]", "Burlington");
        params.append("cities[]", "Vaughan");
      }
      if (maxPrice) {
        params.append("priceMax", maxPrice);
      }
      if (type && type !== "All") {
        if (type === "condo") {
          params.append("class", "Condo");
        } else if (type === "commercial") {
          params.append("class", "Commercial");
        } else {
          params.append("class", "Residential");
        }
      }
      if (keyword) {
        params.append("keywords", keyword);
      }
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
      const mappedListings = rawListings.map((item, index) => {
        const addressStr = `${item.address?.streetNumber || ""} ${item.address?.streetName || ""} ${item.address?.streetSuffix || ""}`.trim() || "Address on Request";
        const images = item.images || [];
        const imageUrl = images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
        let localType = "residential";
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
    } catch (error) {
      console.error("Failed to query live Repliers feed, returning simulated data: ", error.message);
    }
  }
  return res.json({
    listings: [],
    isLiveFeed: false
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(__dirname, "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  const isNumericPort = !isNaN(Number(PORT));
  if (isNumericPort) {
    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } else {
    app.listen(PORT, () => {
      console.log(`Server running on Passenger socket: ${PORT}`);
    });
  }
}
startServer();
//# sourceMappingURL=app.js.map
