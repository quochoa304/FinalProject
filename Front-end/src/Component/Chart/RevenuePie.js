import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

function RevenueChart() {
  const chartRef = useRef(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('Authorization');
        const headers = {
          'Authorization': token
        };

        const response = await axios.get('http://localhost:8000/api/stats/memberships/revenueThisMonthPerMembership', { headers });
        setMonthlyRevenue(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (monthlyRevenue.length > 0) {
      renderChart();
    }
  }, [monthlyRevenue]);

  const renderChart = () => {
    if (chartRef.current !== null && chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }

    const labels = [];
    const data = [];

    let totalRevenue = 0;

    monthlyRevenue.forEach(item => {
      labels.push(item.membershipName);
      data.push(item.revenue);
      totalRevenue += item.revenue;
    });

    // Thêm doanh thu tổng của hai gói thành viên đầu tiên vào tiêu đề của biểu đồ
    const chartTitle = `Monthly Revenue by Membership (Current Month) - Total Revenue: $${totalRevenue}`;

    const chartData = {
      labels: labels,
      datasets: [{
        label: 'Monthly Revenue',
        data: data,
        backgroundColor: generateColors(data.length),
        borderWidth: 1
      }]
    };

    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: chartTitle,
          position: 'bottom'
        },
        legend: {
          display: true,
        }
      }
    };

    const ctx = chartRef.current.getContext('2d');
    chartRef.current.chartInstance = new Chart(ctx, {
      type: 'pie',
      data: chartData,
      options: options
    });
  };

  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      colors.push(getRandomColor());
    }
    return colors;
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div>
      <canvas ref={chartRef} id="revenueChart" width="400" height="400"></canvas>
    </div>
  );
}

export default RevenueChart;
