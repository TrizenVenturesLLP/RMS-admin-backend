import axios from 'axios';

class PincodeService {
  constructor() {
    this.nominatimBaseUrl = 'https://nominatim.openstreetmap.org';
    this.pincodeCache = new Map(); // Cache for pincode lookups
  }

  /**
   * Geocode using pincode (most reliable for Indian addresses)
   * @param {string} pincode - 6-digit pincode
   * @returns {Promise<{lat: number, lon: number, display_name: string}>}
   */
  async geocodeByPincode(pincode) {
    // Clean pincode (remove spaces, ensure 6 digits)
    const cleanPincode = pincode.replace(/\D/g, '').padStart(6, '0');
    
    if (cleanPincode.length !== 6) {
      throw new Error('Invalid pincode format. Must be 6 digits.');
    }

    // Check cache first
    if (this.pincodeCache.has(cleanPincode)) {
      console.log(`📦 Using cached pincode data for ${cleanPincode}`);
      return this.pincodeCache.get(cleanPincode);
    }

    try {
      console.log(`🗺️ Geocoding pincode: ${cleanPincode}`);
      
      // Try multiple pincode search strategies
      const strategies = [
        `Pincode ${cleanPincode}, India`,
        `Postal Code ${cleanPincode}, India`,
        `${cleanPincode}, India`,
        `India ${cleanPincode}`
      ];

      for (const query of strategies) {
        try {
          const response = await axios.get(`${this.nominatimBaseUrl}/search`, {
            params: {
              q: query,
              format: 'json',
              limit: 5,
              countrycodes: 'in',
              addressdetails: 1
            },
            headers: {
              'User-Agent': 'RidersMotoShop/1.0'
            },
            timeout: 10000
          });

          if (response.data && response.data.length > 0) {
            // Find the best match for this pincode
            const bestMatch = this.findBestPincodeMatch(response.data, cleanPincode);
            if (bestMatch) {
              const coordinates = {
                lat: parseFloat(bestMatch.lat),
                lon: parseFloat(bestMatch.lon),
                display_name: bestMatch.display_name,
                address: bestMatch.address,
                pincode: cleanPincode,
                confidence: 'high'
              };
              
              // Cache the result
              this.pincodeCache.set(cleanPincode, coordinates);
              
              console.log(`✅ Pincode geocoded successfully:`, coordinates);
              return coordinates;
            }
          }
        } catch (error) {
          console.log(`⚠️ Pincode strategy failed for "${query}":`, error.message);
          continue;
        }
      }

      throw new Error(`No results found for pincode ${cleanPincode}`);
    } catch (error) {
      console.error('❌ Pincode geocoding error:', error.message);
      throw new Error(`Failed to geocode pincode: ${error.message}`);
    }
  }

  /**
   * Find the best match for pincode from search results
   * @param {Array} results - Search results
   * @param {string} pincode - Target pincode
   * @returns {Object|null} Best match
   */
  findBestPincodeMatch(results, pincode) {
    if (!results || results.length === 0) return null;

    // Score each result based on pincode relevance
    const scoredResults = results.map(result => {
      let score = 0;
      const displayName = (result.display_name || '').toLowerCase();
      const address = result.address || {};
      
      // Exact pincode match gets highest score
      if (displayName.includes(pincode)) {
        score += 1000;
      }
      
      // Check if pincode is in address details
      if (address.postcode === pincode) {
        score += 2000; // Highest priority
      }
      
      // Check for postal code in address
      if (address.postal_code === pincode) {
        score += 2000;
      }
      
      // Prefer results with more address details
      const addressKeys = Object.keys(address);
      score += addressKeys.length * 10;
      
      // Prefer results with higher importance
      if (result.importance) {
        score += result.importance * 100;
      }
      
      // Prefer results that mention "post office" or "postal"
      if (displayName.includes('post office') || displayName.includes('postal')) {
        score += 500;
      }
      
      return { ...result, score };
    });

    // Sort by score and return the best match
    scoredResults.sort((a, b) => b.score - a.score);
    return scoredResults[0];
  }

  /**
   * Extract pincode from address string
   * @param {string} address - Full address
   * @returns {string|null} Extracted pincode
   */
  extractPincode(address) {
    const pincodeMatch = address.match(/\b(\d{6})\b/);
    return pincodeMatch ? pincodeMatch[1] : null;
  }

