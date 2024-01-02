import { useState, useRef, useEffect } from "react";
import useAll from "../../hooks/utilities/useAll";
import { useMutation } from "react-query";
import axios from "../../api/axios";
import LinkedInLogin from "./LinkedInLogin";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Box,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Container,
  Divider,
} from "@mui/material";
import { ForgotPass } from "./ForgotPass";

const Login = () => {
  let loginLimit = 5;
  const {
    setAuth,
    auth,
    setPersist,
    persist,
    setMessage,
    setSeverity,
    setOpenSnackbar,
    setLinearLoading,
  } = useAll();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/home";
  const refreshMessage =
    location.state?.message || "Ready to Relive Memories? Just Login!";
  const snackbarMessage = location.state?.snackbar || "";

  const userRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPass, setForgotPass] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    if (snackbarMessage) {
      setMessage(snackbarMessage);
      setSeverity("success");
      setOpenSnackbar(true);
    }
  }, [setMessage, setOpenSnackbar, setSeverity, snackbarMessage]);

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  const LoginMutation = useMutation(
    async (details) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true, // Set this to true for cross-origin requests with credentials
      };

      await axios.post(`/users/auth/token`, details, axiosConfig);
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
        setOpenSnackbar(true);
        loginLimit--;
      },
      onSuccess: (response) => {
        const data = response?.data;
        setAuth(username, data?.role, data?.access_token);
        if (auth) {
          navigate(from, { replace: true });
        }
      },
      onSettled: () => {
        setLinearLoading(false);
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loginLimit <= 0) {
      console.log("implement some countdown here");
      loginLimit = 5;
    }
    if (!username || !password) {
      setMessage("Username and Password are Required.");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const dataString =
      "grant_type=&username=" +
      username +
      "&password=" +
      password +
      "&scope=&client_id=&client_secret=";

    setLinearLoading(true);
    await LoginMutation.mutateAsync(dataString);
  };

  LoginMutation;

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Box textAlign={"center"} mb={4}>
            <Typography> (logo) PUPQC APMS </Typography>
          </Box>
          <Card>
            <CardContent>
              <Typography variant="h6" textAlign={"center"} mb={4}>
                Login to your account
              </Typography>
              <Container component="main" maxWidth="sm">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography gutterBottom sx={{ fontWeight: 500 }}>
                      Username
                    </Typography>
                    <TextField
                      InputLabelProps={{
                        shrink: false,
                        disableAnimation: true,
                      }}
                      size="small"
                      defaultValue="Small"
                      inputRef={userRef}
                      placeholder="Your username"
                      variant="outlined"
                      fullWidth
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography sx={{ fontWeight: 500 }}>Password</Typography>
                      <Button
                        sx={{
                          cursor: "pointer",
                          textTransform: "none",
                          padding: "0",
                        }}
                        marginBottom={1}
                        onClick={() => setForgotPass(true)}
                      >
                        Forgot Password?
                      </Button>
                    </Box>
                    <TextField
                      InputLabelProps={{
                        shrink: false,
                        disableAnimation: true,
                      }}
                      size="small"
                      defaultValue="Small"
                      type="password"
                      variant="outlined"
                      placeholder="Your password"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input"
                      required
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          color="primary"
                          checked={persist || false}
                          onChange={(event) => setPersist(event.target.checked)}
                          inputProps={{ "aria-label": "controlled" }}
                        />
                      }
                      label={
                        <Typography>Remember me on this device</Typography>
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box mt={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                      >
                        login
                      </Button>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        marginTop={1}
                      >
                        {refreshMessage}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Container>
            </CardContent>

            <CardContent>
              <Box textAlign="center" my={1} position="relative">
                <Divider>or</Divider>
                {/* <Divider />
                <Typography
                  variant="body2"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bg: 'background.paper',
                    px: 1,
                  }}
                >
                  OR
                </Typography> */}
              </Box>
            </CardContent>
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: "2rem" }}
              pb={4}
            >
              <Button variant="outlined" sx={{ textTransform: "none" }}>
                {/* <SvgIcon component="svg" viewBox="0 0 24 24" className="text-google" width="24" height="24">
                        </SvgIcon> */}
                Login with Google
              </Button>
              <LinkedInLogin />
            </Box>
          </Card>
          <Box mt={2} textAlign="center">
            <Typography variant="body1">
              Don&#39;t have an account yet? <Link to="/register">Sign up</Link>
            </Typography>
          </Box>
        </Container>
      </Box>

      <ForgotPass forgotPass={forgotPass} setForgotPass={setForgotPass} />
    </>
  );
};

export default Login;
