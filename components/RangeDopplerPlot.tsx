import React from "react";
import {
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Scatter,
  ResponsiveContainer,
} from "recharts";

type radarDate = {
  data: {
    id: number;
    range: number;
    vel: number;
  }[];
};

type RangeDopplerMapType = {
  rangeSetting: number;
  speedSetting: number;
  cords: radarDate;
};

const RangeDopplerMap = ({
  rangeSetting,
  speedSetting,
  cords,
}: RangeDopplerMapType) => {
  const renderScatter = () => {
    return cords.data.map((cord, index) => {
      console.log(cord);
      return (
        <Scatter
          key={index}
          name={`Range: ${cord.range} Velocity: ${cord.vel}`}
          data={[{ x: cord.range, y: cord.vel }]}
          fill="#8884d8"
        />
      );
    });
  };

  return (
    // <ResponsiveContainer width="600" height="600">
    <ScatterChart
      width={600}
      height={600}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
      <YAxis type="number" dataKey="y" name={"Range"} unit="m" />
      <XAxis type="number" dataKey="x" name={"vel"} unit="knots" />
      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
      {renderScatter()}
    </ScatterChart>
    // </ResponsiveContainer>
  );
};

export default RangeDopplerMap;
