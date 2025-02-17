// src/redux/reducer/userReducer.js

import { SET_USER, LOGOUT, REGISTER_SUCCESS, REGISTER_FAILURE } from '../constant/constantUser';

const initialState = {
  userData: null,
  errorMessage: '', // This field can be used to display error messages for login and registration failures
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        userData: action.payload,
        errorMessage: '', // Reset the error message on successful login
      };
    case LOGOUT:
      return {
        ...state,
        userData: null, // Clear user data on logout
        errorMessage: '', // Optionally reset the error message on logout
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        userData: action.payload, // Assuming you want to automatically log in users upon registration
        errorMessage: '', // Reset the error message on successful registration
      };
    case REGISTER_FAILURE:
      return {
        ...state,
        errorMessage: action.payload, // Update the state with the registration error message
      };
    default:
      return state;
  }
};
