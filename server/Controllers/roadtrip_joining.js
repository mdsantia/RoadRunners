/* HELPER FUNCTIONS TO JOIN DIFFERENT STOPS */

const PolylineCodec = require('@googlemaps/polyline-codec');

function updatedBounds (route1, route2) {
    const bounds1 = route1.bounds;
    const bounds2 = route2.bounds;
    return {
        northeast: {
        lat: Math.max(bounds1.northeast.lat, bounds2.northeast.lat),
        lng: Math.max(bounds1.northeast.lng, bounds2.northeast.lng),
        },
        southwest: {
        lat: Math.min(bounds1.southwest.lat, bounds2.southwest.lat),
        lng: Math.min(bounds1.southwest.lng, bounds2.southwest.lng),
        }};
}

function updateDistance_Duration (route1, route2) {
    route1 = route1.legs[0];
    route2 = route2.legs[0];
    const totalDistance = {
        text: `${Math.floor((route1.distance.value + route2.distance.value) / 1609.344)} mi`,
        value: route1.distance.value + route2.distance.value,
    };

    const totalDuration = {
        text: `${Math.floor((route1.duration.value + route2.duration.value) / 3600)} hours ${Math.floor(((route1.duration.value + route2.duration.value) % 3600) / 60)} mins`,
        value: route1.duration.value + route2.duration.value,
    };

    return {distance: totalDistance, duration: totalDuration};
}
  
function combineRoutes(routeToWaypoint, routeFromWaypoint) { //assuming length exists
    // Combine the routes.
    const completeRoute = routeToWaypoint; 
    /*  Object is of the structure
    bounds: {
      northeast: { lat: 41.878114, lng: -87.6292114 },
      southwest: { lat: 40.5460122, lng: -88.9001043 }
    },
    copyrights: 'Map data ©2023 Google',
    Let us update bounds*/
  
    completeRoute.bounds = updatedBounds(routeToWaypoint, routeFromWaypoint);
  
    /*
    legs: [
      {
        distance: [Object],
        duration: [Object],
        end_address: 'Chicago, IL, USA',
        end_location: [Object],
        start_address: 'Illinois, USA',
        start_location: [Object],
        steps: [Array],
        traffic_speed_entry: [],
        via_waypoint: []
      }
    ], */
  
    const newDur_Dis = updateDistance_Duration(routeToWaypoint, routeFromWaypoint)
  
    completeRoute.legs[0].distance = newDur_Dis.distance;
    completeRoute.legs[0].duration = newDur_Dis.duration;
  
    completeRoute.legs[0].end_address = routeFromWaypoint.legs[0].end_address;
    completeRoute.legs[0].end_location = routeFromWaypoint.legs[0].end_location;
    completeRoute.legs[0].steps = [...routeToWaypoint.legs[0].steps, ...routeFromWaypoint.legs[0].steps];
  
    /*
    overview_polyline: {
      points: ''
    },
    */
  
    const decodedPoints1 = PolylineCodec.decode(
      routeToWaypoint.overview_polyline.points
    );
    
    // Decode the encoded points from the second route's `overview_polyline`.
    const decodedPoints2 = PolylineCodec.decode(
      routeFromWaypoint.overview_polyline.points
    );
    
    const points = [...decodedPoints1, ...decodedPoints2].filter(Boolean);
  
    const encodedPoints = PolylineCodec.encode(points);
  
    completeRoute.overview_polyline = {
      points: encodedPoints
    },
  
    /*
    summary: 'I-55 N',
    warnings: [],
    waypoint_order: []
    to update these last three*/
  
    completeRoute.summary = completeRoute.summary.concat(` and ${routeFromWaypoint.summary}`);
    completeRoute.warnings = [...routeToWaypoint.warnings, ...routeFromWaypoint.warnings];
    completeRoute.waypoint_order = [...routeToWaypoint.waypoint_order, ...routeFromWaypoint.waypoint_order];
  
    return completeRoute;
}

module.exports = {
    combineRoutes
};