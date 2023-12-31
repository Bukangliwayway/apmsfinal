import { ResponsivePie } from "@nivo/pie";
import React from "react";
import useOverallResponseRate from "../../hooks/analytics/useOverallResponseRate";
import { Box, Skeleton, Typography } from "@mui/material";
import useAll from "../../hooks/utilities/useAll";
import useOverallMonthlyIncome from "../../hooks/analytics/useOverallMonthlyIncome";
import useOverallGender from "../../hooks/analytics/useOverallGender";
import useOverallEmploymentStatus from "../../hooks/analytics/useOverallEmploymentStatus";
import useOverallEmploymentContract from "../../hooks/analytics/useOverallEmploymenContract";
import useOverallEmployerType from "../../hooks/analytics/useOverallEmployerType";
import useOverallCivilStatus from "../../hooks/analytics/useOverallCivilStatus";

const AlumniResponseRate = ({ solo = false, type = "response rate" }) => {
  const dataMap = {
    "response rate": useOverallResponseRate(),
    "employment status": useOverallEmploymentStatus(),
    gender: useOverallGender(),
    "civil status": useOverallCivilStatus(),
    "monthly income": useOverallMonthlyIncome(),
    "employment contract": useOverallEmploymentContract(),
    "employer type": useOverallEmployerType(),
  };

  const { data, isLoading } = dataMap[type];

  const { mode } = useAll();

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </Box>
    );
  }

  // Find the item with the highest value
  const maxItem = data?.data?.responses.reduce(
    (max, current) => (current.value > max.value ? current : max),
    { value: -Infinity }
  );

  const sumOfValues = data?.data?.responses.reduce(
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
      data={data?.data?.responses}
      margin={{
        top: solo ? 30 : 10,
        right: 10,
        bottom: solo ? 30 : 10,
        left: 10,
      }}
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
      enableArcLabels={solo}
      enableArcLinkLabels={solo}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={mode == "light" ? "#333" : "#fff"}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsRadiusOffset={0.5}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", "5"]],
      }}
      theme={{
        text: {
          fontSize: 20,
          fill: "#333333",
        },
        tooltip: {
          container: {
            background: mode == "light" ? "#fff" : "#333", // Change the text color of tooltip here
            color: mode == "light" ? "#333" : "#fff", // Change the text color of tooltip here
          },
        },
      }}
      legends={[
        {
          anchor: "top-right",
          direction: "row",
          justify: true,
          translateX: 100,
          translateY: 100,
          itemWidth: 100,
          itemHeight: 20,
          itemsSpacing: 0,
          symbolSize: 20,
          itemDirection: "left-to-right",
        },
      ]}
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
                fontSize: solo ? "5rem" : "1.5rem",
                fontWeight: "bold",
                fill: mode == "light" ? "#333333" : "#fff",
              }}
            >
              {percentageDict.percentage}%
            </text>
            <text
              x={0}
              y={solo ? "3rem" : "1rem"}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: solo ? "1.75rem" : "0.5rem",
                fill: mode == "light" ? "#333333" : "#fff",
              }}
            >
              Majority are
            </text>
            <text
              x={0}
              y={solo ? "5rem" : "1.5rem"}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: solo
                  ? type == "monthly income" || type == "employer type"
                    ? "0.9rem"
                    : "1.75rem"
                  : "0.5rem",
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
