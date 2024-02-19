import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import React from "react";
import SelectCohorts from "./SelectCohorts";
import RespondentsDataGrid from "./RespondentsDataGrid";

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
        <Grid item xs={9} p={1} pl={0.5}>
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
    </Box>
  );
};

export default ResponsesDashboard;
