import {
  AccountCircle,
  Business,
  CheckCircle,
  CloudUpload,
  Dashboard,
  ExpandLess,
  ExpandMore,
  GroupAdd,
  Home,
  HowToReg,
  Label,
  MenuBook,
  People,
  Person,
  PieChart,
  School,
  Security,
  Settings,
  SpaceDashboard,
  Star,
  Work,
} from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

function AdminSidebar({ mode }) {
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [open, setOpen] = useState({
    dashboard: false,
    selections: false,
    accounts: false,
  });
  const centerFlex = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  const handleClick = (key) => {
    setOpen((prevState) => {
      // If the clicked item is already open, close it
      if (prevState[key]) {
        return { ...prevState, [key]: false };
      }

      // If the clicked item is not open, close all and open the clicked one
      return Object.keys(prevState).reduce((acc, currentKey) => {
        acc[currentKey] = currentKey === key;
        return acc;
      }, {});
    });
  };

  return (
    <Box>
      <List component="Box">
        <RouterLink
          to="/home"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={!mode ? () => handleClick("dashboard") : undefined}
              sx={centerFlex}
            >
              <ListItemIcon sx={centerFlex}>
                <SpaceDashboard
                  sx={{
                    fontSize: mode && "2.5rem",
                    textAlign: "center",
                  }}
                />
              </ListItemIcon>
              {!mode && (
                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight={"bold"}>
                      Dashboard
                    </Typography>
                  }
                />
              )}
            </ListItemButton>
          </ListItem>
        </RouterLink>
        {!mode && (
          <Collapse in={open?.dashboard || false} timeout="auto" unmountOnExit>
            <List component="Box">
              <RouterLink
                to="/dashboard/overalls"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <PieChart sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"800"}>
                          Overalls
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
            </List>
            <List component="Box">
              <RouterLink
                to="/dashboard/classifications"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <Label sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"800"}>
                          Jobs Rate
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
            </List>
            <List component="Box">
              <RouterLink
                to="/dashboard/response-rate"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <CheckCircle sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"800"}>
                          Responses
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
            </List>
          </Collapse>
        )}
        <RouterLink
          to="/selections"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemButton
            selected={selectedIndex === 3}
            onClick={!mode ? () => handleClick("selections") : undefined}
            sx={centerFlex}
          >
            <ListItemIcon sx={centerFlex}>
              <Settings
                sx={{
                  fontSize: mode && "2.5rem",
                  textAlign: "center",
                }}
              />
            </ListItemIcon>
            {!mode && (
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight={"bold"}>
                    Selections
                  </Typography>
                }
              />
            )}
          </ListItemButton>
        </RouterLink>
        {!mode && (
          <Collapse in={open?.selections || false} timeout="auto" unmountOnExit>
            <List component="Box">
              <RouterLink
                to="/selections/classifications"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{ ...centerFlex }}
                  >
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <CheckCircle sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"800"}>
                          Classes
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
              <RouterLink
                to="/selections/courses"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <MenuBook sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"800"}>
                          Courses
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
              <RouterLink
                to="/selections/jobs"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <Business sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"800"}>
                          Jobs
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
            </List>
          </Collapse>
        )}
        <RouterLink
          to="/accounts"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemButton
            selected={selectedIndex === 4}
            onClick={!mode ? () => handleClick("accounts") : undefined}
            sx={centerFlex}
          >
            <ListItemIcon sx={centerFlex}>
              <People
                sx={{
                  fontSize: mode && "2.5rem",
                  textAlign: "center",
                }}
              />
            </ListItemIcon>
            {!mode && (
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight={"bold"}>
                    Accounts
                  </Typography>
                }
              />
            )}
          </ListItemButton>
        </RouterLink>
        {!mode && (
          <Collapse in={open?.accounts || false} timeout="auto" unmountOnExit>
            <List component="Box">
              <RouterLink
                to="/accounts/all-accounts"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <Person sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"800"}>
                          Overall
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
              <RouterLink
                to="/accounts/approve-users"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <HowToReg sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"800"}>
                          Approve
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
              <RouterLink
                to="/accounts/users-accounts"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <GroupAdd sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"800"}>
                          Profiles
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
              <RouterLink
                to="/accounts/upload-educations"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <School sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"800"}>
                          Education
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
              <RouterLink
                to="/accounts/upload-employment"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <Work sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"800"}>
                          Employment
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
              <RouterLink
                to="/accounts/upload-achievements"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <Star sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"800"}>
                          Achivements
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
              <RouterLink
                to="/accounts/upload-twowaylink"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <Security sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"800"}>
                          Unclaimed
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
              <RouterLink
                to="/accounts/upload-history"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <CloudUpload sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"800"}>
                          History
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
            </List>
          </Collapse>
        )}
        <RouterLink
          to="/profile/me"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedIndex === 4}
              onClick={(event) => handleListItemClick(event, 9)}
              sx={centerFlex}
            >
              <ListItemIcon sx={centerFlex}>
                <AccountCircle
                  sx={{
                    fontSize: mode && "2.5rem",
                    textAlign: "center",
                  }}
                />
              </ListItemIcon>
              {!mode && (
                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight={"bold"}>
                      My Profile
                    </Typography>
                  }
                />
              )}
            </ListItemButton>
          </ListItem>
        </RouterLink>
      </List>
    </Box>
  );
}

export default AdminSidebar;
