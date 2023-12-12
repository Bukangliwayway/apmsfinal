import { Card, CardContent, Grid, Tooltip, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const DisplayHistory = (history) => {

  if(<history className="length"></history> == 0) return null;
  const sortedHistory = [...history.history].sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  );

  return (
    <Grid container spacing={2} sx={{ display: "flex" }}>
      <Grid item xs={12} mt={"1rem"}>
        <Typography
          variant="h1"
          fontWeight={800}
          sx={{
            padding: "10px",
            borderBottom: "2px solid",
            color: "primary",
          }}
        >
          Upload History
        </Typography>
      </Grid>
      {sortedHistory.map((item) => (
        <Grid item xs={12} key={item.id}>
          <Link to={item.link} target="_blank" sx={{ textDecoration: "none" }}>
            <Tooltip title={"Click to view history content"}>
              <Card>
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant={"subtitle1"}
                    sx={{ fontWeight: "bold" }}
                  >{`${new Date(
                    item.created_at
                  ).toLocaleDateString()} ${new Date(
                    item.created_at
                  ).toLocaleTimeString()}`}</Typography>
                </CardContent>
              </Card>
            </Tooltip>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default DisplayHistory;
