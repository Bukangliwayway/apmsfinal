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
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import useMode from "./hooks/utilities/useMode";

const App = () => {
  const { mode, setMode } = useMode();

  // const theme = createTheme({
  //   palette: {
  //     mode: mode,
  //     primary: {
  //       main: "#206BC4",
  //     },
  //     secondary: {
  //       main: "#6C7A91",
  //     },
  //   },

  //   typography: {
  //     fontFamily: "Inter, Arial, sans-serif", // Font family
  //     fontWeightThin: 100,
  //     fontWeightExtraLight: 200,
  //     fontWeightLight: 300,
  //     fontWeightRegular: 400,
  //     fontWeightMedium: 500,
  //     fontWeightSemiBold: 600,
  //     fontWeightBold: 700,
  //     fontWeightExtraBold: 800,
  //     fontWeightBlack: 900,
  //   },
  // });

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      common: {
        main: "#fff",
      },
      background: {
        default: "#f6f8fb",
        paper: "#f6f8fb",
      },
      primary: {
        main: "#0054a6",
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
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      common: {
        main: "#182433",
      },
      background: {
        default: "#151f2c",
        paper: "#151f2c",
      },
      primary: {
        main: "#182433",
      },
      action:{
        active: "#fff"
      }
    },
    components: {
      MuiAppBar: {
        defaultProps: {
          enableColorOnDark: true,
        },
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
  });

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={mode == "light" ? lightTheme : darkTheme}>
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
                <Route path="*" element={<RoleBasedRoutes />} />
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
