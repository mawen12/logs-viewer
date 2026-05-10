import { createContext } from "preact";
import { useContext, useMemo, useReducer } from "preact/compat";
import { initialQueryState, reducer } from "./reducer";

export const QueryStateContext = createContext({});

export const useQueryState = () => useContext(QueryStateContext).state;

export const useQueryDispatch = () => useContext(QueryStateContext).dispatch;

export const QueryStateProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialQueryState);

    const contextValue = useMemo(() => {
        return {state, dispatch};
    }, [state, dispatch]);

    return <>
        <QueryStateContext.Provider value={contextValue}>
            {children}
        </QueryStateContext.Provider>
    </>
}