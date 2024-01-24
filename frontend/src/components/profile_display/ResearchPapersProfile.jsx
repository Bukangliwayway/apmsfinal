import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAll from "../../hooks/utilities/useAll";
import { useTheme } from "@mui/material/styles";


import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Fab,
  Grid,
  Icon,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Skeleton,
  Tooltip,
  Typography,
  Link,
} from "@mui/material";
import {
  AddCircleRounded,
  BusinessRounded,
  Cake,
  CheckCircle,
  CheckCircleSharp,
  Delete,
  DeleteForever,
  Edit,
  Email,
  EmojiEmotions,
  EmojiEvents,
  Favorite,
  FavoriteRounded,
  Fingerprint,
  GradeRounded,
  LocalBar,
  LocationCity,
  LocationOn,
  MoreHoriz,
  PartyMode,
  PartyModeOutlined,
  PartyModeRounded,
  Phone,
  PublicRounded,
  School,
  Share,
  Star,
  Work,
  WorkOutline,
  WorkOutlined,
} from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const ResearchPapersProfile = ({ data, isLoading }) => {
  const [expanded, setExpanded] = React.useState({});

  const handleExpandClick = (achievementId) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [achievementId]: !prevExpanded[achievementId],
    }));
  };

  const Chiptip = ({ label, additional = "", actual = "" }) => {
    const theme = useTheme();

    // Map status values to theme colors
    const statusColors = {
      Approved: theme.palette.success.main,
      Pending: theme.palette.warning.main,
      Rejected: theme.palette.error.main,
    };

    // Determine the color based on the status
    const chipColor = statusColors[label] || theme.palette.primary.main;

    return (
      <Tooltip
        title={actual !== "" ? actual : additional + label}
        sx={{ padding: "0.5rem" }}
      >
        <Chip
          label={label}
          sx={{
            backgroundColor: chipColor,
            color: theme.palette.getContrastText(chipColor),
          }}
        />
      </Tooltip>
    );
  };

  return (
    data?.data && (
      <Grid
        container
        sx={{
          marginY: "2rem",
          gap: 3,
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            paddingX: "1rem",
            flexDirection: "column",
          }}
        >
          {data?.data.map((research, index) => {
            const isExpanded = expanded[research.id];
            return (
              <React.Fragment key={research.id}>
                <Grid
                  container
                  sx={{
                    marginBottom: "0.5rem",
                    borderBottom: "1px #aaa solid",
                    paddingY: "0.5rem",
                    position: "relative",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {research?.title}
                    </Typography>
                    <Box
                      sx={{
                        ml: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        alignItems: "flex-end",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "bold",
                          textTransform: "capitalize",
                        }}
                      >
                        {research?.research_type}
                      </Typography>
                      <Chiptip label={research?.status} />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      {research?.description}
                    </Typography>
                  </Grid>
                </Grid>
              </React.Fragment>
            );
          })}
        </Grid>
      </Grid>
    )
  );
};

export default ResearchPapersProfile;
