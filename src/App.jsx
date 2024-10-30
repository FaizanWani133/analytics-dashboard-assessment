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
  FunnelChart,
  Funnel,
  LabelList,
  AreaChart,
  Area,
} from "recharts";
import Select from "react-select";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import Parser from "papaparse";
import ElectricVehicleTypePieChart from "./components/ElectricVehiclePieChart";
import MakeAndModelPopularityChart from "./components/MakeAndModelPopularityChart ";
import ModelYearAnalysisChart from "./components/ModelYearAnalysisChart ";
import LegislativeDistrictChart from "./components/LegislativeDistrictChart ";

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
    // Define color codes
    const colors = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"];

    // Count occurrences of each make
    const makeCounts = data.reduce((acc, vehicle) => {
      const make = vehicle.Make;
      acc[make] = (acc[make] || 0) + 1;
      return acc;
    }, {});

    // Convert to array, sort by count, and add color
    const sortedMakes = Object.entries(makeCounts)
      .map(([make, count], index) => ({
        make,
        count,
        fill: colors[index % colors.length], // Assign color cyclically
      }))
      .sort((a, b) => b.count - a.count);

    // Get top 5
    return sortedMakes.slice(0, 5);
  };
  const getModelYearCounts = (data) => {
    const yearCounts = {};

    data.forEach((vehicle) => {
      const modelYear = vehicle["Model Year"];
      if (yearCounts[modelYear]) {
        yearCounts[modelYear] += 1;
      } else {
        yearCounts[modelYear] = 1;
      }
    });

    // Convert yearCounts object to array for Recharts
    return Object.entries(yearCounts)
      .map(([year, count]) => ({
        year: parseInt(year, 10),
        count,
      }))
      .sort((a, b) => a.year - b.year); // Sort by year
  };

  const processedData = getModelYearCounts(filteredData);

  // Example usage:
  const top5Makes = getTop5Makes(filteredData); // Assuming filteredData contains your vehicle data

  useEffect(() => {
    setLoading(true);
    fetch("../public/data-to-visualize/Electric_Vehicle_Population_Data.csv")
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

  const getLegislativeDistrictCounts = (data) => {
    const districtCounts = {};

    data.forEach((vehicle) => {
      const district = vehicle["Legislative District"];
      if (district) {
        if (districtCounts[district]) {
          districtCounts[district] += 1;
        } else {
          districtCounts[district] = 1;
        }
      }
    });

    // Convert districtCounts object to array for Recharts
    return Object.entries(districtCounts)
      .map(([district, count]) => ({
        district,
        count,
      }))
      .sort((a, b) => b.count - a.count); // Sort by count in descending order
  };

  const processedlegeslativeData = getLegislativeDistrictCounts(filteredData);

  const getMakeAndModelCounts = (data) => {
    const makeCounts = {};

    data.forEach((vehicle) => {
      const make = vehicle.Make;
      const model = vehicle.Model;

      // Initialize make if not present
      if (!makeCounts[make]) {
        makeCounts[make] = { count: 0, models: {} };
      }

      // Count the make
      makeCounts[make].count += 1;

      // Count the model under the make
      if (makeCounts[make].models[model]) {
        makeCounts[make].models[model] += 1;
      } else {
        makeCounts[make].models[model] = 1;
      }
    });

    // Format data for the chart
    const fornmattedData = Object.entries(makeCounts).map(
      ([make, { count, models }]) => ({
        make,
        count,
        models: Object.entries(models).map(([model, modelCount]) => ({
          model,
          count: modelCount,
        })),
      })
    );
    return fornmattedData.slice(0, 5);
  };
  const makeAndModelCount = getMakeAndModelCounts(filteredData);

  if (loading) {
    return <h1>Have Patience , We are loading the data for you</h1>;
  }

  return (
    <div className="dashboard">
      <header className="header">
        <div
          style={{
            borderRadius: "4px",
            backgroundColor: "#7267e9",
            padding: "20px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3 style={{ textAlign: "left",color:'white' }}>Electric Vehicles Data (1998-2024)</h3>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                alignItems: "center",
              }}
            >
              <Select
                options={cityOptions}
                value={selectedCity}
                onChange={setSelectedCity}
                placeholder="Select City"
                isClearable
              />
              <Select
                options={yearOptions}
                value={selectedYear}
                onChange={setSelectedYear}
                placeholder="Select Year"
                isClearable
              />
              {/* <Select
                options={makeOptions}
                value={selectedMake}
                onChange={setSelectedMake}
                placeholder="Select Make"
                isClearable
              /> */}
            </div>
          </div>
          
        </div>
      </header>
      <section style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <MakeAndModelPopularityChart data={makeAndModelCount} />
        <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: "20px", flexDirection: "row" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "6px",
                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                padding: "20px",
                textAlign: "left",
                width: "100px",
              }}
            >
              <p>{'Total EV"s'}</p>
              <p>{jsonData.length}</p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "6px",
                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                padding: "20px",
                textAlign: "left",
                width: "100px",
              }}
            >
              <p>{"Make Count"}</p>
              <p>{totalMake}</p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "6px",
                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                overflow: "hidden",
              }}
            >
              <MapContainer
                center={[47.6062, -122.3321]}
                zoom={10}
                style={{ height: "100%", width: "300px",zIndex:0 }}
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
                  return <Marker key={index} position={position}></Marker>;
                })}
              </MapContainer>
            </div>
          </div>
          <div style={{ display: "flex", gap: "20px", flexDirection: "row" }}>
            <ElectricVehicleTypePieChart pieData={pieData} />
          </div>
          
        </div>
        {/* <LegislativeDistrictChart data={processedlegeslativeData} /> */}

      </section>
      <section style={{ marginTop: "20px", display: "flex", gap: "20px" }}>
        <div
          style={{
            padding: "20px",
            borderRadius: "6px",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          }}
        >
          <h3>Electric Vehicle Make vs. Maximum Range</h3>
          <BarChart
            width={500}
            height={200}
            data={data}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="make" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="range" fill="#8884d8" />
          </BarChart>
        </div>
        <ModelYearAnalysisChart data={processedData} />
      </section>
    </div>
  );
}

export default App;
