/* API HELPER FUNCTIONS FOR ROADTRIP BUILDING */
const axios = require('axios');
const { GoogleApiKey, TicketMasterApiKey, YelpApiKey } = require('../Constants');

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
    console.log(`${response.data}`.red.bold);
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
    throw new Error(error.message);
  }
}

async function getYelpURL(location) {
  const searchUrl = 'https://api.yelp.com/v3/businesses/search';
  const headers = {
    Authorization: `Bearer ${YelpApiKey}`,
  };
  const params = {
    // term: SEARCH_TERM,
    location: location,
  };

  axios
  .get(searchUrl, {
    headers,
    params,
  })
  .then((response) => {
    const data = response.data;

    if (data.businesses && data.businesses.length > 0) {
      const business = data.businesses[0];
      const yelpUrl = business.url || 'Yelp URL not found';
      //console.log(`Yelp URL for ${SEARCH_TERM}: ${yelpUrl}`);
      return yelpUrl;
    } else {
      console.log(`No results found for ${SEARCH_TERM}`);
      return null;
    }
  })
  .catch((error) => {
    return {message: error.message};
  });
}

async function getRestaurants(route, foodPreferences) {
  const restaurants = [];
  let current = route[0];
  const maxDistance = 50;
  let currentDistance = 0;
  for(let i = 1; i < route.length; i++) {
    const distance = calculateDistance(current.lat, current.lng, route[i].lat, route[i].lng);
    if (currentDistance + distance > maxDistance) {
      const currRestaurants = await getStops(current, null, foodPreferences ? foodPreferences : null, 'food', 'distance');
      // Push the first 3 restaurants
      restaurants.push(...currRestaurants.slice(0, 3));
      currentDistance = 0; 
    }
    current = route[i];
    currentDistance += distance;
  }

  return restaurants;
}

