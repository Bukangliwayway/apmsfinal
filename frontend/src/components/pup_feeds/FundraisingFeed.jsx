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

const FundraisingFeed = () => {
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
              onClick={() => navigate("/pup-feeds/create/fundraising")}
            >
              <ListItemIcon>
                <MonetizationOn />
              </ListItemIcon>
              <ListItemText>Create Fundraising Post</ListItemText>
            </ListItemButton>
          </ListItem>
        </Card>
      </Grid>
    </Grid>
  );
};

export default FundraisingFeed;
