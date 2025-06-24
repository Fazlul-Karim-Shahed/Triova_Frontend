// store.js
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { getCartNumber } from "../functions/cartFunctions";

const triovaSlice = createSlice({
    name: "triova",

    initialState: {
        decodedToken: null,
        authenticated: false,
        cart: 0,
    },
    reducers: {
        preloadAuth: (state, actions) => {
            (state.decodedToken = actions.payload.decodedToken), (state.authenticated = actions.payload.authenticated);
        },
        getReduxCart: (state, actions) => {
            state.cart = actions.payload.cart;
        },
    },
});

export const { preloadAuth, getReduxCart } = triovaSlice.actions;

const store = configureStore({
    reducer: {
        triova: triovaSlice.reducer,
    },
});

export default store;
