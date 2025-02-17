import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux';
import { userReducer } from '../reducer/reducerUser'; // Adjust the path as needed
import { productReducer } from '../reducer/reducerProduct';


// Combine multiple reducers into a single root reducer
const rootReducer = combineReducers({
    // Key names here define the keys in your state
    user: userReducer,
    product: productReducer,
    // Add other reducers when needed
    // e.g., posts: postsReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // For Redux DevTools

export const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);
