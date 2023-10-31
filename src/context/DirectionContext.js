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
  const [routes, setRoutes] = useState(null); 
  const [stops, setStops] = useState(null);
  const [center, setCenter] = useState(null);
  const [chosenRoute, setChosenRoute] = useState(0);
  const [decoded, setDecoded] = useState(null);

  const updateChosenRoute = (route) => {
    setChosenRoute(route);
    setStops(routes[route].stops);
    setDecoded(routes[route].decodedPath);
  }

  const directionsCallback = (response) => {
    if (response !== null) {
        // Store the directions data in state
        setRoutes(response.routes);
        const route = response.routes[chosenRoute ? chosenRoute : 0];
        setStops(route.stops);
        setDecoded(route.decodedPath);
    }
  };

    return ( 
    <DirectionContext.Provider
      value={{
        routes,
        stops,
        center,
        setCenter,
        directionsCallback,
        chosenRoute,
        updateChosenRoute, 
        decoded
      }}
    >
      {children}
    </DirectionContext.Provider>
    )
}

export function useDirectionContext() {
  return useContext(DirectionContext);
}