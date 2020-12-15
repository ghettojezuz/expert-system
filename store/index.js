import {useMemo} from 'react'
import {applyMiddleware, combineReducers, createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import {appReducer} from "./app/reducer";

let index;

//COMBINING ALL REDUCERS
const rootReducer = combineReducers({
    app: appReducer,
    // OTHER REDUCERS WILL BE ADDED HERE
});

// BINDING MIDDLEWARE
const bindMiddleware = () => {
    if (process.env.NODE_ENV !== "production") {
        return composeWithDevTools(applyMiddleware());
    }
    return applyMiddleware();
};

function initStore(preloadedState) {
    return createStore(
        rootReducer,
        preloadedState,
        bindMiddleware()
    )
}

export const initializeStore = (preloadedState) => {
    let _store = index ?? initStore(preloadedState);

    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the index, and create a new index
    if (preloadedState && index) {
        _store = initStore({
            ...index.getState(),
            ...preloadedState,
        });
        // Reset the current index
        index = undefined
    }

    // For SSG and SSR always create a new index
    if (typeof window === 'undefined') return _store;
    // Create the index once in the client
    if (!index) index = _store;

    return _store;
};

export function useStore(initialState) {
    return useMemo(() => initializeStore(initialState), [initialState]);
}
