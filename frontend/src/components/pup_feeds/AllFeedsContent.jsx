import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
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
import dayjs from "dayjs";

const AllFeedsContent = ({ type }) => {
  const Chiptip = ({ icon, label, additional = "", actual = "" }) => (
    <Tooltip
      title={actual !== "" ? actual : additional + label}
      sx={{ padding: "0.5rem" }}
    >
      <Chip icon={icon} label={label} />
    </Tooltip>
  );

  const navigate = useNavigate();

  const {
    data: feeds,
    isLoading: isLoadingFeeds,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    error,
    refetch,
  } = useGetAllFeeds(type);

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

  const { mode, auth } = useAll();

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

  if (feeds.pages[0].detail == "No Post to Show")
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="subtitle1" align="center" mx="auto" py={"2rem"}>
          There's no Post Yet!
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {feeds?.pages?.map((page, pageIndex) =>
        page?.map((feed, feedIndex) => {
          let created_date;
          const isLastElement =
            pageIndex === feeds.pages.length - 1 &&
            feedIndex === page.length - 1;
          const dateObject = new Date(feed?.created_at);
          const currentDate = new Date();

          // Calculate the difference in milliseconds
          const timeDifference = currentDate - dateObject;

          // Calculate the difference in minutes, hours, days, months, and years
          const minutesDifference = Math.floor(timeDifference / (1000 * 60));
          const hoursDifference = Math.floor(minutesDifference / 60);
          const daysDifference = Math.floor(hoursDifference / 24);
          const monthsDifference = Math.floor(daysDifference / 30);
          const yearsDifference = Math.floor(monthsDifference / 12);

          // Switch statement to determine the appropriate time difference
          switch (true) {
            case yearsDifference >= 1:
              created_date = `${yearsDifference} year${
                yearsDifference !== 1 ? "s" : ""
              } ago`;
              break;
            case monthsDifference >= 1:
              created_date = `${monthsDifference} month${
                monthsDifference !== 1 ? "s" : ""
              } ago`;
              break;
            case daysDifference >= 1:
              created_date = `${daysDifference} day${
                daysDifference !== 1 ? "s" : ""
              } ago`;
              break;
            case hoursDifference >= 1:
              created_date = `${hoursDifference} hour${
                hoursDifference !== 1 ? "s" : ""
              } ago`;
              break;
            default:
              created_date = `${minutesDifference} minute${
                minutesDifference !== 1 ? "s" : ""
              } ago`;
          }

          const title = feed?.title;
          const capitalizedTitle = title
            ? title.charAt(0).toUpperCase() + title.slice(1)
            : null;

          const post_type = feed?.post_type;
          const capitalizedType = post_type
            ? post_type.charAt(0).toUpperCase() + post_type.slice(1)
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
                  <Box
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/pup-feeds/${feed?.post_type}`)}
                  >
                    <Chiptip label={capitalizedType} />
                  </Box>
                  {auth?.role == "admin" && (
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
                  )}
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
                  <Box mb={"1rem"} sx={{ display: "flex", gap: 3 }}>
                    <Typography variant="h6">{capitalizedTitle}</Typography>
                    <Box
                      mb={"1rem"}
                      sx={{ display: "flex", gap: 1, alignItems: "center" }}
                    >
                      {feed?.content_date && (
                        <Chiptip
                          label={dayjs(feed?.content_date).format("MM/DD/YYYY")}
                        />
                      )}
                      {feed?.end_date && (
                        <>
                          to
                          <Chiptip
                            label={dayjs(feed?.end_date).format("MM/DD/YYYY")}
                          />
                        </>
                      )}
                    </Box>
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
              {isLastElement &&
              isFetchingNextPage &&
              hasNextPage &&
              !(isError && !error?.response?.status === 404) ? (
                <Typography
                  variant="subtitle1"
                  align="center"
                  mx="auto"
                  py={"2rem"}
                >
                  Loading More
                </Typography>
              ) : null}
              {isLastElement && !hasNextPage && (
                <Typography
                  variant="subtitle1"
                  align="center"
                  mx="auto"
                  py={"2rem"}
                >
                  You've reached the end!
                </Typography>
              )}
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
