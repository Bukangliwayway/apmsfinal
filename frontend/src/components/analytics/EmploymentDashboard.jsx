import { Box, Grid } from "@mui/material";
import React from "react";
import ClassificationEmploymentRate from "./ClassificationEmploymentRate";
import CourseEmploymentRate from "./CourseEmploymentRate";
import SelectCohorts from "./SelectCohorts";

const EmploymentDashboard = () => {
  return (
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
          <SelectCohorts type={"EmploymentRate"} />
        </Box>
      </Grid>
      <Grid item xs={9} p={1} pl={0.5}>
        <Box
          sx={{
            height: "100%",
            backgroundColor: (theme) => theme.palette.common.main,
          }}
        >
          <ClassificationEmploymentRate solo={true} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default EmploymentDashboard;
