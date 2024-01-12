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
import { useNavigate } from "react-router-dom";


const DeletePostModal = ({ open, onClose, feedID, exit = false}) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    setMessage,
    setSeverity,
    setOpenSnackbar,
    setLinearLoading,
    linearLoading,
  } = useAll();

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
        queryClient.invalidateQueries(["fetch-all-posts", 'all']);
        queryClient.invalidateQueries(["fetch-all-posts", 'event']);
        queryClient.invalidateQueries(["fetch-all-posts", 'announcement']);
        queryClient.invalidateQueries(["fetch-all-posts", 'event']);
        queryClient.invalidateQueries(["fetch-all-posts", 'news']);
        queryClient.invalidateQueries(["post-specific", feedID]);
        setMessage("Post Deleted Successfully");
        setSeverity("success");
        if(exit) navigate("/pup-feeds")
        onClose();
      },
      onSettled: () => {
        setLinearLoading(false);
        setOpenSnackbar(true);
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
