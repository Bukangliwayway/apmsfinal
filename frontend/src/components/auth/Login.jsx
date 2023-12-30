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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            maxWidth: 500,
            padding: "24px",
          }}
        >
          <CardContent>
            <Typography variant="h6">Alumni Login</Typography>
            <Typography color="textSecondary" variant="body2" my={1}>
              {refreshMessage}
            </Typography>
            <Grid container spacing={1.5}>
              <Grid xs={12} item>
                <TextField
                  label="Username"
                  inputRef={userRef}
                  placeholder="input username"
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
                  disabled={isLoginLoading}
                >
                  Login
                </Button>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={persist || false}
                      onChange={(event) => setPersist(event.target.checked)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="Remember me on this device"
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
              Sign Up Instead
            </Link>
          </CardContent>
        </Card>
      </Box>

      <ForgotPass forgotPass={forgotPass} setForgotPass={setForgotPass} />
    </>
  );
};

export default Login;
