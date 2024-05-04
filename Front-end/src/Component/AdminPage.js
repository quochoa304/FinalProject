import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../assets/css/ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import Dashboard from './Chart/Dashboard';
import RevenueChart from './Chart/RevenueChart';
import RevenuePie from './Chart/RevenuePie';
function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [alertShown, setAlertShown] = useState(false);
  const [displayDashboard, setDisplayDashboard] = useState(false);
  const [exercise, setExercise] = useState([]);
  const [message, setMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const[showErrorMessage, setShowErrorMessage] = useState(false);
  const [membershipPackages, setMembershipPackages] = useState([]);
  const [displayMembership, setDisplayMembership] = useState(true);
const [displayExercises, setDisplayExercises] = useState(false);
const [displayAccount, setDisplayAccount] = useState(false);
const [selectedMembershipId, setSelectedMembershipId] = useState(null);
const [selectedEditExercisesId, setSelectedEditExercisesId] = useState(null);
const [exercisesInMembership, setExercisesInMembership] = useState([]);
const [displayMembershipExercises, setDisplayMembershipExercises] = useState(false);
const [selectedExercises, setSelectedExercises] = useState([]);
const [EditExercise, setEditExercise] = useState([]);
const [displayRequest, setdisplayRequest] = useState(false);
const [Request, setRequest] = useState([]);
const [toEmail, setToEmail] = useState('');
const [subject, setSubject] = useState('');
const [body, setBody] = useState('');
const [response, setResponse] = useState('');
  const token = localStorage.getItem('Authorization');

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      setIsAdmin(true);
    } else {
      if (!alertShown) { 
        setAlertShown(true);
      }
      navigate('/member');
    }
    fetchMembershipPackages();
    fetchExercises();
    fetchExercises();
  }, [alertShown]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate('/login', { state: { successMessage: 'Logout success !' } });
      localStorage.removeItem('user');
      localStorage.removeItem('Authorization');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
const fetchMembershipPackages = () => {
  axios.get('http://localhost:8000/admin/gym-memberships', {
    headers: {
      'Authorization': token
    }
  })
  .then(response => {
    setMembershipPackages(response.data);
  })
  .catch(error => console.error('There was an error!', error));
};

const fetchExercises = () => {
  axios.get('http://localhost:8000/admin/exercises', {
    headers: {
      'Authorization': token
    }
  })
  .then(response => {
    setExercise(response.data);
  })
  .catch(error => console.error('There was an error fetching membership info!', error));
};

const fetchRequest = () => {
  axios.get('http://localhost:8000/admin/showAllExpertRequest', {
    headers: {
      'Authorization': token
    }
  })
  .then(response => {
    setRequest(response.data);
  })
  .catch(error => console.error('There was an error fetching membership info!', error));
};



const [membership, setMembership] = useState({
  name: "",
  price: "",
  durationMonths: "",
  description: "",
});

const handleChange = e => {
  setMembership({ ...membership, [e.target.name]: e.target.value });
};
const handleExerciseNameChange = e => {
  setEditExercise({ ...EditExercise, name: e.target.value });
}
const handleExerciseTypeChange = e => {
  setEditExercise({ ...EditExercise, type: e.target.value });
}
const handleExerciseDescripChange = e => {
  setEditExercise({ ...EditExercise, description: e.target.value });
}

const handleSubmit = async e => {
  e.preventDefault();
  
  try {
    await axios.post('/admin/gym-memberships', membership, {
      headers: {
          'Authorization': token
      }
  });
    alert('Membership was saved successfully.');
    setMembership({

      name: "",
      price: "",
      durationMonths: "",
      description: ""
    });
    fetchMembershipPackages();
  } catch (err) {
    console.error('Error creating membership', err);
    alert('Failed to create membership.');
  }
};



const deleteMembership = async (id) => {
  try {
    const confirmDelete = window.confirm("Are you sure to delete this membership?");
    if (confirmDelete) {
      await axios.delete(`http://localhost:8000/admin/gym-memberships/${id}`, {
        headers: {
          'Authorization': token
        }
      });
      fetchMembershipPackages();
    }
  } catch (error) {
    console.error('Error deleting membership:', error);
  }
};

