import React, { useState } from "react";
import { Box, Fab, Paper, Tooltip, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import JobsRow from "./JobsRow";
import AddJob from "./AddJobModal";

export const ManageJobs = () => {
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
        {modalOpen.job && (
          <AddJob open={modalOpen.job} onClose={handleCloseModal} />
        )}
      </Box>
    </Box>
  );
};
