import { useMutation, useQueryClient, useQuery } from "react-query";
import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Skeleton,
} from "@mui/material";
import useAll from "../../hooks/utilities/useAll";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import useGetCommentSpecific from "../../hooks/feeds/useGetCommentSpecific";
import { Close } from "@mui/icons-material";

const EditCommentModal = ({ open, onClose, commentID, exit = false }) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: cachedData, isLoading: isLoadingComment } =
    useGetCommentSpecific(commentID);


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
      await axiosPrivate.put(
        `/posts/comment/${commentID}`,
        comment,
        axiosConfig
      );
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
        queryClient.invalidateQueries((queryKey, queryFn) => {
          return queryKey.includes("comment-specific");
        });
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
  if (isLoadingComment)
    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <Box display="flex" alignItems="center">
          <Skeleton variant="rectangular" width="100%" height={40} />
        </Box>
        <Box>
          <Skeleton variant="rectangular" width="100%" height={200} />
        </Box>
        <Box marginTop={2}>
          <Skeleton variant="rectangular" width="100%" height={50} />
        </Box>
      </Dialog>
    );

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>Edit Comment</Box>
          <Box>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <FormContainer
          defaultValues={{ comment: cachedData?.data?.comment }}
          onSuccess={async (data) => {
            setLinearLoading(true); // Set loading state for the current feed
            const payload = new FormData();
            payload.append("content", data?.comment);
            await mutation.mutateAsync(payload);
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextFieldElement
              defaultValue="Default Comment" // Set your default comment value here
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

export default EditCommentModal;
