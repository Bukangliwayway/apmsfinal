import {
  Box,
  Collapse,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
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

const CourseLowestResponseRate = ({ solo = false }) => {
  const [open, setOpen] = useState(0);
  const handleClick = (index) => {
    setOpen((prevState) => {
      if (prevState == index) return 0;
      return index;
    });
  };

  const {
    data: courseLowestResponseRate,
    isLoading: isLoadingCourseLowestResponseRate,
  } = useCourseLowestResponseRate();

  if (isLoadingCourseLowestResponseRate || !courseLowestResponseRate) {
    return (
      <Box width={"100%"} height={"100%"}>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </Box>
    );
  }

  return (
    <Box padding={2}>
      <Typography variant={"subtitle1"} sx={{ fontWeight: "800" }}>
        Lowest Response Rates from the Recent Year:
      </Typography>
      <List sx={{ display: "flex", flexDirection: "column" }} dense={!solo}>
        {courseLowestResponseRate?.data
          .sort((a, b) => a.response_rate - b.response_rate)
          .slice(0, 5)
          .map((course, index) => (
            <ListItemButton
              onClick={() => handleClick(index + 1)}
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
                  <LinearProgressWithLabel value={course.response_rate} />
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
                      Students Responded:
                    </Typography>
                    <Typography variant="caption">
                      {course.users_completed}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Typography variant="caption">
                      Students under this Course:
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
    </Box>
  );
};

export default CourseLowestResponseRate;
