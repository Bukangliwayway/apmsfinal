import {
  Box,
  Breadcrumbs,
  Card,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import ProfileSearchResult from "./profile_search/ProfileSearchResults";

function Explore() {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(search); // Update the searchQuery state when Enter is pressed
    }
  };
  return (
    <Grid container width={"50%"} mx={"auto"} sx={{ display: "flex", gap: 2 }}>
      <Grid
        item
        xs={12}
        sx={{ backgroundColor: (theme) => theme.palette.common.main }}
        p={2}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <Grid item sx={{ display: "flex" }}>
          <TextField
            fullWidth
            value={search}
            label="Search Profile"
            variant="outlined"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
        </Grid>
        <ProfileSearchResult name={searchQuery} />
      </Grid>
    </Grid>
  );
}

export default Explore;
