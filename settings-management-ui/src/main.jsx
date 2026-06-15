import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import { Provider } from "react-redux";

import { store } from "./store/store";

import ErrorBoundary from "./components/ErrorBoundary";

import { Toaster } from "react-hot-toast";

import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <Provider store={store}>

      {/* Router */}
      <BrowserRouter>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          reverseOrder={false}
        />

        {/* Error Boundary */}
        <ErrorBoundary>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </ErrorBoundary>

      </BrowserRouter>

    </Provider>

  </React.StrictMode>
);