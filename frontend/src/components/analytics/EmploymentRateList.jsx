import {
  Box,
  Collapse,
  FormControl,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";

export const EmploymentRateList = ({
  employmentRate,
  handleClick,
  open,
  LinearProgressWithLabel,
}) => {
  return (
    <List sx={{ display: "flex", flexDirection: "column" }}>
      {employmentRate?.data
        .slice(0) // Exclude the first element
        .sort((a, b) => {
          if (a.course_name === "All Alumnis under this Batch") {
            return -1; // "Overall" should always be at the top
          } else if (b.course_name === "All Alumnis under this Batch") {
            return 1; // "Overall" should always be at the top
          } else {
            return a.employment_rate - b.employment_rate;
          }
        })
        .map((course, index) => (
          <ListItemButton
            onClick={() => handleClick(index + 1, course.course_code)}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <ListItem sx={{ display: "flex", gap: 1, padding: 0 }}>
              <Typography
                variant={"subtitle2"}
                sx={{
                  textTransform: "uppercase",
                  minWidth: "35%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap", // Initially set to "nowrap"
                  width: "auto",
                }}
              >
                {course.course_code}
              </Typography>
              <Box sx={{ width: "100%" }}>
                <LinearProgressWithLabel value={course.employment_rate} />
              </Box>
            </ListItem>
            <Collapse in={open == index + 1}>
              <Box
                p={1}
                sx={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                <Typography sx={{ textTransform: "capitalize" }}>
                  {course.course_name}
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography variant="caption">
                    Currently Employed Alumnis:
                  </Typography>
                  <Typography variant="caption">
                    {course.users_employed}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Typography variant="caption">
                    Alumni with Completed Profile under this Course:
                  </Typography>
                  <Typography variant="caption">
                    {course.users_count}
                  </Typography>
                </Box>
              </Box>
            </Collapse>
          </ListItemButton>
        ))}
    </List>
  );
};
