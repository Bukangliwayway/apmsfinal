import { ResponsivePie } from "@nivo/pie";
import mockdatapie from "../mockdata/mockdatapie";
import React from "react";
import useOverallResponseRate from "../../hooks/analytics/useOverallResponseRate";
import { Box, Skeleton, Typography } from "@mui/material";
import useAll from "../../hooks/utilities/useAll";

const AlumniResponseRate = () => {
  const { data: overallResponseData, isLoading: isLoadingResponseData } =
    useOverallResponseRate();
  const { mode } = useAll();

  if (isLoadingResponseData) {
    return (
      <Box>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </Box>
    );
  }

  // Find the item with the highest value
  const maxItem = overallResponseData?.data?.responses.reduce(
    (max, current) => (current.value > max.value ? current : max),
    { value: -Infinity }
  );

  const sumOfValues = overallResponseData?.data?.responses.reduce(
    (sum, item) => sum + item.value,
    0
  );

  // Calculate the percentage for the maxItem based on the sum of all values
  const percentageDict = {
    label: maxItem.label,
    percentage: Math.round((maxItem.value / sumOfValues) * 100),
  };

  return (
    <ResponsivePie
      data={overallResponseData?.data?.responses}
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      innerRadius={0.7}
      padAngle={2}
      cornerRadius={5}
      activeOuterRadiusOffset={8}
      colors={{ scheme: "paired" }}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      enableArcLinkLabels={false}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsRadiusOffset={1}
      arcLabelsSkipAngle={2}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", "2.9"]],
      }}
      theme={{
        tooltip: {
          container: {
            background: mode == "light" ? "#fff" : "#333", // Change the text color of tooltip here
            color: mode == "light" ? "#333" : "#fff", // Change the text color of tooltip here
          },
        },
      }}
      layers={[
        "arcs",
        "arcLabels",
        "arcLinkLabels",
        ({ centerX, centerY, innerRadius, outerRadius, label }) => (
          <g transform={`translate(${centerX},${centerY})`}>
            <text
              x={0}
              y={"-0.25rem"}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                fill: mode == "light" ? "#333333" : "#fff",
              }}
            >
              {percentageDict.percentage}%
            </text>
            <text
              x={0}
              y={"1rem"}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "0.5rem",
                fill: mode == "light" ? "#333333" : "#fff",
              }}
            >
              Majority are
            </text>
            <text
              x={0}
              y={"1.5rem"}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: "0.5rem",
                fill: mode == "light" ? "#333333" : "#fff",
              }}
            >
              {percentageDict.label}
            </text>
          </g>
        ),
      ]}
    />
  );
};

export default AlumniResponseRate;
