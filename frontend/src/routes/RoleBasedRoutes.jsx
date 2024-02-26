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
import AnnouncementFeed from "../components/pup_feeds/AnnouncementFeed";
import NewsFeed from "../components/pup_feeds/NewsFeed";
import EventFeed from "../components/pup_feeds/EventFeed";
import FundraisingFeed from "../components/pup_feeds/FundraisingFeed";
import ModifyPost from "../components/pup_feeds/ModifyPost";
import ViewPost from "../components/pup_feeds/ViewPost";
import { useState } from "react";
import useMissingFields from "../hooks/useMissingFields";
import SalaryTrendLayout from "../components/analytics/SalaryTrendLayout";
import SoloView from "../components/analytics/SoloView";
const RoleBasedRoutes = () => {
  const { auth } = useAll();
  const {
    data: missingFields,
    isLoading: isLoadingMissingFields,
    isError: isErrorMissingFields,
    error: errorMissingFields,
  } = useMissingFields();
  const profileRoutes = (
    <>
      <Route
        path="explore"
        element={
          <MainLayout mode="profile">
            {!(missingFields?.data?.length != 0 || auth?.role == "public") ? (
              <Explore />
            ) : (
              <Missing />
            )}
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
        path="dashboard/SalaryTrend"
        element={
          <MainLayout mode="admin">
            <SoloView type={"Salary Trend"} />
          </MainLayout>
        }
      />
      <Route
        path="dashboard/WorkAlignment"
        element={
          <MainLayout mode="admin">
            <SoloView type={"Work Alignment"} />
          </MainLayout>
        }
      />
      <Route
        path="dashboard/employertype"
        element={
          <MainLayout mode="admin">
            <SoloView type={"Employer Type"} />
          </MainLayout>
        }
      />
      <Route
        path="dashboard/employmentstatus"
        element={
          <MainLayout mode="admin">
            <SoloView type={"Employment Status"} dashboard="Profile" />
          </MainLayout>
        }
      />
      <Route
        path="dashboard/gender"
        element={
          <MainLayout mode="admin">
            <SoloView type={"Gender"} dashboard="Profile" />
          </MainLayout>
        }
      />
      <Route
        path="dashboard/civilstatus"
        element={
          <MainLayout mode="admin">
            <SoloView type={"Civil Status"} dashboard="Profile" />
          </MainLayout>
        }
      />
      <Route
        path="dashboard/responserate"
        element={
          <MainLayout mode="admin">
            <SoloView type={"Response Rate"} dashboard="Profile" />
          </MainLayout>
        }
      />
      <Route
        path="dashboard/employmentcontract"
        element={
          <MainLayout mode="admin">
            <SoloView type={"Employment Contract"} />
          </MainLayout>
        }
      />
      <Route
        path="dashboard/monthlyincome"
        element={
          <MainLayout mode="admin">
            <SoloView type={"Monthly Income"} />
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
        path="dashboard/JobClassification"
        element={
          <MainLayout mode="admin">
            <SoloView type={"Job Classification"} />
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

  // const publicRoutes = (
  //   <>
  //     <Route
  //       path="profile/me/employment-details"
  //       element={
  //         <MainLayout mode="public">
  //           <EditableEmploymentProfile />
  //         </MainLayout>
  //       }
  //     />
  //     <Route
  //       path="profile/me/educational-details"
  //       element={
  //         <MainLayout mode="public">
  //           <EditableEducationProfile />
  //         </MainLayout>
  //       }
  //     />
  //     <Route
  //       path="profile/me/achievements-details"
  //       element={
  //         <MainLayout mode="public">
  //           <EditableAchievementModal />
  //         </MainLayout>
  //       }
  //     />
  //   </>
  // );

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
        path="pup-feeds/announcement"
        element={
          <MainLayout mode="admin">
            <AnnouncementFeed />
          </MainLayout>
        }
      />
      <Route
        path="pup-feeds/news"
        element={
          <MainLayout mode="admin">
            <NewsFeed />
          </MainLayout>
        }
      />
      <Route
        path="pup-feeds/event"
        element={
          <MainLayout mode="admin">
            <EventFeed />
          </MainLayout>
        }
      />
      <Route
        path="pup-feeds/fundraising"
        element={
          <MainLayout mode="admin">
            <FundraisingFeed />
          </MainLayout>
        }
      />
      <Route
        path="pup-feeds/create/:type"
        element={
          <MainLayout mode="admin">
            <CreatePost />
          </MainLayout>
        }
      />
      <Route
        path="pup-feeds/modify/:type/:postID"
        element={
          <MainLayout mode="admin">
            <ModifyPost />
          </MainLayout>
        }
      />
      <Route
        path="pup-feeds/modify/:type/:postID/:redirect"
        element={
          <MainLayout mode="admin">
            <ModifyPost />
          </MainLayout>
        }
      />
      <Route
        path="pup-feeds/view-post/:postID"
        element={
          <MainLayout mode="admin">
            <ViewPost />
          </MainLayout>
        }
      />
    </>
  );

  if (auth?.role === "alumni" || auth?.role === "public") {
    return (
      <Routes>
        <Route
          path="home"
          element={
            <MainLayout mode="profile">
              <MainFeed />
            </MainLayout>
          }
        />
        {profileRoutes}
        <Route
          path="pup-feeds/announcement"
          element={
            <MainLayout mode="profile" noquote={true}>
              <AnnouncementFeed />
            </MainLayout>
          }
        />
        <Route
          path="pup-feeds/news"
          element={
            <MainLayout mode="profile" noquote={true}>
              <NewsFeed />
            </MainLayout>
          }
        />
        <Route
          path="pup-feeds/event"
          element={
            !(missingFields?.data?.length != 0 || auth?.role == "public") ? (
              <MainLayout mode="profile" noquote={true}>
                <EventFeed />
              </MainLayout>
            ) : (
              <MainLayout mode="profile" noquote={true}>
                <Missing />
              </MainLayout>
            )
          }
        />
        <Route
          path="pup-feeds/fundraising"
          element={
            !(missingFields?.data?.length != 0 || auth?.role == "public") ? (
              <MainLayout mode="profile" noquote={true}>
                <FundraisingFeed />
              </MainLayout>
            ) : (
              <MainLayout mode="profile" noquote={true}>
                <Missing />
              </MainLayout>
            )
          }
        />
        <Route
          path="pup-feeds/view-post/:postID"
          element={
            <MainLayout mode="profile" noquote={true}>
              <ViewPost />
            </MainLayout>
          }
        />
        <Route
          path="*"
          element={
            <MainLayout mode="alumni">
              <Missing />
            </MainLayout>
          }
        />
      </Routes>
    );
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
      </Routes>
    );
  } else {
    return <Route path="*" element={<Missing />} />;
  }
};

export default RoleBasedRoutes;
