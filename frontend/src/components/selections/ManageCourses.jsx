import React, { useState } from "react";
import { Box, Fab, Paper, Tooltip, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import CoursesRow from "./CoursesRow";
import AddCourse from "./AddCourseModal";

export const ManageCourses = () => {
  const [modalOpen, setModalOpen] = useState({
    course: false,
  });

  const handleModalOpen = (type) => {
    setModalOpen((prevState) => ({
      ...prevState,
      [type]: true,
    }));
  };

  const handleCloseModal = () => {
    setModalOpen((prevState) => ({
      ...prevState,
      course: false,
    }));
  };
  return (
    <Box
      flex={4}
      p={{ sm: 4, md: 2 }}
      sx={{
        backgroundColor: (theme) => theme.palette.secondary.main,
        display: "flex",
        gap: 2,
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.common.main,
          padding: 2,
          borderRadius: 3,
          position: "relative",
        }}
        id="manage_courses"
      >
        <Typography
          fontWeight={800}
          sx={{
            padding: "10px",
            borderBottom: "2px solid",
            color: "primary",
          }}
        >
          Manage Courses
        </Typography>
        <Tooltip title="Add Courses">
          <Fab
            size="small"
            color="primary"
            sx={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
            }}
            onClick={() => handleModalOpen("course")}
          >
            <Add />
          </Fab>
        </Tooltip>
        <Box p={4}>
          <Paper>
            <CoursesRow />
          </Paper>
        </Box>
        {modalOpen.course && (
          <AddCourse open={modalOpen.course} onClose={handleCloseModal} />
        )}
      </Box>
    </Box>
  );
};
