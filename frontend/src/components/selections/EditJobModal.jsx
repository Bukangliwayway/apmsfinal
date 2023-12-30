import { useMutation, useQueryClient } from "react-query";
import { useState, useEffect } from "react";
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
  DialogContentText,
} from "@mui/material";
import useClassifications from "../../hooks/useClassifications";
import useGetJobSpecific from "../../hooks/selections/useGetJobSpecific";
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

const EditJobModal = ({ open, onClose, jobID }) => {
  const queryClient = useQueryClient();
  const { data: classificationsData, isLoading: isLoadingClassification } =
    useClassifications();

  const [jobProfile, setJobProfile] = useState({
    name: "",
    classification_ids: [],
  });
  const [classificationIds, setClassificationIds] = useState([]);
  const [deletePrompt, setDeletePrompt] = useState(false);
  const {
    setMessage,
    setSeverity,
    setOpenSnackbar,
    setLinearLoading,
    linearLoading,
  } = useAll();

  const axiosPrivate = useAxiosPrivate();

  const {
    data: cachedData,
    isLoading: isLoadingJob,
    isFetching: isFetchingJob,
  } = useGetJobSpecific(jobID);

  useEffect(() => {
    const classifications =
      cachedData?.data?.classifications?.map(
        (item) => item.classification_id
      ) || [];
    if (cachedData) {
      setClassificationIds(
        // On autofill we get a stringified classifications.
        typeof classifications === "string"
          ? classifications.split(",")
          : classifications
      );
      setJobProfile({
        name: cachedData?.data?.job?.name || "",
        classification_ids:
          cachedData?.data?.classifications?.map(
            (item) => item.classification_id
          ) || [],
      });
    }
  }, [cachedData]);

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
      await axiosPrivate.put(
        `/selections/jobs/${jobID}`,
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
        queryClient.invalidateQueries("jobs-all");
        queryClient.invalidateQueries("jobs-specific");
        queryClient.invalidateQueries("profile-me");
        queryClient.invalidateQueries("career-profile");
        queryClient.invalidateQueries("employment-profile");

        setMessage("Job Updated Successfully");
        setSeverity("success");
      },
      onSettled: () => {
        setLinearLoading(false);
        setOpenSnackbar(true);
      },
    }
  );

  const mutationDelete = useMutation(
    async () => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axiosPrivate.delete(`/selections/jobs/${jobID}`, axiosConfig);
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
        queryClient.invalidateQueries("career-profile");
        queryClient.invalidateQueries("employment-profile");

        setMessage("Job Deleted Successfully");
        setSeverity("success");
        onClose();
      },
      onSettled: () => {
        setLinearLoading(false);
        setOpenSnackbar(true);
      },
    }
  );

  const { isLoading } = mutation;

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

    const data = {
      name: jobProfile?.name,
      classification_ids: jobProfile?.classification_ids,
    };
    // Convert the object to a JSON string
    const payload = JSON.stringify(data);

    setLinearLoading(true);
    await mutation.mutateAsync(payload);
  };

  const handleDelete = async () => {
    setLinearLoading(true);
    await mutationDelete.mutateAsync();
  };

if (isLoadingJob || isFetchingJob || isLoadingClassification) {
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
    {!deletePrompt ? (
      <Box>
        <DialogTitle>Edit Job</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} p={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="name"
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
        <DialogActions sx={{ padding: 3 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Box sx={{ display: "flex", ml: "auto" }}>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ mr: 1 }}
            >
              Save
            </Button>
            <Button
              onClick={() => setDeletePrompt(true)}
              variant="contained"
              color="error"
              disabled={isLoading}
            >
              Delete
            </Button>
          </Box>
        </DialogActions>
      </Box>
    ) : (
      <Box>
        <DialogTitle>Delete Achievement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this achievement?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletePrompt(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={linearLoading}
          >
            Delete
          </Button>
        </DialogActions>
      </Box>
    )}
  </Dialog>
)
};

export default EditJobModal;
