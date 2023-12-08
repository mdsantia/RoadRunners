import { createContext, useContext, useState } from "react";

export const DashboardContext = createContext();

export const directionReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return {
                direction: action.payload
            };
        case 'CLEAR':
            return {
                direction: null
            };
        default:
            return state;
    }
}

export const DashboardContextProvider = ({ children }) => {
  const [center, setCenter] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);
  const [liveEvents, setLiveEvents] = useState([]);

  function calculateTotalDistance(options) {
    const distanceArray = [];
    let totalDistance = 0;
    for (let i = 0; i < options.length; i++) {
      totalDistance = 0;
      for (let j = 0; j < options[i].length - 1; j++) {
        totalDistance += options[i][j].distance;
      }
      distanceArray.push(totalDistance);
    }
    return distanceArray;
  }

  function calculateTotalDuration(options) {
    const durationArray = [];
    let totalDuration = 0;
    for (let i = 0; i < options.length; i++) {
      totalDuration = 0;
      for (let j = 0; j < options[i].length - 1; j++) {
        totalDuration += options[i][j].duration;
      }
      durationArray.push(totalDuration);
    }
    return durationArray;
  }

  function buildPolyline(stops) {
    if (!stops) {
      return;
    }
    var poly = [];
    poly = [];
    for (let i = 0; i < stops.length - 1; i++) {
      poly.push(...stops[i].routeFromHere);
    }
    return poly;
  }

  const changeStops = (newStops) => {
    var newOptions = tripDetails.options;
    newOptions[tripDetails.chosenRoute] = newStops;
    const newTripDetails = {
      ...tripDetails,
      stops: newStops,
      options: newOptions,
      polyline: buildPolyline(newStops),
      totalDistance: calculateTotalDistance(newOptions),
      totalDuration: calculateTotalDuration(newOptions),
    }
    setTripDetails(newTripDetails);
  }

  const updateChosenRoute = (route) => {
    const newTripDetails = {
      ...tripDetails,
      allStops: tripDetails.allStops,
      options: tripDetails.options,
      stops: tripDetails.options[parseInt(route)],
      polyline: buildPolyline(tripDetails.options[parseInt(route)]),
      chosenRoute: parseInt(route),
    }
    setTripDetails(newTripDetails);
  }


  const directionsCallback = (response) => {
    if (response !== null) {
        const newTripDetails = {
          ...tripDetails,
          options: response.options,
          allStops: response.allStops,
          chosenRoute: 0,
          stops: response.options[0],
          totalDistance: calculateTotalDistance(response.options),
          totalDuration: calculateTotalDuration(response.options),
          polyline: buildPolyline(response.options[0]),
        }
        setTripDetails(newTripDetails);
        if (tripDetails.tempid) {
          const tempTrips = JSON.parse(localStorage.getItem('tempTrips')) || {};
          tempTrips[tripDetails.tempid] = newTripDetails;
          localStorage.setItem('tempTrips', JSON.stringify(tempTrips));
        }
    }
  };

    return ( 
    <DashboardContext.Provider
      value={{
        center,
        setCenter,
        directionsCallback,
        tripDetails, 
        setTripDetails,
        updateChosenRoute,
        changeStops,
        liveEvents,
        setLiveEvents,
      }}
    >
      {children}
    </DashboardContext.Provider>
    )
}

export function useDashboardContext() {
  return useContext(DashboardContext);
}