  /**
   * Get pincode zone information
   * @param {string} pincode - 6-digit pincode
   * @returns {Object} Zone information
   */
  getPincodeZone(pincode) {
    const cleanPincode = pincode.replace(/\D/g, '').padStart(6, '0');
    const firstDigit = cleanPincode[0];
    
    const zones = {
      '1': { 
        name: 'Delhi, Haryana, Punjab, Himachal Pradesh, Jammu & Kashmir, Chandigarh',
        states: ['Delhi', 'Haryana', 'Punjab', 'Himachal Pradesh', 'Jammu and Kashmir', 'Chandigarh'],
        distance: 500,
        multiplier: 1.2
      },
      '2': { 
        name: 'Uttar Pradesh, Uttarakhand',
        states: ['Uttar Pradesh', 'Uttarakhand'],
        distance: 400,
        multiplier: 1.1
      },
      '3': { 
        name: 'Rajasthan, Gujarat, Daman & Diu, Dadra & Nagar Haveli',
        states: ['Rajasthan', 'Gujarat', 'Daman and Diu', 'Dadra and Nagar Haveli'],
        distance: 300,
        multiplier: 1.0
      },
      '4': { 
        name: 'Maharashtra, Goa, Madhya Pradesh, Chhattisgarh',
        states: ['Maharashtra', 'Goa', 'Madhya Pradesh', 'Chhattisgarh'],
        distance: 200,
        multiplier: 0.9
      },
      '5': { 
        name: 'Karnataka, Andhra Pradesh, Telangana',
        states: ['Karnataka', 'Andhra Pradesh', 'Telangana'],
        distance: 100,
        multiplier: 0.8
      },
      '6': { 
        name: 'Tamil Nadu, Kerala, Puducherry, Lakshadweep',
        states: ['Tamil Nadu', 'Kerala', 'Puducherry', 'Lakshadweep'],
        distance: 200,
        multiplier: 0.9
      },
      '7': { 
        name: 'West Bengal, Odisha, Assam, Sikkim, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Tripura',
        states: ['West Bengal', 'Odisha', 'Assam', 'Sikkim', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Tripura'],
        distance: 400,
        multiplier: 1.1
      },
      '8': { 
        name: 'Bihar, Jharkhand',
        states: ['Bihar', 'Jharkhand'],
        distance: 500,
        multiplier: 1.2
      },
      '9': { 
        name: 'Army Postal Service (APS)',
        states: ['Army Postal Service'],
        distance: 600,
        multiplier: 1.3
      }
    };

    return zones[firstDigit] || {
      name: 'Unknown Zone',
      states: [],
      distance: 300,
      multiplier: 1.0
    };
  }

  /**
   * Calculate shipping cost based on pincode zone
   * @param {string} pincode - 6-digit pincode
   * @param {number} orderValue - Order value
   * @returns {Object} Shipping calculation
   */
  calculateShippingByPincode(pincode, orderValue = 0) {
    console.log(`💰 Calculating shipping for pincode: ${pincode}, order value: ₹${orderValue}`);
    
    // Free shipping for orders over ₹999
    if (orderValue >= 999) {
      return {
        shippingCost: 0,
        distance: 0,
        duration: 0,
        pincode,
        zone: null,
        fallback: false,
        reason: 'Free shipping - order value ≥ ₹999'
      };
    }

    const zone = this.getPincodeZone(pincode);
    const baseShipping = 150;
    const shippingCost = Math.round(baseShipping * zone.multiplier);
    const estimatedDuration = Math.round(zone.distance / 50); // 50 km/hour average

    return {
      shippingCost,
      distance: zone.distance,
      duration: estimatedDuration,
      pincode,
      zone: zone.name,
      states: zone.states,
      fallback: false,
      reason: `Calculated based on pincode zone ${pincode[0]}`
    };
  }

  /**
   * Validate pincode format
   * @param {string} pincode - Pincode to validate
   * @returns {boolean} Is valid pincode
   */
  isValidPincode(pincode) {
    const cleanPincode = pincode.replace(/\D/g, '');
    return cleanPincode.length === 6 && /^[1-9]\d{5}$/.test(cleanPincode);
  }

  /**
   * Get pincode information
   * @param {string} pincode - 6-digit pincode
   * @returns {Object} Pincode information
   */
  async getPincodeInfo(pincode) {
    try {
      const coordinates = await this.geocodeByPincode(pincode);
      const zone = this.getPincodeZone(pincode);
      
      return {
        pincode,
        coordinates,
        zone,
        isValid: true
      };
    } catch (error) {
      return {
        pincode,
        coordinates: null,
        zone: null,
        isValid: false,
        error: error.message
      };
    }
  }
}

export default new PincodeService();
