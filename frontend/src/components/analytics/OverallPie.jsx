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

const OverallPie = ({ solo = false, type, basis = "Employment" }) => {
  const { mode, cohort } = useAll();

  const dataMap = {
    "response rate": useOverallResponseRate(
      type == "response rate",
      cohort[basis]?.course_code,
      cohort[basis]?.batch_year
    ),
    "employment status": useOverallEmploymentStatus(
      type == "employment status",
      cohort[basis]?.course_code,
      cohort[basis]?.batch_year
    ),
    gender: useOverallGender(
      type == "gender",
      cohort[basis]?.course_code,
      cohort[basis]?.batch_year
    ),
    "civil status": useOverallCivilStatus(
      type == "civil status",
      cohort[basis]?.course_code,
      cohort[basis]?.batch_year
    ),
    "monthly income": useOverallMonthlyIncome(
      type == "monthly income",
      cohort[basis]?.course_code,
      cohort[basis]?.batch_year,
      cohort[basis]?.start_date,
      cohort[basis]?.end_date
    ),
    "employment contract": useOverallEmploymentContract(
      type == "employment contract",
      cohort[basis]?.course_code,
      cohort[basis]?.batch_year,
      cohort[basis]?.start_date,
      cohort[basis]?.end_date
    ),
    "employer type": useOverallEmployerType(
      type == "employer type",
      cohort[basis]?.course_code,
      cohort[basis]?.batch_year,
      cohort[basis]?.start_date,
      cohort[basis]?.end_date
    ),
  };

  const { data, isLoading } = dataMap[type];

  if (isLoading || !data) {
    return (
      <Box width={"100%"} height={"100%"}>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </Box>
    );
  }

  if (data?.data?.responses?.length == 0) {
    return (
      <Box
        height={"100%"}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: solo ? 2 : 0,
        }}
      >
        <Typography
          variant={solo ? "h2" : "h5"}
          textTransform={"capitalize"}
          sx={{ textAlign: "center", fontWeight: "800" }}
        >
          {type}
        </Typography>
        <Typography variant={solo ? "h4" : "subtitle1"}>
          Sorry. There are no data to show
        </Typography>
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
    <Box p={1} height={solo ? "70%" : "100%"}>
      <Typography
        variant={solo ? "h2" : "h6"}
        mb={solo ? "2rem" : 0}
        textTransform={"capitalize"}
        sx={{ textAlign: "center", fontWeight: "800" }}
      >
        {type}
      </Typography>
      <ResponsivePie
        data={data?.data?.responses}
        margin={{
          top: solo ? 35 : 10,
          right: 10,
          bottom: 40,
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
        arcLinkLabelsTextColor={mode == "light" ? "#333" : "#eee"}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsRadiusOffset={0.5}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", "5"]],
        }}
        theme={{
          text: {
            fontSize: solo ? 20 : 10,
            fill: mode == "light" ? "#333333" : "#eee",
          },
          tooltip: {
            container: {
              background: mode == "light" ? "#eee" : "#333", // Change the text color of tooltip here
              color: mode == "light" ? "#333" : "#eee", // Change the text color of tooltip here
            },
          },
        }}
        legends={[
          {
            anchor: solo ? "bottom-right" : "top-right",
            direction: "column",
            justify: false,
            translateX: solo ? -250 : -115,
            translateY: -10,
            itemWidth: 0,
            itemHeight: 10,
            itemsSpacing: solo ? 30 : 5,
            symbolSize: solo ? 30 : 10,
            itemDirection: "left-to-right",
          },
        ]}
        layers={[
          "arcs",
          "legends",
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
                  fill: mode == "light" ? "#333333" : "#eee",
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
                  fill: mode == "light" ? "#333333" : "#eee",
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
                  fill: mode == "light" ? "#333333" : "#eee",
                }}
              >
                {percentageDict.label}
              </text>
            </g>
          ),
        ]}
      />
    </Box>
  );
};

export default OverallPie;
