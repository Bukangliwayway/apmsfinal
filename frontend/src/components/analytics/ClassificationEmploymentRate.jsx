import { ResponsiveBar } from "@nivo/bar";
import mockdatabar from "../mockdata/mockdatabar";
import useClassificationEmploymentRate from "../../hooks/analytics/useClassificationEmploymentRate";
import { Box, Skeleton } from "@mui/material";
import useAll from "../../hooks/utilities/useAll";

const ClassificationEmploymentRate = ({ solo = false }) => {
  const { mode, cohort } = useAll();
  const {
    data: classificationResponseRate,
    isLoading: isLoadingClassificationResponseRate,
  } = useClassificationEmploymentRate(
    cohort["EmploymentRate"]?.batch_year,
    cohort["EmploymentRate"]?.course_code,
    cohort["EmploymentRate"]?.course_column
  );

  if (
    isLoadingClassificationResponseRate ||
    !classificationResponseRate ||
    !classificationResponseRate.data
  ) {
    return (
      <Box width={"100%"} height={"100%"}>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </Box>
    );
  }


  return (
    <Box height={"100%"}>
      <ResponsiveBar
        data={classificationResponseRate?.data || {}}
        tooltip={({ index, id, value, color }) => (
          <Box
            style={{
              padding: "0.5rem",
              color: mode == "light" ? "#333" : "#DCE1E7",
              background: mode == "light" ? "#fff" : "#333",
              gap: 1,
            }}
          >
            <Box p={1} width={"1ch"} sx={{ background: color }}></Box>
            <span>
              {classificationResponseRate?.data[index]?.classification_name}
            </span>
            <br />
            <span
              style={{
                textTransform: "capitalize",
              }}
            >
              {id}: <strong>{value}</strong>
            </span>
          </Box>
        )}
        keys={Object.keys(classificationResponseRate?.data[0] || {})?.filter(
          (key) =>
            key !== "classification_name" && key !== "classification_code"
        )}
        indexBy="classification_code"
        margin={{ top: 25, right: 120, bottom: 50, left: 90 }}
        padding={0.025}
        layout={"vertical"}
        groupMode="stacked"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
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
        borderColor={{
          from: "color",
          modifiers: [["darker", "0.9"]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Job Classification Rate",
          legendPosition: "middle",
          legendOffset: 32,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Employment Count",
          legendPosition: "middle",
          legendOffset: -60,
          truncateTickAt: 0,
        }}
        enableGridY={false}
        enableLabel={false}
        labelSkipWidth={6}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", "1.5"]],
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "top-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemWidth: 100,
            itemHeight: 20,
            itemsSpacing: 2,
            symbolSize: 20,
            itemDirection: "left-to-right",
          },
        ]}
        motionConfig={{
          mass: 1,
          tension: 170,
          friction: 26,
          clamp: false,
          precision: 0.01,
          velocity: 0,
        }}
      />
    </Box>
  );
};

export default ClassificationEmploymentRate;
