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
import useAll from "../../hooks/utilities/useAll";

const EventFeed = () => {
  const navigate = useNavigate();
  const { auth } = useAll();

  return (
    <Grid container width={"50%"} mx={"auto"} sx={{ display: "flex", gap: 2 }}>
      <Grid
        item
        xs={12}
        sx={{ backgroundColor: (theme) => theme.palette.common.main }}
      >
        {auth?.role == "admin" && (
          <Card sx={{ display: "flex", flexDirection: "row" }}>
            <ListItem>
              <ListItemButton
                onClick={() => navigate("/pup-feeds/create/event")}
              >
                <ListItemIcon>
                  <Announcement />
                </ListItemIcon>
                <ListItemText>Create Event Post</ListItemText>
              </ListItemButton>
            </ListItem>
          </Card>
        )}
      </Grid>
      <Grid item xs={12}>
        <AllFeedsContent type={"event"} />
      </Grid>
    </Grid>
  );
};

export default EventFeed;
