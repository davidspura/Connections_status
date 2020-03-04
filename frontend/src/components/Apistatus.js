import React from "react";
import {
  ScatterChart,
  Scatter,
  //XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from "recharts";

const Apistatus = props => {
  props.sluzby.reverse();
  const zdroj = props.sluzby.map(data => {
    return {
      x: data.status === true ? "true" : "false",
      y: data.time
    };
  });
  const data = zdroj;
  return (
    <div className="api">
      {" "}
      <p>Last 24 hours (5 min.)</p>
      <div className="d-flex justify-content-center">
        <ScatterChart
          width={1600}
          height={150}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }}
        >
          <CartesianGrid />
          <YAxis type="number" dataKey="y" name="latency" unit="ms" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter name="A school" data={data} shape="circle">
            {data.map((entry, id) => (
              <Cell
                key={id}
                fill={entry.x === "true" ? "#00ff40" : "#ff0000"}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </div>
    </div>
  );
};

export default Apistatus;
