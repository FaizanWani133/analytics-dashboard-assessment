import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import CustomLegend from "./CustomLegend";

const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"];

const ElectricVehicleTypePieChart = ({ pieData }) => (
  <div
    className="chart-container"
    style={{
      display: "flex",
      alignItems: "center",
      boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      padding: "20px",
      height: "60%",
    }}
  >
    {/* <h3>Electric Vehicle Type Distribution</h3> */}
    <ResponsiveContainer width="40%" height={200}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
    <CustomLegend data={pieData} colors={COLORS} />
  </div>
);

export default ElectricVehicleTypePieChart;
