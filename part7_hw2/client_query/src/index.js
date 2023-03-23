import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter as Router } from "react-router-dom";
import { NotificationContextProvider } from "./NotificationContext";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <NotificationContextProvider>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App/>
      </Router>
    </QueryClientProvider>
  </NotificationContextProvider>
);