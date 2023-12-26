import { useLocation, Routes, Route } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Feed from "../components/Feed";
import Explore from "../components/Explore";
import UpdateProfile from "../components/profile_edit/UpdateProfile";
import Fundraise from "../components/Fundraise";
import Missing from "../components/status_display/UserNotFound";
import PublicLayout from "../layout/PublicLayout";
import MainLayout from "../layout/MainLayout";
import { ManageSelections } from "../components/selections/ManageSelections";
import EditableEmploymentProfile from "../components/profile_edit/EditableEmploymentProfile";
import EditableAchievementModal from "../components/profile_edit/EditableAchievementModal";
import EditableEducationProfile from "../components/profile_edit/EditableEducationProfile";
import { UploadProfiles } from "../components/users_upload/UploadUserAccounts";
import DisplayProfile from "../components/profile_display/DisplayProfile";
import MainDashboard from "../components/analytics/MainDashboard";
import AdminDashboardLayout from "../layout/AdminDashboardLayout";
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
const RoleBasedRoutes = ({ mode, setMode }) => {
  const { auth } = useAuth();
  const location = useLocation();

  const commonRoutes = (
    <>
      <Route
        path="feed"
        element={
          <MainLayout mode={mode} setMode={setMode}>
            <Feed />
          </MainLayout>
        }
      />
      <Route
        path="explore"
        element={
          <MainLayout mode={mode} setMode={setMode}>
            <Explore />
          </MainLayout>
        }
      />
      <Route
        path="explore/alumni/:username"
        element={
          <MainLayout mode={mode} setMode={setMode}>
            <DisplayProfile />
          </MainLayout>
        }
      />
      <Route
        path="alumni-nexus"
        element={
          <MainLayout mode={mode} setMode={setMode}>
            <Feed />
          </MainLayout>
        }
      />
      <Route
        path="profile/me"
        element={
          <MainLayout mode={mode} setMode={setMode}>
            <UpdateProfile />
          </MainLayout>
        }
      />
      <Route
        path="profile/me/employment-details"
        element={
          <MainLayout mode={mode} setMode={setMode}>
            <EditableEmploymentProfile />
          </MainLayout>
        }
      />
      <Route
        path="profile/me/educational-details"
        element={
          <MainLayout mode={mode} setMode={setMode}>
            <EditableEducationProfile />
          </MainLayout>
        }
      />
      <Route
        path="profile/me/achievements-details"
        element={
          <MainLayout mode={mode} setMode={setMode}>
            <EditableAchievementModal />
          </MainLayout>
        }
      />
      <Route
        path="fundraise"
        element={
          <MainLayout mode={mode} setMode={setMode}>
            <Fundraise />
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
            <PublicLayout>
              <UpdateProfile />
            </PublicLayout>
          }
        />
        <Route path="*" element={<Missing />} />
        <Route
          path="profile/me/employment-details"
          element={
            <PublicLayout>
              <EditableEmploymentProfile />
            </PublicLayout>
          }
        />
        <Route
          path="profile/me/educational-details"
          element={
            <PublicLayout>
              <EditableEducationProfile />
            </PublicLayout>
          }
        />
        <Route
          path="profile/me/achievements-details"
          element={
            <PublicLayout>
              <EditableAchievementModal />
            </PublicLayout>
          }
        />
      </Routes>
    );
  } else if (auth?.role === "alumni") {
    return <Routes>{commonRoutes}</Routes>;
  } else if (auth?.role === "faculty") {
    return <Routes>{commonRoutes}</Routes>;
  } else if (auth?.role === "admin") {
    return (
      <Routes>
        {commonRoutes}
        <Route
          path="home"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <MainDashboard />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="selections"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <ManageSelections />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="selections/classifications"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <ManageClassifications />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="selections/courses"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <ManageCourses />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="selections/jobs"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <ManageJobs />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="accounts"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <UploadProfiles />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="accounts/all-accounts"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <ManageAllProfiles />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="accounts/approve-users"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <ManageApproveUsers />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="accounts/users-accounts"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <ManageUserAccounts />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="accounts/upload-educations"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <ManageEducations />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="accounts/upload-employment"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <ManageEmployments />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="accounts/upload-achievements"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <ManageAchievements />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="accounts/upload-twowaylink"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <ManageTwoWayLink />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="accounts/upload-history"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <ManageUploadHistory />
            </AdminDashboardLayout>
          }
        />
        <Route
          path="*"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <Missing />
            </AdminDashboardLayout>
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
