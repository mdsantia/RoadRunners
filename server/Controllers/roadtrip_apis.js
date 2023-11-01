/* API HELPER FUNCTIONS FOR ROADTRIP BUILDING */
const axios = require('axios');
const { GoogleApiKey } = require('../Constants');
const graphlib = require('graphlib');

function buildGraph(stops) {
  const graph = new graphlib.Graph();

  // Create nodes for each stop
  stops.forEach((stop, index) => {
    graph.setNode(index, { name: stop.name });
  });

  // Create edges with distances between stops
  for (let i = 0; i < stops.length; i++) {
    for (let j = i + 1; j < stops.length; j++) {
      const distance = calculateDistance(stops[i].location.lat, stops[i].location.lng, stops[j].location.lat, stops[j].location.lng);
      graph.setEdge(i, j, distance);
    }
  }

  return graph;
}

function edgeWeightFunc(edge) {
  return edge.distance;
}

function get_shortest_path(stops) {
  const graph = buildGraph(stops);
  const shortestPath = graphlib.alg.dijkstra(graph, 0, edgeWeightFunc);
  const path = graphlib.alg.predecessorPath(graph, 0, stops.length - 1);
  return path;
}
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
  try {
    const response = await axios.get(endpoint, { params: params });
    const location = response.data.results[0].geometry.location;
    return location;
  } catch (error) {
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

module.exports = {
  callDirectionService,
  getStops,
  getGeoLocation,
  decodePolyline,
  calculateDistance,
  get_shortest_path
};