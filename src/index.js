import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import React from "react";
import {Provider} from "react-redux";
import { store } from "./app/store";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <BrowserRouter>
  //   <App />
  // </BrowserRouter>
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
