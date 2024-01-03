import { Box, ButtonBase, Card, Grid, Typography } from "@mui/material";
import React from "react";
import AlumniResponseRate from "./OverallPie";
import ClassificationEmploymentRate from "./ClassificationEmploymentRate";
import WorkAlignmentOverTime from "./WorkAlignmentOverTime";
import CourseLowestResponseRate from "./CourseLowestResponseRate";
import CourseEmploymentRate from "./CourseEmploymentRate";
import EmploymentCountOverTime from "./EmploymentCountOverTime";
import { useNavigate } from "react-router-dom";
const MainDashboard = () => {
  const navigate = useNavigate();
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
            onClick={() => navigate("/dashboard/overalls")}
            xs={12}
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              height: "23vh",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.light,
              },
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
            onClick={() => navigate("/dashboard/response-rate")}
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              height: "33vh",
              overflow: "hidden",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.light,
              },
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
            onClick={() => navigate("/dashboard/employments")}
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              height: "56vh" + "1rem",
              overflow: "hidden",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.light,
              },
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
          onClick={() => navigate("/dashboard/employments")}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "30vh",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: (theme) => theme.palette.primary.light,
            },
          }}
        >
          <ClassificationEmploymentRate />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainDashboard;
