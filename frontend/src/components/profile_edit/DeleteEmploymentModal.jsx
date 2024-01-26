import { useMutation, useQueryClient } from "react-query";
import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAll from "../../hooks/utilities/useAll";

const DeleteEmploymentModal = ({ open, onClose, employmentID }) => {
  const axiosPrivate = useAxiosPrivate();
  const {
    setMessage,
    setSeverity,
    setOpenSnackbar,
    setLinearLoading,
    linearLoading,
  } = useAll();

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async () => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axiosPrivate.delete(
        `/profiles/employment_profiles/${employmentID}`,
        axiosConfig
      );
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
      },
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("missing-fields");
        queryClient.invalidateQueries("employment-profile");
        queryClient.invalidateQueries("profile-me");

        setMessage("Employment Deleted Successfully");
        setSeverity("success");
      },
      onSettled: () => {
        setLinearLoading(false);
        setOpenSnackbar(true);
        onClose();
      },
    }
  );

  const handleDelete = async () => {
    setLinearLoading(true);
    await mutation.mutateAsync();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Delete Employment Profile</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this employment profile?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
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
    </Dialog>
  );
};

export default DeleteEmploymentModal;
