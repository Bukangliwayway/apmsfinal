import { useEffect, useState } from "react";
import Navbar from "../components/navigator/Navbar";
import { Box, Grid, IconButton, Stack } from "@mui/material";
import AdminSidebar from "../components/navigator/AdminSidebar";
import useAll from "../hooks/utilities/useAll";
function AdminLayout({ children }) {
  const [sidebarWidth, setSidebarWidth] = useState(15);
  const { toggleSideBar } = useAll();

  useEffect(() => {
    setSidebarWidth(toggleSideBar ? 5 : 15);
  }, [toggleSideBar]);

  return (
    <Box>
      <Navbar toggle={true}/>
      <Stack>
        <Box
          position="fixed"
          sx={{
            display: "flex",
            flexDirection: "column",
            transition: "width  1s, max-width  1s", // Include transition for max-width
            width: `${sidebarWidth}%`,
            maxWidth: `${sidebarWidth}%`, // Example:  15% of viewport width
            overflow: "hidden",
          }}
          pt="1.5rem"
        >
          <AdminSidebar mode={toggleSideBar} />
        </Box>
        <Box
          ml={sidebarWidth + "%"}
          sx={{
            overflow: "hidden",
            transition: "margin  0.5s", // Include transition for max-width
          }}
        >
          <Box>{children}</Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default AdminLayout;
