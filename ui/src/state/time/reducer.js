export const initialTimeState = {
    duration: "",
    timezone: "",
}

export function reducer(state, action) {
    switch (action.type) {
        case "SET_DURATION":
            return {
                ...state,
                duration: action.payload,
            }
        case "SET_TIMEZONE":
            return {
                ...state,
                timezone: action.payload,
            }   
        default:
            throw new Error();
    }
}