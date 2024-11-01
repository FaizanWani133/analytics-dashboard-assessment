import { Tooltip } from "react-leaflet";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const MakeAndRange = ({ data }) => {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "6px",
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
    >
      <h3>Electric Vehicle Make vs. Maximum Range</h3>
      <ResponsiveContainer width={"100%"} height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="make" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="range" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MakeAndRange;
