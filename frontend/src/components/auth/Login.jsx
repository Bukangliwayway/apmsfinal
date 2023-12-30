import React, { useState, useRef, useEffect } from "react";
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
  }, [snackbarMessage]);

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
    if(loginLimit <= 0){
      console.log("implement some countdown here");
      loginLimit = 5
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

  const { isLoading: isLoginLoading } = LoginMutation;

  return (
    <>
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

              <Grid
                item
                xs={12}
                display={"flex"}
                flexDirection={"column"}
                gap={1}
              >
                <TextField
                  label="Password"
                  placeholder="Input password"
                  variant="outlined"
                  fullWidth
                  type="password"
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
              <Box p={2} sx={{ width: "100%", m: "0 auto" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  fullWidth
                  onClick={handleSubmit}
                >
                  login
                </Button>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={persist || false}
                      onChange={handleChange}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="remember me on this device"
                />
              </Box>
            </Grid>
            <LinkedInLogin />
            <Link
              to="/register"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              sign up instead
            </Link>
          </CardContent>
        </Card>
      </Box>

      <ForgotPass forgotPass={forgotPass} setForgotPass={setForgotPass} />
    </>
  );
};

export default Login;
