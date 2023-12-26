import React, { useState } from "react";
import useGetDemographicProfile from "../../hooks/useGetDemographicProfile";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useAuth from "../../hooks/utilities/useAuth";
import {
  Box,
  Breadcrumbs,
  Fab,
  Grid,
  Link,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import SchoolIcon from "@mui/icons-material/School";
import DemographicProfile from "../profile_display/DemographicProfile";
import CareerProfile from "../profile_display/CareerProfile";
import EditableEmploymentProfile from "../profile_edit/EditableEmploymentProfile";
import {
  Add,
  AddCircleRounded,
  Edit,
  PersonPin,
  School,
  Star,
  Work,
} from "@mui/icons-material";
import useGetCareerProfile from "../../hooks/useGetCareerProfile";
import EmploymentProfile from "../profile_display/EmploymentProfile";
import AchievementProfile from "../profile_display/AchievementProfile";
import LoadingCircular from "../status_display/LoadingCircular";
import UserNotFound from "../status_display/UserNotFound";
import useGetVisitCheck from "../../hooks/display_profile/useGetVisitCheck";
import useGetVisitCareerProfile from "../../hooks/display_profile/useGetVisitCareerProfile";
import useGetVisitDemographicProfile from "../../hooks/display_profile/useGetVisitDemographicProfile";
import useGetVisitEmploymentProfile from "../../hooks/display_profile/useGetVisitEmploymentProfile";
import useGetVisitAchievementProfile from "../../hooks/display_profile/useGetVisitAchievementProfile";

function DisplayProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [value, setValue] = useState(0);
  const [activeTab, setActiveTab] = useState("profile_background");

  const { data: checkData, isLoading: isLoadingCheckData } =
    useGetVisitCheck(username);

  const {
    data: demographicData,
    isLoading: isLoadingDemographicData,
    isError: isErrorDemographicData,
    error: errorDemographicData,
  } = useGetVisitDemographicProfile(username);

  const {
    data: careerData,
    isLoading: isLoadingCareerData,
    isError: isErrorCareerData,
    error: errorCareerData,
  } = useGetVisitCareerProfile(username);

  const {
    data: employmentData,
    isLoading: isLoadingEmploymentData,
    isError: isErrorEmploymentData,
    error: errorEmploymentData,
  } = useGetVisitEmploymentProfile(username);

  const {
    data: achievementData,
    isLoading: isLoadingAchievementData,
    isError: isErrorAchievementData,
    error: errorAchievementData,
  } = useGetVisitAchievementProfile(username);

  if (isLoadingCheckData) return <LoadingCircular />;
  if (!checkData.data) return <UserNotFound />;

  if (isErrorDemographicData || isErrorCareerData) {
    const expiredCareerData =
      errorCareerData.response.data.detail === "Token has expired";
    const expiredDemographicData =
      errorDemographicData.response.data.detail === "Token has expired";
    if (expiredDemographicData || expiredCareerData) {
      setAuth({}); // Clears out all the token, logs you out
      navigate("/login", {
        state: {
          from: location,
          message:
            "You have been logged out for security purposes, please login again",
        },
        replace: true,
      });
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      flex={4}
      p={{ sm: 4, md: 2 }}
      sx={{
        display: "flex",
        gap: 2,
        flexDirection: "column",
      }}
    >
      <Box
        position="sticky"
        top={63}
        zIndex={1000}
        bgcolor="inherit"
        borderBottom="1px solid rgba(0, 0, 0, 0.12)"
        sx={{
          backgroundColor: (theme) => theme.palette.common.main,
        }}
      >
        <Tabs value={value} onChange={handleChange} variant="fullWidth">
          <Tab
            icon={<PersonPin />}
            label="Profile"
            onClick={() => setActiveTab("profile_background")}
          />
          <Tab
            icon={<School />}
            label="Education"
            onClick={() => setActiveTab("educational_background")}
          />
          <Tab
            icon={<Star />}
            label="Achievement"
            onClick={() => setActiveTab("achievement_background")}
          />
          <Tab
            icon={<Work />}
            label="Experience"
            onClick={() => setActiveTab("employment_history")}
          />
        </Tabs>
      </Box>

      <Grid
        container
        sx={{
          gap: 2,
          justifyContent: { sm: "stretch" },
          display: { sm: "flex" },
          flexDirection: "column",
        }}
      >
        {activeTab === "profile_background" && (
          <Grid
            item
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              padding: "1rem",
              position: "relative",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                padding: "10px",
                borderBottom: "2px solid",
                color: "primary",
                display: { sm: "flex" },
              }}
            >
              Profile
            </Typography>
            <DemographicProfile
              data={demographicData}
              isLoading={isLoadingDemographicData}
            />
          </Grid>
        )}

        {activeTab === "educational_background" && (
          <Grid
            item
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              padding: "1rem",
              position: "relative",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                padding: "10px",
                borderBottom: "2px solid",
                marginBottom: "10px",
                color: "primary",
              }}
            >
              Education
            </Typography>
            <CareerProfile data={careerData} isLoading={isLoadingCareerData} />
          </Grid>
        )}

        {activeTab === "achievement_background" && (
          <Grid
            item
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              padding: "1rem",
              position: "relative",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                padding: "10px",
                borderBottom: "2px solid",
                marginBottom: "10px",
                color: "primary",
              }}
            >
              Achievements
            </Typography>
            <AchievementProfile
              data={achievementData}
              isLoading={isLoadingAchievementData}
            />
          </Grid>
        )}

        {activeTab === "employment_history" && (
          <Grid
            item
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              padding: "1rem",
              position: "relative",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                padding: "10px",
                borderBottom: "2px solid",
                marginBottom: "10px",
                color: "primary",
              }}
            >
              Experience
            </Typography>
            <EmploymentProfile
              data={employmentData}
              isLoading={isLoadingEmploymentData}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default DisplayProfile;
