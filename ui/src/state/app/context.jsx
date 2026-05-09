import { createContext } from "preact";
import { useContext, useMemo, useReducer } from "preact/compat";
import { initialAppState, reducer } from "./reducer";
import { CssBaseline } from "@mui/material";

export const StateContext = createContext({});

export const useAppState = () => useContext(StateContext).state;

export const useAppDispatch = () => useContext(StateContext).dispatch;

export const initialPrepopulatedState = Object.entries(initialAppState)
    .reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value
    }), {});

export const AppStateProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialPrepopulatedState)

    const contextValue = useMemo(() => {
        return {state, dispatch}
    }, [state, dispatch])

    return <>
        <StateContext.Provider value={contextValue}>
            <CssBaseline/>
            {children}
        </StateContext.Provider>
    </>
}    

