import { FC } from "react";

import { ResponsiveLine, Serie } from "@nivo/line";
import { useAppContext } from "@/components/ContextApi/AppContext";
import appConstant from "@/services/appConstant";

const LineChart: FC<{
  data: Serie[];
  title: string;
  axisBottomTitle: string;
  axisLeftTitle: string;
  color?: string;
}> = ({ data, title, axisBottomTitle, axisLeftTitle, color = appConstant.lineChart.graphColor }) => {
  const { globalState } = useAppContext();

  return (
    <>
      <ResponsiveLine
        data={data}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: globalState.theme === "dark" ? appConstant.lineChart.white : appConstant.lineChart.black,
                fontSize: 10,
              },
            },
            legend: {
              text: {
                fill: globalState.theme === "dark" ? appConstant.lineChart.white : appConstant.lineChart.black,
                fontSize: 15,
              },
            },
            ticks: {
              line: {
                stroke: globalState.theme === "dark" ? appConstant.lineChart.white : appConstant.lineChart.black,
                strokeWidth: 1,
              },
              text: {
                fill: globalState.theme === "dark" ? appConstant.lineChart.white : appConstant.lineChart.black,
                fontSize: 13,
              },
            },
          },
          legends: {
            text: {
              fill: appConstant.lineChart.grey,
            },
          },
          tooltip: {
            container: {
              color: globalState.theme === "dark" ? appConstant.lineChart.white : appConstant.lineChart.black,
            },
          },
        }}
        tooltip={({ point }) => (
          <div
            style={{
              color: `${globalState.theme === "dark" ? appConstant.lineChart.white : appConstant.lineChart.black}`,
            }}
          >
            <strong>{Math.floor(Number(point.data.yFormatted))}</strong>{" "}
            {/* {Math.floor(Number(point.data.yFormatted)) === 1 ? "student" : "students"} */}
            {title}
          </div>
        )}
        colors={[color as string]} // added
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
          stacked: true,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 2,
          tickPadding: 8,
          tickRotation: 0,
          legend: axisBottomTitle, // added
          legendOffset: 40,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickValues: 5, // added
          tickSize: 5,
          tickPadding: 0,
          tickRotation: 0,
          legend: axisLeftTitle, // added
          legendOffset: -50,

          legendPosition: "middle",
        }}
        enableGridX={false}
        enableGridY={false}
        enableArea={true}
        pointSize={8}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
      />
    </>
  );
};

export default LineChart;
