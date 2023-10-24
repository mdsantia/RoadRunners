import { TripContext } from "../context/TripContext";
import { useContext } from 'react';

export const useTripContext = () => {
    const context = useContext(TripContext);

    if (!context) {
        throw new Error('TripContext must be used inside the UserContext provider');
    }

    return context;
}