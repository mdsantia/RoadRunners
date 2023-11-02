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
  const [polyline, setPolyline] = useState(null);
  const [options, setOptions] = useState(null); 
  const [center, setCenter] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);

  function buildPolyline(stops) {
    if (!stops) {
      return;
    }
    let poly = [];
    for (let i = 0; i < stops.length - 1; i++) {
      poly.push(...stops[i].routeFromHere);
    }
    tripDetails.polyline = poly;
  }


  const updateChosenRoute = (route) => {
    buildPolyline(tripDetails.options[route]);
    tripDetails.stops = options[route];
    tripDetails.chosenRoute = route;
  
    return tripDetails;
  }

  const directionsCallback = (response) => {
    if (response !== null) {
        // Store the directions data in state
        tripDetails.options = response.options;
        tripDetails.allStops = response.allStops;
        tripDetails.chosenRoute = 0;
        tripDetails.stops = response.options[0];
        buildPolyline(tripDetails.stops);
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
      }}
    >
      {children}
    </DashboardContext.Provider>
    )
}

export function useDashboardContext() {
  return useContext(DashboardContext);
}