import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [membershipCounts, setMembershipCounts] = useState({});
  const [unregisteredUsers, setUnregisteredUsers] = useState(0);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('Authorization');

    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('/api/stats/users/count', {
          headers: {
            'Authorization': token
          }
        });
        setTotalUsers(usersResponse.data);

        const countsResponse = await axios.get('/api/stats/memberships/counts', {
          headers: {
            'Authorization': token
          }
        });
        setMembershipCounts(countsResponse.data);

        // Calculate unregistered users
        const registeredUsers = Object.values(countsResponse.data).reduce((acc, curr) => acc + curr, 0);
        setUnregisteredUsers(usersResponse.data - registeredUsers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [...Object.keys(membershipCounts), 'Unregistered Users'],
          datasets: [{
            label: 'User Distribution',
            data: [...Object.values(membershipCounts), unregisteredUsers],
            backgroundColor: [
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: `Customer statistics - Total user: ${totalUsers}`, // Tiêu đề của biểu đồ
              position: 'bottom',
            }
          }
        }
      });

      // Add annotation below the chart
      const chartAnnotation = chartInstance.current;
      chartAnnotation.options.plugins.annotation = {
        annotations: [{
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y',
          value: totalUsers,
          borderColor: 'red',
          borderWidth: 2,
          label: {
            content: `Total Users: ${totalUsers}`,
            enabled: true,
            position: 'right',
          }
        }]
      };
      chartAnnotation.update();
    }
  }, [membershipCounts, unregisteredUsers, totalUsers]);

  return (
    <div className="dashboard">
      <div>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}

export default Dashboard;
