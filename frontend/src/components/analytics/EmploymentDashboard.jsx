import { Box, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import ClassificationEmploymentRate from "./ClassificationEmploymentRate";
import SelectCohorts from "./SelectCohorts";
import SalaryTrend from "./SalaryTrend";
import WorkAlignmentLine from "./WorkAlignmentLine";
import OverallPie from "./OverallPie";

const EmploymentDashboard = () => {
  return (
    <Grid
      container
      sx={{ display: "flex", flexDirection: "row", height: "92vh" }}
      px={1}
    >
      <Grid
        item
        xs={3}
        height="100%"
        sx={{ backgroundColor: (theme) => theme.palette.common.main }}
      >
        <SelectCohorts type={"EmploymentRate"} />
      </Grid>
      <Grid container item xs={9}>
        <Grid container item xs={3}>
          <Grid
            item
            xs={12}
            m={1}
            mr={0.5}
            mb={0.5}
            height={"21.9vh"}
            sx={{ backgroundColor: (theme) => theme.palette.common.main }}
          >
            <Typography
              variant="subtitle2"
              sx={{ textAlign: "center", fontWeight: "800" }}
            >
              Employer Type
            </Typography>
            <Box height={"18vh"}>
              <OverallPie type={"employer type"} />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            m={1}
            mr={0.5}
            mt={0.5}
            mb={0.5}
            height={"21.9vh"}
            sx={{ backgroundColor: (theme) => theme.palette.common.main }}
          >
            <Typography
              variant="subtitle2"
              sx={{ textAlign: "center", fontWeight: "800" }}
            >
              Employment Contract
            </Typography>
            <Box height={"18vh"}>
              <OverallPie type={"employment contract"} />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={9} p={1} pb={0.5} pl={0.5} height={"50%"}>
          <Box
            sx={{ backgroundColor: (theme) => theme.palette.common.main }}
            height="100%"
          >
            <WorkAlignmentLine />
          </Box>
        </Grid>
        <Grid item xs={6} p={1} pt={0.5} pr={0.5} pb={0} height={"50%"}>
          <Box
            sx={{ backgroundColor: (theme) => theme.palette.common.main }}
            height="100%"
          >
            <SalaryTrend />
          </Box>
        </Grid>
        <Grid item xs={6} p={1} pt={0.5} pl={0.5} pb={0} height={"50%"}>
          <Box
            sx={{ backgroundColor: (theme) => theme.palette.common.main }}
            height="100%"
          >
            <ClassificationEmploymentRate />
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default EmploymentDashboard;
