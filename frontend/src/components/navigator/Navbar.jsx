import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountMenu from "../ui/AccountMenu";
import {
  School,
  ModeNight,
  LightMode,
  Menu,
  MenuOpen,
} from "@mui/icons-material/";
import useAll from "../../hooks/utilities/useAll";

const Navbar = ({ toggle = false }) => {
  const { mode, setMode, toggleSideBar, setToggleSideBar } = useAll();

  return (
    <AppBar
      p={2}
      position="sticky"
      sx={{ backgroundColor: (theme) => theme.palette.common.main }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{ width: 39, height: 39 }}
            src={
              "https://www.clipartmax.com/png/full/70-708931_the-pup-logo-polytechnic-university-of-the-philippines-logo.png"
            }
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              transition: "visibility  1s", // Include transition for max-width
            }}
            style={
              toggleSideBar
                ? {
                    visibility: "hidden",
                    opacity: 0,
                    width: 0,
                  }
                : {
                    visibility: "visible",
                    opacity: 1,
                    width: "auto", // Use "auto" or a specific width value that suits your layout
                  }
            }
          >
            PUPQC APMS
          </Typography>
          {toggle && (
            <IconButton
              size="large"
              onClick={() => setToggleSideBar(!toggleSideBar)}
            >
              {toggleSideBar ? (
                <Menu sx={{ fontSize: "2rem" }} />
              ) : (
                <MenuOpen sx={{ fontSize: "2rem" }} />
              )}
            </IconButton>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            sx={{ cursor: "pointer", color: "text.primary" }} // Add cursor style to indicate it's clickable
          >
            {!(mode === "light") ? <ModeNight /> : <LightMode />}
          </Box>
          <AccountMenu link="https://ucarecdn.com/c0549749-795b-4ae3-802c-3dfc275aa0b4/-/crop/1190x1000/5,0/-/resize/1035x870/" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
