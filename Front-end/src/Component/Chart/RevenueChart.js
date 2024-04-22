import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

function RevenueChart() {
  const chartRef = useRef(null);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('Authorization');
        const headers = {
          'Authorization': token
        };

        const response = await axios.get('/api/stats/memberships/revenueByMembershipLastFourMonths', { headers });
        setRevenueData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (revenueData.length > 0) {
      renderChart();
    }
  }, [revenueData]);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const renderChart = () => {
    if (chartRef.current !== null && chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }

    const labels = [];
    const datasets = {};

    revenueData.forEach(item => {
      const { month, year, membershipName, revenue } = item;
      const label = `${year}-${month}`;

      if (!labels.includes(label)) {
        labels.push(label);
      }

      if (!datasets[membershipName]) {
        datasets[membershipName] = Array(labels.length).fill(0);
      }

      const index = labels.indexOf(label);
      datasets[membershipName][index] = revenue;
    });

    const data = {
      labels: labels,
      datasets: Object.keys(datasets).map(membershipName => ({
        label: `Membership ${membershipName}`,
        data: datasets[membershipName],
        backgroundColor: getRandomColor(),
        borderColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 1
      }))
    };

    const options = {
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true,
          beginAtZero: true
        }
      }
    };

    const ctx = chartRef.current.getContext('2d');
    chartRef.current.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options
    });
  };

  return (
    <div>
      <canvas ref={chartRef} id="revenueChart" width="800" height="400"></canvas>
      <br />
      <h6 style={{ textAlign: 'center' }}>Monthly Revenue by Membership</h6>
      <br />
      <br />
    </div>
  );
}

export default RevenueChart;
