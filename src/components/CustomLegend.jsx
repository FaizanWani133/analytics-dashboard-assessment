
const CustomLegend = ({ data, colors }) => (
  <div style={{ display: "flex", flexDirection: "column", marginLeft: "4px" }}>
    {data.map((entry, index) => (
      <div
        key={`legend-${index}`}
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: colors[index % colors.length],
            marginRight: "6px",
          }}
        />
        <span style={{ fontWeight: "bold", marginRight: "8px",textAlign:'left' }}>
          {entry.name}:
        </span>
        <span>{entry.value}</span>
      </div>
    ))}
  </div>
);

export default CustomLegend;
