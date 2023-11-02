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
  const [stops, setStops] = useState(null);
  const [center, setCenter] = useState(null);
  const [chosenRoute, setChosenRoute] = useState(0);
  const [allStops, setAllStops] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);

  function buildPolyline(stopsList) {
    if (!stopsList) {
      return;
    }
    let poly = [];
    // console.log(stopsList);
    for (let i = 0; i < stopsList.length - 1; i++) {
      poly.push(...stopsList[i].routeFromHere);
    }
    // console.log(poly);
    setPolyline(poly);
  }

  const updateChosenRoute = (route) => {
    setChosenRoute(route);
    buildPolyline(options[route]);
    setStops(options[route]);
  }

  const resetTo = (tripDetails) => {
    setPolyline(null);
    // if (tripDetails) {
    //   setChosenRoute(tripDetails.chosenRoute);
    //   setOptions(tripDetails.options);
    //   setStops(tripDetails.stops);
    //   setAllStops(tripDetails.allStops);
    //   buildPolyline(tripDetails.stops);
      setTripDetails(tripDetails);
    // } else {
      setChosenRoute(0);
      setOptions(null);
      setStops(null);
      setAllStops(null);
      buildPolyline(null);
      setTripDetails(null);
    // }
  }

  const directionsCallback = (response) => {
    if (response !== null) {
        // Store the directions data in state
        tripDetails.options = response.options;
        setOptions(response.options)
        tripDetails.allStops = response.allStops;
        setAllStops(response.allStops);
        tripDetails.chosenRoute = 0;
        const stopsList = response.options[0];
        tripDetails.stopsList = response.stopsList;
        setStops(stopsList);
        buildPolyline(stopsList);
    }
  };

    return ( 
    <DashboardContext.Provider
      value={{
        polyline,
        stops,
        allStops,
        center,
        setCenter,
        directionsCallback,
        chosenRoute,
        updateChosenRoute,
        resetTo,
        tripDetails, setTripDetails
      }}
    >
      {children}
    </DashboardContext.Provider>
    )
}

export function useDashboardContext() {
  return useContext(DashboardContext);
}