const handleAddExercise = async e => {
  e.preventDefault();
  
  const formData = new FormData(); // Tạo một FormData để chứa dữ liệu của bài tập

  // Lấy thông tin của bài tập từ các trường nhập liệu
  const exerciseName = document.getElementById('exerciseName').value;
  const exerciseType = document.getElementById('exerciseType').value;
  const exerciseDescription = document.getElementById('description').value;
  const exerciseImage = document.getElementById('exerciseImage').files[0]; // Lấy tệp hình ảnh

  // Thêm dữ liệu của bài tập vào FormData
  formData.append('name', exerciseName);
  formData.append('type', exerciseType);
  formData.append('description', exerciseDescription);
  formData.append('image', exerciseImage); // Thêm ảnh vào FormData

  try {
    // Gửi yêu cầu POST với FormData chứa dữ liệu của bài tập và ảnh
    await axios.post('http://localhost:8000/admin/exercises/save', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Đảm bảo rằng yêu cầu được gửi dưới dạng multipart/form-data
        'Authorization': token
      }
    });

    alert('Exercise was saved successfully.');
    setEditExercise({
      name: '',
      type: '',
      description: ''
    });

    fetchExercises(); // Lấy danh sách các bài tập mới sau khi đã thêm thành công
  } catch (error) {
    console.error('Error adding exercise:', error);
    alert('Failed to add exercise.');
  }
}




const editExercise = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8000/admin/exercises/edit/${id}`, {
      headers: {
        'Authorization': token
      }
    });
    setEditExercise(response.data); // Set the exercise details directly
    setSelectedEditExercisesId(id); // Set selectedEditExercisesId to the id of the exercise being edited
  } catch (error) {
    console.error('Error fetching exercise:', error);
  }
}

const handleEditExercise = async e => {
  e.preventDefault();
  const exerciseName = document.getElementById('exerciseName').value;
  const exerciseType = document.getElementById('exerciseType').value;
  const exerciseDescription = document.getElementById('description').value;
  const exerciseImage = document.getElementById('exerciseImage').files[0]; // Lấy hình ảnh mới từ input file

  // Tạo đối tượng FormData và thêm dữ liệu cập nhật vào đó
  const formData = new FormData();
  formData.append('name', exerciseName);
  formData.append('type', exerciseType);
  formData.append('description', exerciseDescription);
  formData.append('image', exerciseImage); // Thêm hình ảnh mới vào FormData

  try {
    await axios.put(`http://localhost:8000/admin/exercises/update/${selectedEditExercisesId}`, formData, {
      headers: {
        'Authorization': token,
        'Content-Type': 'multipart/form-data' // Đặt Content-Type là multipart/form-data để gửi dữ liệu có hình ảnh
      }
    });
    alert('Exercise was updated successfully.');
    // Clear input fields after successful update
    setEditExercise({
      name: '',
      type: '',
      description: ''
    });

    // Fetch exercises to update the exercise list
    fetchExercises();
    setSelectedEditExercisesId(null);
  } catch (error) {
    console.error('Error updating exercise:', error);
    alert('Failed to update exercise.');
  }
}



const editMembership = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8000/admin/gym-memberships/${id}`, {
      headers: {
        'Authorization': token
      }
    });
    setMembership(response.data);
    setSelectedMembershipId(id); 
  } catch (error) {
    console.error('Error fetching membership:', error);
  }
};

const deleteExercise = async (id) => {
  try {
    console.log(id);
    const confirmDelete = window.confirm("Are you sure to delete this exercise?");
    if (confirmDelete) {
      await axios.delete(`http://localhost:8000/admin/exercises/delete/${id}`, {
        headers: {
          'Authorization': token
        }
      });
      fetchExercises();
    }
  } catch (error) {
    console.error('Error deleting exercise:', error);
    alert('The assignment cannot be deleted because it exists in a membership package');
  }
}

const handleCancelEdit = () => {
  setEditExercise({
    name: '',
    type: '',
    description: ''
  });
  setMembership({
    name: "",
    price: "",
    durationMonths: "",
    description: ""
  });
  setSelectedMembershipId(null);
  // Gỡ selectedEditExercisesId
  setSelectedEditExercisesId(null);
};

