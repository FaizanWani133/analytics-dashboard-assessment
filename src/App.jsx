import { useEffect, useState } from "react";
import Select from "react-select";
import "leaflet/dist/leaflet.css";
import "./App.css";
import Parser from "papaparse";
import ElectricVehicleTypePieChart from "./components/ElectricVehiclePieChart";
import MakeAndModelPopularityChart from "./components/MakeAndModelPopularityChart ";
import ModelYearAnalysisChart from "./components/ModelYearAnalysisChart ";
import StateVehicleChart from "./components/StateVehicleChart ";
import EVGrowthChart from "./components/EVGrowthChart";
import MapDistrubution from "./components/MapDistrubution";
import MakeAndRange from "./components/MakeAndRange";
import LoadingIndicator from "./components/LoadingIndicator";
import {
  aggregateEVData,
  getCAFVCounts,
  getMakeAndModelCounts,
  getModelYearCounts,
  getStateCounts,
} from "./utils/helperFunctions";
import CAFVPieChart from "./components/CAFVPieChart ";

function App() {
  const [loading, setLoading] = useState(false);
  const [jsonData, setJsonData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const yearOptions = Array.from(new Set(jsonData.map((v) => v["Model Year"])))
    .map((year) => ({ value: year, label: year }))
    .sort((a, b) => b.value - a.value); // Sort in increasing order

  const cityOptions = Array.from(new Set(jsonData.map((v) => v.City))).map(
    (city) => ({ value: city, label: city })
  );
  const pointsOptions = Array.from(
    new Set(jsonData.map((v) => v["Vehicle Location"]))
  ).map((location) => ({ location: location }));
  const totalCounty = Array.from(new Set(jsonData.map((v) => v.County))).length;
  const totalMake = Array.from(new Set(jsonData.map((v) => v.Make))).length;
  const totalModel = Array.from(new Set(jsonData.map((v) => v.Model))).length;

  // Filtered data based on dropdown selections
  const filteredData = jsonData.filter((vehicle) => {
    return (
      (!selectedYear || vehicle["Model Year"] === selectedYear.value) &&
      (!selectedCity || vehicle.City === selectedCity.value)
    );
  });

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
  const makeRangeData = Object.keys(makeRangeMap).map((make) => ({
    make,
    range: makeRangeMap[make],
  }));
  const makeAndModelCount = getMakeAndModelCounts(filteredData);
  //   const aggregated = data.reduce(
  //     (acc, { "Model Year": year, Make: make }) => {
  //       if (!acc[year]) acc[year] = {};
  //       if (!acc[year][make]) acc[year][make] = 0;
  //       acc[year][make]++;
  //       return acc;
  //     },
  //     {}
  //   );

  //   // Transforming to a chart-friendly format
  //   const chartData = Object.entries(aggregated).map(([year, makes]) => {
  //     return { year: parseInt(year), ...makes };
  //   });

  //   return chartData;
  // };
  const aggregatedData = aggregateEVData(filteredData);
  const statesCountData = getStateCounts(filteredData);
  const processedData = getModelYearCounts(filteredData);
  const eligibilityCounts = getCAFVCounts(filteredData);
  const pieData = filteredData.reduce((acc, vehicle) => {
    const type = vehicle["Electric Vehicle Type"];
    const existingType = acc.find((item) => item.name === type);

    if (existingType) {
      existingType.value += 1;
    } else {
      acc.push({ name: type, value: 1 });
    }

    return acc;
  }, []);
  useEffect(() => {
    setLoading(true);
    fetch("./Electric_Vehicle_Population_Data.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Parser.parse(csvText, {
          header: true,
          complete: (response) => {
            setJsonData(response.data);
          },
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="dashboard">
      <header className="header">
        <div
          style={{
            borderRadius: "4px",
            backgroundColor: "#7267e9",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              justifyContent: "space-between",
            }}
          >
            <h2 style={{ textAlign: "left", color: "white" }}>
              Electric Vehicles Data (1998-2024)
            </h2>

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
                className="select"
              />
              <Select
                options={yearOptions}
                value={selectedYear}
                onChange={setSelectedYear}
                placeholder="Select Year"
                isClearable
                className="select"
              />
            </div>
          </div>
        </div>
      </header>
      <section
        style={{
          display: "flex",
          width: "100%",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            flex: 1,
          }}
        >
          <MakeAndModelPopularityChart data={makeAndModelCount} />

          <MapDistrubution data={pointsOptions} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "6px",
                  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                  padding: "20px",
                  textAlign: "left",
                  flexGrow: 1,
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
                  flexGrow: 1,
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
                  padding: "20px",
                  textAlign: "left",
                  flexGrow: 1,
                }}
              >
                <p>{"Total County"}</p>
                <p>{totalCounty}</p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "6px",
                  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                  padding: "20px",
                  textAlign: "left",
                  flexGrow: 1,
                }}
              >
                <p>{"Model Count"}</p>
                <p>{totalModel}</p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                borderRadius: "6px",
                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                overflow: "hidden",
                width: "500px",
              }}
            >
              <CAFVPieChart data={eligibilityCounts}/>
            </div>
          </div>
          <div
            style={{ display: "flex", gap: "20px", flexDirection: "column" }}
          >
            <ElectricVehicleTypePieChart pieData={pieData} />
            <EVGrowthChart data={aggregatedData} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1.5,
            gap: "20px",
          }}
        >
          <StateVehicleChart data={statesCountData} />
          <ModelYearAnalysisChart data={processedData} />
          <MakeAndRange data={makeRangeData} />
        </div>
      </section>
    </div>
  );
}

export default App;
