import { Box, Grid } from "@mui/material";
import React from "react";
import CourseResponseRate from "./CourseResponseRate";

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
            <CourseResponseRate />
          </Box>
        </Grid>
        <Grid item xs={9} p={1} pl={0.5}></Grid>
      </Grid>
    </Box>
  );
};

export default ResponsesDashboard;
