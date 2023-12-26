import React, { useEffect, useState } from "react";
import useGetDemographicProfile from "../../hooks/useGetDemographicProfile";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
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
import ProfileEditModal from "./EditProfileModal";
import EditInitialStatusModal from "./EditInitialStatusModal";
import EducProfileEditModal from "./EditCareerModal";
import AddEmploymentModal from "./AddEmploymentModal";
import AddAchievementModal from "./AddAchievementModal";
import useGetCareerProfile from "../../hooks/useGetCareerProfile";
import AddEducationModal from "./AddEducationModal";
import EmploymentProfile from "../profile_display/EmploymentProfile";
import AchievementProfile from "../profile_display/AchievementProfile";
import useGetEmploymentProfile from "../../hooks/useGetEmploymentProfile";
import useGetAchievementProfiles from "../../hooks/useGetAchievementProfiles";

function UpdateProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [value, setValue] = React.useState(0);
  const [activeTab, setActiveTab] = useState("profile_background");
  const [modalOpen, setModalOpen] = useState({
    current_status: false,
    profile: false,
    career: false,
    employment: false,
    add_achievement: false,
    add_education: false,
  });

  const {
    data: demographicData,
    isLoading: isLoadingDemographicData,
    isError: isErrorDemographicData,
    error: errorDemographicData,
  } = useGetDemographicProfile();

  const {
    data: careerData,
    isLoading: isLoadingCareerData,
    isError: isErrorCareerData,
    error: errorCareerData,
  } = useGetCareerProfile();

  const {
    data: employmentData,
    isLoading: isLoadingEmploymentData,
    isError: isErrorEmploymentData,
    error: errorEmploymentData,
  } = useGetEmploymentProfile();

  const {
    data: achievementData,
    isLoading: isLoadingAchievementData,
    isError: isErrorAchievementData,
    error: errorAchievementData,
  } = useGetAchievementProfiles();

  useEffect(() => {
    // Check the employment status and conditionally open the modal
    if (
      employmentData?.data?.present_employment_status === "unanswered" &&
      value == 3
    ) {
      handleModalOpen("current_status");
    }
  }, [value]);

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

  const handleModalOpen = (type) => {
    setModalOpen((prevState) => ({
      ...prevState,
      [type]: true,
    }));
  };

  const handleCloseModal = () => {
    setModalOpen((prevState) => ({
      ...prevState,
      current_status: false,
      profile: false,
      career: false,
      employment: false,
      add_achievement: false,
      add_education: false,
    }));
  };

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
            id="profile_background"
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

            <Box
              sx={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <Tooltip title="update demographic profile">
                <Fab
                  size="small"
                  onClick={() => handleModalOpen("profile")}
                  color="primary"
                >
                  <Edit />
                </Fab>
              </Tooltip>
            </Box>
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
            id="educational_background"
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
            <Box
              sx={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <Tooltip title="add education">
                <Fab
                  size="small"
                  onClick={() => handleModalOpen("add_education")}
                  color="primary"
                >
                  <Add />
                </Fab>
              </Tooltip>
              <Tooltip title="edit education">
                <Fab
                  size="small"
                  onClick={() =>
                    navigate("/profile/me/educational-details", {
                      state: {
                        from: location,
                      },
                      replace: true,
                    })
                  }
                  color="primary"
                >
                  <Edit />
                </Fab>
              </Tooltip>
            </Box>
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
            id="achievement_background"
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
            <Box
              sx={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <Tooltip title="add achievement">
                <Fab
                  size="small"
                  onClick={() => handleModalOpen("add_achievement")}
                  color="primary"
                >
                  <Add />
                </Fab>
              </Tooltip>
              <Tooltip title="edit achievements">
                <Fab
                  size="small"
                  onClick={() =>
                    navigate("/profile/me/achievements-details", {
                      state: {
                        from: location,
                      },
                      replace: true,
                    })
                  }
                  color="primary"
                >
                  <Edit />
                </Fab>
              </Tooltip>
            </Box>
            {/* <CareerProfile data={careerData} isLoading={isLoadingCareerData} /> */}
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
            id="employment_history"
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
            <Box
              sx={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <Tooltip title="add employment">
                <Fab
                  size="small"
                  color="primary"
                  onClick={() => handleModalOpen("employment")} // Trigger the profile edit modal
                >
                  <Add />
                </Fab>
              </Tooltip>

              <Tooltip title="edit employments">
                <Fab
                  size="small"
                  color="primary"
                  onClick={() =>
                    navigate("/profile/me/employment-details", {
                      state: {
                        from: location,
                      },
                      replace: true,
                    })
                  }
                >
                  <Edit />
                </Fab>
              </Tooltip>
            </Box>

            <EmploymentProfile
              data={employmentData}
              isLoading={isLoadingEmploymentData}
            />
          </Grid>
        )}
      </Grid>

      {modalOpen.current_status && (
        <EditInitialStatusModal
          open={modalOpen.current_status}
          onClose={handleCloseModal}
          prior={false}
        />
      )}
      {modalOpen.profile && (
        <ProfileEditModal open={modalOpen.profile} onClose={handleCloseModal} />
      )}
      {modalOpen.career && (
        <EducProfileEditModal
          open={modalOpen.career}
          onClose={handleCloseModal}
        />
      )}
      {modalOpen.employment && (
        <AddEmploymentModal
          open={modalOpen.employment}
          onClose={handleCloseModal}
        />
      )}
      {modalOpen.add_achievement && (
        <AddAchievementModal
          open={modalOpen.add_achievement}
          onClose={handleCloseModal}
        />
      )}
      {modalOpen.add_education && (
        <AddEducationModal
          open={modalOpen.add_education}
          onClose={handleCloseModal}
        />
      )}
    </Box>
  );
}

export default UpdateProfile;
