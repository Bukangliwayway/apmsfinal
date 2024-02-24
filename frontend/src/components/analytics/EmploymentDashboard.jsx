import { Box, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import ClassificationEmploymentRate from "./ClassificationEmploymentRate";
import SelectCohorts from "./SelectCohorts";
import SalaryTrend from "./SalaryTrend";
import WorkAlignmentLine from "./WorkAlignmentLine";
import OverallPie from "./OverallPie";
import { useNavigate } from "react-router-dom";

const EmploymentDashboard = () => {
  const navigate = useNavigate();

  return (
    <Grid
      container
      sx={{ display: "flex", flexDirection: "row", height: "93vh" }}
    >
      <Grid item xs={3} p={1} pr={0.5} pt={1}>
        <Box
          sx={{
            height: "100%",
            backgroundColor: (theme) => theme.palette.common.main,
          }}
        >
          <SelectCohorts type={"EmploymentRate"} />
        </Box>
      </Grid>
      <Grid container item xs={9} height="100%">
        <Grid item xs={4} height={"50%"}>
          <Grid item xs={12} p={0.5} pt={1} height={"50%"}>
            <Box
              sx={{
                backgroundColor: (theme) => theme.palette.common.main,
                overflow: "hidden",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.light,
                },
              }}
              onClick={() => navigate("/dashboard/employertype")}
              height={"100%"}
            >
              <OverallPie type={"employer type"} />
            </Box>
          </Grid>
          <Grid item xs={12} p={0.5} height={"50%"}>
            <Box
              height={"100%"}
              sx={{
                backgroundColor: (theme) => theme.palette.common.main,
                overflow: "hidden",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.light,
                },
              }}
              onClick={() => navigate("/dashboard/employmentcontract")}
            >
              <OverallPie type={"employment contract"} />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={8} p={1} pb={0.5} pl={0.5} height={"50%"}>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              overflow: "hidden",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.light,
              },
            }}
            onClick={() => navigate("/dashboard/workalignment")}
            height="100%"
          >
            <WorkAlignmentLine />
          </Box>
        </Grid>
        <Grid item xs={6} p={0.5} pb={1} height={"50%"}>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              overflow: "hidden",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.light,
              },
            }}
            onClick={() => navigate("/dashboard/salarytrend")}
            height="100%"
          >
            <SalaryTrend />
          </Box>
        </Grid>
        <Grid item xs={6} p={0.5} pt={0.5} pl={0.5} pb={1} height={"50%"}>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              overflow: "hidden",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.light,
              },
            }}
            onClick={() => navigate("/dashboard/jobclassification")}
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
