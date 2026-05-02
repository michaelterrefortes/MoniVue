import React from "react";
import { BarChart } from "react-native-gifted-charts";

const BarPlot = ({
  data,
  height,
  spacing = 20,
  barWidth = 20,
  width = 250,
}) => {
  return (
    <BarChart
      data={data}
      height={height}
      width={width}
      barWidth={barWidth}
      //minHeight={3}
      barBorderRadius={3}
      spacing={spacing}
      noOfSections={4}
      yAxisThickness={0}
      xAxisThickness={0}
      xAxisLabelTextStyle={{ color: "gray", fontSize: 10 }}
      yAxisTextStyle={{ color: "gray", fontSize: 10 }}
      isAnimated
      animationDuration={300}
      //showGradient
      gradientColor={"#12ff00"} // Default top color
      //frontColor={"#d3ff00"} // Default bottom color
      frontColor={"#0095ff"}
      //frontColor={"#drgb(0, 162, 255)"}
    />
  );
};

export default BarPlot;
