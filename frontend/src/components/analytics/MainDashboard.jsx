import {
  Box,
  ButtonBase,
  Card,
  Divider,
  Grid,
  LinearProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import OverallPie from "./OverallPie";
import ClassificationEmploymentRate from "./ClassificationEmploymentRate";
import WorkAlignmentOverTime from "./WorkAlignmentOverTime";
import CourseLowestResponseRate from "./CourseLowestResponseRate";
import CourseEmploymentRate from "./CourseEmploymentRate";
import EmploymentCountOverTime from "./EmploymentCountOverTime";
import { useNavigate } from "react-router-dom";
import { EmploymentRateList } from "./EmploymentRateList";
import useCourseEmploymentRate from "../../hooks/analytics/useCourseEmploymentRate";
import useAll from "../../hooks/utilities/useAll";
import WorkAlignmentLine from "./WorkAlignmentLine";

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

const MainDashboard = () => {
  const { setCohort } = useAll();
  const navigate = useNavigate();
  const { data: employmentRate, isLoading: isLoadingCourseEmploymentRate } =
    useCourseEmploymentRate("All Batch Year");

  useEffect(() => {
    setCohort(() => ({
      Employment: {
        batch_year: "All Batch Year",
        course_code: "Overall",
        course_column: true,
        start_date: new Date(0),
        end_date: new Date(),
      },
      Profile: {
        batch_year: "All Batch Year",
        course_code: "Overall",
      },
    }));
  }, []);

  return (
    <Grid container height={"93vh"}>
      <Grid container item xs={12} height={"65%"}>
        <Grid item container xs={3} height={"50%"}>
          <Grid item xs={12} height={"80%"} p={0.5} pt={1} pl={1}>
            <Box
              onClick={() => navigate("/dashboard/response-rate")}
              sx={{
                backgroundColor: (theme) => theme.palette.common.main,
                overflow: "hidden",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.light,
                },
              }}
              height={"100%"}
            >
              <OverallPie type={"response rate"} />
            </Box>
          </Grid>
          <Grid item xs={12} height={"120%"} p={0.5} pl={1}>
            <Box
              onClick={() => navigate("/dashboard/response-rate")}
              sx={{
                backgroundColor: (theme) => theme.palette.common.main,
                overflow: "hidden",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.light,
                },
              }}
              height={"100%"}
            >
              <CourseLowestResponseRate />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={6} container height={"50%"}>
          <Grid item xs={12} height={"120%"} p={0.5} pt={1}>
            <Box
              onClick={() => navigate("/dashboard/employments")}
              sx={{
                backgroundColor: (theme) => theme.palette.common.main,
                overflow: "hidden",
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.light,
                },
              }}
              height={"100%"}
            >
              <WorkAlignmentLine />
            </Box>
          </Grid>
          <Grid item container xs={12} height={"80%"}>
            <Grid item xs={6} height={"100%"} p={0.5}>
              <Box
                sx={{
                  backgroundColor: (theme) => theme.palette.common.main,
                  overflow: "hidden",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.primary.light,
                  },
                }}
                onClick={() => navigate("/dashboard/response-rate")}
                height={"100%"}
              >
                <OverallPie type={"employment status"} />
              </Box>
            </Grid>
            <Grid item xs={6} height={"100%"} p={0.5}>
              <Box
                sx={{
                  backgroundColor: (theme) => theme.palette.common.main,
                  overflow: "hidden",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.primary.light,
                  },
                }}
                onClick={() => navigate("/dashboard/monthlyincome")}
                height={"100%"}
              >
                <OverallPie type={"monthly income"} />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={3} height={"100%"} p={0.5} pt={1} pr={1}>
          <Box
            onClick={() => navigate("/dashboard/employments")}
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              height: "56vh" + "1rem",
              overflow: "hidden",
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.light,
              },
            }}
          >
            {isLoadingCourseEmploymentRate || !employmentRate ? (
              <Box width={"100%"} height={"100%"}>
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"100%"}
                />
              </Box>
            ) : (
              <Box p={2}>
                <Typography variant={"subtitle1"} sx={{ fontWeight: "800" }}>
                  Overall Employment Rate Per Course:
                </Typography>
                <EmploymentRateList
                  employmentRate={employmentRate}
                  LinearProgressWithLabel={LinearProgressWithLabel}
                />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      <Grid item xs={12} height={"35%"} p={1} pt={0.5}>
        <Box
          onClick={() => navigate("/dashboard/employments")}
          sx={{
            backgroundColor: (theme) => theme.palette.common.main,
            height: "100%",
            transition: "background-color 0.3s ease",
            "&:hover": {
              backgroundColor: (theme) => theme.palette.primary.light,
            },
          }}
        >
          <ClassificationEmploymentRate />
        </Box>
      </Grid>
    </Grid>
  );
};

export default MainDashboard;
