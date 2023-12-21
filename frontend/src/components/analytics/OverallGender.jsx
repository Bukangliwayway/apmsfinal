import { ResponsivePie } from "@nivo/pie";
import mockdatapie from "../mockdata/mockdatapie";
import React from "react";
import useOverallGender from "../../hooks/analytics/useOverallGender";
import { Box, Skeleton } from "@mui/material";

const OverallGender = () => {
  const { data: overallGender, isLoading: isLoadingGender } =
    useOverallGender();

  if (isLoadingGender) {
    return (
      <Box>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </Box>
    );
  }

  // Find the item with the highest value
  const maxItem = overallGender?.data?.responses.reduce(
    (max, current) => (current.value > max.value ? current : max),
    { value: -Infinity }
  );

  const sumOfValues = overallGender?.data?.responses.reduce(
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
      data={overallGender?.data?.responses}
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      innerRadius={0.7}
      padAngle={2}
      cornerRadius={5}
      activeOuterRadiusOffset={8}
      colors={{ scheme: "blues" }}
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
                fill: "#333333",
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
                fill: "#333333",
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
                fill: "#333333",
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

export default OverallGender;