const fetchExercisesInMembership = async (id) => {
  setSelectedMembershipId(id);

  try {
    const response = await axios.get(`http://localhost:8000/admin/gym-memberships/${id}/exercises`, {
      headers: {
        'Authorization': token
      }
    });

    setExercisesInMembership(response.data);
    console.log(response.data);
  } catch (error) {
    console.error('There was an error!', error);
  }
};

const handleExerciseSelectionChange = (event) => {
  const selectedOptions = Array.from(event.target.options)
                                .filter(option => option.selected)
                                .map(option => option.value);
  setSelectedExercises(selectedOptions);
};

const handleAddExerciseToMembership = async (event) => {
  event.preventDefault();

  try {
    await axios.post(`http://localhost:8000/admin/gym-memberships/${selectedMembershipId}/exercises`, 
    selectedExercises,  // Changed from {exerciseIds: selectedExercises}
    {
      headers: {
      'Authorization': token
      }
    });

    fetchExercisesInMembership(selectedMembershipId);
    showSuccessNotification();
  } catch (error) {
    console.error('There was an error!', error);
  }
}

const deleteExerciseFromMembership = async (exerciseId) => {
  try {
    await axios.delete(`http://localhost:8000/admin/gym-memberships/${selectedMembershipId}/exercises/${exerciseId}`, {
      headers: {
        'Authorization': token
      }
    });
    fetchExercisesInMembership(selectedMembershipId);
  } catch (error) {
    console.error('There was an error!', error);
  }
}



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

const updateExpertRequest = async (id, status, request) => {
  try {
    await axios.put(`http://localhost:8000/admin/updateExpertRequest/${id}`, status, {
      headers: {
        'Authorization': token
      }
    });
    if (status === 'accepted') {
      // Gọi hàm sendEmail với các thông tin cần thiết
      sendEmail(request.user.email, 'Expert Request Accepted', 'Your expert request has been accepted.');
    } else {
      sendEmail(request.user.email, 'Expert Request Denied', 'Your expert request has been denied. Please use another certificate and try again.');
    }
    fetchRequest();
  } catch (error) {
    console.error('Error updating request:', error);
  }
};


const sendEmail = async (toEmail, subject, body) => {
  try {
    const res = await fetch('/sendEmail?toEmail=' + encodeURIComponent(toEmail) + '&subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body), {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.text();
    setResponse(data);
  } catch (err) {
    console.error(err);
    setResponse('Error sending email');
  }
};



  const showSuccessNotification = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000); 
  };


  const handleToggleMembership = () => {
    setDisplayMembership(true);
    setDisplayExercises(false);
    setDisplayDashboard(false);
    setDisplayMembershipExercises(false);
  };

  const handleToggleExercises = () => {
    setDisplayMembershipExercises(false);
    setDisplayMembership(false);
    setDisplayExercises(true);
    setDisplayDashboard(false);
  };

  const handleToggleDashboard = () => {
    setdisplayRequest(false);
    setDisplayDashboard(true);
    setDisplayMembership(false);
    setDisplayExercises(false);
    setdisplayRequest(false);
  };

  const handleToggleMembershipExercises = async (id) => {
    await fetchExercisesInMembership(id);  
    setDisplayMembership(false);
    setDisplayExercises(false);
    setDisplayMembershipExercises(true); 
    setDisplayAccount(false);
    setdisplayRequest(false);
  };

  const handleBackToMembershipList = () => {
    setDisplayMembershipExercises(false);
    setDisplayMembership(true);
    setdisplayRequest(false);
    fetchExercises();

  };
  const handleImageChange = (event) => {
    const imageFile = event.target.files[0]; // Lấy tệp ảnh từ sự kiện
    setMembership({ ...membership, image: imageFile }); // Cập nhật trạng thái với tệp ảnh đã chọn
  };
  const handleRequest = () => {
    fetchRequest();
    setDisplayMembership(false);
    setDisplayExercises(false);
    setDisplayAccount(true);

  }
  

  const styles = {
    label: {
      color: 'white',
      opacity: '60%',
      fontSize: 'large',
    },
    xLabel: {
      color: 'white',
      opacity: '70%',
      fontSize: 'x-large',
      fontWeight: 'bold'
    },
    caption: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    },
    
  };
  if (!isAdmin) {
    return null;
  }
