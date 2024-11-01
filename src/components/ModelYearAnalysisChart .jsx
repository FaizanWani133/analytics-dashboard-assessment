import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ModelYearAnalysisChart = ({ data, chartType = "line" }) => {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "6px",
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        height: "50%",
      }}
    >
      <h3>Model Year Analysis</h3>
      <ResponsiveContainer width={"100%"} height={150}>
        {chartType === "line" ? (
          <LineChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        ) : (
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ModelYearAnalysisChart;
