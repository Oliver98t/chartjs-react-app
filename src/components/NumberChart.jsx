// NumberChart.jsx
import React, { useRef, useEffect } from 'react';
import {
  lightningChart,
  AxisTickStrategies,
  UIElementBuilders,
  UIDraggingModes,
  Themes,
  emptyLine,
  SolidLine,
} from '@lightningchart/lcjs';
import './NumberChart.css';

const LIGHTNING_KEY = import.meta.env.VITE_LIGHTNING_KEY;

async function cryptoCalcApi(ticker, startDate, endDate, requests) {
  const data = [];
  for (const request of requests) {
    const unixStartMs = new Date(`${startDate}T00:00:00Z`).getTime();
    const fromTs = Math.floor(unixStartMs / 1000);
    const unixEndMs = new Date(`${endDate}T00:00:00Z`).getTime();
    const toTs = Math.floor(unixEndMs / 1000);

    const [crypto, fiat] = ticker.split('/');
    let url = `http://localhost:8000/ohlcv/${request.endPoint}/?pair=${crypto}/${fiat}&from_ts=${fromTs}&to_ts=${toTs}`;
    if (request.option) url += `&${request.option}`;
    console.log(url);
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('Network response was not ok');
    const json = await res.json();

    // Build a friendly legend label
    let legend = request.endPoint.replace('_', ' ');
    if (request.option) {
      const [value] = request.option.match(/-?\d+(\.\d+)?/g);
      const [unit] = request.option.split('_');
      legend = `${value} ${unit} ${legend}`;
    }

    data.push({ ticker: legend, data: json.data });
  }
  return data;
}

const NumberChart = ({ ticker, startDate, endDate, requests }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!ticker.includes('/')) return;

    // Fetch data, then build the chart
    cryptoCalcApi(ticker, startDate, endDate, requests)
      .then((apiDataSets) => {
        // Dispose any prior chart
        chartRef.current?.dispose();

        // Create a new ChartXY in the container
        const chart = lightningChart({
            license: LIGHTNING_KEY,
            licenseInformation: {
                appTitle: "LightningChart JS Trial",
                company: "LightningChart Ltd."
            },
          // You can swap Themes.darkNew for dark mode
          theme: Themes.darkNew,
        }).ChartXY({

          container: chartContainerRef.current,
          // Disable auto cursor legend if you want custom legends
          // disableAxisGestures: false,
        });
        chartRef.current = chart;

        // Configure X axis for DateTime
        chart.setTitle(ticker)
        const axisX = chart.getDefaultAxisX();


        axisX
          .setTickStrategy(AxisTickStrategies.DateTime)
          .setTitle('Date')
          .setTitleFont((font) => font.setSize(16));

        // Configure Y axis title
        chart.getDefaultAxisY().setTitle('Fiat Price').setTitleFont((font) => font.setSize(16));

        // Add a line series for each dataset
        apiDataSets.forEach((set) => {
          if (!Array.isArray(set.data) || set.data.length === 0) return;

          const formatted = set.data.map((d) => ({
            x: d.timestamp * 1000,
            y: d.price,
          }));

          chart.addLineSeries({
              strokeStyle: new SolidLine({
                thickness: 2,
              }),
              pointStyle: emptyLine, // no point markers
            })
            .setName(set.ticker)
            .appendJSON(formatted);
        });
      })
      .catch((err) => {
        console.error('Error fetching or rendering data:', err);
      });

    // Cleanup on unmount or before next render
    return () => {
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, [ticker, startDate, endDate, requests]);

  return <div ref={chartContainerRef} className="chart-container" />;
};

export default NumberChart;