return (
  <div>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">Gym Manager</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={handleToggleMembership}>Manager Gym Membership&emsp; |</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={handleToggleExercises}>Manager Exercises&emsp; |</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={handleRequest}>Manager Expert Request&emsp; |</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={handleToggleDashboard}>Dashboard &emsp;|</a> 
              </li>
              <li className="nav-item">
                <a className="nav-link abc" style={{color:'red'}} href="#" onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    <br />
    {displayMembership && (
      <div className="container">
          <h2>{selectedMembershipId ? 'Update' : 'Create'} Gym Membership</h2>
      <br />
      <form onSubmit={handleSubmit} className="mb-4">
        <input type="hidden" name="id" value={membership.id} />
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input type="text" className="form-control" name="name" value={membership.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Price:</label>
          <input type="number" className="form-control" name="price" value={membership.price} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Duration (Months):</label>
          <input type="number" className="form-control" name="durationMonths" value={membership.durationMonths} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description:</label>
          <textarea className="form-control" name="description" value={membership.description} onChange={handleChange} required></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Create Membership</button>&emsp;
        <button type="button" className="btn btn-danger" onClick={handleCancelEdit}>Cancel</button>
      </form>
      <div className="mb-4" >
        <h2>Membership List</h2>
        <table className="table" >
  <thead style={{ border: '2px solid black' }}>
    <tr style={{ border: '1px solid black' }}>
      <th style={{ border: '1px solid black' }}>Membership Name</th>
      <th style={{ border: '1px solid black' }}>Price</th>
      <th style={{ border: '1px solid black' }}>Description</th>
      <th style={{ border: '1px solid black' }}>Actions</th>
    </tr>
  </thead>
  <tbody>
    {membershipPackages.map((membership) => (
      <tr key={membership.id}>
        <td style={{ border: '1px solid black' }}>{membership.name}</td>
        <td style={{ border: '1px solid black' }}>{membership.price}$</td>
        <td style={{ border: '1px solid black' }}>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {membership.description}
          </div>
        </td>
        <td style={{ border: '1px solid black'}}>
         <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', height: '100%' }}>
            <button style={{marginBottom:'3px'}} className="btn btn-primary" onClick={() => editMembership(membership.id)}>Edit</button>
            <button style={{marginBottom:'3px'}} className="btn btn-success" onClick={() => handleToggleMembershipExercises(membership.id)}>Add exercise</button>
            <button className="btn btn-danger" onClick={() => deleteMembership(membership.id)}>Delete</button>
          </div>
        </td>

      </tr>
    ))}
  </tbody>
</table>

      </div>
      </div>
      )}
    {displayExercises && (
        <div className="container">
          <h2>{selectedEditExercisesId ? 'Update' : 'Create'} Exercise: </h2>
          <br />
          <form className="mb-4" onSubmit={selectedEditExercisesId ? handleEditExercise : handleAddExercise}>
          <input type="hidden" name="id" value={membership.id}  />
          <div className="form-group">
        <label htmlFor="exerciseName">Exercise Name:</label>
        <input type="text" className="form-control" id="exerciseName" value={EditExercise.name} onChange={handleExerciseNameChange} required/>
      </div>
      <div className="form-group">
        <label htmlFor="exerciseType">Exercise Type:</label>
        <input type="text" className="form-control" id="exerciseType" value={EditExercise.type} onChange={handleExerciseTypeChange}required />
      </div>
      <div className="form-group">
        <label htmlFor="exerciseType">Exercise Img:</label>
        <input type="file" className="form-control" id="exerciseImage" onChange={handleImageChange} accept="image/*" required />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <input type="text" className="form-control" id="description" value={EditExercise.description} onChange={handleExerciseDescripChange}required />
      </div>
      <button className="btn btn-primary">Save Exercise</button>&emsp;
      <button className="btn btn-danger" type="button" onClick={handleCancelEdit}>Cancel</button>
          </form>
        <h2>Exercise List</h2>
        <br />
        <table className="table" style={{ border: '1px solid black' }}>
  <thead style={{ border: '2px solid black' }}>
    <tr >
      <th style={{ border: '1px solid black', width:'20%' }}>Exercise Name</th>
      <th style={{ border: '1px solid black' }}>Type</th>
      <th style={{ border: '1px solid black', width:'40%'}}>Description</th>
      <th style={{ border: '1px solid black' }}>Image</th>
      <th style={{ border: '1px solid black', width:'14.6%' }}>Actions</th>
    </tr>
  </thead>
  <tbody>
    {exercise.map((exercises) => (
      <tr key={exercises.id} style={{ border: '1px solid black' }}>
        <td style={{ border: '1px solid black' }}>{exercises.name}</td>
        <td style={{ border: '1px solid black' }}>{exercises.type}</td>
        <td style={{ border: '1px solid black' }}>{exercises.description}</td>
        <td style={{ border: '1px solid black' }}>
    <img src={`data:image/png;base64, ${exercises.image}`} alt="Exercise Image" style={{ width: '100px', height: '100px' }} />
</td>
        <td style={{ border: '1px solid black' }}>
        <button  className="btn btn-primary" style={{ marginRight:'5px'}} onClick={(e) => {
    e.preventDefault(); // Ngăn trình duyệt thực hiện hành động mặc định
    editExercise(exercises.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Chuyển trang lên trên cùng
  }}
>
  Edit
</button>

          <button className="btn btn-danger" onClick={()=> deleteExercise(exercises.id)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      )}
     {displayAccount && (
        <div className="container">
          <h2>Manager Request</h2> <br/>
          <div>
          <table style={{ margin: 'auto', textAlign: 'center', border: '2px solid #ed563b', padding: '10px', width: '100%' }}>
      <thead style={{ borderBottom: '2px solid #ed563b', padding: '10px' }}>
        <tr>
          <th>Request ID</th>
          <th>Email</th>
          <th>Status</th>
          <th>File</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {Request.map((request) => (
          <tr key={request.id} style={{ border: '1px solid black' }}>
            <td style={{ border: '1px solid black' }}>{request.id}</td>
            <td style={{ border: '1px solid black' }}>{request.user.email}</td>
            <td style={{ border: '1px solid black' }}>{request.status}</td>
            <td style={{ border: '1px solid black' }}>
              <button onClick={() => downloadFile(request.applicationData, request.id)}>
                View File
              </button>
            </td>
            <td style={{ border: '1px solid black' }}>
              <button style={{ marginRight: '10px' }} className="btn btn-success" onClick={() => updateExpertRequest(request.id, 'accepted', request)}>
                Accept
              </button>
              <button className="btn btn-danger" onClick={() => updateExpertRequest(request.id, 'denied', request)}>
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
<br />

      </div>
        </div>
      )}

{displayMembershipExercises && (
  <div className="container">
    <h2>Exercises in {membershipPackages.find(membership => membership.id === selectedMembershipId).name}</h2>
    <br />
    <form onSubmit={handleAddExerciseToMembership} className="mb-4">
      <div className="form-group">
        <label htmlFor="exerciseList">Select Exercises:</label>
        <select id="exerciseList" className="form-control" multiple={true} value={selectedExercises} onChange={handleExerciseSelectionChange}>
          {exercise.map((e, index) => (
            <option key={index} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Add Selected Exercises</button>
      <button className="btn btn-secondary" onClick={handleBackToMembershipList}>Back</button>
    </form>

    <table className="table" style={{ border: '1px solid black' }}>
      <thead style={{ border: '2px solid black' }}></thead>
                <thead style={{ border: '2px solid black' }}>
                    <tr >
                        <th style={{ border: '1px solid black' }}>Exercise Name</th>
                        <th style={{ border: '1px solid black' }}>Type</th>
                        <th style={{ border: '1px solid black' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {exercisesInMembership.map((exercise) => (
                        <tr key={exercise.id} style={{ border: '1px solid black' }}>
                            <td style={{ border: '1px solid black' }}>{exercise.name}</td>
                            <td style={{ border: '1px solid black' }}>{exercise.type}</td>
                            <td style={{ border: '1px solid black' }}>
                              <button className="btn btn-danger" onClick={() => deleteExerciseFromMembership(exercise.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
)}      {displayDashboard && (
<div className="container">
<h3>Dashboard: </h3>
<br />
      <div className="row">
      <div className="col-lg-6">
          <RevenuePie />
        </div>
        <div className="col-lg-6">
        <Dashboard />
        </div>
      </div>
      <br></br>      <br></br>
      <br></br>
      <RevenueChart />
    </div>
)}
  </div>
);
}

export default AdminPage;
