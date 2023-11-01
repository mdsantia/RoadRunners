import { DashboardContext } from "../context/DashboardContext";
import { useContext } from 'react';

export const useDashboardContext = () => {
    const context = useContext(DashboardContext);

    if (!context) {
        throw new Error('DashboardContext must be used inside the UserContext provider');
    }

    return context;
}