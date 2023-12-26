import { Routes, Route } from "react-router-dom";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoutes from "./routes/privateRoutes";
import PublicRoutes from "./routes/publicRoutes";
import { QueryClientProvider, QueryClient } from "react-query";
import Missing from "./components/status_display/UserNotFound";
import PersistLogin from "./routes/persistLogin";
import LinkedInRedirect from "./components/auth/LinkedInRedirect";
import { ReactQueryDevtools } from "react-query/devtools";
import RoleBasedRoutes from "./routes/RoleBasedRoutes";
import ResetPassword from "./components/auth/ResetPassword";
import useMediaQuery from '@mui/material/useMediaQuery';

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = createTheme({
    
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: "#206BC4"
      },
      secondary: {
        main: "#6C7A91"
      },
    },

    typography: {
      fontFamily: "Inter, Arial, sans-serif", // Font family
      fontWeightThin: 100,
      fontWeightExtraLight: 200,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightSemiBold: 600,
      fontWeightBold: 700,
      fontWeightExtraBold: 800,
      fontWeightBlack: 900,
    },

        // palette: {
    //   mode: mode,
    //   primary: {
    //     main: mode === "dark" ? "#555" : "#282a3e", // Set #282a3e as the main color
    //     contrastText: "#fff", // Contrast text color for primary
    //   },
    //   secondary: {
    //     main: mode === "dark" ? "#333" : "#F0F2F5", // Text color based on mode
    //   },
    //   common: {
    //     main: mode === "dark" ? "#121212" : "#fff",
    //   },
    //   text: {
    //     primary: mode === "dark" ? "#fff" : "#282a3e",
    //   },
    // },

    // components: {
    //   MuiIconButton: {
    //     styleOverrides: {
    //       root: {
    //         "& svg": {
    //           color: mode === "dark" ? "#fff" : "#282a3e", // Replace with your desired icon color
    //         },
    //       },
    //     },
    //   },
    //   MuiListItemButton: {
    //     styleOverrides: {
    //       root: {
    //         "& svg": {
    //           color: mode === "dark" ? "#fff" : "#282a3e", // Replace with your desired icon color
    //         },
    //       },
    //     },
    //   },
    // },
  });
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Box bgcolor={"background.default"} color={"text.primary"}>
          <Routes>
            <Route path="/" element={<PublicRoutes />}>
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route
                path="resetpassword/:email/:code"
                element={<ResetPassword />}
              />
              <Route
                path="oauth/redirect/linkedin"
                element={<LinkedInRedirect />}
              />
              <Route path="" element={<Login />} />
            </Route>
            <Route element={<PersistLogin />}>
              <Route path="/" element={<PrivateRoutes />}>
                <Route
                  path="*"
                  element={<RoleBasedRoutes />}
                />
              </Route>
            </Route>
            <Route path="*" element={<Missing />} />
          </Routes>
          <ReactQueryDevtools position="bottom-right" initialIsOpen={false} />
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
export default App;
