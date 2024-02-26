import React from "react";
import { ResponsiveLine } from "@nivo/line";
import useEmploymentCountOverTime from "../../hooks/analytics/useEmploymentCountOverTime";
import { Box, Skeleton } from "@mui/material";
import useAll from "../../hooks/utilities/useAll";

const EmploymentCountOverTime = () => {
  const {
    data: employmentCountOverTime,
    isLoading: isLoadingEmploymentCountOverTIme,
  } = useEmploymentCountOverTime();
  const { mode } = useAll();

  if (isLoadingEmploymentCountOverTIme) {
    return (
      <Box>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </Box>
    );
  }

  return (
    <ResponsiveLine
      data={employmentCountOverTime?.data}
      margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Employment Rate Progression Over Time",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      curve="natural"
      theme={{
        axis: {
          ticks: {
            text: {
              fill: mode == "light" ? "#333" : "#DCE1E7",
            },
          },
          legend: {
            text: {
              fill: mode == "light" ? "#333" : "#DCE1E7",
            },
          },
        },
        tooltip: {
          container: {
            background: mode == "light" ? "#eee" : "#333", // Change the text color of tooltip here
            color: mode == "light" ? "#333" : "#DCE1E7", // Change the text color of tooltip here
          },
        },
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "PUP Course",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      colors={{ scheme: "paired" }}
      lineWidth={1}
      enablePoints={false}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      enableSlices="x"
    />
  );
};

export default EmploymentCountOverTime;
