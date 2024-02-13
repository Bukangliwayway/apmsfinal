import { useMutation, useQueryClient, useQuery } from "react-query";
import React from "react";
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

// DIKO NA KAYAA T^T ODITS RUN MO MUNA SYA SA ALLFEEDSCONTENT CREATE A SKELETON NGA PALA HERE AND THEN UNG SA PAGMAP SIEMPRE MALALAMAN MO UN OCNE NAGRUN NA UNG QUERY

const LikersListModal = ({ open, onClose, postID }) => {
  const { data: likersData, isLoading: isLikersLoading } = useGetLikes(postID);
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>People who Liked this Post</Box>
          <Box>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <List>
          {likersData?.data?.map((details) => (
            <>
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    alt="Profile"
                    src={details?.profile_picture}
                    sx={{ width: "40px", height: "40px" }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={details?.first_name + " " + details?.last_name}
                  secondary={details?.code + " - " + details?.batch_year}
                />
              </ListItem>
            </>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default LikersListModal;
