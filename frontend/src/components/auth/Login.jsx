import React, { useState, useRef, useEffect } from "react";
import useAuth from "../../hooks/utilities/useAuth";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useMutation } from "react-query";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "../../api/axios";
import LinkedInLogin from "./LinkedInLogin";
import { useNavigate, Link, useLocation } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Divider,
} from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  const { setAuth, setPersist, persist } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/home";
  const refreshMessage =
    location.state?.message || "Ready to relive Memories? Just Login!";
  const snackbarMessage = location.state?.snackbar || "";

  const userRef = useRef();
  const recaptcha = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [forgotPass, setForgotPass] = useState(false);
  const [open, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState("error");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    if (snackbarMessage) {
      setMessage(snackbarMessage);
      setSeverity("success");
      setOpenSnackbar(true);
    }
  }, [snackbarMessage]);

  const ResetMutation = useMutation(
    async (details) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axios.post(`/auth/password_reset`, details, axiosConfig);
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
        setOpenSnackbar(true);
      },
      onSuccess: () => {
        setMessage("Password Reset Successful");
        setSeverity("success");
      },
    }
  );

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
      },
      onSuccess: (response) => {
        const data = response?.data;
        setAuth(username, data?.role, data?.access_token);
        navigate(from, { replace: true });
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMessage("Username and password are required.");
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

    await LoginMutation.mutateAsync(dataString);

    setOpenSnackbar(true);
  };

  const handleSubmitForgotPassword = async (e) => {
    e.preventDefault();

    const captchaValue = recaptcha.current.getValue();
    if (!captchaValue) {
      setMessage("Please Verify the reCAPTCHA");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    if (!email) {
      setMessage("Input Email");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const data = {
      email: email,
      recaptcha: captchaValue,
    };

    const payload = JSON.stringify(data);
    setForgotPass(false);

    await ResetMutation.mutateAsync(payload);

    setOpenSnackbar(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleChange = (event) => {
    setPersist(event.target.checked);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  const { isLoading: isLoginLoading } = LoginMutation;
  const { isLoading: isResetLoading } = ResetMutation;

  return (
    <>
      <Dialog open={forgotPass} onClose={() => setForgotPass(false)}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <Typography variant="subtitle1">
            Please input your Registered Email account
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              name="email"
              label="Email"
              type="email"
              placeholder="Input Email"
              variant="outlined"
              fullWidth
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              value={email}
              required
            />
            <ReCAPTCHA
              ref={recaptcha}
              sitekey={`${import.meta.env.VITE_RECAPTCHA_HTML_KEY}`}
            />
          </Box>
          <Typography variant="body2">
            After a successful transaction please check your email and follow
            the emailed instruction there
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: 3 }}>
          <Button onClick={() => setForgotPass(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitForgotPassword}
            variant="contained"
            color="primary"
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
      {(isLoginLoading || isResetLoading) && (
        <Box sx={{ width: "100%", position: "fixed", top: 0 }}>
          <LinearProgress />
        </Box>
      )}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <Box sx={{ display: "flex", flexDirection: "column"}} >
        <Box sx={{display: "flex", alignItems: "Center", justifyContent:"center", height:"100vh"}}>
          <Container maxWidth="sm" sx={{py: 4}}>
            <Box textAlign={"center"} mb={4}>
            {/* <Link href="." className="navbar-brand navbar-brand-autodark"> 
            <img src="./static/logo.svg" height="36" alt="" />
            </Link> */}
              <Typography> (logo) PUPQC APMS  </Typography>
            </Box>
            <Card>
              <CardContent>
                <Typography variant="h6" textAlign={"center"} mb={4}>
                  Login to your account
                </Typography>
                <Container component="main" maxWidth="xs">
                        <Grid container spacing={2}>
                          <Grid item xs={12}>

                            <Typography marginBottom={1} fontSize={15} fontWeight={600}>
                              Username
                            </Typography>
                            <TextField
                               InputLabelProps={{
                                shrink: false,
                                disableAnimation: true,
                              }}
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
                            <Typography marginBottom={1} fontSize={15} fontWeight={600}> 
                              Password
                            </Typography>
                            <TextField
                                InputLabelProps={{
                                shrink: false,
                                disableAnimation: true,
                              }}
                              type="password"
                              variant="outlined"
                              placeholder="Your password"
                              fullWidth
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="input"
                              required
                            />
                            
                            <Typography
                              sx={{ cursor: "pointer" }}
                              onClick={() => setForgotPass(true)}
                              variant="body2"
                            >
                              Forgot Password?
                            </Typography>
                          </Grid>

                          <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox color="primary"
                                    checked={persist || false}
                                    onChange={handleChange}
                                    inputProps={{ "aria-label": "controlled" }}
                                  />
                                }
                                label={
                                  <Typography >
                                    Remember me on this device
                                  </Typography>
                                }
                            />
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
                              <Typography color="textSecondary" variant="body2" marginTop={1}>
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
                <Box  sx={{display:"flex", justifyContent: "center",gap:"2rem"}} pb={4} >
                      <Button  variant="outlined" sx={{textTransform:"none"}} >
                        {/* <SvgIcon component="svg" viewBox="0 0 24 24" className="text-google" width="24" height="24">
                        </SvgIcon> */}
                        Login with Google
                      </Button>
                    <LinkedInLogin/>
                  </Box>
            </Card>
            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Don&#39;t have an account yet? <Link to="/register">Sign up</Link>
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Login;
