import {
  Box,
  Button,
  Collapse,
  FormControl,
  IconButton,
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
import useCourseEmploymentRate from "../../hooks/analytics/useCourseEmploymentRate";
import { EmploymentRateList } from "./EmploymentRateList";
import { ResponseRateList } from "./ResponseRateList";
import {
  CalendarToday,
  LightMode,
  LocalLibrary,
  ModeNight,
  Search,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

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

  let message;
  switch (type) {
    case "ResponseRate":
      message = "Response Rate";
      break;
    case "EmploymentRate":
      message = "Employment Rate";
      break;
    case "SalaryTrend":
      message = "Salary Trend";
      break;
  }

  const [dateRange, setDateRange] = useState({
    start_date: new Date(0),
    end_date: new Date(),
  });

  const { setCohort, cohort } = useAll();
  const [open, setOpen] = useState(0);

  const { data: allBatches, isLoading: isLoadingAllBatches } =
    useGetAllBatches();

  const { data: responseRate, isLoading: isLoadingCourseResponseRate } =
    useCourseResponseRate(selected["ResponseRate"]);

  const { data: employmentRate, isLoading: isLoadingCourseEmploymentRate } =
    useCourseEmploymentRate(selected["EmploymentRate"]);

  console.log(cohort);

  useEffect(() => {
    setSelected((prev) => ({ ...prev, [type]: allBatches?.data[0] }));
    setCohort((prev) => ({
      ...prev,
      [type]: {
        batch_year: allBatches?.data[0],
        course_code: "Overall",
        course_column: true,
        start_date: new Date(0),
        end_date: new Date(),
      },
    }));
    setOpen(1);
  }, [allBatches]);

  const handleClick = (index, code) => {
    setOpen((prevState) => {
      if (prevState == index) return 0;
      return index;
    });
    setCohort((prev) => ({
      ...prev,
      [type]: { ...prev[type], course_code: code },
    }));
  };

  const handleChange = (event) => {
    setSelected((prev) => ({ ...prev, [type]: event.target.value }));
    setCohort((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        batch_year: event.target.value,
        course_code: "Overall",
      },
    }));
    setOpen(1);
  };

  if (isLoadingAllBatches) {
    return (
      <Box>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </Box>
    );
  }

  const employmentRateStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 1,
  };

  return (
    <Box padding={2} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant={"body2"} sx={{ fontWeight: "800", mb: "1rem" }}>
        Overall {message} per Course:
      </Typography>
      <Box
        sx={{
          ...(type === "EmploymentRate" && employmentRateStyles),
        }}
      >
        <FormControl sx={{ width: type == "EmploymentRate" ? "20ch" : "25ch" }}>
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
        {type == "EmploymentRate" && (
          <Box
            onClick={() =>
              setCohort((prev) => ({
                ...prev,
                [type]: {
                  ...prev[type], // Preserve existing properties
                  course_column: !prev[type]?.course_column, // Change only the course_column property
                },
              }))
            }
            sx={{ cursor: "pointer" }} // Add cursor style to indicate it's clickable
          >
            <IconButton
              color="primary"
              sx={{
                display: "flex",
                width: "4rem",
                height: "4rem",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {cohort[type]?.course_column ? (
                <>
                  <Typography variant={"subtitle2"}>Course</Typography>
                  <LocalLibrary />
                </>
              ) : (
                <>
                  <Typography variant={"subtitle2"}>Year</Typography>
                  <CalendarToday />
                </>
              )}
            </IconButton>
          </Box>
        )}
      </Box>
      {type == "EmploymentRate" && (
        <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <DatePicker
              name="start_date"
              label="Start Date"
              value={
                dateRange?.start_date ? dayjs(dateRange?.start_date) : null
              }
              onChange={(date) => {
                setDateRange((prev) => ({
                  ...prev,
                  start_date: date,
                }));
              }}
              renderInput={(params) => <TextField {...params} required />}
            />
            <DatePicker
              name="end_date"
              label="End Date"
              value={
                cohort[type]?.end_date ? dayjs(cohort[type]?.end_date) : null
              }
              onChange={(date) => {
                setDateRange((prev) => ({
                  ...prev,
                  end_date: date,
                }));
              }}
              renderInput={(params) => <TextField {...params} required />}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={(date) => {
              setCohort((prev) => ({
                ...prev,
                [type]: {
                  ...prev[type],
                  start_date: dateRange.start_date,
                  end_date: dateRange.end_date,
                },
              }));
            }}
          >
            Search Range
          </Button>
        </Box>
      )}

      {(isLoadingCourseResponseRate || isLoadingCourseEmploymentRate) && (
        <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <ListItemButton sx={{ display: "flex", flexDirection: "column" }}>
                <ListItem sx={{ display: "flex", padding: 0 }}>
                  <Typography
                    variant={"subtitle1"}
                    sx={{
                      textTransform: "uppercase",
                      minWidth: "100%",
                      width: "auto",
                    }}
                  >
                    <Skeleton variant="text" width="100%" />
                  </Typography>
                </ListItem>
              </ListItemButton>
            ))}
        </List>
      )}
      {(() => {
        switch (type) {
          case "ResponseRate":
            return (
              <ResponseRateList
                responseRate={responseRate}
                handleClick={handleClick}
                open={open}
                LinearProgressWithLabel={LinearProgressWithLabel}
              />
            );
          case "EmploymentRate":
            return (
              <EmploymentRateList
                employmentRate={employmentRate}
                handleClick={handleClick}
                open={open}
                LinearProgressWithLabel={LinearProgressWithLabel}
              />
            );
          // case "SalaryTrend":
          //   return (
          //     <CourseSalaryTrendList
          //       courseSalaryTrend={courseSalaryTrend}
          //       handleClick={handleClick}
          //     />
          //   );
          default:
            return null;
        }
      })()}
    </Box>
  );
};

export default SelectCohorts;
