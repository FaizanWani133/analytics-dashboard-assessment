import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import Select from "react-select";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import Parser from "papaparse";

function App() {
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMake, setSelectedMake] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const yearOptions = Array.from(new Set(jsonData.map((v) => v["Model Year"])))
    .map((year) => ({ value: year, label: year }))
    .sort((a, b) => b.value - a.value); // Sort in increasing order

  const makeOptions = Array.from(new Set(jsonData.map((v) => v.Make))).map(
    (make) => ({ value: make, label: make })
  );

  const cityOptions = Array.from(new Set(jsonData.map((v) => v.City))).map(
    (city) => ({ value: city, label: city })
  );

  const pointsOptions = Array.from(
    new Set(jsonData.map((v) => v["Vehicle Location"]))
  ).map((location) => ({ location: location }));
  const totalCounty = Array.from(new Set(jsonData.map((v) => v.County))).length;
  const totalMake = Array.from(new Set(jsonData.map((v) => v.Make))).length;
  const totalModel = Array.from(new Set(jsonData.map((v) => v.Model))).length;
  const totalElectricUtility = Array.from(
    new Set(jsonData.map((v) => v["Electric Utility"]))
  ).length;

  // Filtered data based on dropdown selections
  const filteredData = jsonData.filter((vehicle) => {
    return (
      (!selectedYear || vehicle["Model Year"] === selectedYear.value) &&
      (!selectedMake || vehicle.Make === selectedMake.value) &&
      (!selectedCity || vehicle.City === selectedCity.value)
    );
  });

  // Prepare data for bar chart
  const barData = filteredData.reduce((acc, vehicle) => {
    const index = acc.findIndex(
      (item) => item.type === vehicle["Electric Vehicle Type"]
    );
    if (index === -1) {
      acc.push({ type: vehicle["Electric Vehicle Type"], count: 1 });
    } else {
      acc[index].count += 1;
    }
    return acc;
  }, []);

  // Prepare data for pie chart (Electric Vehicle Type distribution)
  const pieData = filteredData.reduce((acc, vehicle) => {
    const type = vehicle["Electric Vehicle Type"];

    // Find if this type is already in acc
    const existingType = acc.find((item) => item.name === type);

    if (existingType) {
      // If it exists, increment its value
      existingType.value += 1;
    } else {
      // If it does not exist, add it to acc
      acc.push({ name: type, value: 1 });
    }

    return acc;
  }, []);

  const COLORS = ["#8884d8", "#82ca9d"];
  const parseCoordinates = (pointString) => {
    if (!pointString) {
      return null;
    }
    const regex = /POINT \(([^ ]+) ([^ ]+)\)/;
    const match = pointString.match(regex);
    if (match) {
      const longitude = parseFloat(match[1]);
      const latitude = parseFloat(match[2]);
      return [latitude, longitude]; // Return as [latitude, longitude]
    }
    return null;
  };

  const getTop5Makes = (data) => {
    // Count occurrences of each make
    const makeCounts = data.reduce((acc, vehicle) => {
      const make = vehicle.Make;
      if (acc[make]) {
        acc[make]++;
      } else {
        acc[make] = 1;
      }
      return acc;
    }, {});

    // Convert to array and sort by count
    const sortedMakes = Object.entries(makeCounts)
      .map(([make, count]) => ({ make, count }))
      .sort((a, b) => b.count - a.count);

    // Get top 5
    return sortedMakes.slice(0, 10);
  };

  // Example usage:
  const top5Makes = getTop5Makes(filteredData); // Assuming filteredData contains your vehicle data

  useEffect(() => {
    setLoading(true);
    fetch("../data-to-visualize/Electric_Vehicle_Population_Data.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Parser.parse(csvText, {
          header: true,
          complete: (response) => {
            console.log("All chunks loaded", response);
            setJsonData(response.data);
          },
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const makeRangeMap = {};

  jsonData.forEach((vehicle) => {
    const make = vehicle.Make;
    const range = parseInt(vehicle["Electric Range"], 10);

    if (make in makeRangeMap) {
      makeRangeMap[make] = Math.max(makeRangeMap[make], range);
    } else {
      makeRangeMap[make] = range;
    }
  });

  // Convert the object into an array for Recharts
  const data = Object.keys(makeRangeMap).map((make) => ({
    make,
    range: makeRangeMap[make],
  }));

  if (loading) {
    return <h1>Have Patience , We are loading the data for you</h1>;
  }

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Electric Vehicles Dataset Analysis (1998-2024)</h1>
      </header>
      <h1>
        Total Vehicle <br /> {jsonData.length}
      </h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Select
          options={makeOptions}
          value={selectedMake}
          onChange={setSelectedMake}
          placeholder="Select Make"
          isClearable
        />
        <h3>
          Total County <br /> {totalCounty}
        </h3>
        <h3>
          Total Model
          <br /> {totalModel}
        </h3>
        <h3>
          Total Make <br /> {totalMake}
        </h3>
        <h3>
          Total Electric Utility
          <br /> {totalElectricUtility}
        </h3>
        <Select
          options={cityOptions}
          value={selectedCity}
          onChange={setSelectedCity}
          placeholder="Select City"
          isClearable
        />
      </div>

      <div className="filters">
        <Select
          options={yearOptions}
          value={selectedYear}
          onChange={setSelectedYear}
          placeholder="Select Model Year"
          isClearable
        />
      </div>

      <div className="charts" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div className="chart-container">
          <h3>Electric Vehicle Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
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
        <div className="top-5-makes-chart">
          <h3>Top 10 Vehicle Makes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={top5Makes}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="make" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
          <h3>Electric Vehicle Counts by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="map-container">
        <h3>Vehicle Locations</h3>
        <MapContainer
          center={[47.6062, -122.3321]}
          zoom={10}
          style={{ height: "400px", width: "400px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {pointsOptions.map((point, index) => {
            const position = parseCoordinates(point.location);
            if (!position) {
              return;
            }
            return (
              <Marker key={index} position={position}>
                {/* <Popup>
                  <strong>
                    {vehicle.Make} {vehicle.Model}
                  </strong>
                  <br />
                  Year: {vehicle["Model Year"]}
                  <br />
                  Range: {vehicle["Electric Range"]} miles
                </Popup> */}
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      <h1>Electric Vehicle Make vs. Maximum Range</h1>
      <BarChart
        width={1200}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="make" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="range" fill="#8884d8" />
      </BarChart>
    </div>
  );
}

export default App;
