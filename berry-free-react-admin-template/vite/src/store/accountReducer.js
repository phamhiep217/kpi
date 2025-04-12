// action - state management
export const initialState = {
    token: '',
    isLoggedIn: false,
    isInitialized: false,
    user: null,
    message: '',
};

//-----------------------|| ACCOUNT REDUCER ||-----------------------//

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_REQUEST": {
            return { ...state };
        }

        case "LOGIN_SUCCESS": {
            const { user,token,msg } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                user,
                token,
                message: msg
            };
        }
        case "LOGIN_FAILURE": {
            const { msg } = action.payload;
            return {
                ...state,
                message: msg
            };
        }

        case "LOGOUT": {
            return {
                ...state,
                isLoggedIn: false,
                token: '',
                message: '',
                user: null
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
