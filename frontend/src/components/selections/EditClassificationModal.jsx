import { useMutation, useQueryClient, useQuery } from "react-query";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Skeleton,
  DialogContentText,
} from "@mui/material";
import useAll from "../../hooks/utilities/useAll";

const EditClassificationModal = ({ open, onClose, classificationID }) => {
  const queryClient = useQueryClient();

  const getData = async () => {
    return await axiosPrivate.get(
      `/selections/classifications/${classificationID}`
    );
  };

  const { data: cachedData, isLoading: isLoadingClassification } = useQuery(
    "classification-specific",
    getData
  );
  const [classificationProfile, setClassificationProfile] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const [deletePrompt, setDeletePrompt] = useState(false);
  const {
    setMessage,
    setSeverity,
    setOpenSnackbar,
    setLinearLoading,
    linearLoading,
  } = useAll();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  useEffect(() => {
    if (cachedData) {
      setClassificationProfile({
        name: cachedData?.data?.name || "",
        code: cachedData?.data?.code || "",
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
      await axiosPrivate.put(
        `/selections/classifications/${classificationID}`,
        newProfile,
        axiosConfig
      );
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
      },
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("classifications-all");
        queryClient.invalidateQueries("classifications-specific");
        queryClient.invalidateQueries("profile-me");

        setMessage("Classification Update Successfully");
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
      await axiosPrivate.delete(
        `/selections/classifications/${classificationID}`,
        axiosConfig
      );
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
      },
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("classifications-all");
        queryClient.invalidateQueries("classifications-specific");
        queryClient.invalidateQueries("profile-me");

        setMessage("classification deleted successfully");
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setClassificationProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (classificationProfile.name == "" || classificationProfile.code == "") {
      setMessage("please fill out all of the fields.");
      setSeverity("error");
      setOpenSnackbar(true);

      return; // Prevent form submission
    }

    const data = {
      name: classificationProfile?.name,
      code: classificationProfile?.code,
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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      {!deletePrompt ? (
        <Box>
          <DialogTitle>Modify Classification</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} p={2}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="name"
                  value={classificationProfile?.name}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="code"
                  label="code"
                  value={classificationProfile?.code}
                  onChange={handleChange}
                  sx={{ width: "100%" }}
                />
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
              disabled={isLoadingDelete}
            >
              Delete
            </Button>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
};

export default EditClassificationModal;
