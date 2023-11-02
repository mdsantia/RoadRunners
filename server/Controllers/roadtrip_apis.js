/* API HELPER FUNCTIONS FOR ROADTRIP BUILDING */
const axios = require('axios');
const { GoogleApiKey } = require('../Constants');

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
        icon: place.icon,
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
  motionSickness
};