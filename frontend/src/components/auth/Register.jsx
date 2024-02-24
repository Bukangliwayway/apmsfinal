import { useState, useRef, forwardRef, useEffect } from "react";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useMutation } from "react-query";
import { IMaskInput } from "react-imask";
import useAll from "../../hooks/utilities/useAll";
import Box from "@mui/material/Box";
import axios from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

import {
  Avatar,
  Button,
  CardActionArea,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Tooltip,
  Typography,
  Container,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

import dayjs from "dayjs";
import {
  DatePickerElement,
  FormContainer,
  TextFieldElement,
} from "react-hook-form-mui";
import { HelpOutline } from "@mui/icons-material";
const StudentNumberMask = forwardRef(function StudentNumberMask(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="0000-00000-AA-0"
      definitions={{
        A: /[A-Z]/,
        0: /[0-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

const Register = () => {
  const navigate = useNavigate();
  const recaptcha = useRef();
  const payloadRef = useRef(new FormData());
  const [openDialog, setOpenDialog] = useState(false);

  const {
    setMessage,
    setSeverity,
    setOpenSnackbar,
    setBackdropLoading,
    setLinearLoading,
  } = useAll();

  const [fileData, setFileData] = useState({
    profile_picture: "",
    profile_picture_name: "Upload profile picture",
    profile_picture_url: "/default-profile-image.jpeg",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setFileData((prevProfile) => ({
        ...prevProfile,
        profile_picture: file,
        profile_picture_url: URL.createObjectURL(file),
        profile_picture_name: file.name,
      }));
    }
  };

  const mutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      await axios.post("/auth/register/alumni", newProfile, axiosConfig);
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
        if (
          error.response.data.detail ==
          "Provided details doesn't match any PUPQC Alumni records"
        ) {
          setOpenDialog(true);
        }
      },

      onSuccess: (data, variables, context) => {
        setMessage(
          "Successfully Registered! Now please check your email for account credentials thank you!"
        );
        setSeverity("success");

        navigate("/login", {
          state: {
            message:
              "Successfully Registered! Now Please Check your Email for Credentials",
            snackbar:
              "Successfully Registered! Now Please Check your Email for Credentials",
          },
          replace: true,
        });
      },
      onSettled: () => {
        setBackdropLoading(false);
        setOpenSnackbar(true);
      },
    }
  );

  const publicUserMutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      await axios.post("/auth/register/public_user", newProfile, axiosConfig);
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
      },

      onSuccess: (data, variables, context) => {
        setMessage(
          "Successfully Registered as Public User! Now Please Check your Email for Credentials"
        );
        setSeverity("success");

        navigate("/login", {
          state: {
            message:
              "Successfully Registered as Public User! Now Please Check your Email for Credentials",
            snackbar:
              "Successfully Registered as Public User! Now Please Check your Email for Credentials",
          },
          replace: true,
        });
      },
      onSettled: () => {
        setLinearLoading(false);
        setOpenSnackbar(true);
      },
    }
  );

  const { isLoading } = mutation;
  const { isLoading: isPublicUserLoading } = publicUserMutation;

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={() => !isPublicUserLoading && setOpenDialog(false)}
        fullWidth
      >
        <FormContainer
          onSuccess={async (data) => {
            const payload = payloadRef.current;
            setLinearLoading(true);
            await publicUserMutation.mutateAsync(payload);
          }}
        >
          <DialogTitle>Register Instead as an Unverified User</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Avatar sx={{ backgroundColor: "#3f51b5" }}>
                <HelpOutline />
              </Avatar>
              <Typography variant="h6" color="textPrimary">
                Welcome!
              </Typography>
            </Box>
            <Typography variant="body1" color="textSecondary">
              We noticed you've registered, but there's no record of you in our
              system yet. No worries, this could mean the record hasn't been
              added yet.
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Here's an alternative: Register as an Unverified User. This lets
              you update your profile for verification while we process your
              request for full access.
            </Typography>
          </DialogContent>

          <DialogActions sx={{ padding: 2 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              color="inherit"
              disabled={isPublicUserLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit" // Assuming FormContainer triggers form submission on button click
              disabled={isPublicUserLoading}
            >
              Proceed
            </Button>
          </DialogActions>
        </FormContainer>
      </Dialog>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FormContainer
          onSuccess={async (data) => {
            const captchaValue = recaptcha.current.getValue();
            if (!captchaValue) {
              setMessage("Please Verify the reCAPTCHA");
              setSeverity("error");
              setOpenSnackbar(true);
              return;
            }

            const payload = payloadRef.current;

            payload.append("birthdate", data?.birthdate.format("YYYY-MM-DD"));
            payload.append("first_name", data?.first_name);
            payload.append("last_name", data?.last_name);
            payload.append("student_number", data?.student_number);
            payload.append("email", data?.email);
            payload.append("profile_picture", fileData?.profile_picture);
            payload.append("recaptcha", captchaValue);


            setBackdropLoading(true);
            await mutation.mutateAsync(payload);
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
              <Typography variant="h4" fontWeight={800}>
                PUPQC APMS
              </Typography>
            </Box>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  textAlign={"center"}
                  mb={4}
                >
                  Alumni Registration
                </Typography>
                <Container component="main" maxWidth="sm">
                  <Grid container spacing={2}>
                    <Grid item xs={12} mb={2}>
                      <Tooltip title="click to upload profile picture">
                        {/* Profile Picture */}
                        <CardActionArea
                          component="label"
                          htmlFor="profile-picture"
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              id="profile-picture"
                              name="profile_picture"
                              style={{ display: "none" }}
                              onChange={handleFileChange}
                            />
                            <Avatar
                              alt="Profile"
                              src={fileData?.profile_picture_url}
                              sx={{ width: "100px", height: "100px" }}
                            />
                            <Typography variant="body2">
                              {fileData?.profile_picture_name}
                            </Typography>
                          </Box>
                        </CardActionArea>
                      </Tooltip>
                    </Grid>
                    <Tooltip title="This is Optional in case you had already forgotten your student number">
                      <Grid item xs={12}>
                        <Typography gutterBottom fontSize={14} fontWeight={600}>
                          Student Number
                        </Typography>

                        <TextFieldElement
                          defaultValue="Small"
                          variant="outlined"
                          placeholder="Student number"
                          name="student_number"
                          InputProps={{
                            inputComponent: StudentNumberMask,
                          }}
                          fullWidth
                        />
                      </Grid>
                    </Tooltip>
                    <Grid item xs={6}>
                      <Typography gutterBottom fontSize={14} fontWeight={600}>
                        First Name
                      </Typography>
                      <TextFieldElement
                        defaultValue="Small"
                        name="first_name"
                        placeholder="Enter first name"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        gutterBottom
                        fontSize={14}
                        sx={{ fontWeight: "fontWeightSemiBold" }}
                      >
                        Last Name
                      </Typography>
                      <TextFieldElement
                        defaultValue="Small"
                        name="last_name"
                        placeholder="Enter last name"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography gutterBottom fontSize={14} fontWeight={600}>
                        Email Address
                      </Typography>
                      <TextFieldElement
                        defaultValue="Small"
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        variant="outlined"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography gutterBottom fontSize={14} fontWeight={600}>
                        Birthdate
                      </Typography>
                      <DatePickerElement
                        disableFuture
                        name="birthdate"
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <ReCAPTCHA
                        ref={recaptcha}
                        sitekey={`${import.meta.env.VITE_RECAPTCHA_HTML_KEY}`}
                      />
                    </Grid>
                    <Grid item xs={12} mt={2}>
                      <Button
                        fullWidth
                        type="submit" // Assuming FormContainer triggers form submission on button click
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                      >
                        Register
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
                    </Grid>
                  </Grid>
                </Container>
              </CardContent>
            </Card>
            <Box mt={2} textAlign="center">
              <Typography variant="body1">
                Already have account?{" "}
                <Link to="/login" underline="none">
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Container>
        </FormContainer>
      </Box>
    </>
  );
};

export default Register;
