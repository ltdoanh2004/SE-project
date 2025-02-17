import { SET_USER, LOGOUT, REGISTER_SUCCESS, REGISTER_FAILURE } from '../constant/constantUser';
import { userServ } from '../../services/userService';

// Action Creators
export const setUser = (userData) => ({
  type: SET_USER,
  payload: userData,
});

export const loginFailure = (error) => ({
  type: 'LOGIN_FAILURE',
  payload: error,
});

export const logout = () => ({
  type: LOGOUT,
});

// Login User
export const loginUser = (email, password) => async (dispatch) => {
  try {
    const response = await userServ.postLogin({ email, password });
    // Ensure the response includes data before dispatching
    if (response && response.data) {
      dispatch(setUser(response.data));
    } else {
      // If no data is returned, handle as login failure
      dispatch(loginFailure('Login failed'));
    }
  } catch (error) {
    console.error("Login error:", error);
    dispatch(loginFailure(error.message || "Login failed"));
  }
};

// Register User
export const registerUser = (userData) => async (dispatch) => {
  try {
    const response = await userServ.postRegister(userData);
    if (response && response.data) {
      dispatch({ type: REGISTER_SUCCESS, payload: response.data });
      // Assuming you want to automatically log the user in after registration
      dispatch(setUser(response.data));
    } else {
      // Handle as registration failure if no data is returned
      dispatch({ type: REGISTER_FAILURE, payload: "Registration failed" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    dispatch({ type: REGISTER_FAILURE, payload: error.message || "Registration failed" });
  }
};
