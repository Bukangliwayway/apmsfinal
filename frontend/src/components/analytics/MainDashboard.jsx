import { Box, Card, Grid } from "@mui/material";
import React from "react";
import AlumniResponseRate from "./AlumniResponseRate";
import BatchYearResponseRate from "./BatchYearResponseRate";
import WorkAllignmentCourse from "./WorkAllignmentCourse";

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
            <AlumniResponseRate />
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
            <WorkAllignmentCourse />
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={3.41}
        >
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              height: "56vh" + "1rem"
            }}
          >
            <WorkAllignmentCourse />
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
          <BatchYearResponseRate />
        </Grid>
      </Grid>
      <Grid container sx={{ display: "flex", gap: 1, height: "100%", justifyContent: "center" }}>
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <AlumniResponseRate />
        </Grid>
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <AlumniResponseRate />
        </Grid>
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <AlumniResponseRate />
        </Grid>
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <AlumniResponseRate />
        </Grid>
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <AlumniResponseRate />
        </Grid>
        <Grid
          item
          xs={3.94}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "28vh",
          }}
        >
          <AlumniResponseRate />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainDashboard;
