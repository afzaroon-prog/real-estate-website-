exports.handler = async function (event, context) {
  const query = event.queryStringParameters || {};
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
  } = query;

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
    try {
      const ampreUrl = (process.env.AMPRE_API_URL || "https://query.ampre.ca/odata").replace(/\/$/, "");
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
      if (maxP > 0 && maxP < 4000000) {
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
      const fetchUrl = `${ampreUrl}/Property?$filter=${filterValue}&$top=100&$expand=Media`;

      const response = await globalThis.fetch(fetchUrl, {
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
          description: item.PublicRemarks || "An incredible opportunity to own this highly desirable property.",
          features: cleanFeatures,
          yearBuilt: parseInt(item.YearBuilt) || 2015,
          isLiveMLS: true
        };
      });

      let filteredListings = mappedListings;
      if (typeStr && typeStr !== "All") {
        filteredListings = filteredListings.filter((item) => item.type === typeStr);
      }
      if (saleLeaseStr && saleLeaseStr !== "All") {
        const targetStatus = saleLeaseStr === "lease" ? "for-lease" : "for-sale";
        filteredListings = filteredListings.filter((item) => item.status === targetStatus);
      }

      if (sortByStr === "priceAsc") {
        filteredListings.sort((a, b) => a.price - b.price);
      } else if (sortByStr === "priceDesc") {
        filteredListings.sort((a, b) => b.price - a.price);
      } else if (sortByStr === "bedsDesc") {
        filteredListings.sort((a, b) => b.beds - a.beds);
      } else {
        filteredListings.sort((a, b) => String(b.id).localeCompare(String(a.id)));
      }

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listings: filteredListings,
          isLiveFeed: true,
          source: "ampre"
        })
      };

    } catch (error) {
      console.error("Netlify Function Ampre Error:", error);
    }
  }

  // 2. Try Repliers
  if (repliersKey && repliersKey !== "YOUR_REPLIERS_API_KEY" && repliersKey.trim() !== "") {
    try {
      const params = new URLSearchParams();
      params.append("status", "Active");
      params.append("resultsPerPage", "24");
      
      if (cityStr && cityStr !== "All") {
        params.append("city", cityStr);
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

      if (typeStr && typeStr !== "All") {
        if (typeStr === "condo") {
          params.append("class", "Condo");
        } else if (typeStr === "commercial") {
          params.append("class", "Commercial");
        } else {
          params.append("class", "Residential");
        }
      }

      if (keywordStr) {
        params.append("keywords", keywordStr);
      }

      const response = await globalThis.fetch(`https://api.repliers.io/listings?${params.toString()}`, {
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
          description: item.details?.description || "A gorgeous and highly desirable listing.",
          features: cleanFeatures,
          yearBuilt: parseInt(item.details?.yearBuilt) || 2015,
          isLiveMLS: true
        };
      });

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listings: mappedListings,
          isLiveFeed: true,
          source: "repliers"
        })
      };

    } catch (error) {
      console.error("Netlify Function Repliers Error:", error);
    }
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      listings: [],
      isLiveFeed: false
    })
  };
};
