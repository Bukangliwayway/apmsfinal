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
import useCourseLowestResponseRate from "../../hooks/analytics/useCourseLowestResponseRate";

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

const CourseLowestResponseRate = () => {
  const {
    data: courseLowestResponseRate,
    isLoading: isLoadingCourseLowestResponseRate,
  } = useCourseLowestResponseRate();

  if (isLoadingCourseLowestResponseRate) {
    return (
      <Box>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </Box>
    );
  }
  return (
    <Box padding={2}>
      <Typography variant={"body2"} sx={{ fontWeight: "800" }}>
        Lowest Course Response Rates this Year:
      </Typography>
      <List
        dense={true}
        sx={{ display: "flex", flexDirection: "column", gap: 1 }}
      >
        {courseLowestResponseRate?.data
          .sort((a, b) => a.response_rate - b.response_rate)
          .slice(0, 5)
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
                  width: "auto",
                }}
              >
                {course.course_code}
              </Typography>
              <Box sx={{ width: "100%" }}>
                <LinearProgressWithLabel value={course.response_rate} />
              </Box>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

export default CourseLowestResponseRate;