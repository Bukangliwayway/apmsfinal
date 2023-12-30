import { ResponsiveBar } from "@nivo/bar";
import mockdatabar from "../mockdata/mockdatabar";
import useClassificationEmploymentRate from "../../hooks/analytics/useClassificationEmploymentRate";
import { Box, Skeleton } from "@mui/material";
import useAll from "../../hooks/utilities/useAll";

const ClassificationEmploymentRate = () => {
  const {
    data: classificationResponseRate,
    isLoading: isLoadingClassificationResponseRate,
  } = useClassificationEmploymentRate();

  if (isLoadingClassificationResponseRate) {
    return (
      <Box>
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </Box>
    );
  }
  const { mode } = useAll();

  return (
    <div style={{ height: "25vh" }}>
      <ResponsiveBar
        data={classificationResponseRate?.data?.classification}
        keys={classificationResponseRate?.data?.keys}
        indexBy="classification_code"
        margin={{ top: 25, right: 100, bottom: 50, left: 50 }}
        padding={0.2}
        groupMode="grouped"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "paired" }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#38bcb2",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#eed312",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        
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
              background: mode == "light" ? "#fff" : "#333", // Change the text color of tooltip here
              color: mode == "light" ? "#333" : "#DCE1E7", // Change the text color of tooltip here
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
          legendOffset: -40,
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
    </div>
  );
};

export default ClassificationEmploymentRate;
