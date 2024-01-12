import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAll from "../../hooks/utilities/useAll";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Fab,
  Grid,
  ListItemIcon,
  Menu,
  MenuItem,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add,
  ArrowBack,
  AddCircleRounded,
  Business,
  BusinessRounded,
  Cake,
  CheckCircle,
  CheckCircleSharp,
  Delete,
  DeleteForever,
  Description,
  Edit,
  Email,
  EmojiEvents,
  Fingerprint,
  GradeRounded,
  LocationCity,
  LocationOn,
  MoreHoriz,
  Phone,
  PublicRounded,
  School,
  Work,
  WorkOutline,
  WorkOutlined,
  MoneyOff,
  Computer,
  FlightTakeoff,
  DirectionsWalk,
  Loop,
  Search,
} from "@mui/icons-material";
import AddEmploymentModal from "./AddEmploymentModal";
import EditEmploymentModal from "./EditEmploymentModal";
import DeleteEmploymentModal from "./DeleteEmploymentModal";
import EmploymentProfile from "../profile_display/EmploymentProfile";
import EditInitialStatusModal from "./EditInitialStatusModal";

export const EditableEmploymentProfile = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const { auth, setAuth } = useAll();
  const [isModalOpen, setModalOpen] = useState({
    addModal: false,
    editModal: false,
    deleteModal: false,
    currentStatusModal: false,
  });

  const [employmentID, setEmploymentID] = useState(null);

  const handleModalOpen = (type, id) => {
    setEmploymentID(id);
    setModalOpen((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type) => {
    setModalOpen((prev) => ({ ...prev, [type]: false }));
    setEmploymentID("");
  };

  const Chiptip = ({ icon, label, additional = "", actual = "" }) => (
    <Tooltip
      title={actual !== "" ? actual : additional + label}
      sx={{ padding: "0.5rem" }}
    >
      <Chip icon={icon} label={label} />
    </Tooltip>
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getData = async () => {
    return await axiosPrivate.get(
      "/profiles/employment_profiles/me?page=1&per_page=50"
    );
  };

  const { isLoading, data, isError, error, isFetching } = useQuery(
    "employment-profile",
    getData,
    {
      staleTime: 300000,
      // refetchOnWindowFocus: true,
    }
  );

  if (isError) {
    if (error?.response?.data?.detail === "Token has expired") {
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

  if (isLoading) {
    return (
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          justifyContent: "center",
          position: "relative",
          marginY: "2rem",
        }}
      >
        <Box sx={{ alignSelf: "baseline" }}>
          <Skeleton variant="rect" width={200} height={40} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "stretch",
            gap: 2,
            flexDirection: "column",
            width: "80%",
          }}
        >
          {[1, 2, 3].map((index) => (
            <Card sx={{ width: "100%" }} key={index}>
              <CardContent
                sx={{
                  position: "relative",
                }}
              >
                <Grid
                  container
                  alignItems="center"
                  sx={{ display: "flex", flexWrap: "wrap" }}
                >
                  <Grid
                    item
                    sx={{
                      padding: "0 1rem",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Skeleton variant="text" width={200} />
                  </Grid>
                  <Grid item sx={{ whiteSpace: "nowrap" }}>
                    <Skeleton variant="text" width={100} />
                  </Grid>
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  sx={{ display: "flex", flexWrap: "wrap" }}
                >
                  <Grid
                    item
                    sx={{
                      padding: "0 1.5rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Skeleton variant="text" width={150} />
                  </Grid>
                </Grid>
                <Skeleton variant="text" width={250} />
                <Box sx={{ display: "flex", gap: 1, paddingY: 2 }}>
                  <Skeleton variant="rect" width={50} height={20} />
                  <Skeleton variant="rect" width={50} height={20} />
                </Box>
                <Skeleton variant="text" width={150} />
                <Skeleton variant="text" width={150} />
                <Skeleton variant="text" width={150} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Grid>
    );
  }

  data?.data?.employments?.sort((a, b) => {
    const dateA = new Date(a.date_end);
    const dateB = new Date(b.date_end);

    if (dateA > dateB) return -1; // Sort in descending order
    else if (dateA < dateB) return 1;

    return 0;
  });

  const unemploymentOptions = [
    {
      value: "demand-deficient unemployment",
      label: "Demand-Deficient Unemployment",
      tooltip:
        "Insufficient demand, more job seekers than available positions.",
      icon: <MoneyOff />,
    },
    {
      value: "advances in technology",
      label: "Advances in Technology",
      tooltip:
        "Job displacement due to technological progress, requiring retraining.",
      icon: <Computer />,
    },
    {
      value: "job outsourcing",
      label: "Job Outsourcing",
      tooltip:
        "Company shifts operations abroad for lower labor costs, impacting employment.",
      icon: <FlightTakeoff />,
    },
    {
      value: "voluntary",
      label: "Voluntary Leave",
      tooltip:
        "Voluntary exit from workforce, financial stability enables selective job search.",
      icon: <DirectionsWalk />,
    },
    {
      value: "relocation",
      label: "Relocation",
      tooltip: "Unemployment due to relocation; job search in a new location.",
      icon: <LocationCity />,
    },
    {
      value: "new force",
      label: "Newly Entering the Workforce",
      tooltip:
        "Graduates entering job market; seeking roles matching qualifications.",
      icon: <School />,
    },
    {
      value: "reenter force",
      label: "Re-Entering the Workforce",
      tooltip:
        "Returning to work after a hiatus; reasons include family responsibilities.",
      icon: <Loop />,
    },
  ];

  const employmentOptions = [
    {
      value: "employed",
      title: "Employed",
      tooltip: "Currently engaged in work or occupation.",
    },
    {
      value: "self-employed",
      title: "Self-employed",
      tooltip:
        "Working independently, managing one's own business or profession.",
    },
    {
      value: "never been employed",
      title: "Never Been Employed",
      tooltip: "Fresh candidate seeking first employment opportunity.",
    },
    {
      value: "unemployed",
      title: "Unemployed",
      tooltip: "Temporarily out of work, actively seeking new opportunities.",
    },
    {
      value: "unable to work",
      title: "Unable to Work",
      tooltip:
        "Not actively seeking employment and currently unable to participate in the workforce.",
    },
  ];

  const jobFindingOptions = [
    {
      value: "others",
      title: "Other Means",
      tooltip: "Finding job through methods not explicitly specified.",
    },
    {
      value: "pup job fair",
      title: "PUP Job Fair",
      tooltip:
        "Seeking employment opportunities through Polytechnic University of the Philippines job fair.",
    },
    {
      value: "job advertisement",
      title: "Job Advertisement",
      tooltip: "Exploring job opportunities through advertised positions.",
    },
    {
      value: "recommendations",
      title: "Recommendations",
      tooltip:
        "Relying on referrals and recommendations from peers or professional network.",
    },
    {
      value: "On the Job Training",
      title: "On the Job Training",
      tooltip:
        "Pursuing employment by gaining practical experience and skills through on-the-job training.",
    },
    {
      value: "Information from friends",
      title: "Information from Friends",
      tooltip:
        "Getting job leads and insights about opportunities through friends or acquaintances.",
    },
    {
      value: "Government-sponsored job Fair",
      title: "Government-sponsored Job Fair",
      tooltip:
        "Exploring job opportunities facilitated by government-sponsored job fairs.",
    },
    {
      value: "Family Business",
      title: "Family Business",
      tooltip:
        "Engaging in employment within a family-owned business or enterprise.",
    },
    {
      value: "Walk-in Applicant",
      title: "Walk-in Applicant",
      tooltip:
        "Applying for jobs directly by physically visiting employers or companies.",
    },
  ];

  data?.data?.employments?.sort((a, b) => {
    const dateA = new Date(a.date_end);
    const dateB = new Date(b.date_end);

    if (dateA > dateB) return -1; // Sort in descending order
    else if (dateA < dateB) return 1;

    return 0;
  });

  const unemployed =
    data?.data?.present_employment_status === "long-term unemployed" ||
    data?.data?.present_employment_status === "short-term unemployed" ||
    data?.data?.present_employment_status === "unable to work";

  const generatedChiptips = data?.data?.unemployment_reason.map((reason) => {
    const option = unemploymentOptions.find((opt) => opt.value === reason);

    return (
      <Chiptip
        key={reason} // Ensure each Chiptip has a unique key
        icon={option ? option.icon : <LocationOn color="primary" />}
        label={option ? option.label : data?.data?.origin_address}
      />
    );
  });

  const employmentStatusOption = employmentOptions.find(
    (option) => option.value === data?.data?.present_employment_status
  );

  return (
    data?.data?.employments && (
      <Grid
        item
        sx={{
          width: "50%",
          marginX: "auto",
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
          <Tooltip title="go back">
            <Fab
              size="small"
              onClick={() => navigate(from, { replace: true })}
              color="primary"
            >
              <ArrowBack />
            </Fab>
          </Tooltip>
          <Tooltip title="add employment">
            <Fab
              size="small"
              color="primary"
              onClick={() => handleModalOpen("addModal")} // Trigger the profile edit modal
            >
              <Add />
            </Fab>
          </Tooltip>
          <Tooltip title="manually edit current employment status">
            <Fab
              size="small"
              color="primary"
              onClick={() => handleModalOpen("currentStatusModal")} // Trigger the profile edit modal
            >
              <Edit />
            </Fab>
          </Tooltip>
        </Box>
        <Grid
          container
          sx={{
            marginY: "1rem",
            gap: 3,
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              paddingX: "1rem",
              flexDirection: "column",
            }}
          >
            <Grid
              item
              xs={12}
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  textTransform: "capitalize",
                  textAlign: "center",
                  fontWeight: "bold",
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Tooltip title="Current Employment Status">
                  <Work />
                </Tooltip>
                <Tooltip title={employmentStatusOption?.tooltip || ""}>
                  {employmentStatusOption?.title || ""}
                </Tooltip>
              </Typography>
              {unemployed && (
                <>
                  <Divider sx={{ padding: 2 }}>
                    <Typography variant="subtitle2">
                      Unemployment Reasons
                    </Typography>
                  </Divider>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 1,
                      justifyContent: "center",
                    }}
                  >
                    {generatedChiptips}
                  </Box>
                </>
              )}
            </Grid>
            {data?.data?.employments.map((employment, index) => {
              return (
                <React.Fragment key={employment.id}>
                  <Grid
                    container
                    sx={{
                      gap: 2,
                      borderBottom: "2px #aaa solid",
                      paddingY: "0.5rem",
                      position: "relative",
                    }}
                  >
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <React.Fragment>
                          <Button
                            {...bindTrigger(popupState)}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: "1rem",
                              right: "1rem",
                            }}
                          >
                            <MoreHoriz color="primary" />
                          </Button>
                          <Menu {...bindMenu(popupState)}>
                            <MenuItem
                              onClick={() =>
                                handleModalOpen("editModal", employment.id)
                              } // Trigger the profile edit modal
                            >
                              <ListItemIcon>
                                <Edit fontSize="small" />
                              </ListItemIcon>
                              edit
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleModalOpen("deleteModal", employment.id)
                              }
                            >
                              <ListItemIcon>
                                <Delete fontSize="small" />
                              </ListItemIcon>
                              delete
                            </MenuItem>
                          </Menu>
                        </React.Fragment>
                      )}
                    </PopupState>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                      >
                        {employment.company_name}
                      </Typography>
                      <Chiptip
                        label={(() => {
                          const startDate = new Date(employment.date_hired);
                          if (!employment.date_end)
                            return (
                              "active job since " + startDate.getFullYear()
                            );
                          const endDate = employment.date_end
                            ? new Date(employment.date_end)
                            : "ongoing";
                          const monthsDifference =
                            (endDate.getFullYear() - startDate.getFullYear()) *
                              12 +
                            (endDate.getMonth() - startDate.getMonth());

                          const yearsDifference = monthsDifference / 12; // Calculate years with decimal
                          const formattedYears = yearsDifference.toFixed(1); // Round to 2 decimal places
                          const timespan =
                            monthsDifference < 1
                              ? ""
                              : ` (${formattedYears} years)`;

                          return `${startDate.getFullYear()} to ${endDate.getFullYear()}${timespan}`;
                        })()}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        paddingX: "1rem",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {employment?.job_title
                          ? employment?.job_title
                          : "unknown job title"}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {employment?.classification
                          ? employment?.classification
                          : "unknown job classification"}
                      </Typography>
                    </Grid>
                    <Grid item sx={{ display: "flex", gap: "0.5rem" }}>
                      {employment?.aligned_with_academic_program && (
                        <Chiptip
                          icon={<CheckCircle color="primary" />}
                          label="Academically Aligned"
                          actual="This Job is Aligned with their taken Academic Program"
                        />
                      )}
                      {employment?.region && employment?.city ? (
                        <Chiptip
                          icon={<LocationOn color="primary" />}
                          label={employment?.region + ", " + employment?.city}
                        />
                      ) : (
                        <Chiptip
                          icon={<LocationOn color="primary" />}
                          label={employment?.country}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Divider>
                        <Typography variant="subtitle2">
                          Job Snapshot
                        </Typography>
                      </Divider>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        <Tooltip title="gross monthly income">
                          {employment?.gross_monthly_income}
                        </Tooltip>
                      </Typography>
                    </Grid>

                    <Box
                      sx={{
                        display: "flex",
                        paddingY: 1,
                        width: "100%",
                        gap: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      {employment?.finding_job_means && (
                        <Chiptip
                          icon={<Search color="primary" />}
                          label={
                            jobFindingOptions.find(
                              (option) =>
                                option.value === employment?.finding_job_means
                            )?.title
                          }
                          actual="Means of Finding the Job"
                        />
                      )}

                      {employment?.employment_contract && (
                        <Chiptip
                          icon={<Description color="primary" />}
                          label={
                            <Typography>
                              {employment?.employment_contract}
                            </Typography>
                          }
                          actual="employment contract"
                        />
                      )}

                      {employment?.employer_type && (
                        <Chiptip
                          icon={<Business color="primary" />}
                          label={
                            <Typography>{employment?.employer_type}</Typography>
                          }
                          actual="employer type"
                        />
                      )}

                      {employment?.job_position && (
                        <Chiptip
                          icon={<Work color="primary" />}
                          label={
                            <Typography>{employment?.job_position}</Typography>
                          }
                          actual="job position"
                        />
                      )}
                    </Box>
                  </Grid>
                </React.Fragment>
              );
            })}
          </Grid>
          {isModalOpen.addModal ? (
            <AddEmploymentModal
              open={isModalOpen.addModal}
              onClose={() => handleCloseModal("addModal")}
            />
          ) : null}
          {isModalOpen.currentStatusModal ? (
            <EditInitialStatusModal
              open={isModalOpen.currentStatusModal}
              onClose={() => handleCloseModal("currentStatusModal")}
              prior={true}
            />
          ) : null}
          {employmentID && isModalOpen.editModal ? (
            <EditEmploymentModal
              open={isModalOpen.editModal}
              onClose={() => handleCloseModal("editModal")}
              employmentID={employmentID}
            />
          ) : null}

          {employmentID && isModalOpen.deleteModal ? (
            <DeleteEmploymentModal
              open={isModalOpen.deleteModal}
              onClose={() => handleCloseModal("deleteModal")}
              employmentID={employmentID}
            />
          ) : null}
        </Grid>
      </Grid>
    )
  );
};

export default EditableEmploymentProfile;
