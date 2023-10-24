import React, { createContext, useContext, useState } from 'react';

// Create a new context
export const TripContext = createContext();

// Create a context provider component
export function TripContextProvider({ children }) {
  const [tripDetails, setTripDetails] = useState(null);

  return (
    <TripContext.Provider value={{ tripDetails, setTripDetails }}>
      {children}
    </TripContext.Provider>
  );
}
