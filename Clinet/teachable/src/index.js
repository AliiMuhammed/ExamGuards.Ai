import React from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { routes } from "./Router";
import store from "./Redux/store"; // Import your Redux store
import "./Style/index.css";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import App from "./App"; // Import your main App component
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <RouterProvider router={routes}>
      <App />
    </RouterProvider>
  </Provider>
);

serviceWorkerRegistration.register();

reportWebVitals();
