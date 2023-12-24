import {
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";
import useCourseEmploymentRate from "../../hooks/analytics/useCourseEmploymentRate";

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

const CourseEmploymentRate = () => {
  const { data: courseResponseRate, isLoading: isLoadingCourseResponseRate } =
    useCourseEmploymentRate();

  if (isLoadingCourseResponseRate) {
    return (
      <Box>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </Box>
    );
  }
  return (
    <Box padding={2}>
      <Typography variant={"body2"} sx={{ fontWeight: "800" }}>
        Overall Employment Rate per Course:
      </Typography>
      <List
        dense={true}
        sx={{ display: "flex", flexDirection: "column", gap: 1 }}
      >
        {courseResponseRate?.data
          .sort((a, b) => b.employment_rate - a.employment_rate)
          .slice(0, 10)
          .map((course, index) => (
            <ListItem sx={{ display: "flex", gap: 1, padding: 0 }}>
              <Typography
                variant={"subtitle2"}
                sx={{
                  textTransform: "uppercase",
                  minWidth: "35%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap", // Initially set to "nowrap"
                  width: "auto"
                }}
              >
                {course.course_code}
               </Typography> 
              <Box sx={{ width: "100%" }}>
                <LinearProgressWithLabel value={course.employment_rate} />
              </Box>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default CourseEmploymentRate;
