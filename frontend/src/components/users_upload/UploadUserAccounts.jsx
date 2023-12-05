import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Fab,
  Grid,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
  Add,
  Business,
  CloudUpload,
  Edit,
  FilterList,
  GroupAdd,
  Label,
  MenuBook,
  PersonPin,
  School,
  Stars,
  Work,
} from "@mui/icons-material";
import ClassificationsRow from "../selections/ClassificationsRow";
import CoursesRow from "../selections/CoursesRow";
import JobsRow from "../selections/JobsRow";
import AddClassification from "../selections/AddClassificationModal";
import AddCourse from "../selections/AddCourseModal";
import AddJob from "../selections/AddJobModal";
import DemoProfileDataGrid from "./ProfileDataGrid";
import ProfilesUploadInput from "./ProfilesUploadInput";
import EducationUploadInput from "./EducationUploadInput";
import EducationDataGrid from "./EducationDataGrid";
import EmploymentUploadInput from "./EmploymentUploadInput";
import EmploymentDataGrid from "./EmploymentDataGrid";
import AchievementUploadInput from "./AchievementUploadInput";
import AchievementDataGrid from "./AchievementDataGrid";

export const UploadProfiles = () => {
  const [value, setValue] = useState(0);
  const [activeTab, setActiveTab] = useState("upload_profiles");
  const [modalOpen, setModalOpen] = useState({
    classification: false,
    job: false,
    course: false,
  });

  const handleModalOpen = (type) => {
    setModalOpen((prevState) => ({
      ...prevState,
      [type]: true,
    }));
  };

  const handleCloseModal = () => {
    setModalOpen((prevState) => ({
      ...prevState,
      classification: false,
      job: false,
      course: false,
    }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box
        flex={4}
        p={{ sm: 4, md: 2 }}
        sx={{
          backgroundColor: (theme) => theme.palette.secondary.main,
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
          sx={{ backgroundColor: (theme) => theme.palette.common.main }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            variant="fullWidth"
            aria-label="icon tabs example"
          >
            <Tab
              icon={<GroupAdd />}
              label="User Accounts"
              onClick={() => setActiveTab("upload_profiles")}
            />
            <Tab
              icon={<School />}
              label="Education"
              onClick={() => setActiveTab("upload_education")}
            />
            <Tab
              icon={<Work />}
              label="employment"
              onClick={() => setActiveTab("upload_employments")}
            />
            <Tab
              icon={<Stars />}
              label="Achievements"
              onClick={() => setActiveTab("upload_achievements")}
            />
          </Tabs>
        </Box>

        {activeTab === "upload_profiles" && (
          <Grid
            container
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              padding: 2,
              borderRadius: 3,
              position: "relative",
              opacity: activeTab === "upload_profiles" ? 1 : 0,
              display: activeTab === "upload_profiles" ? "flex" : "none",
              gap: 2,
              transition: "opacity 0.5s ease-in-out",
            }}
            id="upload_profiles"
          >
            <Grid item xs={12}>
              <Typography
                variant="h1"
                fontWeight={800}
                sx={{
                  padding: "10px",
                  borderBottom: "2px solid",
                  color: "primary",
                }}
              >
                Upload Profiles
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ProfilesUploadInput />
            </Grid>
            <Grid item xs={12}>
              <DemoProfileDataGrid />
            </Grid>
          </Grid>
        )}
        {activeTab === "upload_education" && (
          <Grid
            container
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              padding: 2,
              borderRadius: 3,
              position: "relative",
              opacity: activeTab === "upload_education" ? 1 : 0,
              display: activeTab === "upload_education" ? "flex" : "none",
              gap: 2,
              transition: "opacity 0.5s ease-in-out",
            }}
            id="upload_education"
          >
            <Grid item xs={12}>
              <Typography
                variant="h1"
                fontWeight={800}
                sx={{
                  padding: "10px",
                  borderBottom: "2px solid",
                  color: "primary",
                }}
              >
                Upload Educations
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <EducationUploadInput />
            </Grid>
            <Grid item xs={12}>
              <EducationDataGrid />
            </Grid>
          </Grid>
        )}
        {activeTab === "upload_employments" && (
          <Grid
            container
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              padding: 2,
              borderRadius: 3,
              position: "relative",
              opacity: activeTab === "upload_employments" ? 1 : 0,
              display: activeTab === "upload_employments" ? "flex" : "none",
              gap: 2,
              transition: "opacity 0.5s ease-in-out",
            }}
            id="upload_employments"
          >
            <Grid item xs={12}>
              <Typography
                variant="h1"
                fontWeight={800}
                sx={{
                  padding: "10px",
                  borderBottom: "2px solid",
                  color: "primary",
                }}
              >
                Upload Employments
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <EmploymentUploadInput />
            </Grid>
            <Grid item xs={12}>
              <EmploymentDataGrid />
            </Grid>
          </Grid>
        )}
        {activeTab === "upload_achievements" && (
          <Grid
            container
            sx={{
              backgroundColor: (theme) => theme.palette.common.main,
              padding: 2,
              borderRadius: 3,
              position: "relative",
              opacity: activeTab === "upload_achievements" ? 1 : 0,
              display: activeTab === "upload_achievements" ? "flex" : "none",
              gap: 2,
              transition: "opacity 0.5s ease-in-out",
            }}
            id="upload_achievements"
          >
            <Grid item xs={12}>
              <Typography
                variant="h1"
                fontWeight={800}
                sx={{
                  padding: "10px",
                  borderBottom: "2px solid",
                  color: "primary",
                }}
              >
                Upload Achievements
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <AchievementUploadInput />
            </Grid>
            <Grid item xs={12}>
              <AchievementDataGrid />
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};
