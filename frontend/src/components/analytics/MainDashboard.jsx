import { Box, Card, Grid } from "@mui/material";
import React from "react";
import AlumniResponseRate from "./OverallResponseRate";
import JobClassificationEmploymentRate from "./JobClassificationEmploymentRate";
import WorkAllignmentCourse from "./WorkAllignmentCourse";
import CourseLowestResponseRate from "./CourseLowestResponseRate";
import EmploymentRatePerCourse from "./EmploymentRatePerCourse";
import CourseEmploymentRateOverTime from "./EmploymentRateOverTime";
import OverallEmployerType from "./OverallEmployerType";
import OverallMonthlyIncome from "./OverallMonthlyIncome";
import OverallGender from "./OverallGender";
import OverallCivilStatus from "./OverallCivilStatus";
import OverallEmploymentStatus from "./OverallEmploymentStatus";
import OverallEmploymentContract from "./OverallEmploymentContract";

const MainDashboard = () => {
  return (
    <Box
      p={{ sm: 4, md: 1 }}
      sx={{
        backgroundColor: (theme) => theme.palette.secondary.main,
        display: "flex",
        gap: 1,
        height: "100%",
        flexDirection: "column",
      }}
    >
      <Grid container sx={{ display: "flex", gap: 1 }}>
        <Grid item xs={3} container sx={{ display: "flex", gap: 1 }}>
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              height: "23vh",
            }}
          >
            <AlumniResponseRate />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              height: "33vh",
            }}
          >
            <CourseLowestResponseRate />
          </Grid>
        </Grid>
        <Grid item xs={5.41} container sx={{ display: "flex", gap: 1 }}>
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              height: "28vh",
            }}
          >
            <WorkAllignmentCourse />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              height: "28vh",
            }}
          >
            <CourseEmploymentRateOverTime />
          </Grid>
        </Grid>
        <Grid item container xs={3.41}>
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              height: "56vh" + "1rem",
            }}
          >
            <EmploymentRatePerCourse />
          </Grid>
        </Grid>
      </Grid>
      <Grid container sx={{ display: "flex", gap: 1, height: "100%" }}>
        <Grid
          item
          xs={12}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "30vh",
          }}
        >
          <JobClassificationEmploymentRate />
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          display: "flex",
          gap: 1,
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <OverallMonthlyIncome />
        </Grid>
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <OverallGender />
        </Grid>
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <OverallCivilStatus />
        </Grid>
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <OverallEmploymentStatus />
        </Grid>
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <OverallEmploymentContract />
        </Grid>
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <OverallEmployerType />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainDashboard;
