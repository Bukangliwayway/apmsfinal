import {
  AddBox,
  Announcement,
  Article,
  Event,
  MonetizationOn,
} from "@mui/icons-material";
import {
  Grid,
  Box,
  ButtonBase,
  List,
  ListItemButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import AllFeedsContent from "./AllFeedsContent";

const AnnouncementFeed = () => {
  const navigate = useNavigate();
  return (
    <Grid container width={"50%"} mx={"auto"} sx={{ display: "flex", gap: 2 }}>
      <Grid
        item
        xs={12}
        sx={{ backgroundColor: (theme) => theme.palette.common.main }}
      >
        <Card sx={{ display: "flex", flexDirection: "row" }}>
          <ListItem>
            <ListItemButton
              onClick={() => navigate("/pup-feeds/create/announcement")}
            >
              <ListItemIcon>
                <Event />
              </ListItemIcon>
              <ListItemText>Create Announcement Post</ListItemText>
            </ListItemButton>
          </ListItem>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <AllFeedsContent type={"announcement"} />
      </Grid>
    </Grid>
  );
};

export default AnnouncementFeed;
