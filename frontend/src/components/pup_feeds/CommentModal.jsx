import { useMutation, useQueryClient, useQuery } from "react-query";
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import useAll from "../../hooks/utilities/useAll";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useGetLikes from "../../hooks/feeds/useGetLikes";
import { Close, Image } from "@mui/icons-material";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";

const CommentModal = ({ open, onClose, postID }) => {
  const queryClient = useQueryClient();
  const axiosPrivate = useAxiosPrivate();

  const {
    setOpenSnackbar,
    setSeverity,
    setMessage,
    linearLoading,
    setLinearLoading,
  } = useAll();

  const mutation = useMutation(
    async (comment) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true, // Set this to true for cross-origin requests with credentials
      };
      await axiosPrivate.post(`/posts/comment/`, comment, axiosConfig);
    },
    {
      onSuccess: (data, variables, context) => {
        setMessage("Comment Posted!");
        setSeverity("success");
        setOpenSnackbar(true);
        queryClient.invalidateQueries((queryKey, queryFn) => {
          return queryKey.includes("post-specific");
        });
        queryClient.invalidateQueries((queryKey, queryFn) => {
          return queryKey.includes("likers");
        });
        queryClient.invalidateQueries((queryKey, queryFn) => {
          return queryKey.includes("fetch-all-posts");
        });
        const allComments = queryClient.getQueryData({queryKey:[
          "fetch-all-comments",
          postID,
        ], refetchType: "all"});
        // refetch({ refetchPage: (page, index) => index === 0 });

        onClose();
      },
      onError: (error) => {
        setMessage(
          error.response ? error.response.data.detail[0].msg : error.message
        );
        setSeverity("error");
        setOpenSnackbar(true);
      },
      onSettled: () => {
        setLinearLoading(false); // Set loading state for the current feed
      },
    }
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>Add Comment</Box>
          <Box>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <FormContainer
          onSuccess={async (data) => {
            setLinearLoading(true); // Set loading state for the current feed
            const payload = new FormData();
            payload.append("content", data?.comment);
            payload.append("post_id", postID);
            await mutation.mutateAsync(payload);
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextFieldElement
              defaultValue=""
              variant="outlined"
              placeholder="Comment"
              name="comment"
              fullWidth
              required
              multiline
              rows={5}
            />
            <Button
              fullWidth
              type="submit" // Assuming FormContainer triggers form submission on button click
              variant="contained"
              color="primary"
              disabled={linearLoading}
            >
              Comment
            </Button>
          </Box>
        </FormContainer>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;
