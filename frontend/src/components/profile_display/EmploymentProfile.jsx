import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
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
  AddCircleRounded,
  BusinessRounded,
  Cake,
  CheckCircle,
  CheckCircleSharp,
  Delete,
  DeleteForever,
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
} from "@mui/icons-material";
import AddEmploymentModal from "../profile_edit/AddEmploymentModal";
import EditEmploymentModal from "../profile_edit/EditEmploymentModal";
import DeleteEmploymentModal from "../profile_edit/DeleteEmploymentModal";

export const EmploymentProfile = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const [isModalOpen, setModalOpen] = useState({
    addModal: false,
    editModal: false,
    deleteModal: false,
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [employmentID, setEmploymentID] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
      color="secondary"
      title={actual !== "" ? actual : additional + label}
      sx={{ padding: "0.5rem" }}
    >
      <Chip icon={icon} label={label} />
    </Tooltip>
  );

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
    if (error.response.data.detail === "Token has expired") {
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
    // console.log("nani");
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

        <Fab
          size="small"
          color="primary"
          sx={{
            position: "absolute",
            top: "-1rem",
            right: "1rem",
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
        </Fab>
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

  return (
    data?.data?.employments && (
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
          {data?.data?.present_employment_status && (
            <Chiptip
              icon={<WorkOutline color="primary" />}
              label={
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {data?.data?.present_employment_status}
                </Typography>
              }
              actual="current employment status"
              sx={{ alignSelf: "baseline" }}
            />
          )}
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
          {data?.data?.employments.map((employment, index) => {
            return (
              <React.Fragment key={employment.id}>
                <Card sx={{ width: "100%" }} key={index}>
                  <CardContent
                    sx={{
                      position: "relative",
                    }}
                  >
                    <Box>
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <React.Fragment>
                            <Button
                              // variant="contained"
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
                    </Box>
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
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                          }}
                        >
                          {employment.company_name}
                        </Typography>
                      </Grid>
                      <Grid item sx={{ whiteSpace: "nowrap" }}>
                        <Typography variant="subtitle2">
                          {(() => {
                            const startDate = new Date(employment.date_hired);
                            if (!employment.date_end)
                              return (
                                "active job since " + startDate.getFullYear()
                              );
                            const endDate = employment.date_end
                              ? new Date(employment.date_end)
                              : "ongoing";
                            const monthsDifference =
                              (endDate.getFullYear() -
                                startDate.getFullYear()) *
                                12 +
                              (endDate.getMonth() - startDate.getMonth());

                            const yearsDifference = monthsDifference / 12; // Calculate years with decimal
                            const formattedYears =
                              yearsDifference.toFixed(1) + "0"; // Round to 2 decimal places

                            const timespan =
                              monthsDifference < 1
                                ? ""
                                : ` (${formattedYears} years)`;

                            return `${startDate.getFullYear()} to ${endDate.getFullYear()}${timespan}`;
                          })()}
                        </Typography>
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
                        <Typography
                          variant="body"
                          sx={{ textTransform: "lowercase" }}
                        >
                          {employment?.job_title}, {employment?.classification}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box sx={{ display: "flex", gap: 1, paddingY: 2 }}>
                      {employment.first_job && (
                        <Chiptip
                          icon={<Work color="primary" />}
                          label="first job "
                        />
                      )}
                      {employment.aligned_with_academic_program && (
                        <Chiptip
                          icon={<CheckCircle color="primary" />}
                          label="academically aligned"
                          actual="this job is aligned with their graduated academic program"
                        />
                      )}
                    </Box>
                    <Divider sx={{ paddingBottom: 1 }}>
                      <Typography variant="subtitle2">
                        career snapshot
                      </Typography>
                    </Divider>
                    <Typography
                      variant="h6"
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        padding: 1,
                      }}
                    >
                      <Tooltip color="secondary" title="gross monthly income">
                        {employment?.gross_monthly_income}
                      </Tooltip>
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        paddingY: 1,
                        width: "100%",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Chiptip
                        icon={<BusinessRounded color="primary" />}
                        label={
                          <Typography sx={{ textTransform: "lowercase" }}>
                            {employment.type_of_employer}
                          </Typography>
                        }
                        actual="employer type"
                      />
                      <Chiptip
                        icon={<PublicRounded color="primary" />}
                        label={
                          <Typography sx={{ textTransfworm: "lowercase" }}>
                            {employment.location_of_employment}
                          </Typography>
                        }
                        actual="employment location"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </React.Fragment>
            );
          })}
        </Box>

        <Fab
          size="small"
          color="primary"
          sx={{
            position: "absolute",
            top: "-1rem",
            right: "1rem",
          }}
          onClick={() => handleModalOpen("addModal")} // Trigger the profile edit modal
        >
          <AddCircleRounded />
        </Fab>
        {
          <>
            <AddEmploymentModal
              open={isModalOpen.addModal}
              onClose={() => handleCloseModal("addModal")} // Pass a function reference
            />
            {employmentID && (
              <>
                <EditEmploymentModal
                  open={isModalOpen.editModal}
                  onClose={() => handleCloseModal("editModal")}
                  employmentID={employmentID}
                />
                <DeleteEmploymentModal
                  open={isModalOpen.deleteModal}
                  onClose={() => handleCloseModal("deleteModal")}
                  employmentID={employmentID}
                />
              </>
            )}
          </>
        }
      </Grid>
    )
  );
};

export default EmploymentProfile;