import { Box, Card, Grid, Typography } from "@mui/material";
import React from "react";
import AlumniResponseRate from "./OverallResponseRate";
import ClassificationEmploymentRate from "./ClassificationEmploymentRate";
import WorkAlignmentOverTime from "./WorkAlignmentOverTime";
import CourseLowestResponseRate from "./CourseLowestResponseRate";
import CourseEmploymentRate from "./CourseEmploymentRate";
import EmploymentCountOverTime from "./EmploymentCountOverTime";
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
            <Typography
              variant="subtitle2"
              sx={{ textAlign: "center", fontWeight: "800" }}
            >
              Overall Response Rate
            </Typography>
            <Box height={"19vh"}>
              <AlumniResponseRate />
            </Box>
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
            <WorkAlignmentOverTime />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              height: "28vh",
            }}
          >
            <EmploymentCountOverTime />
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
            <CourseEmploymentRate />
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
          <ClassificationEmploymentRate />
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
          <Typography
            variant="subtitle2"
            sx={{ textAlign: "center", fontWeight: "800" }}
          >
            Overall Employment Status
          </Typography>
          <Box height={"25vh"}>
            <OverallEmploymentStatus />
          </Box>
        </Grid>
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ textAlign: "center", fontWeight: "800" }}
          >
            Overall Gender
          </Typography>
          <Box height={"25vh"}>
            <OverallGender />
          </Box>
        </Grid>
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ textAlign: "center", fontWeight: "800" }}
          >
            Overall Civil Status
          </Typography>
          <Box height={"25vh"}>
            <OverallCivilStatus />
          </Box>
        </Grid>
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ textAlign: "center", fontWeight: "800" }}
          >
            Overall Monthly Income
          </Typography>
          <Box height={"25vh"}>
            <OverallMonthlyIncome />
          </Box>
        </Grid>
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ textAlign: "center", fontWeight: "800" }}
          >
            Overall Employment Contract
          </Typography>
          <Box height={"25vh"}>
            <OverallEmploymentContract />
          </Box>
        </Grid>
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ textAlign: "center", fontWeight: "800" }}
          >
            Overall Employer Type
          </Typography>
          <Box height={"25vh"}>
            <OverallEmployerType />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainDashboard;
