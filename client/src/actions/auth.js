import { AUTH, LOGOUT } from "../constants/actionTypes";
import * as api from "../api/index.js";

export const signIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);

    dispatch({ type: AUTH, data });
    navigate("/");
  } catch (error) {
    console.log(error);
    console.log(error.response?.data);
  }
};

export const signUp = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: AUTH, data });
    navigate("/");
  } catch (error) {
    console.log(error);
    console.log(error.response?.data);
  }
};

export const processAuth0Login = (auth0User, navigate) => async (dispatch) => {
  try {
    // Send relevant Auth0 user data to your backend
    const auth0UserDataForBackend = {
      sub: auth0User.sub, // Auth0 user ID
      email: auth0User.email,
      name: auth0User.name,
      picture: auth0User.picture,
      // Add other fields if needed by your backend logic
    };

    // Call the new backend API endpoint
    const { data } = await api.auth0SignInBackend(auth0UserDataForBackend);

    // The backend returns { result, token } in the same format as traditional login
    // Dispatch the AUTH action to update state and localStorage
    dispatch({ type: AUTH, data });

    // Navigate the user home
    navigate("/");
  } catch (error) {
    console.error(
      "Processing Auth0 Login Error:",
      error.response?.data || error
    );
    // Handle errors (e.g., if backend fails to process Auth0 data)
    // Maybe log the user out of Auth0 or show an error message
  }
};
