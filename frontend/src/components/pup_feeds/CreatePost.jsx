import {
  Box,
  Grid,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
  CardActionArea,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Announcement,
  Article,
  Event,
  MonetizationOn,
  Lock,
  LockOpen,
  TextFields,
  Photo,
} from "@mui/icons-material";
import { useRef, useState } from "react";
import {
  LinkBubbleMenu,
  MenuButton,
  RichTextEditor,
  TableBubbleMenu,
} from "mui-tiptap";
import ContentTextFieldControls from "./ContentTextFieldControls";
import useExtensions from "./useExtensions";
import { useNavigate, useParams } from "react-router-dom";
import useAll from "../../hooks/utilities/useAll";
import { useMutation, useQueryClient } from "react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const CreatePost = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { type } = useParams();
  const extensions = useExtensions({
    placeholder: "Add your own content here...",
  });
  const queryClient = useQueryClient();

  const rteRef = useRef(null);
  const [showMenuBar, setShowMenuBar] = useState(true);
  const [isEditable, setIsEditable] = useState(true);
  const [content, setContent] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState();
  const [endDate, setEndDate] = useState();
  const [photo, setPhoto] = useState({});
  const [postType, setPostType] = useState(type || "announcement");
  const { setMessage, setSeverity, setOpenSnackbar, setLinearLoading } =
    useAll();

  const typeToValueMap = {
    announcement: 0,
    news: 1,
    event: 2,
    fundraising: 3,
  };
  const [value, setValue] = useState(
    type !== null && type !== undefined ? typeToValueMap[type] : -1
  );

  const PostMutation = useMutation(
    async (postProfile) => {
      const axiosConfig = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true, // Set this to true for cross-origin requests with credentials
      };

      await axiosPrivate.post(`/posts/create-post`, postProfile, axiosConfig);
    },
    {
      onError: (error) => {
        setMessage(error.response ? error.response.data.detail : error.message);
        setSeverity("error");
        setOpenSnackbar(true);
      },
      onSuccess: (response) => {
        const capitalizedPostType =
          postType.charAt(0).toUpperCase() + postType.slice(1);

        setMessage(`${capitalizedPostType} Posted Successfully`);
        setSeverity("success");
        queryClient.invalidateQueries(["fetch-all-posts", "all"]);
        queryClient.invalidateQueries(["fetch-all-posts", "event"]);
        queryClient.invalidateQueries(["fetch-all-posts", "announcement"]);
        queryClient.invalidateQueries(["fetch-all-posts", "event"]);
        queryClient.invalidateQueries(["fetch-all-posts", "news"]);

        navigate("/pup-feeds");
      },
      onSettled: () => {
        setLinearLoading(false);
        setOpenSnackbar(true);
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !postType ||
      (postType == "fundraising" && !goalAmount) ||
      (postType == "event" && !date) ||
      date >= endDate ||
      !title ||
      !content
    ) {
      setMessage(
        "please fill out all of the required fields and ensure that the data are right."
      );
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const payload = new FormData();
    payload.append("title", title);
    payload.append("content", content);
    payload.append("post_type", postType);

    if (photo?.file) {
      payload.append("img", photo.file);
    }

    if (goalAmount) {
      payload.append("goal_amount", goalAmount);
    }

    if (postType == "event") {
      if (date) {
        payload.append("content_date", date.format("YYYY-MM-DD") || null);
      }

      if (endDate) {
        payload.append("end_date", endDate.format("YYYY-MM-DD") || null);
      }
    }

    setLinearLoading(true);
    await PostMutation.mutateAsync(payload);
  };

  const { isLoading } = PostMutation;

  return (
    <Grid
      container
      width={"75%"}
      mx={"auto"}
      sx={{
        display: "flex",
        gap: 2,
        backgroundColor: (theme) => theme.palette.common.main,
        paddingX: "1rem",
      }}
    >
      <Grid item xs={12}>
        <Tabs
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          variant="fullWidth"
        >
          <Tab
            icon={<Announcement />}
            label="Announcement"
            onClick={() => setPostType("announcement")}
          />
          <Tab
            icon={<Article />}
            label="News"
            onClick={() => setPostType("news")}
          />
          <Tab
            icon={<Event />}
            label="Events"
            onClick={() => setPostType("event")}
          />
          <Tab
            icon={<MonetizationOn />}
            label="Fundraising"
            onClick={() => setPostType("fundraising")}
          />
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          required
          label="Content Title"
          onChange={(event) => setTitle(event.target.value)}
        />
      </Grid>
      {postType == "event" && (
        <>
          <Grid item xs={6}>
            <DatePicker
              slotProps={{ textField: { size: "small" } }}
              label={"Event Start Date"}
              placeholder="Input the Date to be highlighted here"
              value={date}
              onChange={(date) => setDate(date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              required
            />
          </Grid>
          <Tooltip title="Leave this one blank if Event is just 1 Day">
            <Grid item xs={5}>
              <DatePicker
                slotProps={{ textField: { size: "small" } }}
                label="Event End Date"
                name="End Date"
                placeholder="Input the Date to be highlighted here"
                value={endDate}
                onChange={(endDate) => setEndDate(endDate)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
          </Tooltip>
        </>
      )}

      {postType == "fundraising" && (
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Goal Amount"
            value={goalAmount}
            onChange={(e) => {
              const sanitizedValue = event.target.value.replace(/\D/g, "");
              setGoalAmount(sanitizedValue);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <MonetizationOn />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <Box
          sx={{
            "& .ProseMirror": {
              "& h1, & h2, & h3, & h4, & h5, & h6": {
                scrollMarginTop: showMenuBar ? 50 : 0,
              },
            },
          }}
        >
          <RichTextEditor
            ref={rteRef}
            extensions={extensions}
            onBlur={() => {
              setContent(rteRef.current?.editor?.getHTML() ?? "");
            }}
            editable={isEditable}
            renderControls={() => <ContentTextFieldControls />}
            RichTextFieldProps={{
              variant: "outlined",
              MenuBarProps: {
                hide: !showMenuBar,
              },
              footer: (
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    borderTopStyle: "solid",
                    borderTopWidth: 1,
                    borderTopColor: (theme) => theme.palette.divider,
                    py: 1,
                    px: 1.5,
                  }}
                >
                  <MenuButton
                    value="formatting"
                    tooltipLabel={
                      showMenuBar ? "Hide formatting" : "Show formatting"
                    }
                    size="small"
                    onClick={() =>
                      setShowMenuBar((currentState) => !currentState)
                    }
                    selected={showMenuBar}
                    IconComponent={TextFields}
                  />

                  <MenuButton
                    value="formatting"
                    tooltipLabel={
                      isEditable
                        ? "Prevent edits (use read-only mode)"
                        : "Allow edits"
                    }
                    size="small"
                    onClick={() =>
                      setIsEditable((currentState) => !currentState)
                    }
                    selected={!isEditable}
                    IconComponent={isEditable ? Lock : LockOpen}
                  />
                </Stack>
              ),
            }}
          >
            {() => (
              <>
                <LinkBubbleMenu />
                <TableBubbleMenu />
              </>
            )}
          </RichTextEditor>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Tooltip title="Click to Upload an Image">
          <CardActionArea component="label" htmlFor="image-upload-input">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: 450,
                background: `url(${photo?.url || "/no-image.jpeg"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "black",
              }}
            >
              <input
                type="file"
                accept="image/*"
                id="image-upload-input"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0]; // Get the selected file
                  if (file) {
                    setPhoto(() => ({
                      file: file,
                      url: URL.createObjectURL(file),
                      name: file.name,
                    }));
                  }
                }}
              />
              <Box
                backgroundColor="white"
                p={"1rem"}
                sx={{ borderRadius: "1rem" }}
              >
                <Typography
                  variant={"h6"}
                  sx={{ display: "flex", gap: 2, alignItems: "center" }}
                >
                  <Photo />
                  Click to upload an Image Content
                </Typography>
              </Box>
            </Box>
            <Typography
              sx={{ backgroundColor: "inherit", padding: 1 }}
              variant="body2"
            >
              {photo.name}
            </Typography>
          </CardActionArea>
        </Tooltip>
      </Grid>
      <Grid xs={12} pt={2} pb={4}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          onClick={handleSubmit}
        >
          Post
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreatePost;
