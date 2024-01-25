import { useMutation, useQueryClient } from "react-query";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Box,
  Button,
  Dialog,
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
  FormControlLabel,
  Switch,
  Skeleton,
  OutlinedInput,
} from "@mui/material";

import { Add } from "@mui/icons-material";

import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from "@mui/x-date-pickers";
import useCourses from "../../hooks/useCourses";
import useRegions from "../../hooks/useRegion";
import useCountries from "../../hooks/useCountries";
import useCitiesMunicipalities from "../../hooks/useCitiesMunicipalities";
import AddCourse from "../selections/AddCourseModal";
import useAll from "../../hooks/utilities/useAll";

const AddEducationModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  const axiosPrivate = useAxiosPrivate();
  const [openModal, setOpenModal] = useState(false);

  const { setMessage, setSeverity, setOpenSnackbar, setLinearLoading } =
    useAll();

  const [educationProfile, setEducationProfile] = useState(null);
  const { data: courses, isLoading: isLoadingCourses } = useCourses();
  const { data: regions, isLoading: isLoadingRegions } = useRegions();
  const { data: countries, isLoading: isLoadingCountries } = useCountries();
  const {
    data: citiesMunicipalities,
    isLoading: isLoadingCitiesMunicipalities,
  } = useCitiesMunicipalities(educationProfile?.region_code);

  const mutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axiosPrivate.post(`/profiles/education/`, newProfile, axiosConfig);
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
      },
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("education-me");
        queryClient.invalidateQueries("career-profile");
        queryClient.invalidateQueries("profile-me");

        setMessage("Education Updated Successfully");
        setSeverity("success");
      },
      onSettled: () => {
        setLinearLoading(false);
        setOpenSnackbar(true);
        onClose();
      },
    }
  );

  const { isLoading } = mutation;

  const handleDateStarted = (date) => {
    setEducationProfile((prevProfile) => ({
      ...prevProfile,
      date_start: date,
    }));
  };

  const handleDateGraduated = (date) => {
    setEducationProfile((prevProfile) => ({
      ...prevProfile,
      date_graduated: date,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEducationProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      educationProfile?.level == "" ||
      educationProfile?.school_name == "" ||
      educationProfile?.story == "" ||
      (educationProfile?.is_international &&
        (educationProfile?.country == "" || educationProfile?.address == "")) ||
      (!educationProfile?.is_international &&
        (educationProfile?.region == "" ||
          educationProfile?.region_code == "" ||
          educationProfile?.city == "" ||
          educationProfile?.city_code == "")) ||
      educationProfile?.date_start == null ||
      (!educationProfile?.currently_studying &&
        educationProfile?.date_graduated == null)
    ) {
      setMessage("please fill out all of the fields.");
      setSeverity("error");
      setOpenSnackbar(true);
      return; // Prevent form submission
    }

    if (educationProfile?.is_international) {
      setEducationProfile((prevProfile) => ({
        ...prevProfile,
        address: educationProfile?.country,
        region: "",
        region_code: "",
      }));
    }

    const data = {
      course: educationProfile?.course || null,
      level: educationProfile?.level || "",
      school_name: educationProfile?.school_name || "",
      is_international: educationProfile?.is_international || false,
      country: educationProfile?.country || "",
      region: educationProfile?.region || "",
      city: educationProfile?.city || "",
      story: educationProfile?.story || "",
      region_code: educationProfile?.region_code || "",
      city_code: educationProfile?.city_code || "",
      address: educationProfile?.address || "",
      date_start: educationProfile?.date_start?.format("YYYY-MM-DD") || null,
      date_graduated:
        educationProfile?.date_graduated?.format("YYYY-MM-DD") || null,
    };

    // Convert the object to a JSON string
    const payload = JSON.stringify(data);
    setLinearLoading(true);
    await mutation.mutateAsync(payload);
  };

  const levelOptions = [
    {
      value: "Early Childhood Education",
    },
    {
      value: "Primary",
    },
    {
      value: "Lower Secondary",
    },
    {
      value: "Upper Secondary",
    },
    {
      value: "Post-Secondary Non-Tertiary",
    },
    {
      value: "Short Cycle Tertiary",
    },
    {
      value: "Bachelor's or equivalent level",
    },
    {
      value: "Master's or equivalent elvel",
    },
    {
      value: "Doctoral or equivalent level",
    },
  ];

  if (isLoadingCourses || isLoadingRegions || isLoadingCountries) {
    return (
      <Dialog open={true} fullWidth>
        <DialogTitle>
          <Skeleton variant="text" />
        </DialogTitle>
        <DialogContent>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Box>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Box>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Box>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Box>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Box>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
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

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>School Information</DialogTitle>
        <DialogContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant="h6" my={2}>
                Educational Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="school_name"
                    label="Name of School"
                    value={educationProfile?.school_name || ""}
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Educational Level</InputLabel>
                    <Select
                      name="level"
                      onChange={handleChange}
                      value={educationProfile?.level || ""}
                      input={<OutlinedInput label="Educational Level" />}
                    >
                      {levelOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "stretch",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Autocomplete
                      sx={{ width: "80%" }}
                      name="course"
                      options={courses?.data}
                      getOptionLabel={(option) => option.name}
                      getOptionSelected={(option, value) =>
                        option.name === value.name
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Course Name" />
                      )}
                      onChange={(event, value) =>
                        setEducationProfile((prevProfile) => ({
                          ...prevProfile,
                          course: value ? value.id : null,
                          course_name: value ? value.name : null,
                        }))
                      }
                      value={
                        courses?.data?.find(
                          (option) =>
                            option.name === educationProfile?.course_name
                        ) || null
                      }
                    />
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setOpenModal(true)}
                    >
                      Course
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" my={2}>
                Education Length
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={
                      <Switch
                        defaultChecked
                        checked={educationProfile?.currently_studying || false}
                        onChange={() => {
                          setEducationProfile((prevProfile) => ({
                            ...prevProfile,
                            currently_studying: event.target.checked,
                          }));
                        }}
                        name="currently_studying"
                      />
                    }
                    label="currently studying"
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    views={["year", "month"]}
                    name="date_started"
                    label="Date Started"
                    value={educationProfile?.date_started}
                    onChange={handleDateStarted}
                    renderInput={(params) => <TextField {...params} required />}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  style={{
                    display: educationProfile?.currently_studying
                      ? "none"
                      : "block",
                  }}
                >
                  <DatePicker
                    views={["year", "month"]}
                    name="date_graduated"
                    label="Date Graduated"
                    value={educationProfile?.date_graduated}
                    onChange={handleDateGraduated}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" my={2}>
                School Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    sx={{ marginLeft: "auto" }}
                    control={
                      <Switch
                        defaultChecked
                        checked={educationProfile?.is_international || false}
                        onChange={(event) => {
                          setEducationProfile((prevProfile) => ({
                            ...prevProfile,
                            is_international: event.target.checked,
                          }));
                        }}
                        name="is_international"
                      />
                    }
                    label="studying or studied internationally"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: !educationProfile?.is_international
                      ? "none"
                      : "block",
                  }}
                >
                  <Autocomplete
                    fullWidth
                    name="country"
                    options={countries}
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) =>
                      option.name === value.name
                    }
                    getOptionDisabled={(option) => option.name == "Philippines"}
                    renderInput={(params) => (
                      <TextField {...params} label="country" />
                    )}
                    onChange={(event, value) => {
                      setEducationProfile((prevProfile) => ({
                        ...prevProfile,
                        country: value ? value.name : null,
                      }));
                    }}
                    value={
                      countries?.find(
                        (option) => option.name === educationProfile?.country
                      ) || null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: educationProfile?.is_international
                      ? "none"
                      : "block",
                  }}
                >
                  <Autocomplete
                    fullWidth
                    name="region"
                    options={regions}
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) =>
                      option.name === value.name
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Region" />
                    )}
                    onChange={(event, value) => {
                      setEducationProfile((prevProfile) => ({
                        ...prevProfile,
                        region: value ? value.name : null,
                        address: value ? value.name : null,
                        city: null,
                        region_code: value ? value.code : null,
                        city_code: null,
                      }));
                    }}
                    value={
                      regions?.find(
                        (option) => option.name === educationProfile?.region
                      ) || null
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: educationProfile?.is_international
                      ? "none"
                      : "block",
                  }}
                >
                  <Autocomplete
                    fullWidth
                    name="city"
                    disabled={
                      !citiesMunicipalities || isLoadingCitiesMunicipalities
                    }
                    options={citiesMunicipalities || []}
                    getOptionLabel={(option) => option.name}
                    getOptionSelected={(option, value) =>
                      option.name === value.name
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="City or Municipality" />
                    )}
                    onChange={(event, value) => {
                      setEducationProfile((prevProfile) => ({
                        ...prevProfile,
                        city: value ? value.name : null,
                        address: value
                          ? prevProfile?.region + ", " + value.name
                          : prevProfile?.region,
                        city_code: value ? value.code : null,
                      }));
                    }}
                    value={
                      citiesMunicipalities?.find(
                        (option) => option.name === educationProfile?.city
                      ) || null
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" my={2}>
                Education's Story
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="story"
                    label="highlights of your education (optional)"
                    value={educationProfile?.story || ""}
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
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
      {openModal && (
        <AddCourse open={openModal} onClose={() => setOpenModal(false)} />
      )}
    </>
  );
};

export default AddEducationModal;
