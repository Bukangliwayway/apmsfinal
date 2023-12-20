import { ResponsivePie } from "@nivo/pie";
import mockdatapie from "../mockdata/mockdatapie";
import React from "react";

const OverallEmploymentContract = () => {
  return (
    <ResponsivePie
      data={mockdatapie}
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
              50%
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
              Majority are Regular
            </text>
          </g>
        ),
      ]}
    />
  );
};

export default OverallEmploymentContract;
