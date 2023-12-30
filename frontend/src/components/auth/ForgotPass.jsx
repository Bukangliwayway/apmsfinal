import axios from "../../api/axios";
import { useMutation } from "react-query";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import useAll from "../../hooks/utilities/useAll";

export const ForgotPass = ({ forgotPass, setForgotPass }) => {
  const navigate = useNavigate();
  const recaptcha = useRef();
  const [email, setEmail] = useState("");
  const { setMessage, setSeverity, setOpenSnackbar, setLinearLoading } =
    useAll();

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
        navigate("/login", {
          state: {
            message: "Password Reset Request Successful",
          },
          replace: true,
        });
        setMessage("Successfully Requested!");
        setSeverity("success");
        setOpenSnackbar(true);
      },
    }
  );

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

    await ResetMutation.mutateAsync(payload);

    setOpenSnackbar(true);
  };

  const { isLoading: isResetLoading } = ResetMutation;

  useEffect(() => {
    setLinearLoading(isResetLoading);
  }, [isResetLoading]);

  return (
    <Box>
      <Dialog open={forgotPass} onClose={() => setForgotPass(false)} fullWidth>
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
          <Button onClick={() => setForgotPass(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitForgotPassword}
            variant="contained"
            color="primary"
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
