import {
  AppBar,
  Box,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountMenu from "../ui/AccountMenu";
import {
  School,
  ModeNight,
  LightMode,
} from "@mui/icons-material/";
import useAll from "../../hooks/utilities/useAll";

const Navbar = () => {
  const { mode, setMode } = useAll();

  return (

    <AppBar p={2} position="sticky" sx={{bgcolor: "#182433"}}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <School sx={{ display: { xs: "block", sm: "none" } }} />
        <Typography
          variant="h5"
          sx={{ display: { xs: "none", sm: "block" }, fontWeight: 700 }}
        >
          PUPQC APMS
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            sx={{ cursor: "pointer" }} // Add cursor style to indicate it's clickable
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
