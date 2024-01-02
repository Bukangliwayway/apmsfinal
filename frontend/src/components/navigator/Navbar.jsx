import { AppBar, Avatar, Box, Toolbar, Typography } from "@mui/material";
import AccountMenu from "../ui/AccountMenu";
import { School, ModeNight, LightMode } from "@mui/icons-material/";
import useAll from "../../hooks/utilities/useAll";

const Navbar = () => {
  const { mode, setMode } = useAll();

  return (
    <AppBar
      p={2}
      position="sticky"
      sx={{ backgroundColor: (theme) => theme.palette.common.main }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Avatar
            sx={{ width: 32, height: 32, mr: 1 }}
            src={
              "https://www.clipartmax.com/png/full/70-708931_the-pup-logo-polytechnic-university-of-the-philippines-logo.png"
            }
          />
          <Typography
            variant="h5"
            sx={{
              display: { xs: "none", sm: "block" },
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            PUPQC APMS
          </Typography>
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
