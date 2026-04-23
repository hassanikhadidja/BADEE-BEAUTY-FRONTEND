import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store";
import { LangProvider } from "./context/LangContext";
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LangProvider>
          <App />
        </LangProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
