import { useLocation, Routes, Route } from "react-router-dom";
import useAll from "../hooks/utilities/useAll";
import Feed from "../components/Feed";
import Explore from "../components/Explore";
import UpdateProfile from "../components/profile_edit/UpdateProfile";
import Fundraise from "../components/Fundraise";
import Missing from "../components/status_display/UserNotFound";
import MainLayout from "../layout/MainLayout";
import { ManageSelections } from "../components/selections/ManageSelections";
import EditableEmploymentProfile from "../components/profile_edit/EditableEmploymentProfile";
import EditableAchievementModal from "../components/profile_edit/EditableAchievementModal";
import EditableEducationProfile from "../components/profile_edit/EditableEducationProfile";
import { UploadProfiles } from "../components/users_upload/UploadUserAccounts";
import DisplayProfile from "../components/profile_display/DisplayProfile";
import MainDashboard from "../components/analytics/MainDashboard";
import { ManageCourses } from "../components/selections/ManageCourses";
import { ManageClassifications } from "../components/selections/ManageClassifications";
import { ManageJobs } from "../components/selections/ManageJobs";
import { ManageAllProfiles } from "../components/users_upload/ManageAllProfiles";
import { ManageApproveUsers } from "../components/users_upload/ManageApproveUsers";
import { ManageUserAccounts } from "../components/users_upload/ManageUserAccounts";
import { ManageEducations } from "../components/users_upload/ManageEducations";
import { ManageEmployments } from "../components/users_upload/ManageEmployments";
import { ManageAchievements } from "../components/users_upload/ManageAchievements";
import { ManageTwoWayLink } from "../components/users_upload/ManageTwoWayLink";
import { ManageUploadHistory } from "../components/users_upload/ManageHistory";
import OverallDashboard from "../components/analytics/OverallDashboard";
import EmploymentDashboard from "../components/analytics/EmploymentDashboard";
import ResponsesDashboard from "../components/analytics/ResponsesDashboard";
import MainFeed from "../components/pup_feeds/MainFeed";
import CreatePost from "../components/pup_feeds/CreatePost";
const RoleBasedRoutes = () => {
  const { auth } = useAll();
  const profileRoutes = (
    <>
      <Route
        path="feed"
        element={
          <MainLayout mode="profile">
            <Feed />
          </MainLayout>
        }
      />
      <Route
        path="explore"
        element={
          <MainLayout mode="profile">
            <Explore />
          </MainLayout>
        }
      />
      <Route
        path="explore/alumni/:username"
        element={
          <MainLayout mode="profile">
            <DisplayProfile />
          </MainLayout>
        }
      />
      <Route
        path="alumni-nexus"
        element={
          <MainLayout mode="profile">
            <Feed />
          </MainLayout>
        }
      />
      <Route
        path="profile/me"
        element={
          <MainLayout mode="profile">
            <UpdateProfile />
          </MainLayout>
        }
      />
      <Route
        path="profile/me/employment-details"
        element={
          <MainLayout mode="profile">
            <EditableEmploymentProfile />
          </MainLayout>
        }
      />
      <Route
        path="profile/me/educational-details"
        element={
          <MainLayout mode="profile">
            <EditableEducationProfile />
          </MainLayout>
        }
      />
      <Route
        path="profile/me/achievements-details"
        element={
          <MainLayout mode="profile">
            <EditableAchievementModal />
          </MainLayout>
        }
      />
      <Route
        path="fundraise"
        element={
          <MainLayout mode="public">
            <Fundraise />
          </MainLayout>
        }
      />
    </>
  );

  const adminRoutes = (
    <>
      <Route
        path="dashboard/overalls"
        element={
          <MainLayout mode="admin">
            <OverallDashboard />
          </MainLayout>
        }
      />
      <Route
        path="dashboard/employments"
        element={
          <MainLayout mode="admin">
            <EmploymentDashboard />
          </MainLayout>
        }
      />
      <Route
        path="dashboard/response-rate"
        element={
          <MainLayout mode="admin">
            <ResponsesDashboard />
          </MainLayout>
        }
      />
      <Route
        path="selections"
        element={
          <MainLayout mode="admin">
            <ManageSelections />
          </MainLayout>
        }
      />
      <Route
        path="selections/classifications"
        element={
          <MainLayout mode="admin">
            <ManageClassifications />
          </MainLayout>
        }
      />
      <Route
        path="selections/courses"
        element={
          <MainLayout mode="admin">
            <ManageCourses />
          </MainLayout>
        }
      />
      <Route
        path="selections/jobs"
        element={
          <MainLayout mode="admin">
            <ManageJobs />
          </MainLayout>
        }
      />
      <Route
        path="accounts"
        element={
          <MainLayout mode="admin">
            <UploadProfiles />
          </MainLayout>
        }
      />
      <Route
        path="accounts/all-accounts"
        element={
          <MainLayout mode="admin">
            <ManageAllProfiles />
          </MainLayout>
        }
      />
      <Route
        path="accounts/approve-users"
        element={
          <MainLayout mode="admin">
            <ManageApproveUsers />
          </MainLayout>
        }
      />
      <Route
        path="accounts/users-accounts"
        element={
          <MainLayout mode="admin">
            <ManageUserAccounts />
          </MainLayout>
        }
      />
      <Route
        path="accounts/upload-educations"
        element={
          <MainLayout mode="admin">
            <ManageEducations />
          </MainLayout>
        }
      />
      <Route
        path="accounts/upload-employment"
        element={
          <MainLayout mode="admin">
            <ManageEmployments />
          </MainLayout>
        }
      />
      <Route
        path="accounts/upload-achievements"
        element={
          <MainLayout mode="admin">
            <ManageAchievements />
          </MainLayout>
        }
      />
      <Route
        path="accounts/upload-twowaylink"
        element={
          <MainLayout mode="admin">
            <ManageTwoWayLink />
          </MainLayout>
        }
      />
      <Route
        path="accounts/upload-history"
        element={
          <MainLayout mode="admin">
            <ManageUploadHistory />
          </MainLayout>
        }
      />
    </>
  );

  const publicRoutes = (
    <>
      <Route
        path="profile/me/employment-details"
        element={
          <MainLayout mode="public">
            <EditableEmploymentProfile />
          </MainLayout>
        }
      />
      <Route
        path="profile/me/educational-details"
        element={
          <MainLayout mode="public">
            <EditableEducationProfile />
          </MainLayout>
        }
      />
      <Route
        path="profile/me/achievements-details"
        element={
          <MainLayout mode="public">
            <EditableAchievementModal />
          </MainLayout>
        }
      />
    </>
  );

  const postRoutes = (
    <>
      <Route
        path="pup-feeds"
        element={
          <MainLayout mode="admin">
            <MainFeed />
          </MainLayout>
        }
      />
      <Route
        path="pup-feeds/create"
        element={
          <MainLayout mode="admin">
            <CreatePost />
          </MainLayout>
        }
      />
    </>
  );

  if (auth?.role === "public") {
    return (
      <Routes>
        <Route
          path="home"
          element={
            <MainLayout mode="public">
              <UpdateProfile />
            </MainLayout>
          }
        />
        {publicRoutes}
        <Route
          path="*"
          element={
            <MainLayout mode="public">
              <Missing />
            </MainLayout>
          }
        />
      </Routes>
    );
  } else if (auth?.role === "alumni") {
    return <Routes>{profileRoutes}</Routes>;
  } else if (auth?.role === "officer") {
    return <Routes>{profileRoutes}</Routes>;
  } else if (auth?.role === "admin") {
    return (
      <Routes>
        <Route
          path="home"
          element={
            <MainLayout mode="admin">
              <MainDashboard />
            </MainLayout>
          }
        />
        {profileRoutes}
        {adminRoutes}
        {postRoutes}
        <Route
          path="*"
          element={
            <MainLayout mode="admin">
              <Missing />
            </MainLayout>
          }
        />
        ;
      </Routes>
    );
  } else {
    return <Route path="*" element={<Missing />} />;
  }
};

export default RoleBasedRoutes;
