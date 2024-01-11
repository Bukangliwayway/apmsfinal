import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useGetAllFeeds from "../../hooks/feeds/useGetAllfeeds";
import LoadingCircular from "../status_display/LoadingCircular";
import { Delete, Edit, MoreHoriz } from "@mui/icons-material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import useAll from "../../hooks/utilities/useAll";
import DeletePostModal from "./DeletePostModal";
import { useNavigate } from "react-router-dom";

const AllFeedsContent = () => {
  const navigate = useNavigate();

  const {
    data: feeds,
    isLoading: isLoadingFeeds,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    refetch
  } = useGetAllFeeds();

  const observer = useRef();


  const lastFeedElementRef = useCallback(
    (node) => {
      if (isFetchingNextPage || isError) return; 
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isError) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage, isError]
  );

  useEffect(() => {
    const currentObserver = observer.current;
    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, []);

  const { mode } = useAll();

  const [feedID, setFeedID] = useState(null);

  const [isModalOpen, setModalOpen] = useState({
    editModal: false,
    deleteModal: false,
  });

  const handleCloseModal = (type) => {
    setModalOpen((prev) => ({ ...prev, [type]: false }));
    setFeedID("");
  };

  const handleModalOpen = (type, id) => {
    setFeedID(id);
    setModalOpen((prev) => ({ ...prev, [type]: true }));
  };

  if (isLoadingFeeds) return <LoadingCircular />;



  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {feeds?.pages.map((page, pageIndex) =>
        page.map((feed, feedIndex) => {
          let created_date;
          const isLastElement =
            pageIndex === feeds.pages.length - 1 &&
            feedIndex === page.length - 1;
          const dateObject = new Date(feed?.created_at);
          const currentDate = new Date();

          // Calculate the difference in milliseconds
          const timeDifference = currentDate - dateObject;

          // Calculate the difference in days
          const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
          );

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

          const title = feed?.title;
          const capitalizedTitle = title
            ? title.charAt(0).toUpperCase() + title.slice(1)
            : null;

          return (
            <>
              <Card
                ref={isLastElement ? lastFeedElementRef : null}
                id={feed?.id}
                key={feed?.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: (theme) => theme.palette.common.main,
                  maxHeight: feed?.img_link ? "" : "25vh",
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

                  <Typography
                    variant="subtitle1"
                    fontWeight={"fontWeightSemiBold"}
                  >
                    PUPQC Alumni
                  </Typography>
                  <Typography variant="caption">{created_date}</Typography>
                  {feed?.updated_at != feed?.created_at && (
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
                                `/pup-feeds/modify/${feed?.post_type}/${feed?.id}`
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
                              handleModalOpen("deleteModal", feed?.id)
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
                <CardActionArea
                  onClick={() => navigate(`/pup-feeds/view-post/${feed?.id}`)}
                  sx={{
                    position: "relative", // Ensure the parent has a relative position
                    padding: 2,
                    ...(!feed?.img_link &&
                      feed?.content?.length > 50 && {
                        "&:after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          top: "calc(100% - 10rem)", // Adjust the value as needed
                          backgroundImage:
                            mode == "light"
                              ? "linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5))"
                              : "linear-gradient(rgba(36, 47, 61, 0), rgba(36, 47, 61, 0.5))",
                          backgroundSize: "100% 10rem",
                          backgroundRepeat: "no-repeat",
                        },
                      }),
                  }}
                >
                  <Box mb={"1rem"}>
                    <Typography variant="h6">{capitalizedTitle}</Typography>
                  </Box>
                  {!feed?.img_link && (
                    <Box
                      dangerouslySetInnerHTML={{ __html: feed?.content }}
                      mt={"1rem"}
                      sx={{
                        maxHeight: "calc(10 * (1.2em))",
                        overflow: "hidden",
                      }}
                    />
                  )}
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <img
                      src={feed?.img_link || ""}
                      alt=""
                      width={"auto"}
                      height="500"
                    />
                  </Box>
                </CardActionArea>
              </Card>
              {isLastElement && isFetchingNextPage && !isError ? "Loading more..." : null}
            </>
          );
        })
      )}
      {feedID && isModalOpen.deleteModal ? (
        <DeletePostModal
          open={isModalOpen.deleteModal}
          onClose={() => handleCloseModal("deleteModal")}
          feedID={feedID}
          refetch={refetch}
        />
      ) : null}
    </Box>
  );
};

export default AllFeedsContent;
