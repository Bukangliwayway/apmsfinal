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
import {
  FormContainer,
  PasswordElement,
  TextFieldElement,
} from "react-hook-form-mui";

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
    async (data) => {
      // Use URLSearchParams for safer parameter handling
      const params = new URLSearchParams();
      params.append("grant_type", "password");
      params.append("username", data.username);
      params.append("password", data.password);

      const axiosConfig = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      };

      try {
        const response = await axios.post(
          `/users/auth/token`,
          params.toString(),
          axiosConfig
        );
        return response.data;
      } catch (error) {
        // Handle specific error cases
        if (error.response) {
          throw new Error(
            error.response.data.detail || "Authentication failed"
          );
        }
        throw new Error("Network error occurred");
      }
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
        setOpenSnackbar(true);
        loginLimit--;
      },
      onSuccess: (response) => {
        navigate(from, { replace: true });
      },
      onSettled: () => {
        setBackdropLoading(false);
      },
    }
  );

  return (
    <>
      <FormContainer
        onSuccess={async (data) => {
          setBackdropLoading(true);
          await LoginMutation.mutateAsync(data);
        }}
      >
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
                      <TextFieldElement
                        inputRef={userRef}
                        placeholder="Your Username or Email"
                        variant="outlined"
                        name="username"
                        fullWidth
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
                      <PasswordElement
                        InputLabelProps={{
                          shrink: false,
                          disableAnimation: true,
                        }}
                        type="password"
                        variant="outlined"
                        placeholder="Your password"
                        fullWidth
                        name="password"
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
      </FormContainer>
      <ForgotPass forgotPass={forgotPass} setForgotPass={setForgotPass} />
    </>
  );
};

export default Login;
