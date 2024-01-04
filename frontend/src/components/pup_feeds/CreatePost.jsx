import {
  Box,
  Grid,
  Tab,
  Tabs,
  TextField,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import {
  Announcement,
  Article,
  Event,
  MonetizationOn,
  Lock,
  LockOpen,
  TextFields,
} from "@mui/icons-material";
import { useRef, useState } from "react";
import {
  LinkBubbleMenu,
  MenuButton,
  RichTextEditor,
  RichTextReadOnly,
  TableBubbleMenu,
} from "mui-tiptap";
import ContentTextFieldControls from "./ContentTextFieldControls";
import useExtensions from "./useExtensions";

const CreatePost = () => {
  const extensions = useExtensions({
    placeholder: "Add your own content here...",
  });
  const rteRef = useRef(null);
  const [showMenuBar, setShowMenuBar] = useState(true);
  const [isEditable, setIsEditable] = useState(true);
  const [submittedContent, setSubmittedContent] = useState("");
  const [value, setValue] = useState(-1);
  const [postType, setPostType] = useState("news");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container width={"75%"} mx={"auto"} sx={{ display: "flex", gap: 2 }}>
      <Grid item xs={12}>
        <Tabs value={value} onChange={handleChange} variant="fullWidth">
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
            onClick={() => setPostType("events")}
          />
          <Tab
            icon={<MonetizationOn />}
            label="Fundraising"
            onClick={() => setPostType("fundraising")}
          />
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth required label="Content Title" />
      </Grid>
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
            // content={exampleContent}
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

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setSubmittedContent(
                        rteRef.current?.editor?.getHTML() ?? ""
                      );
                    }}
                  >
                    Save
                  </Button>
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
    </Grid>
  );
};

export default CreatePost;
