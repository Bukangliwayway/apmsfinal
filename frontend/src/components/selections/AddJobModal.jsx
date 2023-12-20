import { useMutation, useQueryClient, useQuery } from "react-query";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useTheme } from "@mui/material/styles";
import useClassifications from "../../hooks/useClassifications";

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
  FormControlLabel,
  Switch,
  Skeleton,
  OutlinedInput,
  Chip,
} from "@mui/material";
import useAuth from "../../hooks/useAuth";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AddJob = ({ open, onClose }) => {
  const { auth, setAuth } = useAuth();

  const queryClient = useQueryClient();
  const { data: cachedData, isLoading: isLoadingClassification } =
    useClassifications();
  const [jobProfile, setJobProfile] = useState({
    name: "",
    classification_ids: null,
  });

  const [classificationIds, setClassificationIds] = useState([]);

  const handleChangeSelect = (event) => {
    const {
      target: { value },
    } = event;
    setClassificationIds(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    setJobProfile((prevProfile) => ({
      ...prevProfile,
      classification_ids: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setJobProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const mutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosPrivate.post(
        `/selections/jobs/`,
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
        queryClient.invalidateQueries("jobs-all");
        queryClient.invalidateQueries("jobs-specific");
        queryClient.invalidateQueries("profile-me");

        setMessage("Job Added Successfully");
        setSeverity("success");
      },
    }
  );

  const { isLoading, isError, error, isSuccess } = mutation;

  const axiosPrivate = useAxiosPrivate();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      jobProfile.name == "" ||
      jobProfile.code == "" ||
      !jobProfile?.classification_ids ||
      jobProfile.classification_ids.length === 0
    ) {
      setMessage("please fill out all of the fields.");
      setSeverity("error");
      setOpenSnackbar(true);
      return; // Prevent form submission
    }

    const data = [{
      name: jobProfile?.name,
      certified_job: jobProfile?.certified_job,
      code: jobProfile?.code,
      classification_ids: jobProfile?.classification_ids,
    }];

    // Convert the object to a JSON string
    const payload = JSON.stringify(data);

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

  if (isLoadingClassification) {
    return (
      <Dialog open={true}>
        <DialogTitle>
          <Skeleton variant="text" />
        </DialogTitle>
        <DialogContent sx={{ width: "40vw" }}>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Box>
          <Box>
            <Skeleton variant="rectangular" width="100%" height={50} />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const classifications = cachedData?.data;

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
      <DialogTitle>Add Job</DialogTitle>
      <DialogContent sx={{ width: "40vw" }}>
        <Grid container spacing={2} p={2}>
          {auth?.role == "admin" && (
            <>
              <Grid item xs={12}>
                <FormControlLabel
                  required
                  control={
                    <Switch
                      name="certified_job"
                      value={jobProfile?.certified_job}
                      checked={jobProfile?.certified_job}
                      onChange={(event) => {
                        const { checked } = event.target;
                        setJobProfile((prevProfile) => ({
                          ...prevProfile,
                          certified_job: checked,
                        }));
                      }}
                    />
                  }
                  label="Job to be Included in Analytics"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="code"
                  label="Job Occupational Code"
                  value={jobProfile?.code}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Name"
              value={jobProfile?.name}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Related Classifications</InputLabel>
              <Select
                multiple
                value={classificationIds}
                onChange={handleChangeSelect}
                input={<OutlinedInput label="Related Classifications" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={
                          classifications.find(
                            (classification) => classification.id === value
                          ).name
                        }
                      />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {classifications.map((classification) => (
                  <MenuItem key={classification.id} value={classification.id}>
                    {classification.name}
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

export default AddJob;
