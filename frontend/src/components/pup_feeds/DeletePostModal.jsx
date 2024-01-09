import { useMutation, useQueryClient, useQuery } from "react-query";
import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import useAll from "../../hooks/utilities/useAll";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";


const DeletePostModal = ({ open, onClose, feedID, offset, placing }) => {
  const axiosPrivate = useAxiosPrivate();
  const {
    setMessage,
    setSeverity,
    setOpenSnackbar,
    setLinearLoading,
    linearLoading,
  } = useAll();

  console.log(offset, placing, feedID);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async () => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axiosPrivate.delete(
        `/posts/delete-post/${feedID}`,
        axiosConfig
      );
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["fetch-all-posts", offset, placing]);
        setMessage("Post Deleted Successfully");
        console.log(["fetch-all-posts", offset, placing]);
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
      <DialogTitle>Delete Post</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this post?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
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

export default DeletePostModal;
