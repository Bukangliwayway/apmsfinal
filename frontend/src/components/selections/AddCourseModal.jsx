import { useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import {
  Box,
  Button,
  Dialog,
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
  Chip,
  FormControlLabel,
  Switch,
} from "@mui/material";
import useClassifications from "../../hooks/useClassifications";
import useAll from "../../hooks/utilities/useAll";

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

const AddCourse = ({ open, onClose }) => {
  const {
    auth,
    setMessage,
    setSeverity,
    setOpenSnackbar,
    setLinearLoading,
    linearLoading,
  } = useAll();
  const queryClient = useQueryClient();
  const { data: classificationsData, isLoading: isLoadingClassification } =
    useClassifications();

  const [courseProfile, setCourseProfile] = useState({
    name: "",
    code: "",
    classification_ids: [],
  });
  const [classificationIds, setClassificationIds] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const handleChangeSelect = (event) => {
    const {
      target: { value },
    } = event;
    setClassificationIds(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    setCourseProfile((prevProfile) => ({
      ...prevProfile,
      classification_ids: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourseProfile((prevProfile) => ({
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
        `/selections/courses/`,
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
        queryClient.invalidateQueries("courses");
        queryClient.invalidateQueries("courses-all");
        queryClient.invalidateQueries("courses-specific");
        queryClient.invalidateQueries("profile-me");

        setMessage("Course Added Successfully");
        setSeverity("success");
        onClose();
      },
      onSettled: () => {
        setLinearLoading(false);
        setOpenSnackbar(true);
      },
    }
  );

  const { isLoading, isError, error, isSuccess } = mutation;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      courseProfile.name == "" ||
      !courseProfile?.classification_ids ||
      courseProfile.classification_ids.length === 0
    ) {
      setMessage("please fill out all of the fields.");
      setSeverity("error");
      setOpenSnackbar(true);
      return; // Prevent form submission
    }

    const data = {
      name: courseProfile?.name,
      in_pupqc: courseProfile?.in_pupqc,
      code: courseProfile?.code,
      classification_ids: courseProfile?.classification_ids,
    };

    // Convert the object to a JSON string
    const payload = JSON.stringify(data);

    setLinearLoading(true);
    await mutation.mutateAsync(payload);
  };


  if (isLoadingClassification) {
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
        </DialogContent>
      </Dialog>
    );
  }

  const classifications = classificationsData?.data;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Course</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={2}>
          {auth?.role == "admin" && (
            <Grid item xs={12}>
              <FormControlLabel
                required
                control={
                  <Switch
                    name="in_pupc"
                    value={courseProfile?.in_pupqc}
                    checked={courseProfile?.in_pupqc}
                    onChange={(event) => {
                      const { checked } = event.target;
                      setCourseProfile((prevProfile) => ({
                        ...prevProfile,
                        in_pupqc: checked,
                      }));
                    }}
                  />
                }
                label="Course for PUPQC"
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Course Name"
              value={courseProfile?.name}
              onChange={handleChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="code"
              label="Course Code"
              value={courseProfile?.code}
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
                {classifications?.map((classification) => (
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
  );
};

export default AddCourse;
