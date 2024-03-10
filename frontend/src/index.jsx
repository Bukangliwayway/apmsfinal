import { QueryClientProvider, QueryClient } from "react-query";
import {
  HashRouter,
} from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ReactQueryDevtools } from "react-query/devtools";
import { AllProvider } from "./context/AllContext";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import useLogout from "./hooks/utilities/useLogout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        const logout = useLogout();
        if (error.response?.data?.detail === "Refresh token is missing")
          logout("Your Access has Expired Please Login Again!");
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <QueryClientProvider client={queryClient}>
          <AllProvider>
            <App />
            <ReactQueryDevtools position="bottom-right" initialIsOpen={false} />
          </AllProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </HashRouter>
  </React.StrictMode>
);
