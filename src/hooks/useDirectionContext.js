import { DirectionContext } from "../context/DirectionContext";
import { useContext } from 'react';

export const useDirectionContext = () => {
    const context = useContext(DirectionContext);

    if (!context) {
        throw new Error('DirectionContext must be used inside the UserContext provider');
    }

    return context;
}