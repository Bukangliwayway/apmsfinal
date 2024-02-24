import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import React from "react";
import SelectCohorts from "./SelectCohorts";
import RespondentsDataGrid from "./RespondentsDataGrid";
import OverallPie from "./OverallPie";

const ResponsesDashboard = () => {
  return (
    <Box>
      <Grid
        container
        sx={{ display: "flex", flexDirection: "row", height: "90vh" }}
      >
        <Grid item xs={3} p={1} pr={0.5}>
          <Box
            sx={{
              height: "100%",
              backgroundColor: (theme) => theme.palette.common.main,
            }}
          >
            <SelectCohorts type={"ResponseRate"} />
          </Box>
        </Grid>
        <Grid container item xs={9} height={"100%"}>
          <Grid container item xs={4} height={"100%"}>
            <Grid item xs={12} height={"25%"} p={0.5} pt={1}>
              <Box
                sx={{
                  height: "100%",
                  backgroundColor: (theme) => theme.palette.common.main,
                }}
              >
                <OverallPie type={"response rate"} basis={"ResponseRate"} />
              </Box>
            </Grid>
            <Grid item xs={12} height={"25%"} p={0.5}>
              <Box
                sx={{
                  height: "100%",
                  backgroundColor: (theme) => theme.palette.common.main,
                }}
              >
                <OverallPie type={"employment status"} basis={"ResponseRate"} />
              </Box>
            </Grid>
            <Grid item xs={12} height={"25%"} p={0.5}>
              <Box
                sx={{
                  height: "100%",
                  backgroundColor: (theme) => theme.palette.common.main,
                }}
              >
                <OverallPie type={"gender"} basis={"ResponseRate"} />
              </Box>
            </Grid>
            <Grid item xs={12} height={"25%"} p={0.5} pb={1}>
              <Box
                sx={{
                  height: "100%",
                  backgroundColor: (theme) => theme.palette.common.main,
                }}
              >
                <OverallPie type={"civil status"} basis={"ResponseRate"} />
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
