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
  OutlinedInput,
  Backdrop,
  CircularProgress,
} from "@mui/material";

import {
  MoneyOff,
  Computer,
  FlightTakeoff,
  DirectionsWalk,
  LocationCity,
  School,
  Loop,
} from "@mui/icons-material";

import Chip from "@mui/material/Chip";
import useGetEmploymentStatus from "../../hooks/useGetEmploymentStatus";
import useGetEmploymentProfile from "../../hooks/useGetEmploymentProfile";

const EditInitialStatusModal = ({ open, onClose, prior }) => {
  const queryClient = useQueryClient();

  const { data: cachedData, isLoading: isLoadingDisplay } =
    useGetEmploymentStatus();

  const { data: employment, isLoading: isLoadingEmployment } =
    useGetEmploymentProfile();

  const [employmentStatus, setEmploymentStatus] = useState({
    present_employment_status: "",
    unemployment_reason: [],
  });

  useEffect(() => {
    setEmploymentStatus({
      present_employment_status:
        cachedData?.data?.present_employment_status || "",
      unemployment_reason: cachedData?.data?.unemployment_reason || [],
    });
  }, [cachedData]);

  const mutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosPrivate.put(
        "/profiles/employment_status/",
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
        queryClient.invalidateQueries("employment-profile");
        queryClient.invalidateQueries("employment-status");
        queryClient.invalidateQueries("profile-me");

        setMessage("Employment Status modified successfully");
        setSeverity("success");
      },
    }
  );

  const { isLoading, isError, error, isSuccess } = mutation;

  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(prior);
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (employmentStatus?.present_employment_status == "") {
      setMessage("All Fields are required to answer");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const data = {
      present_employment_status: employmentStatus?.present_employment_status,
      unemployment_reason: employmentStatus?.unemployment_reason,
    };

    // Set Unemployment Reasons to blank if employed
    if (
      employmentStatus?.present_employment_status != "unemployed" &&
      employmentStatus?.present_employment_status != "unable to work" &&
      employmentStatus?.present_employment_status != "never been employed"
    )
      data.unemployment_reason = [];

    // Throw an error if there's no chosen reason
    if (
      (employmentStatus?.present_employment_status == "unemployed" ||
        employmentStatus?.present_employment_status == "never been employed" ||
        employmentStatus?.present_employment_status == "unable to work") &&
      data.unemployment_reason.length == 0
    ) {
      setMessage("The Unemployment Reason is required");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    if (
      employmentStatus?.present_employment_status == "never been employed" &&
      employment?.data?.employments.length > 0
    ) {
      setMessage(
        "You have an Employment Record in your profile. Please modify your employment records first."
      );
      setSeverity("error");
      setOpenSnackbar(true);
      console.log(employment?.data?.employments.length);
      return;
    }

    if (
      (employmentStatus?.present_employment_status == "unemployed" ||
        employmentStatus?.present_employment_status == "unable to work" ||
        employmentStatus?.present_employment_status == "never been employed") &&
      employment?.data?.employments.some((emp) => emp?.date_end === null)
    ) {
      setMessage(
        "You have an Active Job in the record. Please modify your employment records first."
      );
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // Convert the object to a JSON string
    const payload = JSON.stringify(data);

    await mutation.mutateAsync(payload);

    setOpenSnackbar(true);

    setDone(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const unemploymentOptions = [
    {
      value: "demand-deficient unemployment",
      label: "Demand-Deficient Unemployment",
      tooltip:
        "Insufficient demand, more job seekers than available positions.",
      icon: <MoneyOff />,
    },
    {
      value: "advances in technology",
      label: "Advances in Technology",
      tooltip:
        "Job displacement due to technological progress, requiring retraining.",
      icon: <Computer />,
    },
    {
      value: "job outsourcing",
      label: "Job Outsourcing",
      tooltip:
        "Company shifts operations abroad for lower labor costs, impacting employment.",
      icon: <FlightTakeoff />,
    },
    {
      value: "voluntary",
      label: "Voluntary Leave",
      tooltip:
        "Voluntary exit from workforce, financial stability enables selective job search.",
      icon: <DirectionsWalk />,
    },
    {
      value: "relocation",
      label: "Relocation",
      tooltip: "Unemployment due to relocation; job search in a new location.",
      icon: <LocationCity />,
    },
    {
      value: "new force",
      label: "Newly Entering the Workforce",
      tooltip:
        "Graduates entering job market; seeking roles matching qualifications.",
      icon: <School />,
    },
    {
      value: "reenter force",
      label: "Re-Entering the Workforce",
      tooltip:
        "Returning to work after a hiatus; reasons include family responsibilities.",
      icon: <Loop />,
    },
  ];

  const employmentOptions = [
    {
      value: "employed",
      title: "Employed",
      tooltip: "Currently engaged in work or occupation.",
    },
    {
      value: "self-employed",
      title: "Self-employed",
      tooltip:
        "Working independently, managing one's own business or profession.",
    },
    {
      value: "never been employed",
      title: "Never Been Employed",
      tooltip: "Fresh candidate seeking first employment opportunity.",
    },
    {
      value: "unemployed",
      title: "Unemployed",
      tooltip: "Temporarily out of work, actively seeking new opportunities.",
    },
    {
      value: "unable to work",
      title: "Unable to Work",
      tooltip:
        "Not actively seeking employment and currently unable to participate in the workforce.",
    },
  ];

  // Render the MenuItems using the employmentOptions array
  const menuItems = employmentOptions.map((option) => (
    <MenuItem key={option.value} value={option.value}>
      <Tooltip title={option.tooltip}>{option.title}</Tooltip>
    </MenuItem>
  ));

  if (isLoadingDisplay || isLoadingEmployment) {
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

  return (
    <Dialog open={open} width={"70vw"}>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <Box sx={{ position: "relative", top: 0 }}>
        {isLoading && <LinearProgress />}
        {!isLoading && <Box sx={{ height: 4 }} />}
      </Box>
      <DialogTitle width={"40vw"}>
        {!done && "Initially"} Set Employment Status
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={2}>
          <Grid item xs={12}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Employment Status</InputLabel>
              <Select
                name="employment_status"
                value={employmentStatus?.present_employment_status || ""}
                onChange={(event) => {
                  setEmploymentStatus({
                    ...employmentStatus,
                    present_employment_status: event.target.value,
                  });
                }}
                input={<OutlinedInput label="Employment Status" />}
              >
                {menuItems}
              </Select>
            </FormControl>
          </Grid>
          {employmentStatus?.present_employment_status == "unemployed" ||
          employmentStatus?.present_employment_status == "unable to work" ||
          employmentStatus?.present_employment_status ==
            "never been employed" ? (
            <Grid item xs={12}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel>Unemployment Reasons</InputLabel>
                <Select
                  labelId="Unemployment Reasons"
                  multiple
                  value={employmentStatus?.unemployment_reason || []}
                  input={<OutlinedInput label="Unemployment Reasons" />}
                  onChange={(event) => {
                    setEmploymentStatus({
                      ...employmentStatus,
                      unemployment_reason: event.target.value,
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
                        const selectedOption = unemploymentOptions.find(
                          (option) => option.value === value
                        );
                        if (selectedOption) {
                          return (
                            <Tooltip title={selectedOption.tooltip}>
                              <Chip
                                key={value}
                                label={selectedOption.label}
                                icon={selectedOption.icon}
                              />
                            </Tooltip>
                          );
                        }
                        return null; // Handle cases where the option with the selected value doesn't exist
                      })}
                    </Box>
                  )}
                >
                  {unemploymentOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Tooltip title={option.tooltip}>{option.label}</Tooltip>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ) : null}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Tooltip
          title="Will only be available when this is all filled up"
          disableHoverListener={done}
        >
          <Button
            onClick={() => {
              if (done) {
                onClose();
              }
            }}
          >
            Done
          </Button>
        </Tooltip>
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

export default EditInitialStatusModal;
