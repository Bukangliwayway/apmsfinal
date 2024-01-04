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
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const MainFeed = () => {
  const navigate = useNavigate();
  return (
    <Grid container width={"75%"} mx={"auto"} sx={{ display: "flex", gap: 2 }}>
      <Grid
        item
        xs={12}
        sx={{ backgroundColor: (theme) => theme.palette.common.main }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <ListItem>
            <ListItemButton onClick={() => navigate("create")}>
              <ListItemIcon>
                <AddBox />
              </ListItemIcon>
              <ListItemText>Create Post</ListItemText>
            </ListItemButton>
          </ListItem>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <ListItem>
              <ListItemIcon>
                <ListItemButton onClick={() => navigate("create")}>
                  <Announcement />
                </ListItemButton>
              </ListItemIcon>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={() => navigate("create")}>
                <Article />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={() => navigate("create")}>
                <Event />
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton onClick={() => navigate("create")}>
                <MonetizationOn />
              </ListItemButton>
            </ListItem>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MainFeed;
