import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import MasterRequest from './MasterRequest';
function BecomeTrainer() {
  const token = localStorage.getItem('Authorization');
  const [selectedFile, setSelectedFile] = useState(null);
  const [request, setRequest] = useState(null);
  const [showLabel, setShowLabel] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showRequestTable, setShowRequestTable] = useState(false);
  const [fileTypeError, setFileTypeError] = useState(false);
  const fileInputRef = useRef(null);
  const [showTrainerPageButton, setShowTrainerPageButton] = useState(false);
  const [showRentRequestTable, setShowRentRequestTable] = useState(false);
  const [requests, setRequests] = useState([]);


  useEffect(() => {
    fetchRequests();
    const token = localStorage.getItem('Authorization');
    const headers = {
      'Authorization': token
    };
  
    axios.get('http://localhost:8000/ExpertRequest/myExpertRequest', { headers })
      .then(response => {
        console.log(response.data);
        setRequest(response.data);
        if (response.data && response.data.status === 'accepted') {
          setShowTrainerPageButton(true);
        } else {
          setShowTrainerPageButton(false);
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, []);

  const uploadFile = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('applicationData', selectedFile);
    const token = localStorage.getItem('Authorization');
    const headers = {
      'Authorization': token
    };

    axios.post('http://localhost:8000/ExpertRequest/submit', formData, { headers }) 
      .then(response => {
        console.log(response.data);
        alert('File uploaded successfully!');
      })
      .catch(error => {
        console.error('There was an error!', error);
        if (error.response && error.response.status === 400) {
          alert('Each user can send only 1 request');
        } else {
          console.log('File upload failed:', error.message);
        }
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.endsWith('.pdf')) {
      setFileTypeError(true);
      setSelectedFile(null);
      fileInputRef.current.value = null; // Clear the file input
    } else {
      setFileTypeError(false);
      setSelectedFile(file);
    }
  };
  const getMyExpertRequest = () => {
    const token = localStorage.getItem('Authorization');
    const headers = {
      'Authorization': token
    };
  
    axios.get('http://localhost:8000/ExpertRequest/myExpertRequest', { headers })
      .then(response => {
        console.log(response.data);
        setRequest(response.data);
        setShowRequestTable(true);
        setShowLabel(false);
  
        // Check if the request status is "accepted"
        if (response.data && response.data.status === 'accepted') {
          setShowTrainerPageButton(true);
        } else {
          setShowTrainerPageButton(false);
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const updateRequest = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('applicationData', selectedFile || request.applicationData);

    const token = localStorage.getItem('Authorization');
    const headers = {
      'Authorization': token
    };

    axios.put(`http://localhost:8000/ExpertRequest/update/${request.id}`, formData, { headers })
      .then(response => {
        console.log(response.data);
        alert('Request updated successfully!');
        cancelForm();
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  const downloadFile = (base64Data, filename, fileExtension) => {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: "application/pdf"});
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setShowUpdateForm(false); // Hide the update form if visible
    setShowRequestTable(false); // Hide the request table
    setShowLabel(false);
  };

  const toggleUpdateForm = () => {
    setShowUpdateForm(!showUpdateForm);
    setShowForm(false); // Hide the submit form if visible
    setShowRequestTable(false); // Hide the request table
    setShowLabel(false);
  };

  const cancelForm = () => {
    setShowForm(false);
    setShowUpdateForm(false);
    setShowRequestTable(false);
    setShowLabel(true);
  };
  const cancelTable = () => {
    setShowRequestTable(false);
    setShowForm(false);
    setShowUpdateForm(false);
    setShowLabel(true);
  };
  const handleToggleRequestTable = () => {
    fetchRequests();
    setShowRentRequestTable(true); 
  };
  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/rentRequests/masterRequest', {
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
        const requestData = { status };
        if (status === 'accepted') {
            const response = await axios.get('http://localhost:8000/createMeeting', {
                headers: {
                    'Authorization': token
                }
            });
            const meetingData = response.data;
            requestData.start_url = meetingData.start_url;
            requestData.join_url = meetingData.join_url;
        }

        await axios.put(`http://localhost:8000/api/rentRequests/update/${id}`, requestData, {
            headers: {
                'Authorization': token
            }
        });

        fetchRequests();
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
    width: '100%',
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
      {showLabel &&(
        <div >
                                     <div style={{display:'block'}}>
                    <h6>Become our partner:</h6><br></br>
                    <h7>- Earn money from your skills (Up to 2000$/month)</h7><br></br>
                    <h7>- You can make money anywhere online</h7><br></br>
                    <h7>- Daily revenue payment</h7><br></br>
                </div><br></br>
         </div>
      )}
     {!showForm && !showUpdateForm && !showRequestTable && (
  <div>
    {!showTrainerPageButton && (
      <>
        <button onClick={toggleForm} style={{ marginRight: '10px' }}>
          Submit a request
        </button>
        <button onClick={getMyExpertRequest}>My Request</button>
      </>
    )}
    {showTrainerPageButton && (
      <>
              <button onClick={getMyExpertRequest}>My expert request</button> &ensp;
           
              <button onClick={handleToggleRequestTable}>Check hire request</button><br/><br/>
      {showRentRequestTable && (
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
                     <tr key={request.id} data-request-id={request.id}>
                       <td>{request.user.firstName + ' ' + request.user.lastName}</td>
                       <td>{request.user.email}</td>
                       <td>
                            {request.start_url && request.start_url !== "" ?
                            <a href={request.start_url} style={{ color: 'blue' }}>Host link</a> :
                            <a href="#" style={{ color: 'red' }}>Link empty</a>
                          }
                        </td>
                       <td>{request.status}</td>
                       <td>
                         <button style={buttonStyle} onClick={() => updateRentRequest(request.id, 'accepted')}>Accept</button>
                         {request.status !== 'accepted' && 
                         <button style={buttonStyle} onClick={() => updateRentRequest(request.id, 'denied')}>Reject</button>
                          }
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
      )} &ensp;
      </>
    )}
  </div>
)}
      {showForm && (
        <div>
          <form style={{ border: '2px solid #ed563b', padding: '10px' }}>
            <label style={{fontWeight:'bold'}}>Upload your certificate or diploma here:</label> <br />
            <label style={{fontStyle:'italic', fontSize:'smaller'}}>Accepted qualifications: CPT,CPR/AED, CEU  (Convert to PDF)</label> <br /><br />
            <input type="file" accept=".pdf"  ref={fileInputRef}   required onChange={handleFileChange} /><br />
            {fileTypeError && (
        <div>
          <p style={{color:'red'}}>Please select a PDF file.</p>
        </div>
      )}
            <input type="radio" id="certificate" name="certificate" required /> 
            <label htmlFor="certificate">I am sure this is my certificate, I take responsibility if it is fake</label>
            <br /><br />
            &ensp;&ensp;<button type="submit" onClick={uploadFile}>Save</button>&ensp;
            <button type="button" onClick={cancelForm}>Cancel</button>
          </form>
        </div>
      )}
      {showUpdateForm && (
        <div style={{ border: '2px solid #ed563b', padding: '10px' }}>
          <form >
            <label style={{fontWeight:'bold'}}>Upload your updated certificate or diploma here:</label> <br />
            <label style={{fontStyle:'italic', fontSize:'smaller'}}>Accepted qualifications: CPT,CPR/AED, CEU   (Convert to PDF)</label> <br /><br />
            <input type="file" accept=".pdf"  ref={fileInputRef}   required onChange={handleFileChange} /><br />
            {fileTypeError && (
        <div>
          <p style={{color:'red'}}>Please select a PDF file.</p>
        </div>
      )}
            <input type="radio"required id="certificate" name="certificate" /> 
            <label htmlFor="certificate">I am sure this is my certificate, I take responsibility if it is fake</label>
            <br /><br />
            &ensp;&ensp;<button type="submit" onClick={updateRequest}>Submit</button>&ensp;
            <button type="button" onClick={cancelForm}>Cancel</button>
          </form>
        </div>
      )}
     {showRequestTable && (
  <div>
    {request ? ( // Kiểm tra xem request có tồn tại hay không
      <div>
        <br /><br />
        <table style={{ margin: 'auto',textAlign: 'center' ,border: '2px solid #ed563b', padding: '10px'}}>
          <thead style={{ borderBottom: '2px solid #ed563b', padding: '10px', margin: '50px' }}>
            <tr>
              <th>Request ID</th>&ensp;
              <th>Email: </th>&ensp;
              <th>Status</th>&ensp;
              <th>File</th>&ensp;
              <th>Action</th>&ensp;
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{request.id}</td>&ensp;
              <td>{request.user.email}</td>&ensp;
              <td>{request.status}</td>&ensp;
              <td>
                <button onClick={() => downloadFile(request.applicationData, `${request.id}`)}>
                  View File
                </button>
              </td>&ensp;
              <td>
                <button onClick={toggleUpdateForm}>Update Request</button>
              </td>&ensp;
            </tr>
          </tbody>
        </table><br />
        <button onClick={() => getMyExpertRequest()}>Reload</button>&ensp;&ensp;
        <button onClick={() => cancelTable()}>Back</button>
      </div>
    ) : ( 
      <div>
        <br /><br />
        <h7>No request found.</h7> <br/><br/>
        <button onClick={() => cancelTable()}>Back</button>
      </div>
    )}
  </div>
)}

    </div>
  );
}


export default BecomeTrainer;