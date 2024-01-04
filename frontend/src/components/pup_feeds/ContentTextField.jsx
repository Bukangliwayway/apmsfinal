import { Box, Button, Stack, Typography } from "@mui/material";
import { Lock, LockOpen, TextFields } from "@mui/icons-material";
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

export default function ContentTextField() {
  const extensions = useExtensions({
    placeholder: "Add your own content here...",
  });
  const rteRef = useRef(null);
  const [showMenuBar, setShowMenuBar] = useState(true);
  const [isEditable, setIsEditable] = useState(true);
  const [submittedContent, setSubmittedContent] = useState("");

  return (
    <>
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
                  onClick={() => setIsEditable((currentState) => !currentState)}
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

      <Typography variant="h5" sx={{ mt: 5 }}>
        Saved result:
      </Typography>

      {submittedContent ? (
        <>
          <pre style={{ marginTop: 10, overflow: "auto", maxWidth: "100%" }}>
            <code>{submittedContent}</code>
          </pre>

          <Box mt={3}>
            <Typography variant="overline" sx={{ mb: 2 }}>
              Read-only saved snapshot:
            </Typography>

            <RichTextReadOnly
              content={submittedContent}
              extensions={extensions}
            />
          </Box>
        </>
      ) : (
        <>
          Press “Save” above to show the HTML markup for the editor content.
          Typically you’d use a similar <code>editor.getHTML()</code> approach
          to save your data in a form.
        </>
      )}
    </>
  );
}
