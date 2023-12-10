import { FormatQuote } from "@mui/icons-material";
import { Card, CardHeader, CardContent, Typography, Box } from "@mui/material";
import React from "react";

function Rightbar() {
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

  return (
    <Box width={"75%"} mt={"5vh"}>
      <Card>
        <CardHeader
          titleTypographyProps={{ variant: "h6" }}
          title="Alumni Quote"
          sx={{ textAlign: "center" }}
        />
        <CardContent>
          <Typography
            sx={{ textAlign: "center", mt: -2, mb: 1 }}
          >
            <FormatQuote />
          </Typography>

          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            {quote}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Rightbar;
