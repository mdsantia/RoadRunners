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
  const [directions, setDirections] = useState(null);
  const [directionSet, setDirectionSet] = useState(false);
  const [center, setCenter] = useState(null);

  const directionsCallback = (response) => {
    if (directionSet) {
      return;
    }
    if (response !== null) {
      if (response.status === 'OK') {
        // Store the directions data in state
        // console.log(response);
        // setCenter(response.routes[0].overview_path[response.routes[0].overview_path.length / 2]);
        setDirections(response);
        // Set color of polyline to red
        setDirectionSet(true);
      } else {
        console.error(`Directions request failed due to ${response.status}`);
      }
    }
  };

    return ( 
    <DirectionContext.Provider
      value={{
        directions,
        center,
        setCenter,
        directionSet,
        directionsCallback,
      }}
    >
      {children}
    </DirectionContext.Provider>
    )
}

export function useDirectionContext() {
  return useContext(DirectionContext);
}