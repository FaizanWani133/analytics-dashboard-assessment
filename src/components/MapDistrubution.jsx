import { MapContainer, Marker, TileLayer } from "react-leaflet";
const parseCoordinates = (pointString) => {
  if (!pointString) {
    return null;
  }
  const regex = /POINT \(([^ ]+) ([^ ]+)\)/;
  const match = pointString.match(regex);
  if (match) {
    const longitude = parseFloat(match[1]);
    const latitude = parseFloat(match[2]);
    return [latitude, longitude];
  }
  return null;
};
const MapDistrubution = ({ data }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "6px",
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        overflow: "hidden",
        height: "100%",
        width: "100%",
      }}
    >
      <MapContainer
        center={[47.6062, -122.3321]}
        zoom={10}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {data.map((point, index) => {
          const position = parseCoordinates(point.location);
          if (!position) {
            return;
          }
          return <Marker key={index} position={position}></Marker>;
        })}
      </MapContainer>
    </div>
  );
};

export default MapDistrubution;
