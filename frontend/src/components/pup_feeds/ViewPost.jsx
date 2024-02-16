import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  CircularProgress,
  Grid,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import LoadingCircular from "../status_display/LoadingCircular";
import {
  CommentOutlined,
  Delete,
  Edit,
  MoreHoriz,
  ThumbUp,
  ThumbUpOffAlt,
} from "@mui/icons-material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import useAll from "../../hooks/utilities/useAll";
import DeletePostModal from "./DeletePostModal";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useGetSpecificFeed from "../../hooks/feeds/useGetSpecificFeed";
import dayjs from "dayjs";
import useMissingFields from "../../hooks/useMissingFields";
import Missing from "../status_display/UserNotFound";
import LikersListModal from "./LikersListModal";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CommentModal from "./CommentModal";
import ViewComments from "./ViewComments";

const ViewPost = () => {
  const Chiptip = ({ icon, label, additional = "", actual = "" }) => (
    <Tooltip
      title={actual !== "" ? actual : additional + label}
      sx={{ padding: "0.5rem" }}
    >
      <Chip icon={icon} label={label} />
    </Tooltip>
  );

  const queryClient = useQueryClient();

  const {
    data: missingFields,
    isLoading: isLoadingMissingFields,
    isError: isErrorMissingFields,
    error: errorMissingFields,
  } = useMissingFields();

  const { auth, setBackdropLoading } = useAll();

  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();

  const [likeLoading, setLikeLoading] = useState(false);

  const { postID } = useParams();

  const { data: feed, isLoading: isLoadingFeed } = useGetSpecificFeed(postID);

  const mutation = useMutation(
    async (postID) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      setLikeLoading(true); // Set loading state for the current feed
      await axiosPrivate.post(`/posts/toggle-like/${postID}`, axiosConfig);
    },
    {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries((queryKey, queryFn) => {
          return queryKey.includes("post-specific");
        });
        queryClient.invalidateQueries((queryKey, queryFn) => {
          return queryKey.includes("likers");
        });
        queryClient.invalidateQueries((queryKey, queryFn) => {
          return queryKey.includes("fetch-all-posts");
        });
      },
    }
  );

  const [isModalOpen, setModalOpen] = useState({
    editModal: false,
    deleteModal: false,
    likersListModal: false,
    commentModal: false,
  });

  if (isLoadingFeed) return <LoadingCircular />;

  const handleModalOpen = (type, id) => {
    setModalOpen((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type) => {
    setModalOpen((prev) => ({ ...prev, [type]: false }));
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
  const post_type = feed?.data?.post_type;
  const capitalizedType = post_type
    ? post_type.charAt(0).toUpperCase() + post_type.slice(1)
    : null;

  if (
    (missingFields?.data?.length !== 0 || auth?.role === "public") &&
    (feed?.data?.post_type === "event" ||
      feed?.data?.post_type === "fundraising")
  ) {
    return <Missing />;
  }
  return (
    <Grid container width={"50%"} mx={"auto"} sx={{ display: "flex", gap: 2 }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: (theme) => theme.palette.common.main,
          width: "100%",
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
          <Box
            sx={{ cursor: "pointer", display: "flex", gap: 2 }}
            onClick={() => navigate(`/pup-feeds/${feed?.data?.post_type}`)}
          >
            <Chiptip label={capitalizedType} />
            {feed?.data?.is_esis && <Chiptip label={"ESIS"} />}
          </Box>
          {auth?.role == "admin" && !feed?.data?.is_esis && (
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
                    <MenuItem onClick={() => handleModalOpen("deleteModal")}>
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
        <Box p={2}>
          <Box mb={"1rem"} sx={{ display: "flex", gap: 3 }}>
            <Typography variant="h6">{capitalizedTitle}</Typography>
            <Box
              mb={"1rem"}
              sx={{ display: "flex", gap: 1, alignItems: "center" }}
            >
              {feed?.data?.content_date && (
                <Chiptip
                  label={dayjs(feed?.data?.content_date).format("MM/DD/YYYY")}
                />
              )}
              {feed?.data?.end_date && (
                <>
                  to
                  <Chiptip
                    label={dayjs(feed?.data?.end_date).format("MM/DD/YYYY")}
                  />
                </>
              )}
            </Box>
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
        <Box
          sx={{
            display: "flex",
            paddingX: 2,
            gap: 2,
          }}
        >
          <Button onClick={() => handleModalOpen("likersListModal")}>
            <Box
              sx={{
                cursor: "pointer",
                textTransform: "none",
                padding: "0",
                display: "flex",
                gap: 1,
              }}
            >
              {feed?.data?.liked ? <ThumbUp /> : <ThumbUpOffAlt />}
              {feed?.data?.likes} Likes
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
              {feed?.data?.comments} Comments
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
              likeLoading ? ( // Check loading state for the current feed
                <CircularProgress size={20} />
              ) : feed?.data?.liked ? (
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
            disabled={likeLoading[feed?.data?.id]} // Disable the button based on loading state for the current feed
            onClick={async () => {
              await mutation.mutateAsync(feed?.data?.id);
              setLikeLoading(false); // Reset loading state after the mutation
            }}
          >
            <Typography variant="body2">
              {likeLoading
                ? feed?.data?.liked
                  ? "Unliking..."
                  : "Liking..."
                : feed?.data?.liked
                ? "Unlike"
                : "Like"}
            </Typography>
          </Button>

          <Button
            onClick={() => handleModalOpen("commentModal")}
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
        <ViewComments postID={postID} />
      </Card>
      {isModalOpen.deleteModal ? (
        <DeletePostModal
          open={isModalOpen.deleteModal}
          onClose={() => handleCloseModal("deleteModal")}
          feedID={postID}
          exit={true}
        />
      ) : null}
      {isModalOpen.likersListModal ? (
        <LikersListModal
          open={isModalOpen.likersListModal}
          onClose={() => handleCloseModal("likersListModal")}
          postID={postID}
        />
      ) : null}
      {isModalOpen.commentModal ? (
        <CommentModal
          open={isModalOpen.commentModal}
          onClose={() => handleCloseModal("commentModal")}
          postID={postID}
        />
      ) : null}
    </Grid>
  );
};

export default ViewPost;
