import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MakeAndModelPopularityChart = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const models = data.find((item) => item.make === label)?.models;
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            border: "1px solid #ccc",
          }}
        >
          <p>
            <strong>{label}</strong>
          </p>
          {models &&
            models.slice(0, 3).map((model, index) => (
              <p key={index}>
                {model.model}: {model.count}
              </p>
            ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      style={{
        borderRadius: "6px",
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        padding: "20px",
      }}
    >
      <h3>Make and Model Popularity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="make" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MakeAndModelPopularityChart;
