import { Box, Grid, Stack } from "@mui/material";
import React from "react";
import ClassificationEmploymentRate from "./ClassificationEmploymentRate";
import SelectCohorts from "./SelectCohorts";
import SalaryTrend from "./SalaryTrend";
import WorkAlignmentLine from "./WorkAlignmentLine";

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
            height: "50%",
            backgroundColor: (theme) => theme.palette.common.main,
          }}
        >
          <WorkAlignmentLine />
        </Box>
        <Stack
          direction="row"
          sx={{
            height: "50%",
            backgroundColor: (theme) => theme.palette.common.main,
          }}
        >
          <Box sx={{ width: "50%" }}>
            <SalaryTrend />
          </Box>
          <Box sx={{ width: "50%" }}>
            <ClassificationEmploymentRate />
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default EmploymentDashboard;
