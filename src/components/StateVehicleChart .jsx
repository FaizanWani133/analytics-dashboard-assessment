import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StateVehicleChart = ({ data }) => {
  return (
    <div
      className="chart-container"
      style={{
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        padding: "20px",
      }}
    >
      <h3>Top States by Electric Vehicle Count</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            label={{
              value: "Vehicle Count",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis type="category" dataKey="state" />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StateVehicleChart;
