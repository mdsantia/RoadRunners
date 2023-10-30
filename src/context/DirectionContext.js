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
  const [stops, setStops] = useState(null);
  const [directions, setDirections] = useState(null);
  const [directionSet, setDirectionSet] = useState(false);
  const [center, setCenter] = useState(null);
  const [chosenRoute, setChosenRoute] = useState(0);
  const [testStops, setTestStops] = useState(null);

  const directionsCallback = (response) => {
    if (directionSet) {
      return;
    }
    if (response !== null) {
      if (response.status === 'OK') {
        // Store the directions data in state
        setDirections(response.route);
        setStops(response.stops);
        setDirectionSet(true);
        setTestStops(response.testStops);
      } else {
        console.error(`Directions request failed due to ${response.status}`);
      }
    }
  };

    return ( 
    <DirectionContext.Provider
      value={{
        directions,
        stops,
        center,
        setCenter,
        directionSet,
        directionsCallback,
        chosenRoute,
        setChosenRoute, 
        testStops
      }}
    >
      {children}
    </DirectionContext.Provider>
    )
}

export function useDirectionContext() {
  return useContext(DirectionContext);
}