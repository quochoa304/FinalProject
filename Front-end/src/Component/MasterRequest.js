import React, { useState, useEffect } from 'react';
import axios from 'axios';
const token = localStorage.getItem('Authorization');
const MasterRequest = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/rentRequests/userRequest', {
        headers: {
            'Authorization': token
        }
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const updateRentRequest = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/rentRequests/update/${id}`, { status }, {
        headers: {
            'Authorization': token
        }
      });
      if (status === 'accepted') {
        window.location.href = response.data; // Redirect to Google Meet link
      } else {
        fetchRequests(); // Update the request list after rejecting
      }
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const tableContainerStyle = {
    maxWidth: '100%',
    overflowX: 'auto',
    overflowY: 'hidden',
  };
  
  const tableStyle = {
    margin: 'auto',
    textAlign: 'center',
    border: '2px solid #ed563b',
    padding: '10px',
    width: '80%',
    borderCollapse: 'collapse'
  };
  
  const thStyle = {
    width: '1%',
    whiteSpace: 'nowrap',
    border: '2px solid #ed563b'
  };
  
  const buttonStyle = {
    marginRight: '5px'
  };

  return (
    <div>
      <h5>List Requests:</h5><br/>
      {requests.length > 0 ? (
          <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>User Name</th>
                <th style={thStyle}>User Email</th>
                <th style={thStyle}>Link access</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => (
                <tr key={request.id}>
                  <td>{request.user.firstName + ' ' + request.user.lastName}</td>
                  <td>{request.user.email}</td>
                  <td><a href="#">Link access</a></td>
                  <td>{request.status}</td>
                  <td>
                    <button style={buttonStyle} onClick={() => updateRentRequest(request.id, 'accepted')}>Accept</button>
                    <button onClick={() => updateRentRequest(request.id, 'denied')}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', fontStyle: 'italic' }}>
          <h7>No request found.</h7>
        </div>
      )}
    </div>
  );
};

export default MasterRequest;
