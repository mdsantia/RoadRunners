import { createContext, useEffect, useReducer } from "react";

export const UserContext = createContext();

export const userReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                user: action.payload
            };
        case 'LOGOUT':
            return {
                user: null
            };
        case 'UPDATE':
            return {
                user: action.payload
            };
        default:
            return state;
    }
}

export const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, {
        user: null
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            dispatch({type: 'LOGIN', payload: user});
        }
    }, []);

    const setUser = (user) => {
        dispatch({type: 'LOGIN', payload: user});
        localStorage.setItem('user', JSON.stringify(user));
    }

    const updateUser = (user) => {
        dispatch({type: 'UPDATE', payload: user});
        localStorage.setItem('user', JSON.stringify(user));
    }

    const logout = () => {
        dispatch({type: 'LOGOUT'});
        localStorage.removeItem('user');
    }

    return ( 
        <UserContext.Provider value={{ user: state.user, setUser, updateUser, logout }}>
            { children }
        </UserContext.Provider>
    )
}