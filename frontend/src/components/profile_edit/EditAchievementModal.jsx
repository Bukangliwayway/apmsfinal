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
  Skeleton,
  OutlinedInput,
} from "@mui/material";

import { Add } from "@mui/icons-material";

import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import useGetAchievementSpecific from "../../hooks/useGetAchievementsSpecific";
import useNationalCertificates from "../../hooks/useNationalCertificates";
import useAll from "../../hooks/utilities/useAll";
import AddNationalAchievementModal from "../selections/AddNationalAchievementModal";

const EditAchievementModal = ({ open, onClose, achievementID }) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();
  const { setMessage, setSeverity, setOpenSnackbar, setLinearLoading } =
    useAll();

  const { data: cachedData, isLoading: isLoadingProfile } =
    useGetAchievementSpecific(achievementID);

  const { data: certificates, isLoading: isLoadingDisplay } =
    useNationalCertificates();

  const [achievementProfile, setAchievementProfile] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (cachedData) {
      setAchievementProfile({
        type_of_achievement:
          cachedData?.data?.achievement?.type_of_achievement || "",
        description: cachedData?.data?.achievement?.description || "",
        story: cachedData?.data?.achievement?.story || "",
        link_reference: cachedData?.data?.achievement?.link_reference || "",
        national_certification_name:
          cachedData?.data?.achievement?.national_certification?.name || "",
        date_of_attainment:
          cachedData?.data?.achievement?.date_of_attainment || null,
        national_certification_id:
          cachedData?.data?.achievement?.national_certification?.id || "",
      });
    }
  }, [cachedData]);

  const handleDateChange = (date) => {
    setAchievementProfile((prevProfile) => ({
      ...prevProfile,
      date_of_attainment: date,
    }));
  };

  const handleAchievementTypeChange = (event) => {
    const selectedAchievementType = event.target.value;
    const selectedAchievement = achievement_type.find(
      (achievement) => achievement.type === selectedAchievementType
    );

    setAchievementProfile((prevProfile) => ({
      ...prevProfile,
      type_of_achievement: selectedAchievementType,
      description: selectedAchievement?.description || "",
    }));
  };

  const mutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axiosPrivate.put(
        `/profiles/achievement/${achievementID}`,
        newProfile,
        axiosConfig
      );
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
      },
      onSuccess: () => {
        queryClient.invalidateQueries("missing-fields");
        queryClient.invalidateQueries("achievements-profile");
        queryClient.invalidateQueries("profile-me");
        queryClient.invalidateQueries([
          "achievement-profile-specific",
          achievementID,
        ]);
        queryClient.invalidateQueries("profile-me");

        setMessage("Achievement Updated Successfully");
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
  useEffect(() => {
    setLinearLoading(isLoading);
  }, [isLoading]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAchievementProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      achievementProfile.type_of_achievement == "" ||
      achievementProfile.description == "" ||
      achievementProfile.date_of_attainment == 0 ||
      (achievementProfile.type_of_achievement == "national certifications" &&
        !achievementProfile?.national_certification_id)
    ) {
      setMessage("please fill out all of the fields.");
      setSeverity("error");
      setOpenSnackbar(true);
      return; // Prevent form submission
    }

    let certID = achievementProfile?.national_certification_id || null;

    if (achievementProfile.type_of_achievement != "national certifications") {
      certID = null;
    }

    const data = {
      national_certification_id: certID,
      type_of_achievement: achievementProfile?.type_of_achievement,
      description: achievementProfile?.description,
      story: achievementProfile?.story,
      link_reference: achievementProfile?.link_reference,
      date_of_attainment:
        achievementProfile?.date_of_attainment &&
        !/^\d{4}-\d{2}-\d{2}$/.test(achievementProfile.date_of_attainment)
          ? achievementProfile.date_of_attainment.format("YYYY-MM-DD")
          : achievementProfile?.date_of_attainment || "",
    };


    // Convert the object to a JSON string
    const payload = JSON.stringify(data);

    setLinearLoading(true);
    await mutation.mutateAsync(payload);
  };

  if (isLoadingProfile || isLoadingDisplay) {
    return (
      <Dialog open={true}>
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

  const achievement_type = [
    {
      type: "bar exam passer",
      description: "successfully passed a bar examination.",
    },
    {
      type: "board exam passer",
      description: "successfully passed a board examination.",
    },
    {
      type: "civil service eligibility",
      description: "successfully passed a civil service exam",
    },
    {
      type: "owned a business",
      description: "successfully established my own business",
    },
    {
      type: "certifications",
      description: "succesfully received a special certification",
    },
    {
      type: "national certifications",
      description: "succesfully received a national certification",
    },
  ];

  const nationalCertificatesOptions = certificates?.data;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Add Achievement</DialogTitle>
        <DialogContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant="h6" my={2}>
                Achievement Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Achievement Type</InputLabel>
                    <Select
                      name="achievement_type"
                      value={achievementProfile?.type_of_achievement || ""}
                      onChange={handleAchievementTypeChange}
                      input={<OutlinedInput label="Achievement Type" />}
                    >
                      {achievement_type.map((option) => (
                        <MenuItem key={option.type} value={option.type}>
                          {option.type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Description of the Achievements"
                    value={achievementProfile?.description || ""}
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                  />
                </Grid>
              </Grid>
            </Grid>
            {achievementProfile?.type_of_achievement ==
              "national certifications" && (
              <Grid item xs={12}>
                <Typography variant="h6" my={2}>
                  National Certificate
                </Typography>
                <Grid
                  container
                  spacing={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Grid item xs={9}>
                    <Autocomplete
                      name="national_certification"
                      options={nationalCertificatesOptions}
                      getOptionLabel={(option) => option.name}
                      getOptionSelected={(option, value) =>
                        option.id === value.id
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="National Certificate"
                          style={{
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        />
                      )}
                      onChange={(event, value) =>
                        setAchievementProfile((prevProfile) => ({
                          ...prevProfile,
                          national_certification_id: value ? value.id : null,
                          national_certification_name: value
                            ? value.name
                            : null,
                        }))
                      }
                      value={
                        nationalCertificatesOptions?.find(
                          (option) =>
                            option.name ===
                            achievementProfile?.national_certification_name
                        ) || null
                      }
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setOpenModal(true)}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="h6" my={2}>
                Supporting Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <DatePicker
                    views={["year"]}
                    label="year attained"
                    value={
                      achievementProfile?.date_of_attainment
                        ? dayjs(achievementProfile?.date_of_attainment)
                        : null
                    }
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="link_reference"
                    label="supporting links for the achievement (optional)"
                    value={achievementProfile?.link_reference || ""}
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" my={2}>
                Achiever's Story
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="story"
                    label="story of your achievement (optional)"
                    value={achievementProfile?.story || ""}
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
        <AddNationalAchievementModal
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}
    </>
  );
};

export default EditAchievementModal;
