/* API HELPER FUNCTIONS FOR ROADTRIP BUILDING */
const axios = require('axios');
const { GoogleApiKey, TicketMasterApiKey } = require('../Constants');

async function callDirectionService (request) {
  const baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';
  request.key = GoogleApiKey;

  try {
    const response = await axios.get(baseUrl, {
      params: request,
    });
    
    if (response.data.status === 'OK') {
      const route = response.data;
      return route;
    } else {
      console.error(`Error getting directions by request: ${response.data.status}`.red.bold);
      return {message: response.data.status};
    }
  } catch (error) {
    console.error(`Error getting directions: ${error.message}`.red.bold);
    return {message: error.message};
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3960; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

async function getGeoLocation(address) {
  let endpoint = 'https://maps.googleapis.com/maps/api/geocode/json';
  let params = {
    address: address,
    key: GoogleApiKey,
  };
  let response;
  try {
    response = await axios.get(endpoint, { params: params });
    const location = response.data.results[0].geometry.location;
    return location;
  } catch (error) {
    console.log(response.data);
    throw new Error(error.message);
    
  }
}


//Get State From Coordinates
async function getStateFromCoordinates(lat, long) {
  let endpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${GoogleApiKey}`;
  let response;
  try {
    response = await axios.get(endpoint);
    const state = response.data.results[0].address_components.find(component => {
      return component.types.includes('administrative_area_level_1');
    });
    return state.long_name;
  } catch (error) {
    console.log(response.data);
    throw new Error(error.message);
  }
}


//Get Gas Station Prices
async function getGasStationPrices(geocode) {
  const state = await getStateFromCoordinates(geocode.lat,geocode.long);
  console.log("state", state);
  const gasPrices = {
    "Alaska": 4.229,
    "Alabama": 3.028,
    "Arkansas": 3.049,
    "Arizona": 3.915,
    "California":	5.210,
    "Colorado":	3.503,
    "Connecticut":	3.547,
    "District of Columbia": 3.640,
    "Delaware":	3.119,
    "Florida":	3.228,
    "Georgia":	2.934,
    "Hawaii":	 4.760,
    "Iowa": 3.172,
    "Idaho":	3.866,
    "Illinois": 3.544,
    "Indiana": 3.296,
    "Kansas": 3.260,
    "Kentucky": 3.111,
    "Louisiana": 3.011,
    "Massachusetts": 3.543,
    "Maryland": 3.321,
    "Maine": 3.529,
    "Michigan": 3.296,
    "Minnesota": 3.338,
    "Missouri": 3.121,
    "Mississippi": 2.943,
    "Montana": 3.693,
    "North Carolina": 3.151,
    "North Dakota": 3.522,
    "Nebraska":3.359,
    "New Hampshire": 3.428,
    "New Jersey": 3.375,
    "New Mexico": 3.353,
    "Nevada": 4.527,
    "New York": 3.727,
    "Ohio": 3.129,
    "Oklahoma": 3.097,
    "Oregon": 4.305,
    "Pennsylvania": 3.679,
    "Rhode Island": 3.479,
    "South Carolina": 3.021,
    "South Dakota": 3.460,
    "Tennessee": 3.063,
    "Texas": 2.933,
    "Utah": 3.696,
    "Virginia": 3.258,
    "Vermont": 3.618,
    "Washington": 4.649,
    "Wisconsin": 3.154,
    "West Virginia": 3.312,
    "Wyoming": 3.567
  };

  if (gasPrices[state]) {
    return gasPrices[state];
  } else {
    throw new Error(`Gas price for ${state} not found.`);
  }


}


async function decodePolyline(polyline) {
  const endpoint = 'https://maps.googleapis.com/maps/api/directions/json';
  const params = {
    polyline: polyline,
    key: GoogleApiKey,
  };
  try {
    const response = await axios.get(endpoint, { params: params });
    const location = response.data.results[0].geometry.location;
    return location;
  } catch (error) {
    throw new Error(error.message);
  } 
}

function nearestNextStop(from, stops) {
  let minDist = Infinity;
  let next = null;
  for (let i = 0; i < stops.length; i++) {
    const distance = calculateDistance(from.location.lat, from.location.lng,
      stops[i].location.lat, stops[i].location.lng);
    if (distance < minDist) {
      minDist = distance;
      next = i;
    }
  }
  return next;
}

async function callTicketmasterService(request) {
  const baseUrl = 'https://app.ticketmaster.com/discovery/v2/attractions.json';
  request.apikey = TicketMasterApiKey;

  try {
    const response = await axios.get(baseUrl, {
      params: request,
    });

    if (response.data._embedded && response.data._embedded.attractions) {
      const attractions = response.data._embedded.attractions;
      return attractions;
    } else {
      console.error(`Error getting Ticketmaster attractions: ${response.data.error}`);
      return { message: response.data.error };
    }
  } catch (error) {
    console.error(`Error getting Ticketmaster attractions: ${error.message}`);
    return { message: error.message };
  }
}

// async function getPlacePhotos(placeId) {
//   try {
//     const endpoint = 'https://maps.googleapis.com/maps/api/place/photo';
//     const params = {
//       photoreference: placeId, // Use place_id as photoreference
//       maxwidth: 400, // You can adjust the size of the photo
//       key: GoogleApiKey
//     };
//     const photoResponse = await axios.get(endpoint, { params: params });
//     return photoResponse.data; // This will contain the photo data
//   } catch (error) {
//     return { message: error.message };
//   }
// }

async function getStops(location, radius, keyword, preferences, type) {
  try {
    const locationString = `${location.lat},${location.lng}`;
    endpoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    params = {
      location: locationString,
      radius: radius,
      type: type,
      // minprice: , 
      // maxprice: ,
      // rankby: 'prominance'/'distance',
      key: GoogleApiKey
    };
    if (keyword) 
      params.keyword = keyword;
    const results = await axios.get(endpoint, { params: params });
    const list = results.data.results.map((place) => {
      return ({
        name: place.name,
        location: place.geometry.location,
        category: type,
        // icon: place.icon,
        place_id: place.place_id,
        locationString: `${place.geometry.location.lat},${place.geometry.location.lng}`, 
        rating: place.rating});})
    return list; // Corrected access to place names
  } catch (error) {
    return { message: error.message };
  }
}

function motionSickness(stops, scale) {
  /* Notes on motion sickness */
  /* 
  1. Drive Smoothly: Try to maintain a steady speed and avoid sudden acceleration or braking. 
  
  2. Focus on the horizon and limit head movements.
  
  3. Proper Ventilation: Ensure good ventilation in the vehicle.

  4. Opt for Daytime Driving: If possible, drive during the day. 
  
  5. Select the Right Vehicle: If you have the option, choose a vehicle with a smoother ride. Larger and more stable vehicles can often provide a more comfortable journey.
  
  6. Avoid Heavy Traffic: Stop-and-go traffic can make carsickness worse. You can check real-time traffic conditions on Google Maps and try to avoid congested areas. Upload all your planned routes into your Google Maps for easier access.
  
  7. Use Highways: Highways tend to have smoother and straighter roads compared to local streets.
  
  8. Plan for Frequent Stops.
  
  9. Avoid Winding Roads: Try to avoid routes with a lot of sharp turns and winding roads.

  10. Use Medication: If carsickness is a chronic issue for a passenger, consider over-the-counter motion sickness medication. Consult a healthcare professional for recommendations.
  */
 const recommendations = ['Drive Smoothly: Try to maintain a steady speed and avoid sudden acceleration or braking.'];
 recommendations.push('Focus on the horizon and limit head movements.'); 
 recommendations.push('Proper Ventilation: Ensure good ventilation in the vehicle.'); 
 recommendations.push('Opt for Daytime Driving: If possible, drive during the day.'); 
 recommendations.push('Select the Right Vehicle: If you have the option, choose a vehicle with a smoother ride.'); 
 recommendations.push('Avoid Heavy Traffic: Stop-and-go traffic can make carsickness worse. You can check real-time traffic conditions on Google Maps and try to avoid congested areas. Upload all your planned routes into your Google Maps for easier access.'); 
 recommendations.push('Use Highways: Highways tend to have smoother and straighter roads compared to local streets.'); 
 recommendations.push('Plan for Frequent Stops.');
 recommendations.push('Avoid Winding Roads: Try to avoid routes with a lot of sharp turns and winding roads.');
 recommendations.push('Use Medication: If carsickness is a chronic issue for a passenger, consider over-the-counter motion sickness medication. Consult a healthcare professional for recommendations.');

  const result = recommendations.splice(0, scale - 1);  

  return result;
}

module.exports = {
  callDirectionService,
  getStops,
  getGeoLocation,
  decodePolyline,
  calculateDistance,
  nearestNextStop,
  callTicketmasterService,
  motionSickness
};