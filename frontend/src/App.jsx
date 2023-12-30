import { Routes, Route } from "react-router-dom";
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoutes from "./routes/privateRoutes";
import PublicRoutes from "./routes/publicRoutes";
import Missing from "./components/status_display/UserNotFound";
import PersistLogin from "./routes/persistLogin";
import LinkedInRedirect from "./components/auth/LinkedInRedirect";
import RoleBasedRoutes from "./routes/RoleBasedRoutes";
import ResetPassword from "./components/auth/ResetPassword";
import MainLayout from "./layout/MainLayout";
import useAll from "./hooks/utilities/useAll";

const App = () => {
  const { mode } = useAll();

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
      text: {
        primary: "#182433",
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#fff', // Set your desired background color for all cards
          },
        },
      },
    },
    typography: {
      fontFamily: "Inter, Arial, sans-serif", // Font family
      fontSize: 14,
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
        main: "#0054a6",
      },
      text: {
        primary: "#DCE1E7",
      },
    },
    components: {
      MuiAppBar: {
        defaultProps: {
          enableColorOnDark: true,
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#182433', // Set your desired background color for all cards
          },
        },
      },
    },
    typography: {
      fontFamily: "Inter, Arial, sans-serif", // Font family
      fontSize: 14,
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

  return (
    <ThemeProvider theme={mode == "light" ? lightTheme : darkTheme}>
      <CssBaseline /> {/* to change the background of the application */}
      <Box>
        <Routes>
          <Route path="/" element={<PublicRoutes />}>
            <Route
              path="register"
              element={
                <MainLayout>
                  <Register />
                </MainLayout>
              }
            />
            <Route
              path="login"
              element={
                <MainLayout>
                  <Login />
                </MainLayout>
              }
            />
            <Route
              path="resetpassword/:email/:code"
              element={
                <MainLayout>
                  <ResetPassword />
                </MainLayout>
              }
            />
            <Route
              path="oauth/redirect/linkedin"
              element={
                <MainLayout>
                  <LinkedInRedirect />
                </MainLayout>
              }
            />
            <Route
              path=""
              element={
                <MainLayout>
                  <Login />
                </MainLayout>
              }
            />
          </Route>
          <Route element={<PersistLogin />}>
            <Route path="/" element={<PrivateRoutes />}>
              <Route path="*" element={<RoleBasedRoutes />} />
            </Route>
          </Route>
          <Route path="*" element={<Missing />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
};
export default App;
