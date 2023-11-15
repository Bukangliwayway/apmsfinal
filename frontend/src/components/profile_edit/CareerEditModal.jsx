import { useMutation, useQueryClient, useQuery } from "react-query";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import {
  Alert,
  Box,
  Button,
  Dialog,
  Avatar,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Grid,
  Snackbar,
  LinearProgress,
  Tooltip,
  Skeleton,
  FormControlLabel,
  Switch,
} from "@mui/material";

import {
  LibraryBooks as LibraryBooksIcon,
  School as SchoolIcon,
  EmojiPeople as EmojiPeopleIcon,
  Create as CreateIcon,
  LocalLibrary as LocalLibraryIcon,
  SportsSoccer as SportsSoccerIcon,
  Public as PublicIcon,
  Lightbulb as LightbulbIcon,
  Star as StarIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  BusinessCenter as BusinessCenterIcon,
  Flight as FlightIcon,
  People as PeopleIcon,
  SwapHoriz as SwapHorizIcon,
  FamilyRestroom as FamilyRestroomIcon,
} from "@mui/icons-material";

import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const careerProfileEditModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  const getCourses = async () => {
    return await axiosPrivate.get("/selections/courses/");
  };
  const { data: courses, isLoading: isLoadingCourses } = useQuery(
    "courses",
    getCourses
  );

  const getData = async () => {
    return await axiosPrivate.get("/profiles/career_profile/me");
  };
  const { data: cachedData } = useQuery("career-profile", getData);

  const [careerProfile, setCareerProfile] = useState(null);

  useEffect(() => {
    if (cachedData) {
      setCareerProfile({
        ...cachedData.data,
        year_graduated: cachedData?.data?.year_graduated || null,
        course: cachedData?.data?.course || "",
        course_name: cachedData?.data?.course || "",
        post_grad_act: cachedData?.data?.post_grad_act || [],
      });
    }
  }, [cachedData]);

  const mutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosPrivate.put(
        "/profiles/career_profiles/",
        newProfile,
        axiosConfig
      );
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
        setOpenSnackbar(true);
      },
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("career-profile");
        queryClient.invalidateQueries("profile-me");

        setMessage("Career Profile updated successfully");
        setSeverity("success");
      },
    }
  );

  const { isLoading, isError, error, isSuccess } = mutation;

  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleDateChange = (date) => {
    const year = date.year();
    setCareerProfile((prevProfile) => ({
      ...prevProfile,
      year_graduated: year,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      year_graduated:
        careerProfile?.year_graduated === cachedData?.data?.year_graduated
          ? null
          : careerProfile?.year_graduated,
      course:
        careerProfile?.course === cachedData?.data?.course
          ? null
          : careerProfile?.course,
      post_grad_act: careerProfile?.post_grad_act,
    };

    // Filter out null values
    const filteredData = Object.keys(data).reduce((acc, key) => {
      if (data[key] !== null) {
        acc[key] = data[key];
      }
      return acc;
    }, {});

    // Convert the object to a JSON string
    const payload = JSON.stringify(filteredData);

    try {
      await mutation.mutateAsync(payload);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail);
        setSeverity("error");
      } else if (error.request) {
        setMessage("No response received from the server");
        setSeverity("error");
      } else {
        setMessage("Error: " + error.message);
        setSeverity("error");
      }
    }
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const postGradActOptions = [
    {
      value: "Employment",
      label: "Employment",
      tooltip: "This covers any form of work or employment.",
      icon: <WorkIcon />,
    },
    {
      value: "Education",
      label: "Education",
      tooltip:
        "Encompasses further education, postgraduate studies, or pursuing additional certifications.",
      icon: <SchoolIcon />,
    },
    {
      value: "Internship",
      label: "Internship or Training",
      tooltip:
        "Involves internships, professional training, or gaining practical experience.",
      icon: <BusinessCenterIcon />,
    },
    {
      value: "Freelancing",
      label: "Freelancing or Self-Employment",
      tooltip: "Includes freelance work or starting a business venture.",
      icon: <BusinessIcon />,
    },
    {
      value: "Travel",
      label: "Travel or Personal Time",
      tooltip:
        "Covers travel, taking time off for personal reasons, or a gap year.",
      icon: <FlightIcon />,
    },
    {
      value: "Volunteering",
      label: "Volunteering or Social Service",
      tooltip:
        "Involves volunteering or engaging in social service activities.",
      icon: <PeopleIcon />,
    },
    {
      value: "Career Transition",
      label: "Career Transition",
      tooltip: "Represents changing career paths or industries.",
      icon: <SwapHorizIcon />,
    },
    {
      value: "PersonalResponsibilities",
      label: "Family or Personal Responsibilities",
      tooltip:
        "Includes responsibilities related to family, marriage, or personal matters.",
      icon: <FamilyRestroomIcon />,
    },
  ];

  if (isLoadingCourses) {
    return (
      <Dialog open={true}>
        <DialogTitle>
          <Skeleton variant="text" />
        </DialogTitle>
        <DialogContent sx={{ width: "40vw" }}>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Box>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Box>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={100} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button disabled>
            <Skeleton variant="text" />
          </Button>
          <Button disabled>
            <Skeleton variant="text" />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const coursesOptions = courses.data;

  return (
    <Dialog open={open} onClose={onClose}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <Box sx={{ width: "100%", position: "relative", top: 0 }}>
        {isLoading && <LinearProgress />}
        {!isLoading && <Box sx={{ height: 4 }} />}
      </Box>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent sx={{ width: "40vw" }}>
        <Grid container spacing={2} p={2}>
          <Grid item xs={12}>
            <Autocomplete
              name="course"
              options={coursesOptions}
              getOptionLabel={(option) => option.name}
              getOptionSelected={(option, value) => option.name === value.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Course"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />
              )}
              onChange={(event, value) =>
                setCareerProfile((prevProfile) => ({
                  ...prevProfile,
                  course: value ? value.id : null,
                  course_name: value ? value.name : null,
                }))
              }
              value={
                coursesOptions.find(
                  (option) => option.name === careerProfile?.course_name
                ) || null
              }
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]} sx={{ width: "100%" }}>
                <DemoItem>
                  <DatePicker
                    views={["year"]}
                    label="Year graduated"
                    value={
                      careerProfile?.year_graduated
                        ? dayjs(`${careerProfile.year_graduated}-01-01`)
                        : null
                    }
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="post-grad-act-label">Post Grad Act</InputLabel>
              <Select
                labelId="post-grad-act-label"
                multiple
                value={careerProfile?.post_grad_act}
                onChange={(event) => {
                  setCareerProfile({
                    ...careerProfile,
                    post_grad_act: event.target.value, // Update post_grad_act
                  });
                }}
                renderValue={(selected) => (
                  <Box
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "flex",
                      flexDirection: "column",
                      width: "60%",
                      margin: "0 auto",
                      gap: 5,
                    }}
                  >
                    {selected.map((value) => {
                      const selectedOption = postGradActOptions.find(
                        (option) => option.value === value
                      );
                      if (selectedOption) {
                        return (
                          <Chip
                            key={value}
                            label={selectedOption.label}
                            icon={selectedOption.icon}
                          />
                        );
                      }
                      return null; // Handle cases where the option with the selected value doesn't exist
                    })}
                  </Box>
                )}
              >
                {postGradActOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default careerProfileEditModal;