import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/utilities/useAuth";
import useLogout from "../../hooks/utilities/useLogout";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";

export const ProfileCard = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();
  const { auth, setAuth } = useAuth();

  const getProfile = async () => {
    return await axiosPrivate.get("/users/me");
  };

  const { isLoading, data, isError, error, isFetching } = useQuery(
    "profile-me",
    getProfile,
    {
      staleTime: 300000,
    }
  );

  if (isError) {
    if (error.response.data.detail === "Token has expired") {
      setAuth({}); // Clears out all the token, logs you out
      logout();
      navigate("/login", {
        state: {
          from: location,
          message:
            "You have been logged out for security purposes, please login again",
        },
        replace: true,
      });
    }
  }

  if (isLoading) {
    return (
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Skeleton variant="rectangular" width={40} height={20} />
          <Skeleton variant="rectangular" width={40} height={20} />
          <Skeleton variant="rectangular" width={40} height={20} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Skeleton variant="circular" width={60} height={60} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.2 }}>
            <Skeleton variant="rectangular" width={120} height={24} />
          </Box>
        </Box>
        <Skeleton
          variant="rectangular"
          width={80}
          height={16}
          sx={{ marginLeft: "auto", marginTop: 0.5 }}
        />
      </CardContent>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
      <Avatar
        alt="Profile"
        src={data?.data?.profile_picture}
        sx={{ width: "60px", height: "60px" }}
      />
      <Box>
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{ textTransform: "capitalize" }}
        >
          {data?.data?.first_name + " " + data?.data?.last_name}
        </Typography>
        {data?.data?.year_graduated ? (
          <Typography
            variant="caption"
            display="block"
            style={{ lineHeight: 1 }}
          >
            batch {data?.data?.year_graduated}
          </Typography>
        ) : null}
        <Typography variant="caption" display="block" style={{ lineHeight: 1 }}>
          {auth?.role}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileCard;
