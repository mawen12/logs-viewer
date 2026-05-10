export const initialQueryState = {
    query: "",    
};

export function reducer(state, action) {
    switch (action.type) {
        case "SET_QUERY":
            return {
                ...state,
                query: action.payload
            }
        default:
            throw new Error();
    }
}

