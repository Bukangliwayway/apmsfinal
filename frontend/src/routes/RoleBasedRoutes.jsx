import { useLocation, Navigate, Routes, Route } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import Feed from "../components/Feed";
import Explore from "../components/Explore";
import Announcements from "../components/Announcements";
import News from "../components/News";
import Events from "../components/Events";
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
import AdminDashboardLayout from "../layout/AdminDashboardLayout";
const RoleBasedRoutes = ({ mode, setMode }) => {
  const { auth } = useAuth();
  const location = useLocation();

  const commonRoutes = (
    <>
      <Route
        path="home"
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
          path="selections"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <ManageSelections />
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
          path="dashboard"
          element={
            <AdminDashboardLayout mode={mode} setMode={setMode}>
              <UploadProfiles />
            </AdminDashboardLayout>
          }
        />
        <Route path="*" element={<Missing />} />;
      </Routes>
    );
  } else {
    return <Route path="*" element={<Missing />} />;
  }
};

export default RoleBasedRoutes;