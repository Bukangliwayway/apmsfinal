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

const DeleteCommentModal = ({ open, onClose, commentID, exit = false }) => {
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
      await axiosPrivate.delete(`/posts/comment/${commentID}`, axiosConfig);
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
      },
      onSuccess: () => {
        queryClient.invalidateQueries((queryKey, queryFn) => {
          return queryKey.includes("post-specific");
        });
        queryClient.invalidateQueries((queryKey, queryFn) => {
          return queryKey.includes("likers");
        });
        queryClient.invalidateQueries((queryKey, queryFn) => {
          return queryKey.includes("fetch-all-posts");
        });
        setMessage("Comment Deleted Successfully");
        setSeverity("success");
        if (exit) navigate("/pup-feeds");
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
      <DialogTitle>Delete Comment</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this comment?
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

export default DeleteCommentModal;
