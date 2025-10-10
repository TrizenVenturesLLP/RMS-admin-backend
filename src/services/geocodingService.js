import axios from 'axios';
import pincodeService from './pincodeService.js';

// Shop location (you can set this to your actual shop location)
const SHOP_LOCATION = {
  lat: 17.385044, // Hyderabad coordinates (example)
  lon: 78.486671,
  address: "Hyderabad, Telangana, India"
};

class GeocodingService {
  constructor() {
    this.nominatimBaseUrl = 'https://nominatim.openstreetmap.org';
    this.osrmBaseUrl = 'https://router.project-osrm.org';
  }

  /**
   * Geocode an address to get latitude and longitude
   * @param {string} address - The address to geocode
   * @returns {Promise<{lat: number, lon: number, display_name: string}>}
   */
  async geocodeAddress(address) {
    console.log(`🗺️ Geocoding address: ${address}`);
    
    // Strategy 1: Try pincode-based geocoding first (most reliable for India)
    const pincode = pincodeService.extractPincode(address);
    if (pincode && pincodeService.isValidPincode(pincode)) {
      console.log(`📮 Found pincode: ${pincode}, using pincode-based geocoding`);
      try {
        const pincodeResult = await pincodeService.geocodeByPincode(pincode);
        console.log(`✅ Pincode geocoding successful:`, pincodeResult);
        return {
          ...pincodeResult,
          strategy: 'Pincode-based',
          confidence: 'high'
        };
      } catch (error) {
        console.log(`⚠️ Pincode geocoding failed:`, error.message);
        // Continue to fallback strategies
      }
    }
    
    // Strategy 2: Try multiple text-based geocoding strategies
    const strategies = this.generateGeocodingStrategies(address);
    
    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      console.log(`🔄 Trying strategy ${i + 1}/${strategies.length}: ${strategy.name}`);
      
      try {
        const response = await axios.get(`${this.nominatimBaseUrl}/search`, {
          params: {
            q: strategy.query,
            format: 'json',
            limit: 5, // Get more results for better matching
            countrycodes: 'in',
            addressdetails: 1,
            ...strategy.params
          },
          headers: {
            'User-Agent': 'RidersMotoShop/1.0'
          },
          timeout: 10000
        });

        if (response.data && response.data.length > 0) {
          // Find the best match
          const bestMatch = this.findBestMatch(response.data, address);
          if (bestMatch) {
            const coordinates = {
              lat: parseFloat(bestMatch.lat),
              lon: parseFloat(bestMatch.lon),
              display_name: bestMatch.display_name,
              address: bestMatch.address,
              strategy: strategy.name,
              confidence: 'medium'
            };
            
            console.log(`✅ Geocoded successfully using ${strategy.name}:`, coordinates);
            return coordinates;
          }
        }
      } catch (error) {
        console.log(`⚠️ Strategy ${strategy.name} failed:`, error.message);
        continue; // Try next strategy
      }
    }
    
