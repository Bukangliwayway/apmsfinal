import {
  Box,
  Fab,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
  Add,
  Business,
  Label,
  MenuBook,
} from "@mui/icons-material";
import ClassificationsRow from "./ClassificationsRow";
import CoursesRow from "./CoursesRow";
import JobsRow from "./JobsRow";
import AddClassification from "./AddClassificationModal";
import AddCourse from "./AddCourseModal";
import AddJob from "./AddJobModal";

export const ManageSelections = () => {
  const [value, setValue] = useState(0);
  const [activeTab, setActiveTab] = useState("manage_classifications");
  const [modalOpen, setModalOpen] = useState({
    classification: false,
    job: false,
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
      classification: false,
      job: false,
      course: false,
    }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const targetOffset = element.offsetTop - 165; // Fixed offset of -63
      window.scrollTo({
        top: targetOffset,
        behavior: "smooth",
      });
    }
  };
  return (
    <Box>
      <Box
        flex={4}
        p={{ sm: 4, md: 2 }}
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: "column",
        }}
      >
        <Box
          position="sticky"
          top={63}
          zIndex={1000}
          bgcolor="inherit"
          borderBottom="1px solid rgba(0, 0, 0, 0.12)"
          sx={{ backgroundColor: (theme) => theme.palette.common.main }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="icon tabs example"
          >
            <Tab
              icon={<Label />}
              label="classifications"
              onClick={() => setActiveTab("manage_classifications")}
            />
            <Tab
              icon={<MenuBook />}
              label="courses"
              onClick={() => setActiveTab("manage_courses")}
            />
            <Tab
              icon={<Business />}
              label="jobs"
              onClick={() => setActiveTab("manage_jobs")}
            />
          </Tabs>
        </Box>
        {activeTab === "manage_classifications" && (
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              padding: 2,
              borderRadius: 3,
              position: "relative",
            }}
            id="manage_classifications"
          >
            <Typography
              fontWeight={800}
              sx={{
                padding: "10px",
                borderBottom: "2px solid",
                color: "primary",
              }}
            >
              Manage Classifications
            </Typography>
            <Tooltip title="Add Classifications">
              <Fab
                size="small"
                color="primary"
                sx={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                }}
                onClick={() => handleModalOpen("classification")}
              >
                <Add />
              </Fab>
            </Tooltip>
            <Box p={4}>
              <Paper>
                <ClassificationsRow />
              </Paper>
            </Box>
          </Box>
        )}
        {activeTab === "manage_courses" && (
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
          </Box>
        )}
        {activeTab === "manage_jobs" && (
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              padding: 2,
              borderRadius: 3,
              position: "relative",
            }}
            id="manage_jobs"
          >
            <Typography
              fontWeight={800}
              sx={{
                padding: "10px",
                borderBottom: "2px solid",
                color: "primary",
              }}
            >
              Manage Jobs
            </Typography>
            <Tooltip title="Add Jobs">
              <Fab
                size="small"
                color="primary"
                sx={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                }}
                onClick={() => handleModalOpen("job")}
              >
                <Add />
              </Fab>
            </Tooltip>
            <Box p={4}>
              <Paper>
                <JobsRow />
              </Paper>
            </Box>
          </Box>
        )}
      </Box>
      {modalOpen.classification && (
        <AddClassification
          open={modalOpen.classification}
          onClose={handleCloseModal}
        />
      )}
      {modalOpen.course && (
        <AddCourse open={modalOpen.course} onClose={handleCloseModal} />
      )}
      {modalOpen.job && (
        <AddJob open={modalOpen.job} onClose={handleCloseModal} />
      )}
    </Box>
  );
};
