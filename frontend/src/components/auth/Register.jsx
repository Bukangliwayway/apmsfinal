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
} from "@mui/material";

import dayjs from "dayjs";
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
  const [openDialog, setOpenDialog] = useState(false);

  const {
    setMessage,
    setSeverity,
    setOpenSnackbar,
    setBackdropLoading,
    setLinearLoading,
  } = useAll();

  const [formData, setFormData] = useState({
    email: "",
    birthdate: null,
    first_name: "",
    last_name: "",
    student_number: "",
    profile_picture: "",
    profile_picture_name: "Upload profile picture",
    profile_picture_url: "/default-profile-image.jpeg",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevProfile) => ({
      ...prevProfile,
      birthdate: date,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setFormData((prevProfile) => ({
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
        console.log(error.response.data.detail);
        console.log(error.message);
        if (error.message =="Provided details doesn't match any PUPQC Alumni records") {
          setOpenDialog(true);
        }
      },

      onSuccess: (data, variables, context) => {
        setMessage(
          "Successfully Registered! Now please check your email for account credentials thank you!"
        );
        setSeverity("success");

        setFormData({
          username: "",
          email: "",
          profile_picture: "",
          last_name: "",
          first_name: "",
          student_number: "",
        });

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

        setFormData({
          username: "",
          email: "",
          profile_picture: "",
          last_name: "",
          first_name: "",
          student_number: "",
        });

        navigate("/login", {
          state: {
            message:
              "Successfully Registered as Public User! Now Please Check your Email for Credentials",
            snackbar: "Successfully Registered!",
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const allFieldsFilled = Object.entries(formData).every(
      ([fieldName, fieldValue]) =>
        fieldName === "profile_picture" ||
        fieldName === "student_number" ||
        (fieldValue !== "" && fieldValue !== null)
    );

    if (!allFieldsFilled || !dayjs(formData?.birthdate).isValid()) {
      setMessage("Please fill all fields");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // const studentNumberRegex = /^\d{4}-\d{5}-[A-Z]{2}-\d$/;

    // if (!studentNumberRegex.test(formData?.student_number)) {
    //   setMessage("Please enter a valid student number like 2017-00001-CM-0");
    //   setSeverity("error");
    //   setOpenSnackbar(true);
    //   return;
    // }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData?.email)) {
      setMessage("Please enter a valid email address");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const captchaValue = recaptcha.current.getValue();
    if (!captchaValue) {
      setMessage("Please Verify the reCAPTCHA");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const payload = new FormData();
    payload.append("birthdate", formData?.birthdate.format("YYYY-MM-DD"));
    payload.append("first_name", formData?.first_name);
    payload.append("last_name", formData?.last_name);
    payload.append("student_number", formData?.student_number);
    payload.append("email", formData?.email);
    payload.append("profile_picture", formData?.profile_picture);
    payload.append("recaptcha", captchaValue);

    setBackdropLoading(true);
    await mutation.mutateAsync(payload);
  };

  const handleSubmitPublicUser = async (event) => {
    event.preventDefault();

    const payload = new FormData();
    payload.append("birthdate", formData?.birthdate.format("YYYY-MM-DD"));
    payload.append("first_name", formData?.first_name);
    payload.append("last_name", formData?.last_name);
    payload.append("student_number", formData?.student_number);
    payload.append("email", formData?.email);
    payload.append("profile_picture", formData?.profile_picture);
    setLinearLoading(true);
    await publicUserMutation.mutateAsync(payload);
  };

  const { isLoading } = mutation;
  const { isLoading: isPublicUserLoading } = publicUserMutation;

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={() => !isPublicUserLoading && setOpenDialog(false)}
        fullWidth
      >
        <DialogTitle>Register Instead as a Public User</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <Typography variant="body1">
            It appears that you&#39;ve registered your credentials, but there is
            no matching record of yours in the system. If you&#39;re confident
            in your credentials, it&#39;s possible that the system does not yet
            have the record for your batch.
          </Typography>
          <Typography variant="body1">
            Consider our alternative:
            <Typography variant="body1">
              You may register as a Public User. This allows you to edit your
              profile for further validation while waiting for admin approval
              for full access.
            </Typography>
          </Typography>
          <Typography variant="body1" mt={"1.5rem"}>
            Would you like to proceed as a public user first?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: 3 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            color="inherit"
            disabled={isPublicUserLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitPublicUser}
            variant="contained"
            color="primary"
            disabled={isPublicUserLoading}
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
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
                            src={formData?.profile_picture_url}
                            sx={{ width: "100px", height: "100px" }}
                          />
                          <Typography variant="body2">
                            {formData?.profile_picture_name}
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

                      <TextField
                        size="small"
                        defaultValue="Small"
                        variant="outlined"
                        placeholder="Student number"
                        value={formData?.student_number}
                        onChange={handleChange}
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
                    <TextField
                      size="small"
                      defaultValue="Small"
                      name="first_name"
                      placeholder="Enter first name"
                      value={formData.first_name}
                      onChange={handleChange}
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
                    <TextField
                      size="small"
                      defaultValue="Small"
                      name="last_name"
                      placeholder="Enter last name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom fontSize={14} fontWeight={600}>
                      Email Address
                    </Typography>
                    <TextField
                      size="small"
                      defaultValue="Small"
                      name="email"
                      type="email"
                      placeholder="Enter email"
                      variant="outlined"
                      fullWidth
                      onChange={handleChange}
                      value={formData.email}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom fontSize={14} fontWeight={600}>
                      Birthdate
                    </Typography>
                    <DatePicker
                      disableFuture
                      slotProps={{ textField: { size: "small" } }}
                      name="birthdate"
                      placeholder="Enter birthdate"
                      value={formData?.birthdate}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
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
                      onClick={handleSubmit}
                      variant="contained"
                      color="primary"
                      disabled={isLoading}
                    >
                      Register
                    </Button>
                    <Typography mt={1.5} variant="body2" align="center">
                      By using this service, you understood and agree to the PUP
                      Online Services{" "}
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
      </Box>
    </>
  );
};

export default Register;
