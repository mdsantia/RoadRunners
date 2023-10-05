import { createContext, useEffect, useReducer } from "react";

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
    const [state, dispatch] = useReducer(directionReducer, {
        direction: null
    });

    const setDirection = (direction) => {
        dispatch({type: 'SET', payload: direction});
    }

    const clearDirection = () => {
        dispatch({type: 'CLEAR'});
    }

    return ( 
        <DirectionContext.Provider value={{ direction: state.direction, setDirection, clearDirection }}>
            { children }
        </DirectionContext.Provider>
    )
}
