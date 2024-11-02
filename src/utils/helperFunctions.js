export const aggregateEVData = (data) => {
  const aggregated = data.reduce((acc, { "Model Year": year, Make: make }) => {
    if (!acc[year]) acc[year] = {};
    if (!acc[year][make]) acc[year][make] = 0;
    acc[year][make]++;
    return acc;
  }, {});

  // Transforming to a chart-friendly format
  const chartData = Object.entries(aggregated).map(([year, makes]) => {
    return { year: parseInt(year), ...makes };
  });

  return chartData;
};

export const getStateCounts = (data) => {
  const stateCounts = {};

  data.forEach((vehicle) => {
    const state = vehicle["City"];
    if (state) {
      if (stateCounts[state]) {
        stateCounts[state] += 1;
      } else {
        stateCounts[state] = 1;
      }
    }
  });

  // Convert stateCounts object to array for Recharts
  return Object.entries(stateCounts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20); // Sort by count in descending order
};

export const getMakeAndModelCounts = (data) => {
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

export const getModelYearCounts = (data) => {
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

export const getCAFVCounts = (data) => {
  const eligibilityCounts = data.reduce(
    (acc, vehicle) => {
      if (
        vehicle["Clean Alternative Fuel Vehicle (CAFV) Eligibility"] ===
        "Clean Alternative Fuel Vehicle Eligible"
      ) {
        acc.eligible++;
      } else {
        acc.notEligible++;
      }
      return acc;
    },
    { eligible: 0, notEligible: 0 }
  );

  return [
    { name: "Yes", value: eligibilityCounts.eligible },
    { name: "No", value: eligibilityCounts.notEligible },
  ];
};
