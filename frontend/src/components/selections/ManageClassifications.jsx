import React, { useState } from "react";
import { Box, Fab, Paper, Tooltip, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import ClassificationsRow from "./ClassificationsRow";
import AddClassification from "./AddClassificationModal";

export const ManageClassifications = () => {
  const [modalOpen, setModalOpen] = useState({
    classification: false,
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
        id="manage_Classifications"
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
        {modalOpen.classification && (
          <AddClassification
            open={modalOpen.classification}
            onClose={handleCloseModal}
          />
        )}
      </Box>
    </Box>
  );
};
