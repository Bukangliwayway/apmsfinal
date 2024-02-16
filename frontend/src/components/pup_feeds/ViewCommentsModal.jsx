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
import ViewComments from "./ViewComments";

const ViewCommentsModal = ({ open, onClose, postID }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>View Comments</Box>
          <Box>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <ViewComments postID={postID} />
      </DialogContent>
    </Dialog>
  );
};

export default ViewCommentsModal;
