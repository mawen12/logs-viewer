export const initialAppState = {
    serverUrl: "",
}

export function reducer(state, action) {
    switch (action.type) {
        case "SET_SERVER":
            return {
                ...state,
                serverUrl: action.payload,
            }
        default:
            throw new Error();
    }
}