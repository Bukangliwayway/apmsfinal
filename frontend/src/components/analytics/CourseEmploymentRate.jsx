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

const CourseEmploymentRate = ({ solo = false }) => {
  const [open, setOpen] = useState(0);
  const handleClick = (index) => {
    setOpen((prevState) => {
      if (prevState == index) return 0;
      return index;
    });
  };

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
      <List sx={{ display: "flex", flexDirection: "column" }} dense={!solo}>
        {courseResponseRate?.data
          .sort((a, b) => b.employment_rate - a.employment_rate)
          .slice(0, 10)
          .map((course, index) => (
            <>
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
                        Employed Student:
                      </Typography>
                      <Typography variant="caption">
                        {course.users_employed}
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
            </>
          ))}
      </List>
    </Box>
  );
};

export default CourseEmploymentRate;
