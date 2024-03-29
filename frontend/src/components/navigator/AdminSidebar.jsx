import {
  AccountCircle,
  Announcement,
  Article,
  Business,
  BusinessCenter,
  CheckCircle,
  CloudUpload,
  Event,
  Group,
  GroupAdd,
  HowToReg,
  Hub,
  Label,
  MenuBook,
  MonetizationOn,
  Payment,
  People,
  Person,
  PieChart,
  Public,
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
    posts: false,
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
      <List>
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
                    fontSize: mode && "2rem",
                    textAlign: "center",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight={"bold"}>
                    Dashboard
                  </Typography>
                }
                style={
                  mode
                    ? { visibility: "hidden", opacity: 0 }
                    : { visibility: "visible", opacity: 1 }
                }
              />
            </ListItemButton>
          </ListItem>
        </RouterLink>
        {!mode && (
          <Collapse in={open?.dashboard || false}>
            <List component="Box">
              <RouterLink
                to="/dashboard/employments"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <BusinessCenter sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"bold"}>
                          Employments
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
                      <People sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"bold"}>
                          Profiles
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
          to="/pup-feeds"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={!mode ? () => handleClick("posts") : undefined}
            >
              <ListItemIcon sx={centerFlex}>
                <Hub
                  sx={{
                    fontSize: mode && "2rem",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight={"bold"}>
                    PUP Feeds
                  </Typography>
                }
                style={
                  mode
                    ? { visibility: "hidden", opacity: 0 }
                    : { visibility: "visible", opacity: 1 }
                }
              />
            </ListItemButton>
          </ListItem>
        </RouterLink>
        {!mode && (
          <Collapse in={open?.posts || false}>
            <List component="Box">
              <RouterLink
                to="/pup-feeds/announcement"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <Announcement sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"bold"}>
                          Announcements
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
            </List>
            <List component="Box">
              <RouterLink
                to="/pup-feeds/news"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <Article sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"bold"}>
                          News
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
            </List>
            <List component="Box">
              <RouterLink
                to="/pup-feeds/event"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <Event sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"bold"}>
                          Events
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </RouterLink>
            </List>
            <List component="Box">
              <RouterLink
                to="/pup-feeds/fundraising"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <MonetizationOn sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"bold"}>
                          Fundraising
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
                  fontSize: mode && "2rem",
                  textAlign: "center",
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" fontWeight={"bold"}>
                  Accounts
                </Typography>
              }
              style={
                mode
                  ? { visibility: "hidden", opacity: 0 }
                  : { visibility: "visible", opacity: 1 }
              }
            />
          </ListItemButton>
        </RouterLink>
        {!mode && (
          <Collapse in={open?.accounts || false}>
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
                        <Typography variant="body1" fontWeight={"bold"}>
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
                        <Typography variant="body1" fontWeight={"bold"}>
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
                        <Typography variant="body1" fontWeight={"bold"}>
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
                        <Typography variant="body1" fontWeight={"bold"}>
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
                        <Typography variant="body1" fontWeight={"bold"}>
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
                        <Typography variant="body1" fontWeight={"bold"}>
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
                        <Typography variant="body1" fontWeight={"bold"}>
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
                        <Typography variant="body1" fontWeight={"bold"}>
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
                  fontSize: mode && "2rem",
                  textAlign: "center",
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" fontWeight={"bold"}>
                  Selections
                </Typography>
              }
              style={
                mode
                  ? { visibility: "hidden", opacity: 0 }
                  : { visibility: "visible", opacity: 1 }
              }
            />
          </ListItemButton>
        </RouterLink>
        {!mode && (
          <Collapse in={open?.selections || false}>
            <List component="Box">
              <RouterLink
                to="/selections/classifications"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem disablePadding>
                  <ListItemButton sx={{ ...centerFlex }}>
                    <ListItemIcon sx={{ ...centerFlex, marginLeft: "1rem" }}>
                      <CheckCircle sx={{ textAlign: "center" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={"bold"}>
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
                        <Typography variant="body1" fontWeight={"bold"}>
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
                        <Typography variant="body1" fontWeight={"bold"}>
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
                    fontSize: mode && "2rem",
                    textAlign: "center",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body1" fontWeight={"bold"}>
                    My Profile
                  </Typography>
                }
                style={
                  mode
                    ? { visibility: "hidden", opacity: 0 }
                    : { visibility: "visible", opacity: 1 }
                }
              />
            </ListItemButton>
          </ListItem>
        </RouterLink>
      </List>
    </Box>
  );
}

export default AdminSidebar;
