import { FormatQuote } from "@mui/icons-material";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  Tooltip,
} from "@mui/material";
import React from "react";
import useAll from "../../hooks/utilities/useAll";
import { useTheme } from "@mui/material/styles";
import useMissingFields from "../../hooks/useMissingFields";

function Rightbar() {
  const theme = useTheme();
  const { auth } = useAll();
  const quotes = [
    "The journey of learning doesn't end with graduation; it's a lifelong adventure.",
    "Our time in school was just the beginning; now, it's our turn to make a difference.",
    "Education is the key that unlocks the doors of opportunity and understanding.",
    "As alumni, we carry the torch of knowledge and pass it on to future generations.",
    "In every challenge lies an opportunity to learn, grow, and succeed.",
    "The friendships forged in school are the foundation of a strong and supportive network.",
    "Life is a continuous learning process, and our alma mater is where it all began.",
    "Success is not just about what you accomplish, but also about the lives you touch and inspire.",
    "Cherish the memories, apply the lessons, and strive to make a positive impact on the world.",
    "Education empowers us to shape our destiny; let's use our knowledge to create a better future.",
  ];

  function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  const quote = getRandomQuote();

  const {
    data: missingFields,
    isLoading: isLoadingMissingFields,
    isError: isErrorMissingFields,
    error: errorMissingFields,
  } = useMissingFields();

  return (
    <Box
      width={"75%"}
      mt={"1.65vh"}
      sx={{ display: "flex", gap: 3, flexDirection: "column" }}
    >
      {auth.role == "public" && (
        <Tooltip
          title={
            "To speed up the approval, consider enhancing your profile. Make sure all the necessary details are filled in, as an incomplete profile might prevent approval altogether."
          }
        >
          <Card sx={{ bgcolor: theme.palette.error.main }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                color: (theme) => theme.palette.common.main,
              }}
            >
              <Typography
                variant="h4"
                marginTop="1vh"
                textAlign={"center"}
                fontWeight={"700"}
                textTransform={"uppercase"}
                px={3}
              >
                Unverified Alumni
              </Typography>
              <Typography variant="subtitle2" px={3}>
                Your alumni profile is currently pending approval from the
                APMS-PUPQC ADMIN.
              </Typography>
            </CardContent>
          </Card>
        </Tooltip>
      )}
      {missingFields?.data.length != 0 && (
        <Tooltip
          title="  The account is currently incomplete meaning you won't be able to
              access our Explore Section and Other PUPQC Feeds"
        >
          <Card sx={{ bgcolor: theme.palette.error.main }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                color: (theme) => theme.palette.common.main,
              }}
            >
              <Typography
                variant="h4"
                marginTop="1vh"
                textAlign={"center"}
                px={3}
                fontWeight={"700"}
                textTransform={"uppercase"}
              >
                Incomplete Profile
              </Typography>

              <Typography variant="subtitle2" px={3}>
                Please fill the necessary information such as <br />
                {missingFields?.data?.map((field, index) => (
                  <React.Fragment key={index}>
                    {field}
                    {index < missingFields?.data?.length - 1 && ", "}
                  </React.Fragment>
                ))}
              </Typography>
            </CardContent>
          </Card>
        </Tooltip>
      )}
      {auth.role != "public" && (
        <Card>
          <CardHeader
            titleTypographyProps={{ variant: "h5" }}
            title="Alumni Quote"
            sx={{ textAlign: "center", marginTop: "2vh" }}
          />
          <CardContent>
            <Typography sx={{ textAlign: "center", mt: -2, mb: 1 }}>
              <FormatQuote />
            </Typography>

            <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
              {quote}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default Rightbar;
