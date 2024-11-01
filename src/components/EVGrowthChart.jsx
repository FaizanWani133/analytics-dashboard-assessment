import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EVGrowthChart = ({ data }) => {
  return (
    <div
      className="chart-container"
      style={{
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        padding: "20px",
      }}
    >
      <h3>Growth in EVs Over Time by Model Year</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="TESLA" stroke="#8884d8" />
          <Line type="monotone" dataKey="NISSAN" stroke="#82ca9d" />
          <Line type="monotone" dataKey="CHEVROLET" stroke="#ffc658" />
          {/* Add more Line components for additional makes */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EVGrowthChart;
