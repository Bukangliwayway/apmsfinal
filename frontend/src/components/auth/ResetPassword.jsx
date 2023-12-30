import axios from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import useAll from "../../hooks/utilities/useAll";

const ResetPassword = () => {
  const navigate = useNavigate();

  const { code } = useParams();
  const { email } = useParams();
  const [password, setPassword] = useState("");
  const { setMessage, setSeverity, setOpenSnackbar, setLinearLoading } =
    useAll();

  const ResetMutation = useMutation(
    async (details) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axios.post(`/auth/password_change`, details, axiosConfig);
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
        setOpenSnackbar(true);
      },
      onSuccess: (data, variables, context) => {
        setMessage("Password Changed Successful");
        setSeverity("success");
        navigate("/login", {
          state: {
            message:
              "Successfully Reset your Password now Please Input your Updated Credentials",
            snackbar: "Successfully Updated!",
          },
          replace: true,
        });
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !code) {
      setMessage("Input All Fields");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const data = {
      password: password,
      email: email,
      code: code,
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
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card>
          <CardHeader
            title={<Typography variant="h4">Password Reset</Typography>}
          />
          <CardContent>
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
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              Save
            </Button>
          </CardActions>
        </Card>
      </Box>
    </>
  );
};

export default ResetPassword;
