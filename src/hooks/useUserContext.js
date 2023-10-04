import { UserContext } from "../context/UserContext";
import { useContext } from 'react';

export const useUserContext = () => {
    const user = useContext(UserContext);

    if (!user) {
        throw new Error('useUserContext must be used inside the UserContext provider');
    }

    return user.user;
};