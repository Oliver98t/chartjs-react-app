import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './NumberChart.css'; // import CSS file

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const NumberChart = ({ ticker, startDate, endDate }) => {
  const [numbers, setNumbers] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    if (!ticker.includes('/')) return;
    
    const unix_start_ts_ms = new Date(`${startDate}T00:00:00Z`).getTime()
    const from_ts = Math.floor(unix_start_ts_ms / 1000)
    console.log(from_ts)

    const unix_end_ts_ms = new Date(`${endDate}T00:00:00Z`).getTime()
    const to_ts = Math.floor(unix_end_ts_ms / 1000)
    console.log(to_ts)

    const [crypto, fiat] = ticker.split('/');

    fetch(`http://localhost:8000/ohlcv/pair_data/?pair=${crypto}/${fiat}&from_ts=${from_ts}&to_ts=${to_ts}`, {
      headers: { Accept: 'application/json' }
    })
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        const series = data['data'];
        const prices = series.map(d => d.price);
        const timeLabels = series.map(d => {
          const date = new Date(d.timestamp * 1000);
          return date.toLocaleDateString('en-GB');
        });
        
        setNumbers(prices);
        setLabels(timeLabels);
      })
      .catch(err => {
        console.error('Error fetching OHLCV data:', err);
        setNumbers([]);
        setLabels([]);
      });
  }, [ticker, startDate, endDate]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: ticker,
        data: numbers,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

    const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Timestamp', // Replace with your preferred label
          font: {
            size: 16
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Fiat Price', // Customize to match your data
          font: {
            size: 16
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default NumberChart;