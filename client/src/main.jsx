import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import reducers from "./reducers";
import { Auth0Provider } from "@auth0/auth0-react";

const store = createStore(reducers, compose(applyMiddleware(thunk)));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-l4syjbgk08yn58r5.us.auth0.com"
      clientId="wYyXxrPTC6VBkmPF0mV9XbVY02f28ugq"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </Auth0Provider>
  </StrictMode>
);
