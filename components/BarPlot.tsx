import React from "react";
import { BarChart } from "react-native-gifted-charts";

const BarPlot = ({ data, height }) => {
  return (
    <BarChart
      data={data}
      height={height}
      //width={220}
      //barWidth={20}
      //minHeight={3}
      barBorderRadius={3}
      spacing={20}
      noOfSections={4}
      yAxisThickness={0}
      xAxisThickness={0}
      xAxisLabelTextStyle={{ color: "gray", fontSize: 10 }}
      yAxisTextStyle={{ color: "gray", fontSize: 10 }}
      isAnimated
      animationDuration={300}
      //showGradient
      gradientColor={"#12ff00"} // Default top color
      frontColor={"#d3ff00"} // Default bottom color
      //frontColor={"#drgb(0, 162, 255)"}
    />
  );
};

export default BarPlot;
