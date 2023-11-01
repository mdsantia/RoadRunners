import { createContext, useContext, useState } from "react";

export const DirectionContext = createContext();

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

export const DirectionContextProvider = ({ children }) => {
  const [options, setOptions] = useState(null); 
  const [stops, setStops] = useState(null);
  const [center, setCenter] = useState(null);
  const [chosenRoute, setChosenRoute] = useState(0);
  const [allStops, setAllStops] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);

  const updateChosenRoute = (route) => {
    setChosenRoute(route);
    setStops(options[route]);
  }

  const resetTo = (tripDetails) => {
    setOptions(null);
    setStops(null);
    setChosenRoute(0);
    setAllStops(null);
    setTripDetails(tripDetails);
  }

  const directionsCallback = (response) => {
    if (response !== null) {
        // Store the directions data in state
        setOptions(response.options)
        setAllStops(response.allStops);
        setStops(response.options[chosenRoute ? chosenRoute : 0]);
    }
  };

    return ( 
    <DirectionContext.Provider
      value={{
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
    </DirectionContext.Provider>
    )
}

export function useDirectionContext() {
  return useContext(DirectionContext);
}