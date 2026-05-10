import { createContext } from "preact";
import { useContext, useMemo, useReducer } from "preact/compat";
import { initialTimeState, reducer } from "./reducer";

export const TimeStateContext = createContext({});

export const useTimeState = () => useContext(TimeStateContext).state;

export const useTimeDispatch = () => useContext(TimeStateContext).dispatch;

export const TimeStateProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialTimeState);

    const contextValue = useMemo(() => {
        return {state, dispatch};
    }, [state, dispatch]);

    return <>
        <TimeStateContext.Provider value={contextValue}>
            {children}
        </TimeStateContext.Provider>
    </>
}