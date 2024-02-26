import { ResponsiveLine } from "@nivo/line";
import React from "react";
import useWorkAlignmentLine from "../../hooks/analytics/useWorkAlignmentLine";
import useAll from "../../hooks/utilities/useAll";
import { Box, Skeleton, Typography } from "@mui/material";

const WorkAlignmentLine = ({ solo = false }) => {
  const { mode, cohort } = useAll();

  const { data: data, isLoading: isLoadingData } = useWorkAlignmentLine(
    cohort["Employment"]?.course_code,
    cohort["Employment"]?.batch_year,
    cohort["Employment"]?.start_date,
    cohort["Employment"]?.end_date
  );

  if (isLoadingData || !data) {
    return (
      <Box width={"100%"} height={"100%"}>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </Box>
    );
  }

  if (data?.data?.length == 0) {
    return (
      <Box
        height={"100%"}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant={solo ? "h2" : "h3"}
          textTransform={"capitalize"}
          sx={{ textAlign: "center", fontWeight: "800" }}
        >
          Work Alignment
        </Typography>
        <Typography variant="h6">
          Sorry but there are no data here :(
        </Typography>
      </Box>
    );
  }

  return (
    <Box height={solo ? "87%" : "95%"} p={solo ? 5 : 2}>
      <Typography
        variant={solo ? "h3" : "h5"}
        textTransform={"capitalize"}
        sx={{ textAlign: "center", fontWeight: "800" }}
      >
        Work Alignment
      </Typography>
      <ResponsiveLine
        data={data?.data || {}}
        margin={{ top: 20, right: 20, bottom: 60, left: 50 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        curve="basis"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -20,
          legend: "Time Span",
          legendOffset: 35,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Employment Count",
          legendOffset: -40,
          legendPosition: "middle",
          truncateTickAt: 0,
        }}
        enableGridX={solo}
        enableGridY={solo}
        colors={{ scheme: "paired" }}
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
              background: mode == "light" ? "#fff" : "#333",
              color: mode == "light" ? "#333" : "#DCE1E7",
            },
          },
          legends: {
            text: {
              fill: mode == "light" ? "#333" : "#DCE1E7",
            },
          },
        }}
        lineWidth={0}
        enablePoints={false}
        pointSize={2}
        pointColor={{ theme: "background" }}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="xFormatted"
        pointLabelYOffset={-12}
        enableArea={true}
        areaBlendMode="normal"
        areaOpacity={1}
        enableSlices="x"
        crosshairType="x"
        useMesh={true}
        legends={[
          {
            dataFrom: "keys",
            anchor: "top-left",
            direction: "column",
            justify: false,
            translateX: 10,
            translateY: 0,
            itemWidth: 100,
            itemHeight: 20,
            itemsSpacing: 2,
            symbolSize: 20,
            itemDirection: "left-to-right",
          },
        ]}
      />
    </Box>
  );
};

export default WorkAlignmentLine;
