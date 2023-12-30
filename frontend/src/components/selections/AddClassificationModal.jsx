import { useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from "@mui/material";
import useAll from "../../hooks/utilities/useAll";

const AddClassification = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [classificationProfile, setClassificationProfile] = useState({
    name: "",
    code: "",
  });
  const { setMessage, setSeverity, setOpenSnackbar, setLinearLoading } =
    useAll();
  const axiosPrivate = useAxiosPrivate();

  const mutation = useMutation(
    async (newProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axiosPrivate.post(
        `/selections/classifications/`,
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

        setMessage("Classification Added Successfully");
        setSeverity("success");
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

    if (
      classificationProfile?.name == "" ||
      classificationProfile?.code == ""
    ) {
      setMessage("please fill out all of the fields.");
      setSeverity("error");
      setOpenSnackbar(true);
      return; // Prevent form submission
    }

    const data = [
      {
        name: classificationProfile?.name,
        code: classificationProfile?.code,
      },
    ];

    // Convert the object to a JSON string
    const payload = JSON.stringify(data);

    setLinearLoading(true);
    await mutation.mutateAsync(payload);
  };



  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Classification</DialogTitle>
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

export default AddClassification;
