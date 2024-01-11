import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Grid,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import useGetAllFeeds from "../../hooks/feeds/useGetAllfeeds";
import LoadingCircular from "../status_display/LoadingCircular";
import { Delete, Edit, MoreHoriz } from "@mui/icons-material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import useAll from "../../hooks/utilities/useAll";
import DeletePostModal from "./DeletePostModal";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useGetSpecificFeed from "../../hooks/feeds/useGetSpecificFeed";

const ViewPost = () => {
  const navigate = useNavigate();

  const { postID } = useParams();

  const { data: feed, isLoading: isLoadingFeed } = useGetSpecificFeed(postID);

  const [feedID, setFeedID] = useState(null);

  const [isModalOpen, setModalOpen] = useState({
    editModal: false,
    deleteModal: false,
  });

  if (isLoadingFeed) return <LoadingCircular />;

  const handleCloseModal = (type) => {
    setModalOpen((prev) => ({ ...prev, [type]: false }));
    setFeedID("");
  };

  const handleModalOpen = (type, id) => {
    setFeedID(id);
    setModalOpen((prev) => ({ ...prev, [type]: true }));
  };

  let created_date;
  const dateObject = new Date(feed?.data?.created_at);
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const timeDifference = currentDate - dateObject;

  // Calculate the difference in days
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // Check if it's less than a month
  if (daysDifference < 30) {
    // Display days ago
    created_date = `${daysDifference} day${
      daysDifference !== 1 ? "s" : ""
    } ago`;
  } else {
    // Display months ago
    const monthsDifference = Math.floor(daysDifference / 30);
    created_date = `${monthsDifference} month${
      monthsDifference !== 1 ? "s" : ""
    } ago`;
  }

  const title = feed?.data?.title;
  const capitalizedTitle = title
    ? title.charAt(0).toUpperCase() + title.slice(1)
    : null;

  return (
    <Grid container width={"50%"} mx={"auto"} sx={{ display: "flex", gap: 2 }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: (theme) => theme.palette.common.main,
          maxHeight: feed?.data?.img_link ? "" : "25vh",
          width: "100%"
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            padding: 2,
            pb: 1,
            alignItems: "center",
            position: "relative",
          }}
        >
          <img
            src={
              "https://www.clipartmax.com/png/full/70-708931_the-pup-logo-polytechnic-university-of-the-philippines-logo.png"
            }
            style={{ width: "auto", height: "40px" }}
          />

          <Typography variant="subtitle1" fontWeight={"fontWeightSemiBold"}>
            PUPQC Alumni
          </Typography>
          <Typography variant="caption">{created_date}</Typography>
          {feed?.data?.updated_at != feed?.data?.created_at && (
            <Typography variant="caption">Edited</Typography>
          )}
                            <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                      <React.Fragment>
                        <Button
                          {...bindTrigger(popupState)}
                          size="small"
                          sx={{
                            position: "absolute",
                            right: "1rem",
                          }}
                        >
                          <MoreHoriz color="primary" />
                        </Button>
                        <Menu {...bindMenu(popupState)}>
                          <MenuItem
                            onClick={() =>
                              navigate(
                                `/pup-feeds/modify/${feed?.data?.post_type}/${feed?.data?.id}/true`
                              )
                            }
                          >
                            <ListItemIcon>
                              <Edit fontSize="small" />
                            </ListItemIcon>
                            edit
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleModalOpen("deleteModal", feed?.data?.id)
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
        <Box p={2}>
          <Box mb={"1rem"}>
            <Typography variant="h6">{capitalizedTitle}</Typography>
          </Box>
        
            <Box
              dangerouslySetInnerHTML={{ __html: feed?.data?.content }}
              my={"2rem"}
            />
    
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={feed?.data?.img_link || ""}
              alt=""
              width={"auto"}
              height="500"
            />
          </Box>
        </Box>
      </Card>
      {feedID && isModalOpen.deleteModal ? (
        <DeletePostModal
          open={isModalOpen.deleteModal}
          onClose={() => handleCloseModal("deleteModal")}
          feedID={feedID}
          exit={true}
        />
      ) : null}
    </Grid>
  );
};

export default ViewPost;
