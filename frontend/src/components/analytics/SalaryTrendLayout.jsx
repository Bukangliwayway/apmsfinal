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
import SalaryTrend from "./SalaryTrend";

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

const SalaryTrendLayout = () => {
  const [selected, setSelected] = useState(null);
  const [renderKey, setRenderKey] = useState(0);

  const { cohort, setCohort } = useAll();

  const { data: allBatches, isLoading: isLoadingAllBatches } =
    useGetAllBatches();
  const { data: courseResponseRate, isLoading: isLoadingCourseResponseRate } =
    useCourseResponseRate(selected);

  useEffect(() => {
    setSelected(allBatches?.data[0]);
    setRenderKey((prevKey) => prevKey + 1);
    setCohort({
      batch_year: allBatches?.data[0],
    });
  }, [allBatches]);

  const [open, setOpen] = useState(0);
  const handleClick = (index, code) => {
    setOpen((prevState) => {
      setCohort({
        batch_year: selected,
        course_code: code,
      });
      if (prevState == index) return 0;
      return index;
    });
  };

  const handleChange = (event) => {
    setSelected(event.target.value);
    setCohort({
      batch_year: event.target.value,
    });
  };

  if (isLoadingAllBatches) {
    return (
      <Box>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Box padding={2}>
        <FormControl sx={{ width: "25ch" }}>
          <InputLabel>Batch Year</InputLabel>
          <Select
            key={renderKey}
            value={selected}
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
        <List>
          {courseResponseRate?.data
            .sort((a, b) => a.response_rate - b.response_rate)
            .slice(0, 5)
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
      <Box width={"100vw"}>
        <SalaryTrend />
      </Box>
    </Box>
  );
};

export default SalaryTrendLayout;
