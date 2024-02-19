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
import React, { useEffect, useState } from "react";
import useCourseResponseRate from "../../hooks/analytics/useCourseResponseRate";
import useGetAllBatches from "../../hooks/analytics/useGetAllBatches";
import useAll from "../../hooks/utilities/useAll";

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

const SelectCohorts = ({ type }) => {
  const [selected, setSelected] = useState({
    ResponseRate: null,
    EmploymentRate: null,
    SalaryTrend: null,
  });

  const { cohort, setCohort } = useAll();
  const [open, setOpen] = useState(0);

  const { data: allBatches, isLoading: isLoadingAllBatches } =
    useGetAllBatches();
  const { data: courseResponseRate, isLoading: isLoadingCourseResponseRate } =
    useCourseResponseRate(selected[type]);

  useEffect(() => {
    setSelected((prev) => ({ ...prev, [type]: allBatches?.data[0] }));
    setCohort((prev) => ({
      ...prev,
      [type]: { batch_year: allBatches?.data[0] },
    }));
    console.log(allBatches?.data);
  }, [allBatches]);

  const handleClick = (index, code) => {
    setOpen((prevState) => {
      if (prevState == index) return 0;
      return index;
    });

    setCohort((prev) => ({
      ...prev,
      [type]: { batch_year: selected[type], course_code: code },
    }));
  };

  const handleChange = (event) => {
    setSelected((prev) => ({ ...prev, [type]: event.target.value }));
    setCohort((prev) => ({
      ...prev,
      [type]: { batch_year: event.target.value },
    }));
  };

  if (isLoadingAllBatches) {
    return (
      <Box>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </Box>
    );
  }

  return (
    <Box padding={2}>
      <FormControl sx={{ width: "25ch" }}>
        <InputLabel>Batch Year</InputLabel>
        <Select
          key={selected[type]}
          value={selected[type]}
          onChange={handleChange}
          label="Overall Type"
        >
          {allBatches.data.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <List sx={{ display: "flex", flexDirection: "column" }}>
        {courseResponseRate?.data
          .slice(0) // Exclude the first element
          .sort((a, b) => {
            if (a.course_name === "All Alumnis under this Batch") {
              return -1; // "Overall" should always be at the top
            } else if (b.course_name === "All Alumnis under this Batch") {
              return 1; // "Overall" should always be at the top
            } else {
              return a.response_rate - b.response_rate;
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

export default SelectCohorts;
