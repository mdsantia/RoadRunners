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

async function getGeoLocation(address) {
  let endpoint = 'https://maps.googleapis.com/maps/api/geocode/json';
  let params = {
    address: address,
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

async function getStops(location, radius, keyword, preferences, type) {
  try {
    const locationString = `${location.lat},${location.lng}`;
    endpoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    params = {
      location: locationString,
      radius: radius,
      keyword: keyword,
      type: type,
      // minprice: , 
      // maxprice: ,
      // rankby: 'prominance'/'distance',
      key: GoogleApiKey
    };
    const results = await axios.get(endpoint, { params: params });
    const list = results.data.results.map((place) => {
      return ({
        name: place.name,
        location: place.geometry.location,
        category: type,
        locationString: `${place.geometry.location.lat},${place.geometry.location.lng}`, 
        rating: place.rating});})
    return list; // Corrected access to place names
  } catch (error) {
    return { message: error.message };
  }
}

module.exports = {
  callDirectionService,
  getStops,
  getGeoLocation,
};