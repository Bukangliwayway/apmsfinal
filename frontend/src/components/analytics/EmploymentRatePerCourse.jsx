import {
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ width: "100%" }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Typography variant="body2" color="text.secondary">{`${Math.round(
        props.value
      )}%`}</Typography>
    </Box>
  );
}

const EmploymentRatePerCourse = () => {
  return (
    <Box padding={2}>
      <Typography variant={"body2"} sx={{ fontWeight: "800" }}>
        Overall Employment Rate per Course:
      </Typography>
      <List dense={true}>
        <ListItem sx={{ display: "flex", gap: 1, padding: 0 }}>
          <Typography variant={"subtitle2"}>BSIT</Typography>
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={43} />
          </Box>
        </ListItem>
        <ListItem sx={{ display: "flex", gap: 1, padding: 0 }}>
          <Typography variant={"subtitle2"}>AAAAAAAAAA</Typography>
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={39} />
          </Box>
        </ListItem>
        <ListItem sx={{ display: "flex", gap: 1, padding: 0 }}>
          <Typography variant={"subtitle2"}>BSIT</Typography>
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={23} />
          </Box>
        </ListItem>
        <ListItem sx={{ display: "flex", gap: 1, padding: 0 }}>
          <Typography variant={"subtitle2"}>BSIT</Typography>
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={13} />
          </Box>
        </ListItem>
        <ListItem sx={{ display: "flex", gap: 1, padding: 0 }}>
          <Typography variant={"subtitle2"}>BSIT</Typography>
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={13} />
          </Box>
        </ListItem>
        <ListItem sx={{ display: "flex", gap: 1, padding: 0 }}>
          <Typography variant={"subtitle2"}>BSIT</Typography>
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={13} />
          </Box>
        </ListItem>
        <ListItem sx={{ display: "flex", gap: 1, padding: 0 }}>
          <Typography variant={"subtitle2"}>BSIT</Typography>
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={13} />
          </Box>
        </ListItem>
        <ListItem sx={{ display: "flex", gap: 1, padding: 0 }}>
          <Typography variant={"subtitle2"}>BSIT</Typography>
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={13} />
          </Box>
        </ListItem>
        <ListItem sx={{ display: "flex", gap: 1, padding: 0 }}>
          <Typography variant={"subtitle2"}>BSIT</Typography>
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={13} />
          </Box>
        </ListItem>
        <ListItem sx={{ display: "flex", gap: 1, padding: 0 }}>
          <Typography variant={"subtitle2"}>BSIT</Typography>
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={13} />
          </Box>
        </ListItem>
      </List>
    </Box>
  );
};

export default EmploymentRatePerCourse;
