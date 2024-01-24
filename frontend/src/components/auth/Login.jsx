import { useState, useRef, useEffect } from "react";
import useAll from "../../hooks/utilities/useAll";
import { useMutation } from "react-query";
import axios from "../../api/axios";
import LinkedInLogin from "./LinkedInLogin";
import { IconBrandGoogle } from "@tabler/icons-react";

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
    setBackdropLoading,
  } = useAll();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/home";
  const refreshMessage =
    location.state?.message || "Ready to Relive Memories? Just Login!";
  const snackbarMessage = location.state?.snackbar || "";

  const userRef = useRef();
  const [disable, setDisable] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPass, setForgotPass] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
    };

    // Attach the event listener when the component mounts
    window.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []); // Empty dependency array ensures that the effect runs only once during mounting

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
        setBackdropLoading(false);
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

    setBackdropLoading(true);
    await LoginMutation.mutateAsync(dataString);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Container maxWidth="sm" sx={{ py: 4 }}>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={2}
              mb={4}
            >
              <img
                src={
                  "https://www.clipartmax.com/png/full/70-708931_the-pup-logo-polytechnic-university-of-the-philippines-logo.png"
                }
                style={{ width: "auto", height: "50px" }}
              />
              <Typography variant="h4" fontWeight={"800"}>
                PUPQC APMS
              </Typography>
            </Box>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={700} textAlign={"center"}>
                  Login to your account
                </Typography>
                <Container component="main" maxWidth="sm">
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        mb={5}
                        textAlign={"center"}
                      >
                        {refreshMessage}
                      </Typography>
                      <Typography gutterBottom fontSize={14} fontWeight={600}>
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
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography fontSize={14} fontWeight={600}>
                          Password
                        </Typography>
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
                            onChange={(event) =>
                              setPersist(event.target.checked)
                            }
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
                        <Typography mt={1.5} variant="body2" align="center">
                          By using this service, you understood and agree to the
                          PUP Online Services{" "}
                          <a
                            target={"_blank"}
                            href="https://www.pup.edu.ph/terms/"
                            rel="noreferrer"
                          >
                            {" "}
                            Terms of Use
                          </a>{" "}
                          and{" "}
                          <a
                            target={"_blank"}
                            href="https://www.pup.edu.ph/privacy/"
                            rel="noreferrer"
                          >
                            Privacy Statement
                          </a>
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Container>
              </CardContent>
            </Card>
            <Box mt={2} textAlign="center">
              <Typography variant="body1">
                Don&#39;t have an account yet?{" "}
                <Link to="/register" underline="none">
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Container>
        </Box>
      </form>

      <ForgotPass forgotPass={forgotPass} setForgotPass={setForgotPass} />
    </>
  );
};

export default Login;
