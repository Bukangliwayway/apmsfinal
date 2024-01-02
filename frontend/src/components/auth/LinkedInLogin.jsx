import { Button, Typography } from "@mui/material";
import React from "react";
import { IconBrandLinkedin } from "@tabler/icons-react";

const LinkedInLogin = () => {
  const handleLinkedInAuth = () => {
    // Define your LinkedIn OAuth 2.0 parameters
    const randomString = [...Array(30)]
      .map(() => Math.random().toString(36)[2])
      .join("");

    const clientId = `${import.meta.env.VITE_LINKEDIN_CLIENT_ID}`;
    const redirectUri = `${import.meta.env.VITE_LINKEDIN_REDIRECT}`; // Your callback URL
    const state = randomString; // You can generate a random value for the state

    // Define the scope as needed
    const scope = "openid profile w_member_social email";

    // Create the LinkedIn authorization URL
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;

    // Redirect the user to LinkedIn for authorization
    window.location.href = authUrl;
  };

  return (
    <Button
      variant="outlined"
      onClick={handleLinkedInAuth}
      sx={{ textTransform: "none" }}
    >
      <IconBrandLinkedin />
      <Typography variant="body2" ml={1}>Login with LinkedIn</Typography>
    </Button>
  );
};

export default LinkedInLogin;
