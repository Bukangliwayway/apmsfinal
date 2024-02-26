import { ResponsiveBar } from "@nivo/bar";
import mockdatabar from "../mockdata/mockdatabar";
import useClassificationEmploymentRate from "../../hooks/analytics/useClassificationEmploymentRate";
import { Box, Skeleton, Typography } from "@mui/material";
import useAll from "../../hooks/utilities/useAll";

const ClassificationEmploymentRate = ({ solo = false }) => {
  const { mode, cohort } = useAll();
  const { data, isLoading } = useClassificationEmploymentRate(
    cohort["Employment"]?.batch_year,
    cohort["Employment"]?.course_code,
    cohort["Employment"]?.course_column,
    cohort["Employment"]?.start_date,
    cohort["Employment"]?.end_date
  );

  if (isLoading || !data) {
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
          Job Classification
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
        variant={solo ? "h2" : "h5"}
        textTransform={"capitalize"}
        sx={{ textAlign: "center", fontWeight: "800" }}
      >
        Job Classification
      </Typography>
      <ResponsiveBar
        data={data?.data || {}}
        tooltip={({ index, id, value, color }) => (
          <Box
            style={{
              padding: "0.5rem",
              color: mode == "light" ? "#333" : "#DCE1E7",
              background: mode == "light" ? "#eee" : "#333",
              gap: 1,
            }}
          >
            <span>{data?.data[index]?.classification_name}</span>
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
        keys={Object.keys(data?.data[0] || {})?.filter(
          (key) =>
            key !== "classification_name" && key !== "classification_code"
        )}
        indexBy="classification_code"
        margin={{ top: 20, right: 20, bottom: 60, left: 50 }}
        padding={0.1}
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
              background: mode == "light" ? "#eee" : "#333",
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
          tickRotation: -20,
          legend: "Job Classification Rate",
          legendPosition: "middle",
          legendOffset: 40,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Employment Count",
          legendPosition: "middle",
          legendOffset: -40,
          truncateTickAt: 0,
        }}
        enableGridY={solo}
        enableGridX={solo}
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
