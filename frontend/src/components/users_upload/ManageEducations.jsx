import React, { useState } from "react";
import { Box, Fab, Grid, Paper, Tooltip, Typography } from "@mui/material";
import EducationUploadInput from "./EducationUploadInput";
import EducationDataGrid from "./EducationDataGrid";

export const ManageEducations = () => {
  return (
    <Box
      flex={4}
      p={{ sm: 4, md: 2 }}
      sx={{
        display: "flex",
        gap: 2,
        flexDirection: "column",
      }}
    >
      <Grid
        container
        sx={{
          backgroundColor: (theme) => theme.palette.common.main,
          padding: 2,
          borderRadius: 3,
          minHeight: "88vh",
          display: "flex",
          gap: 2,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <Grid item xs={12}>
          <Typography
            fontWeight={800}
            sx={{
              padding: "10px",
              borderBottom: "2px solid",
              color: "primary",
            }}
          >
            Upload Educations
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <EducationUploadInput />
        </Grid>
        <Grid item xs={12}>
          <EducationDataGrid />
        </Grid>
      </Grid>
    </Box>
  );
};
