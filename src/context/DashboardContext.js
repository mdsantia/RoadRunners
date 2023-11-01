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
  const [loaded, setLoaded] = useState(false);

  function buildPolyline(stopsList) {
    let poly = [];
    console.log(stopsList);
    // for (let i = 0; i < stopsList.length - 1; i++) {
    //   poly.push(...stopsList[i].routeFromHere);
    // }
    // console.log(poly);
    setPolyline(stopsList[0].routeFromHere);
  }

  const updateChosenRoute = (route) => {
    setChosenRoute(route);
    buildPolyline(options[route]);
    setStops(options[route]);
  }

  const resetTo = (tripDetails) => {
    setTripDetails(tripDetails);
    if (tripDetails.options) {
      buildPolyline(tripDetails.stops);
      setOptions(tripDetails);
      setStops(tripDetails.stops);
      setChosenRoute(0);
      setAllStops(tripDetails.allStops);
    }
  }

  const loadNewPage = (tripDetails) => {
    console.log(tripDetails);
    setLoaded(true);
    resetTo(tripDetails);
  }

  const directionsCallback = (response) => {
    if (response !== null) {
        // Store the directions data in state
        setOptions(response.options)
        setAllStops(response.allStops);
        const stopsList = response.options[chosenRoute ? chosenRoute : 0];
        setStops(stopsList);
        buildPolyline(stopsList);
        tripDetails.stops = stopsList;
        tripDetails.allStops = response.allStops;
        tripDetails.chosenRoute = chosenRoute;
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
        tripDetails, 
        setTripDetails,
        loaded,
        loadNewPage
      }}
    >
      {children}
    </DashboardContext.Provider>
    )
}

export function useDashboardContext() {
  return useContext(DashboardContext);
}