import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import LikersListModal from "./LikersListModal";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useGetAllComments from "../../hooks/feeds/useGetAllComments";
import DeleteCommentModal from "./DeleteCommentModal";
import EditCommentModal from "./EditCommentModal";

const ViewComments = ({ postID }) => {
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const Chiptip = ({ icon, label, additional = "", actual = "" }) => (
    <Tooltip
      title={actual !== "" ? actual : additional + label}
      sx={{ padding: "0.5rem" }}
    >
      <Chip icon={icon} label={label} />
    </Tooltip>
  );

  const {
    data: comments,
    isLoading: isLoadingComments,
    hasNextPage,
    isFetchingNextPage,
    isError,
    fetchNextPage,
    error,
    refetch,
  } = useGetAllComments(postID);

  const [commentID, setcommentID] = useState(null);

  const [isModalOpen, setModalOpen] = useState({
    editModal: false,
    deleteModal: false,
    likersListModal: false,
  });

  const handleCloseModal = (type) => {
    setModalOpen((prev) => ({ ...prev, [type]: false }));
    setcommentID("");
  };

  const handleModalOpen = (type, id) => {
    setcommentID(id);
    setModalOpen((prev) => ({ ...prev, [type]: true }));
  };

  const handleLoadMoreClick = () => {
    fetchNextPage();
  };

  if (isLoadingComments) return <LoadingCircular />;
  if (comments?.pages[0]?.length == 0) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="subtitle1" align="center" mx="auto" py={"2rem"}>
          There's no Comment Yet!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <List mx={"auto"} sx={{ borderBottom: "whitesmoke solid 1px" }}>
        {comments?.pages?.map(
          (page, pageIndex) =>
            Array.isArray(page) &&
            page?.map((comment, commentIndex) => {
              const isLastElement =
                pageIndex === comments.pages.length - 1 &&
                commentIndex === page.length - 1;
              return (
                <Box paddingX={"2rem"}>
                  <ListItem
                    id={comment?.id}
                    key={comment?.id}
                    sx={{ position: "relative" }}
                  >
                    {comment?.editable && (
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <React.Fragment>
                            <Button
                              {...bindTrigger(popupState)}
                              sx={{
                                position: "absolute",
                                right: "3rem",
                                top: "0.5rem",
                              }}
                              size="small"
                            >
                              <MoreHoriz color="primary" />
                            </Button>
                            <Menu {...bindMenu(popupState)}>
                              <MenuItem
                                onClick={() =>
                                  handleModalOpen("editModal", comment?.id)
                                } // Trigger the profile edit modal
                              >
                                <ListItemIcon>
                                  <Edit fontSize="small" />
                                </ListItemIcon>
                                edit
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleModalOpen("deleteModal", comment?.id)
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

                    <ListItemAvatar>
                      <Avatar
                        alt="Profile"
                        src={comment?.profile_picture}
                        sx={{ width: "40px", height: "40px" }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        comment?.first_name +
                        " " +
                        comment?.last_name +
                        " (" +
                        comment?.code +
                        " " +
                        comment?.batch_year +
                        ")"
                      }
                      secondary={comment?.comment}
                    />
                  </ListItem>

                  {isLastElement &&
                  hasNextPage &&
                  !isFetchingNextPage &&
                  !(isError && !error?.response?.status === 404) ? (
                    <Typography
                      variant="subtitle1"
                      style={{
                        cursor: "pointer",
                        textDecoration: "none",
                        color: "blue",
                      }}
                      onClick={handleLoadMoreClick}
                      component="a"
                    >
                      View more comments...
                    </Typography>
                  ) : isLastElement && isFetchingNextPage ? (
                    <Typography
                      variant="subtitle1"
                      style={{
                        cursor: "pointer",
                        textDecoration: "none",
                        color: "blue",
                      }}
                      component="a"
                    >
                      Loading more comments...
                    </Typography>
                  ) : null}
                </Box>
              );
            })
        )}
      </List>

      {comments.pages[comments.pages.length - 1].detail ==
        "You've Reached the End" &&
        comments.pages.length < 1 && (
          <Typography variant="subtitle1" align="center" mx="auto" pb={"1rem"}>
            You've Reached the End!
          </Typography>
        )}

      {commentID && isModalOpen.deleteModal ? (
        <DeleteCommentModal
          open={isModalOpen.deleteModal}
          onClose={() => handleCloseModal("deleteModal")}
          commentID={commentID}
        />
      ) : null}
      {commentID && isModalOpen.editModal ? (
        <EditCommentModal
          open={isModalOpen.editModal}
          onClose={() => handleCloseModal("editModal")}
          commentID={commentID}
        />
      ) : null}
      {commentID && isModalOpen.likersListModal ? (
        <LikersListModal
          open={isModalOpen.likersListModal}
          onClose={() => handleCloseModal("likersListModal")}
          postID={commentID}
        />
      ) : null}
    </Box>
  );
};

export default ViewComments;
