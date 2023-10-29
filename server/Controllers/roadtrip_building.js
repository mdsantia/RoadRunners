/* HELPER FUNCTIONS FOR ROADTRIP BUILDING */
const axios = require('axios');
const { GoogleApiKey } = require('../Constants');

async function getMidLocations(address, radius) {
  let endpoint = 'https://maps.googleapis.com/maps/api/geocode/json';
  let params = {
    address: address,
    key: GoogleApiKey,
  };

  try {
    const response = await axios.get(endpoint, { params: params });
    const location = response.data.results[0].geometry.location;
    const locationString = `${location.lat},${location.lng}`;
    endpoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    params = {
      location: locationString,
      radius: radius,
      keyword: "Attractions",
      // type: "Attractions",
      // minprice: , 
      // maxprice: ,
      // rankby: 'prominance'/'distance',
      key: GoogleApiKey
    };
    const results = await axios.get(endpoint, { params: params });
    const list = results.data.results.map((place) => {
      return ({
        name: place.name,
        locationString: `${place.geometry.location.lat},${place.geometry.location.lng}`, 
        rating: place.rating});})
    // console.log(list);  // Log the results for debugging
    return list; // Corrected access to place names
  } catch (error) {
    return { message: error.message };
  }
}


function getStops(origin, destination) {

}

function motionSickness(scale) {
    /* Notes on motion sickness */
    /* 
    1. Avoid Winding Roads: Try to avoid routes with a lot of sharp turns and winding roads.
  
    2. Use Highways: Highways tend to have smoother and straighter roads compared to local streets.
  
    3. Plan for Frequent Stops: Frequent stops can help people prone to carsickness.
  
    4. Avoid Heavy Traffic: Stop-and-go traffic can make carsickness worse. You can check real-time traffic conditions on Google Maps and try to avoid congested areas.
  
    5. Select the Right Vehicle: If you have the option, choose a vehicle with a smoother ride. Larger and more stable vehicles can often provide a more comfortable journey.
  
    6. Opt for Daytime Driving: If possible, drive during the day. 
  
    7. Proper Ventilation: Ensure good ventilation in the vehicle.
  
    8. Drive Smoothly: Try to maintain a steady speed and avoid sudden acceleration or braking. 
  
    9. Use Medication: If carsickness is a chronic issue for a passenger, consider over-the-counter motion sickness medication. Consult a healthcare professional for recommendations.
    */
    
  }

module.exports = {
  getStops,
  getMidLocations,
  motionSickness
};