    // If all strategies fail, throw error
    throw new Error('No results found for the given address after trying multiple strategies');
  }

  /**
   * Generate multiple geocoding strategies for better results
   * @param {string} address - Original address
   * @returns {Array} Array of geocoding strategies
   */
  generateGeocodingStrategies(address) {
    const strategies = [];
    
    // Strategy 1: Full address as-is
    strategies.push({
      name: 'Full Address',
      query: address,
      params: {}
    });
    
    // Strategy 2: Clean and format address
    const cleanedAddress = this.cleanAddress(address);
    if (cleanedAddress !== address) {
      strategies.push({
        name: 'Cleaned Address',
        query: cleanedAddress,
        params: {}
      });
    }
    
    // Strategy 3: Extract city and state
    const cityState = this.extractCityState(address);
    if (cityState) {
      strategies.push({
        name: 'City + State',
        query: cityState,
        params: {}
      });
    }
    
    // Strategy 4: Extract pincode area
    const pincodeArea = this.extractPincodeArea(address);
    if (pincodeArea) {
      strategies.push({
        name: 'Pincode Area',
        query: pincodeArea,
        params: {}
      });
    }
    
    // Strategy 5: Broader search without country restriction
    strategies.push({
      name: 'Global Search',
      query: cleanedAddress,
      params: {} // No countrycodes restriction
    });
    
    return strategies;
  }

  /**
   * Clean and format address for better geocoding
   * @param {string} address - Raw address
   * @returns {string} Cleaned address
   */
  cleanAddress(address) {
    return address
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/,\s*,/g, ',') // Remove empty comma segments
      .replace(/^,\s*|,\s*$/g, '') // Remove leading/trailing commas
      .trim();
  }

  /**
   * Extract city and state from address
   * @param {string} address - Full address
   * @returns {string|null} City and state
   */
  extractCityState(address) {
    const parts = address.split(',').map(part => part.trim());
    
    // Look for common patterns
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      // Check if this looks like a city
      if (part.length > 3 && !/^\d+$/.test(part)) {
        // Look for state in next parts
        for (let j = i + 1; j < parts.length; j++) {
          const nextPart = parts[j];
          if (nextPart.length > 3 && !/^\d+$/.test(nextPart)) {
            return `${part}, ${nextPart}, India`;
          }
        }
        return `${part}, India`;
      }
    }
    
    return null;
  }

  /**
   * Extract pincode area from address
   * @param {string} address - Full address
   * @returns {string|null} Pincode area
   */
  extractPincodeArea(address) {
    const pincodeMatch = address.match(/\b(\d{6})\b/);
    if (pincodeMatch) {
      const pincode = pincodeMatch[1];
      return `Pincode ${pincode}, India`;
    }
    return null;
  }

  /**
   * Find the best match from geocoding results
   * @param {Array} results - Geocoding results
   * @param {string} originalAddress - Original address
   * @returns {Object|null} Best match
   */
  findBestMatch(results, originalAddress) {
    if (!results || results.length === 0) return null;
    
    // Score each result based on relevance
    const scoredResults = results.map(result => {
      let score = 0;
      const displayName = (result.display_name || '').toLowerCase();
      const originalLower = originalAddress.toLowerCase();
      
      // Exact match gets highest score
      if (displayName.includes(originalLower)) {
        score += 100;
      }
      
      // Partial matches
      const originalWords = originalLower.split(/\s+/);
      originalWords.forEach(word => {
        if (word.length > 2 && displayName.includes(word)) {
          score += 10;
        }
      });
      
      // Prefer results with more address details
      if (result.address) {
        const addressKeys = Object.keys(result.address);
        score += addressKeys.length * 2;
      }
      
      // Prefer results with higher importance (Nominatim ranking)
      if (result.importance) {
        score += result.importance * 50;
      }
      
      return { ...result, score };
    });
    
    // Sort by score and return the best match
    scoredResults.sort((a, b) => b.score - a.score);
    return scoredResults[0];
  }

  /**
   * Calculate distance between two points using OSRM
   * @param {number} lat1 - Latitude of first point
   * @param {number} lon1 - Longitude of first point
   * @param {number} lat2 - Latitude of second point
   * @param {number} lon2 - Longitude of second point
   * @returns {Promise<{distance: number, duration: number}>}
   */
  async calculateDistance(lat1, lon1, lat2, lon2) {
    try {
      console.log(`📏 Calculating distance from (${lat1}, ${lon1}) to (${lat2}, ${lon2})`);
      
      const response = await axios.get(`${this.osrmBaseUrl}/route/v1/driving/${lon1},${lat1};${lon2},${lat2}`, {
        params: {
          overview: false,
          steps: false
        },
        timeout: 10000
      });

      if (response.data && response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const distance = route.distance; // in meters
        const duration = route.duration; // in seconds
        
        console.log(`✅ Distance calculated: ${(distance / 1000).toFixed(2)} km, Duration: ${(duration / 3600).toFixed(2)} hours`);
        
        return {
          distance: distance, // meters
          duration: duration, // seconds
          distanceKm: distance / 1000,
          durationHours: duration / 3600
        };
      } else {
        throw new Error('No route found between the given coordinates');
      }
    } catch (error) {
      console.error('❌ Distance calculation error:', error.message);
      throw new Error(`Failed to calculate distance: ${error.message}`);
    }
  }

  /**
   * Calculate shipping cost based on distance
   * @param {number} distanceKm - Distance in kilometers
   * @param {number} orderValue - Order value in rupees
   * @returns {number} - Shipping cost in rupees
   */
  calculateShippingCost(distanceKm, orderValue = 0) {
    console.log(`💰 Calculating shipping for ${distanceKm.toFixed(2)} km, order value: ₹${orderValue}`);
    
    // Free shipping for orders over ₹999
    if (orderValue >= 999) {
      console.log('✅ Free shipping - order value ≥ ₹999');
      return 0;
    }

    // Distance-based shipping rates
    let baseShipping = 0;
    
    if (distanceKm < 10) {
      baseShipping = 50; // Local delivery
    } else if (distanceKm < 50) {
      baseShipping = 100; // City delivery
    } else if (distanceKm < 100) {
      baseShipping = 150; // Regional delivery
    } else if (distanceKm < 300) {
      baseShipping = 200; // State delivery
    } else if (distanceKm < 500) {
      baseShipping = 300; // Inter-state delivery
    } else {
      baseShipping = 500; // Long distance delivery
    }

    // Add distance-based surcharge
    const distanceSurcharge = Math.ceil(distanceKm / 100) * 25; // ₹25 per 100km
    const totalShipping = baseShipping + distanceSurcharge;

    console.log(`📦 Base shipping: ₹${baseShipping}, Distance surcharge: ₹${distanceSurcharge}, Total: ₹${totalShipping}`);
    
    return totalShipping;
  }

  /**
   * Get shipping cost for a given address
   * @param {string} address - Customer address
   * @param {number} orderValue - Order value
   * @returns {Promise<{shippingCost: number, distance: number, coordinates: object}>}
   */
  async getShippingCost(address, orderValue = 0) {
    try {
      // Strategy 1: Try pincode-based calculation first (most reliable)
      const pincode = pincodeService.extractPincode(address);
      if (pincode && pincodeService.isValidPincode(pincode)) {
        console.log(`📮 Using pincode-based shipping calculation for: ${pincode}`);
        try {
          const pincodeShipping = pincodeService.calculateShippingByPincode(pincode, orderValue);
          const pincodeInfo = await pincodeService.getPincodeInfo(pincode);
          
          return {
            shippingCost: pincodeShipping.shippingCost,
            distance: pincodeShipping.distance,
            duration: pincodeShipping.duration,
            coordinates: pincodeInfo.coordinates,
            shopLocation: SHOP_LOCATION,
            pincode: pincode,
            zone: pincodeShipping.zone,
            method: 'pincode-based',
            confidence: 'high'
          };
        } catch (error) {
          console.log(`⚠️ Pincode-based calculation failed:`, error.message);
          // Continue to geocoding-based calculation
        }
      }
      
      // Strategy 2: Geocode the customer address and calculate distance
      console.log(`🗺️ Using geocoding-based shipping calculation`);
      const customerLocation = await this.geocodeAddress(address);
      
      // Calculate distance from shop to customer
      const distanceData = await this.calculateDistance(
        SHOP_LOCATION.lat,
        SHOP_LOCATION.lon,
        customerLocation.lat,
        customerLocation.lon
      );
      
      // Calculate shipping cost
      const shippingCost = this.calculateShippingCost(distanceData.distanceKm, orderValue);
      
      return {
        shippingCost,
        distance: distanceData.distanceKm,
        duration: distanceData.durationHours,
        coordinates: customerLocation,
        shopLocation: SHOP_LOCATION,
        method: 'geocoding-based',
        confidence: customerLocation.confidence || 'medium'
      };
    } catch (error) {
      console.error('❌ Shipping calculation error:', error.message);
      
      // Fallback to intelligent shipping calculation
      console.log('🔄 Using intelligent fallback shipping calculation');
      return this.getFallbackShippingCost(address, orderValue);
    }
  }

  /**
   * Fallback shipping calculation when geocoding fails
   * @param {string} address - Customer address
   * @param {number} orderValue - Order value
   * @returns {object} - Fallback shipping data
   */
  getFallbackShippingCost(address, orderValue = 0) {
    console.log('🔄 Using fallback shipping calculation');
    
    // Free shipping for orders over ₹999
    if (orderValue >= 999) {
      return {
        shippingCost: 0,
        distance: 0,
        duration: 0,
        coordinates: null,
        shopLocation: SHOP_LOCATION,
        fallback: true
      };
    }

    // Enhanced shipping calculation based on address analysis
    const addressLower = address.toLowerCase();
    let shippingCost = 150; // Default shipping
    let estimatedDistance = 200; // Default estimated distance in km

    // Tier 1 Metro Cities - Lower shipping
    const tier1Cities = [
      'mumbai', 'delhi', 'bangalore', 'chennai', 'hyderabad', 'kolkata', 
      'pune', 'ahmedabad', 'surat', 'jaipur', 'lucknow', 'kanpur'
    ];
    
    // Tier 2 Cities - Medium shipping
    const tier2Cities = [
      'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam', 'pimpri', 
      'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik'
    ];
    
    // Tier 3 Cities - Higher shipping
    const tier3Cities = [
      'faridabad', 'meerut', 'rajkot', 'kalyan', 'vasai', 'varanasi',
      'srinagar', 'aurangabad', 'noida', 'solapur', 'vijayawada', 'kolhapur'
    ];

    // Check for tier 1 cities
    if (tier1Cities.some(city => addressLower.includes(city))) {
      shippingCost = 100;
      estimatedDistance = 50;
    }
    // Check for tier 2 cities
    else if (tier2Cities.some(city => addressLower.includes(city))) {
      shippingCost = 120;
      estimatedDistance = 100;
    }
    // Check for tier 3 cities
    else if (tier3Cities.some(city => addressLower.includes(city))) {
      shippingCost = 140;
      estimatedDistance = 150;
    }
    
    // State-based shipping adjustments
    const stateAdjustments = {
      // Southern states (closer to Hyderabad shop)
      'andhra pradesh': { multiplier: 0.8, distance: 100 },
      'telangana': { multiplier: 0.7, distance: 50 },
      'karnataka': { multiplier: 0.9, distance: 200 },
      'tamil nadu': { multiplier: 0.9, distance: 300 },
      'kerala': { multiplier: 1.0, distance: 400 },
      
      // Western states
      'maharashtra': { multiplier: 0.8, distance: 150 },
      'gujarat': { multiplier: 0.9, distance: 200 },
      'goa': { multiplier: 1.0, distance: 300 },
      
      // Northern states
      'uttar pradesh': { multiplier: 1.2, distance: 500 },
      'rajasthan': { multiplier: 1.1, distance: 400 },
      'punjab': { multiplier: 1.3, distance: 600 },
      'haryana': { multiplier: 1.2, distance: 550 },
      'delhi': { multiplier: 1.2, distance: 550 },
      
      // Eastern states
      'west bengal': { multiplier: 1.1, distance: 400 },
      'odisha': { multiplier: 1.0, distance: 300 },
      'bihar': { multiplier: 1.2, distance: 500 },
      'jharkhand': { multiplier: 1.1, distance: 450 },
      
      // Remote areas - Higher shipping
      'jammu and kashmir': { multiplier: 1.5, distance: 800 },
      'himachal pradesh': { multiplier: 1.4, distance: 700 },
      'uttarakhand': { multiplier: 1.3, distance: 600 },
      'arunachal pradesh': { multiplier: 1.6, distance: 900 },
      'assam': { multiplier: 1.3, distance: 600 },
      'manipur': { multiplier: 1.5, distance: 800 },
      'meghalaya': { multiplier: 1.4, distance: 700 },
      'mizoram': { multiplier: 1.5, distance: 800 },
      'nagaland': { multiplier: 1.5, distance: 800 },
      'sikkim': { multiplier: 1.4, distance: 700 },
      'tripura': { multiplier: 1.3, distance: 600 }
    };

    // Apply state-based adjustments
    for (const [state, adjustment] of Object.entries(stateAdjustments)) {
      if (addressLower.includes(state)) {
        shippingCost = Math.round(shippingCost * adjustment.multiplier);
        estimatedDistance = adjustment.distance;
        break;
      }
    }

    // Pincode-based adjustments (rough estimation)
    const pincodeMatch = address.match(/\b(\d{6})\b/);
    if (pincodeMatch) {
      const pincode = pincodeMatch[1];
      const firstDigit = pincode[0];
      
      // Pincode zones (rough estimation)
      const zoneAdjustments = {
        '1': { multiplier: 1.2, distance: 500 }, // Delhi, Haryana, Punjab
        '2': { multiplier: 1.1, distance: 400 }, // Uttar Pradesh, Uttarakhand
        '3': { multiplier: 1.0, distance: 300 }, // Rajasthan, Gujarat
        '4': { multiplier: 0.9, distance: 200 }, // Maharashtra, Goa
        '5': { multiplier: 0.8, distance: 100 }, // Karnataka, Andhra Pradesh, Telangana
        '6': { multiplier: 0.9, distance: 200 }, // Tamil Nadu, Kerala, Puducherry
        '7': { multiplier: 1.1, distance: 400 }, // West Bengal, Odisha, Assam
        '8': { multiplier: 1.2, distance: 500 }, // Bihar, Jharkhand, Northeast
        '9': { multiplier: 1.3, distance: 600 }  // Remote areas
      };
      
      if (zoneAdjustments[firstDigit]) {
        const zoneAdj = zoneAdjustments[firstDigit];
        shippingCost = Math.round(shippingCost * zoneAdj.multiplier);
        estimatedDistance = zoneAdj.distance;
      }
    }

    return {
      shippingCost,
      distance: estimatedDistance,
      duration: Math.round(estimatedDistance / 50), // Rough estimate: 50 km/hour
      coordinates: null,
      shopLocation: SHOP_LOCATION,
      fallback: true,
      fallbackReason: 'Geocoding failed, using intelligent fallback calculation'
    };
  }
}

export default new GeocodingService();
