import React from "react";
import { ResponsiveLine } from "@nivo/line";
import { Box, Skeleton } from "@mui/material";
import useWorkAlignmentOverTime from "../../hooks/analytics/useWorkAlignmentOverTime";


const WorkAlignmentOverTime = () => {
  const {
    data: workAlignmment,
    isLoading: isLoadingWorkAlignment,
  } = useWorkAlignmentOverTime();

  if (isLoadingWorkAlignment) {
    return (
      <Box>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </Box>
    );
  }
  return (
    <ResponsiveLine
      data={workAlignmment?.data}
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
        legend: "Work Alignment Progression Over Time",
        legendOffset: 36,
        legendPosition: "middle",
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
      colors={{ scheme: "blues" }}
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

export default WorkAlignmentOverTime;
