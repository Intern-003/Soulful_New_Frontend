import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter } from "react-router-dom";
// import { GoogleOAuthProvider } from "@react-oauth/google";

import "./styles/tailwind.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
          {/* <GoogleOAuthProvider clientId="390955489017-9l39ddftqrbho7d92fm7m504nf6ao5ae.apps.googleusercontent.com"> */}
          <App />
        {/* </GoogleOAuthProvider> */}
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);