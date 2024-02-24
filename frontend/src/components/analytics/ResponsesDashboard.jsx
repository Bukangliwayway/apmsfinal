import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import React from "react";
import SelectCohorts from "./SelectCohorts";
import RespondentsDataGrid from "./RespondentsDataGrid";
import OverallPie from "./OverallPie";

const ResponsesDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Grid
        container
        sx={{ display: "flex", flexDirection: "row", height: "93vh" }}
      >
        <Grid item xs={3} p={1} pr={0.5}>
          <Box
            sx={{
              height: "100%",
              backgroundColor: (theme) => theme.palette.common.main,
            }}
          >
            <SelectCohorts type={"Profile"} />
          </Box>
        </Grid>
        <Grid container item xs={9} height={"100%"}>
          <Grid container item xs={4} height={"100%"}>
            <Grid item xs={12} height={"25%"} p={0.5} pt={1}>
              <Box
                sx={{
                  backgroundColor: (theme) => theme.palette.common.main,
                  overflow: "hidden",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.primary.light,
                  },
                }}
                onClick={() => navigate("/dashboard/responserate")}
                height={"100%"}
              >
                <OverallPie type={"response rate"} basis={"Profile"} />
              </Box>
            </Grid>
            <Grid item xs={12} height={"25%"} p={0.5}>
              <Box
                sx={{
                  backgroundColor: (theme) => theme.palette.common.main,
                  overflow: "hidden",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.primary.light,
                  },
                }}
                onClick={() => navigate("/dashboard/employmentstatus")}
                height={"100%"}
              >
                <OverallPie type={"employment status"} basis={"Profile"} />
              </Box>
            </Grid>
            <Grid item xs={12} height={"25%"} p={0.5}>
              <Box
                sx={{
                  backgroundColor: (theme) => theme.palette.common.main,
                  overflow: "hidden",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.primary.light,
                  },
                }}
                onClick={() => navigate("/dashboard/gender")}
                height={"100%"}
              >
                <OverallPie type={"gender"} basis={"Profile"} />
              </Box>
            </Grid>
            <Grid item xs={12} height={"25%"} p={0.5} pb={1}>
              <Box
                sx={{
                  backgroundColor: (theme) => theme.palette.common.main,
                  overflow: "hidden",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.primary.light,
                  },
                }}
                onClick={() => navigate("/dashboard/civilstatus")}
                height={"100%"}
              >
                <OverallPie type={"civil status"} basis={"Profile"} />
              </Box>
            </Grid>
          </Grid>

          <Grid item xs={8} p={0.5} pr={1} pb={1} pt={1}>
            <Box
              sx={{
                height: "100%",
                backgroundColor: (theme) => theme.palette.common.main,
                padding: 1,
              }}
            >
              <RespondentsDataGrid />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResponsesDashboard;