async function gasStationsForStop(stop, mpg, fuelCapacity, distancePassed, fuelType) {
  const gasStations = [];
  const route = stop.routeFromHere;
  let current = route[0];
  const maxDistance = mpg * fuelCapacity * 0.75;
  let currentDistance = distancePassed;
  for(let i = 1; i < route.length; i++) {
    const distance = calculateDistance(current.lat, current.lng, route[i].lat, route[i].lng);
    if (currentDistance + distance > maxDistance) {
      const currGasStations = await getStops(current, null, null, 'gas_station', 'distance');
      // Push the first 3 gas stations
      gasStations.push(...currGasStations.slice(0, 3));
      gasStations.forEach(async (station) => {
          station.price = await getGasStationPrices(station.location, fuelType);
      });
      currentDistance = 0;
    }
    current = route[i];
    currentDistance += distance; 
  }
  stop.distanceForGasStations = currentDistance;
  stop.gasStations = gasStations;
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

async function callTicketmasterService(startLocation, endLocation, startDate, endDate) {
  let url = `https://app.ticketmaster.com//discovery/v2/events.json?apikey=${TicketMasterApiKey}`;

  const start = new Date(startDate).toISOString().split('T')[0] + 'T00:00:00Z';
  const end = new Date(endDate).toISOString().split('T')[0] + 'T23:59:59Z';
  const params = {
    startDateTime: start,
    endDateTime: end,
    size: 10,
    radius: 100,
    sort: 'relevance,asc',
    latlong: `${startLocation.lat},${startLocation.lng}`,
  }

  // Add params to url
  for (const key in params) {
    url += `&${key}=${params[key]}`;
  }

  try {
    const response = await axios.get(url);
    return response.data._embedded.events;
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

async function getStops(location, radius, preferences, type, rankby) {
  try {
    let keywords;
    const locationString = `${location.lat},${location.lng}`;
    endpoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    params = {
      location: locationString,
      // minprice: , 
      // maxprice: ,
      // rankby: rankby, // 'prominence' / 'distance'
      key: GoogleApiKey
    };
    if (preferences && preferences.length > 0) {
      const lowercasedArray = preferences.map(str => str.toLowerCase().replace(' ', '_'));
      keywords = lowercasedArray.join(',');
      params.keyword = keywords;
    }
    if (type)
      params.type = type;
    if (radius)
      params.radius = radius;
    if (rankby)
      params.rankby = rankby;
    const results = await axios.get(endpoint, { params: params });
    const list = results.data.results.map((place) => {
      return ({
        name: place.name,
        location: place.geometry.location,
        category: type,
        // icon: place.icon,
        place_id: place.place_id,
        locationString: `${place.geometry.location.lat},${place.geometry.location.lng}`, 
        price: place.price_level,
        vicinity: place.vicinity ? place.vicinity : null,
        url: place.url,
        photo: place.photos ? place.photos[0] : null,
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
  getYelpURL,
  callTicketmasterService,
  motionSickness,
  gasStationsForStop,
  getRestaurants,
};

//Get Gas Station Prices
async function getGasStationPrices(geocode, fuelType) {
  const state = await getStateFromCoordinates(geocode.lat,geocode.lng);
  const gasPrices = {
    Alaska: {
      Regular: 4.196,
      MidGrade: 4.429,
      Premium: 4.634,
      Diesel: 4.532,
    },
    Alabama: {
      Regular: 3.016,
      MidGrade: 3.427,
      Premium: 3.809,
      Diesel: 4.111,
    },
    Arkansas: {
      Regular: 3.038,
      MidGrade: 3.441,
      Premium: 3.805,
      Diesel: 4.175,
    },
    Arizona: {
      Regular: 3.894,
      MidGrade: 4.222,
      Premium: 4.505,
      Diesel: 4.561,
    },
    California: {
      Regular: 5.183,
      MidGrade: 5.415,
      Premium: 5.569,
      Diesel: 6.072,
    },
    Colorado: {
      Regular: 3.476,
      MidGrade: 3.863,
      Premium: 4.164,
      Diesel: 4.535,
    },
    Connecticut: {
      Regular: 3.537,
      MidGrade: 4.117,
      Premium: 4.517,
      Diesel: 4.546,
    },
    'District of Columbia': {
      Regular: 3.636,
      MidGrade: 4.230,
      Premium: 4.607,
      Diesel: 4.544,
    },
    Delaware: {
      Regular: 3.101,
      MidGrade: 3.643,
      Premium: 3.947,
      Diesel: 4.260,
    },
    Florida: {
      Regular: 3.208,
      MidGrade: 3.627,
      Premium: 3.960,
      Diesel: 4.271,
    },
    Georgia: {
      Regular: 2.924,
      MidGrade: 3.360,
      Premium: 3.750,
      Diesel: 4.028,
    },
    Hawaii: {
      Regular: 4.754,
      MidGrade: 4.963,
      Premium: 5.214,
      Diesel: 5.737,
    },
    Iowa: {
      Regular: 3.151,
      MidGrade: 3.483,
      Premium: 3.919,
      Diesel: 4.458,
    },
    Idaho: {
      Regular: 3.855,
      MidGrade: 4.088,
      Premium: 4.327,
      Diesel: 4.627,
    },
    Illinois: {
      Regular: 3.538,
      MidGrade: 4.046,
      Premium: 4.474,
      Diesel: 4.269,
    },
    Indiana: {
      Regular: 3.282,
      MidGrade: 3.789,
      Premium: 4.249,
      Diesel: 4.337,
    },
    Kansas: {
      Regular: 3.240,
      MidGrade: 3.544,
      Premium: 3.870,
      Diesel: 4.516,
    },
    Kentucky: {
      Regular: 3.095,
      MidGrade: 3.576,
      Premium: 3.980,
      Diesel: 4.159,
    },
    Louisiana: {
      Regular: 2.997,
      MidGrade: 3.416,
      Premium: 3.774,
      Diesel: 4.016,
    },
    Massachusetts: {
      Regular: 3.533,
      MidGrade: 4.112,
      Premium: 4.452,
      Diesel: 4.465,
    },
    Maryland: {
      Regular: 3.307,
      MidGrade: 3.876,
      Premium: 4.186,
      Diesel: 4.367,
    },
    Maine: {
      Regular: 3.516,
      MidGrade: 3.952,
      Premium: 4.365,
      Diesel: 4.472,
    },
    Michigan: {
      Regular: 3.389,
      MidGrade: 3.858,
      Premium: 4.355,
      Diesel: 4.280,
    },
    Minnesota: {
      Regular: 3.321,
      MidGrade: 3.658,
      Premium: 4.061,
      Diesel: 4.670,
    },
    Missouri: {
      Regular: 3.108,
      MidGrade: 3.449,
      Premium: 3.774,
      Diesel: 4.297,
    },
    Mississippi: {
      Regular: 2.929,
      MidGrade: 3.338,
      Premium: 3.689,
      Diesel: 3.959,
    },
    Montana: {
      Regular: 3.669,
      MidGrade: 3.965,
      Premium: 4.262,
      Diesel: 4.479,
    },
    'North Carolina': {
      Regular: 3.140,
      MidGrade: 3.553,
      Premium: 3.925,
      Diesel: 4.194,
    },
    'North Dakota': {
      Regular: 3.499,
      MidGrade: 3.794,
      Premium: 4.125,
      Diesel: 4.628,
    },
    Nebraska: {
      Regular: 3.339,
      MidGrade: 3.541,
      Premium: 3.979,
      Diesel: 4.521,
    },
    'New Hampshire': {
      Regular: 3.416,
      MidGrade: 3.885,
      Premium: 4.300,
      Diesel: 4.352,
    },
    'New Jersey': {
      Regular: 3.369,
      MidGrade: 3.990,
      Premium: 4.264,
      Diesel: 4.469,
    },
    'New Mexico': {
      Regular: 3.331,
      MidGrade: 3.686,
      Premium: 3.961,
      Diesel: 4.421,
    },
    Nevada: {
      Regular: 4.509,
      MidGrade: 4.781,
      Premium: 5.008,
      Diesel: 4.858,
    },
    'New York': {
      Regular: 3.720,
      MidGrade: 4.228,
      Premium: 4.602,
      Diesel: 4.676,
    },
    Ohio: {
      Regular: 3.135,
      MidGrade: 3.606,
      Premium: 4.067,
      Diesel: 4.246,
    },
    Oklahoma: {
      Regular: 3.076,
      MidGrade: 3.404,
      Premium: 3.691,
      Diesel: 4.362,
    },
    Oregon: {
      Regular: 4.288,
      MidGrade: 4.540,
      Premium: 4.752,
      Diesel: 4.902,
    },
    Pennsylvania: {
      Regular: 3.673,
      MidGrade: 4.047,
      Premium: 4.355,
      Diesel: 4.748,
    },
    'Rhode Island': {
      Regular: 3.473,
      MidGrade: 4.105,
      Premium: 4.448,
      Diesel: 4.474,
    },
    'South Carolina': {
      Regular: 3.008,
      MidGrade: 3.429,
      Premium: 3.787,
      Diesel: 4.113,
    },
    'South Dakota': {
      Regular: 3.443,
      MidGrade: 3.600,
      Premium: 4.100,
      Diesel: 4.440,
    },
    'Tennessee': {
      Regular: 3.048,
      MidGrade: 3.474,
      Premium: 3.848,
      Diesel: 4.123,
    },
    'Texas': {
      Regular: 2.917,
      MidGrade: 3.342,
      Premium: 3.674,
      Diesel: 3.926,
    },
    'Utah': {
      Regular: 3.678,
      MidGrade: 3.909,
      Premium: 4.115,
      Diesel: 4.442,
    },
    'Virginia': {
      Regular: 3.244,
      MidGrade: 3.696,
      Premium: 4.051,
      Diesel: 4.248,
    },
    'Vermont': {
      Regular: 3.611,
      MidGrade: 4.104,
      Premium: 4.506,
      Diesel: 4.483,
    },
    'Washington': {
      Regular: 4.632,
      MidGrade: 4.904,
      Premium: 5.103,
      Diesel: 5.395,
    },
    'Wisconsin': {
      Regular: 3.153,
      MidGrade: 3.607,
      Premium: 4.041,
      Diesel: 4.131,
    },
    'West Virginia': {
      Regular: 3.304,
      MidGrade: 3.644,
      Premium: 3.994,
      Diesel: 4.204,
    },
    'Wyoming': {
      Regular: 3.553,
      MidGrade: 3.810,
      Premium: 4.083,
      Diesel: 4.644,
    },
  };

  if (gasPrices[state]) {
    return gasPrices[state];
  } else {  
    throw new Error(`Gas price for ${state} not found.`);
  }
}