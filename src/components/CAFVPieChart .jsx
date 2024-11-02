import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4caf50", "#f44336"];

const CAFVPieChart = ({ data }) => {
  return (
    <div
      className="chart-container"
      style={{
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        padding: "20px",
      }}
    >
      <h3>CAFV Eligibility Status</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={(entry) => `${entry.name}: ${entry.value}`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CAFVPieChart;
