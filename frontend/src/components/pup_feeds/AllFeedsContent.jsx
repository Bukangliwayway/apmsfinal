import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  CircularProgress,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useGetAllFeeds from "../../hooks/feeds/useGetAllfeeds";
import LoadingCircular from "../status_display/LoadingCircular";
import {
  Comment,
  CommentOutlined,
  Delete,
  Edit,
  MoreHoriz,
  ThumbUp,
  ThumbUpAlt,
  ThumbUpOffAlt,
} from "@mui/icons-material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import useAll from "../../hooks/utilities/useAll";
import DeletePostModal from "./DeletePostModal";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import useGetLikes from "../../hooks/feeds/useGetLikes";
import LikersListModal from "./LikersListModal";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AllFeedsContent = ({ type }) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [likeLoading, setLikeLoading] = useState({});

  const Chiptip = ({ icon, label, additional = "", actual = "" }) => (
    <Tooltip
      title={actual !== "" ? actual : additional + label}
      sx={{ padding: "0.5rem" }}
    >
      <Chip icon={icon} label={label} />
    </Tooltip>
  );

  const navigate = useNavigate();

  const { setBackdropLoading } = useAll();

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
  const [postID, setPostID] = useState("");

  const lastFeedElementRef = useCallback(
    (node) => {
      if (isFetchingNextPage || isError) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isError) {
          const lastPage = feeds.pages[feeds.pages.length - 1];
          if (lastPage && lastPage.length > 0) {
            let esisOffset = 0;
            let postOffset = 0;

            for (let i = 0; i < feeds.pages.length; i++) {
              const page = feeds.pages[i];

              for (let j = 0; j < page.length; j++) {
                const dict = page[j];

                if (dict.is_esis) {
                  esisOffset++;
                } else {
                  postOffset++;
                }
              }
            }

            fetchNextPage({
              pageParam: {
                post_offset: postOffset || 0,
                esis_offset: esisOffset || 0,
              },
            });
            postOffset = 0;
            esisOffset = 0;
          } else {
            fetchNextPage({ pageParam: { post_offset: 0, esis_offset: 0 } });
          }
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
    likersListModal: false,
  });

  const handleCloseModal = (type) => {
    setModalOpen((prev) => ({ ...prev, [type]: false }));
    setFeedID("");
  };

  const handleModalOpen = (type, id) => {
    setFeedID(id);
    setModalOpen((prev) => ({ ...prev, [type]: true }));
  };

  const mutation = useMutation(
    async (postID) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      setLikeLoading((prev) => ({ ...prev, [postID]: true })); // Set loading state for the current feed
      await axiosPrivate.post(`/posts/toggle-like/${postID}`, axiosConfig);
    },
    {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries(["fetch-all-posts", "all"]);
        queryClient.invalidateQueries(["fetch-all-posts", "event"]);
        queryClient.invalidateQueries(["fetch-all-posts", "announcement"]);
        queryClient.invalidateQueries(["fetch-all-posts", "event"]);
        queryClient.invalidateQueries(["fetch-all-posts", "news"]);
      },
      onSettled: () => {
        setBackdropLoading(false);
      },
    }
  );

  if (isLoadingFeeds) return <LoadingCircular />;
  if (feeds.pages[0].detail == "No Post to Show") {
    console.log("aaaa");
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="subtitle1" align="center" mx="auto" py={"2rem"}>
          There's no Post Yet!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {feeds?.pages?.map(
        (page, pageIndex) =>
          Array.isArray(page) &&
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
                    maxHeight: feed?.img_link ? "" : "30vh",
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
                      sx={{ cursor: "pointer", display: "flex", gap: 2 }}
                      onClick={() => navigate(`/pup-feeds/${feed?.post_type}`)}
                    >
                      <Chiptip label={capitalizedType} />
                      {feed?.is_esis && <Chiptip label={"ESIS"} />}
                    </Box>
                    {auth?.role == "admin" && !feed?.is_esis && (
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
                                ? "linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))"
                                : "linear-gradient(rgba(36, 47, 61, 0), rgba(36, 47, 61, 1))",
                            backgroundSize: "100% 10rem",
                            backgroundRepeat: "no-repeat",
                          },
                        }),
                      ...(!feed?.img_link && {
                        maxHeight: "calc(10 * (1.2em))",
                        overflow: "hidden",
                      }),
                    }}
                  >
                    <Box
                      mb={"1rem"}
                      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      <Typography variant="h6">{capitalizedTitle}</Typography>
                      <Box
                        mb={"1rem"}
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        {feed?.content_date && (
                          <Chiptip
                            label={dayjs(feed?.content_date).format(
                              "MM/DD/YYYY"
                            )}
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
                  <Box
                    sx={{
                      display: "flex",
                      paddingX: 2,
                      gap: 2,
                    }}
                  >
                    <Button
                      onClick={() =>
                        handleModalOpen("likersListModal", feed?.id)
                      }
                    >
                      <Box
                        sx={{
                          cursor: "pointer",
                          textTransform: "none",
                          padding: "0",
                          display: "flex",
                          gap: 1,
                        }}
                      >
                        {feed?.liked ? <ThumbUp /> : <ThumbUpOffAlt />}
                        {feed?.likes} Likes
                      </Box>
                    </Button>
                    <Button>
                      <Box
                        sx={{
                          cursor: "pointer",
                          textTransform: "none",
                          padding: "0",
                          display: "flex",
                          gap: 1,
                        }}
                      >
                        <CommentOutlined />
                        {feed?.comments} Comments
                      </Box>
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      startIcon={
                        likeLoading[feed?.id] ? ( // Check loading state for the current feed
                          <CircularProgress size={20} />
                        ) : feed?.liked ? (
                          <ThumbUp />
                        ) : (
                          <ThumbUpOffAlt />
                        )
                      }
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        padding: 3,
                        width: "100%",
                      }}
                      disabled={likeLoading[feed?.id]} // Disable the button based on loading state for the current feed
                      onClick={async () => {
                        await mutation.mutateAsync(feed?.id);
                        setLikeLoading((prev) => ({
                          ...prev,
                          [feed?.id]: false,
                        })); // Reset loading state after the mutation
                      }}
                    >
                      <Typography variant="body2">
                        {likeLoading[feed?.id]
                          ? feed?.liked
                            ? "Unliking..."
                            : "Liking..."
                          : feed?.liked
                          ? "Unlike"
                          : "Like"}
                      </Typography>
                    </Button>

                    <Button
                      startIcon={<CommentOutlined />}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        padding: 3,
                        width: "100%",
                      }}
                    >
                      <Typography variant="body2">Comment</Typography>
                    </Button>
                  </Box>
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
              </>
            );
          })
      )}
      {feeds.pages[feeds.pages.length - 1].detail == "No Post to Show" && (
        <Typography variant="subtitle1" align="center" mx="auto" py={"2rem"}>
          You've reached the end!
        </Typography>
      )}
      {feedID && isModalOpen.deleteModal ? (
        <DeletePostModal
          open={isModalOpen.deleteModal}
          onClose={() => handleCloseModal("deleteModal")}
          feedID={feedID}
          refetch={refetch}
        />
      ) : null}
      {feedID && isModalOpen.likersListModal ? (
        <LikersListModal
          open={isModalOpen.likersListModal}
          onClose={() => handleCloseModal("likersListModal")}
          postID={feedID}
          refetch={refetch}
        />
      ) : null}
    </Box>
  );
};

export default AllFeedsContent;
