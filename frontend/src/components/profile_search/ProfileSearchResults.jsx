import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import LoadingCircular from "../status_display/LoadingCircular";
import { useNavigate } from "react-router-dom";
import useGetSearchProfiles from "../../hooks/search_profiles/useGetSearchProfiles";
import useSearchInitial from "../../hooks/search_profiles/useSearchInitial";

const ProfileSearchResult = ({ name }) => {
  const navigate = useNavigate();

  const { data: initialProfiles, isLoading: isLoadingInitialProfiles } =
    useSearchInitial();
  const {
    data: profiles,
    isLoading: isLoadingProfiles,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    isFetching,
    error,
    refetch,
  } = useGetSearchProfiles(name);

  useEffect(() => {
    // Call the refetch function when the name changes
    refetch();
  }, [name, refetch]); // Add name and refetch to the dependency array

  const observer = useRef();

  const lastProfileElementRef = useCallback(
    (node) => {
      if (isFetchingNextPage || isError) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isError) {
          fetchNextPage();
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

  if (isLoadingInitialProfiles) return <LoadingCircular />;

  if (isFetching && name == "")
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {initialProfiles?.data?.map((profile) => {
          return (
            <>
              <Card
                id={profile?.id}
                key={profile?.id}
                sx={{
                  backgroundColor: (theme) => theme.palette.common.main,
                }}
              >
                <CardActionArea
                  onClick={() =>
                    navigate(`/explore/alumni/${profile?.username}`)
                  }
                  sx={{
                    padding: 2,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                    <Avatar
                      alt="Profile"
                      sx={{ width: "40px", height: "40px" }}
                      src={profile?.profile_picture}
                    />
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {profile?.first_name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {profile?.last_name}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      padding: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ textTransform: "uppercase" }}
                    >
                      {profile?.code}
                    </Typography>
                    <Typography variant="subtitle2">
                      Batch {profile?.batch_year}
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </>
          );
        })}
      </Box>
    );

  if (isFetching || isLoadingProfiles) return <LoadingCircular />;

  if (profiles?.pages[0].detail == "No Profiles to Show")
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="subtitle1" align="center" mx="auto" py={"2rem"}>
          There's no Post Yet!
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {profiles?.pages?.map((page, pageIndex) =>
        page?.map((profile, profileIndex) => {
          const isLastElement =
            pageIndex === profiles.pages.length - 1 &&
            profileIndex === page.length - 1;
          return (
            <>
              <Card
                ref={isLastElement ? lastProfileElementRef : null}
                id={profile?.id}
                key={profile?.id}
                sx={{
                  backgroundColor: (theme) => theme.palette.common.main,
                }}
              >
                <CardActionArea
                  onClick={() =>
                    navigate(`/explore/alumni/${profile?.username}`)
                  }
                  sx={{
                    padding: 2,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                    <Avatar
                      alt="Profile"
                      sx={{ width: "40px", height: "40px" }}
                      src={profile?.profile_picture}
                    />
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {profile?.first_name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {profile?.last_name}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      padding: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ textTransform: "uppercase" }}
                    >
                      {profile?.code}
                    </Typography>
                    <Typography variant="subtitle2">
                      Batch {profile?.batch_year}
                    </Typography>
                  </Box>
                </CardActionArea>
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
              {isLastElement && !hasNextPage && (
                <Typography
                  variant="subtitle1"
                  align="center"
                  mx="auto"
                  py={"2rem"}
                >
                  You've reached the end!
                </Typography>
              )}
            </>
          );
        })
      )}
    </Box>
  );
};

export default ProfileSearchResult;
