import React, { useState, useEffect } from 'react';
import axios from 'axios';
const token = localStorage.getItem('Authorization');
const UserRequest = () => {
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
    })
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  return (
    <div>
      <h2>List Requests:</h2>
      <table style={{ margin: 'auto', textAlign: 'center', border: '2px solid #ed563b', padding: '10px', width: '80%' }}>
        <thead>
          <tr>
            <th style={{ width: '25%', border: '2px solid #ed563b' }}>Master Name</th>
            <th style={{ width: '25%', border: '2px solid #ed563b' }}>Master Email</th>
            <th style={{ width: '25%', border: '2px solid #ed563b' }}>Link access</th>
            <th style={{ width: '25%' , border: '2px solid #ed563b'}}>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id}>
              <td>{request.master.firstName + ' ' + request.master.lastName}</td>
              <td>{request.master.email}</td>
              <td>
                {request.join_url && request.join_url !== "" ?
                <a href={request.join_url} style={{ color: 'blue' }}>Join link</a> :
                <a href="#" style={{ color: 'red' }}>Link empty</a>
                 }
              </td>
              <td>{request.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRequest;
