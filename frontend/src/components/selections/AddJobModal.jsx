import { useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useClassifications from "../../hooks/useClassifications";

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
} from "@mui/material";
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

const AddJob = ({ open, onClose }) => {
  const { setMessage, setSeverity, setOpenSnackbar, setLinearLoading } =
    useAll();

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
      await axiosPrivate.post(`/selections/jobs/`, newProfile, axiosConfig);
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
      },
      onSuccess: () => {
        queryClient.invalidateQueries("jobs-all");
        queryClient.invalidateQueries("jobs-specific");
        queryClient.invalidateQueries("profile-me");

        setMessage("Job Added Successfully");
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

  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      jobProfile.name == "" ||
      !jobProfile?.classification_ids ||
      jobProfile.classification_ids.length === 0
    ) {
      setMessage("please fill out all of the fields.");
      setSeverity("error");
      setOpenSnackbar(true);
      return; // Prevent form submission
    }

    const data = [
      {
        name: jobProfile?.name,
        classification_ids: jobProfile?.classification_ids,
      },
    ];

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

  const classifications = cachedData?.data;

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Job</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={2}>
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

export default AddJob;
