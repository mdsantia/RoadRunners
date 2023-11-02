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
    var poly = [];
    poly = [];
    for (let i = 0; i < stops.length - 1; i++) {
      poly.push(...stops[i].routeFromHere);
    }
    return poly;
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
          polyline: buildPolyline(response.options[0]),
        }
        setTripDetails(newTripDetails);
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