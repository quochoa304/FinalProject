import React, { useEffect, useState } from 'react';
import axios from 'axios';
import gymVideo from '../assets/images/gym-video.mp4';
import '../assets/css/ProfilePage.css';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';


function AdminPage() {
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

  const token = localStorage.getItem('Authorization');

  useEffect(() => {
    fetchMembershipPackages();
    fetchExercises();

}, []);

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
  // Add exercise
  e.preventDefault();
  const exerciseName = document.getElementById('exerciseName').value;
  const exerciseType = document.getElementById('exerciseType').value;
  const exerciseDescription = document.getElementById('description').value;
  
  axios.post('http://localhost:8000/admin/exercises/save', {
    name: exerciseName,
    type: exerciseType,
    description : exerciseDescription
  }, {
    headers: {
      'Authorization': token
    }
  })
  alert('Exercise was save successfully.');
  setEditExercise({
    name: '',
    type: '',
    description: ''
  });
  fetchExercises();
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

  try {
    await axios.put(`http://localhost:8000/admin/exercises/update/${selectedEditExercisesId}`, {
      name: exerciseName,
      type: exerciseType,
      description: exerciseDescription
    }, {
      headers: {
        'Authorization': token
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


  const showSuccessNotification = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000); 
  };


  const handleToggleMembership = () => {
    setDisplayMembershipExercises(false);
    setDisplayMembership(true);
    setDisplayExercises(false);
    setDisplayAccount(false);
  };

  const handleToggleExercises = () => {
    setDisplayMembershipExercises(false);
    setDisplayMembership(false);
    setDisplayExercises(true);
    setDisplayAccount(false);
  };

  const handleToggleAccount = () => {
    setDisplayMembershipExercises(false);
    setDisplayMembership(false);
    setDisplayExercises(false);
    setDisplayAccount(true);
  };

  const handleToggleMembershipExercises = async (id) => {
    await fetchExercisesInMembership(id);  
  
    setDisplayMembership(false);
    setDisplayExercises(false);
    setDisplayMembershipExercises(true); 
    setDisplayAccount(false);
  };

  const handleBackToMembershipList = () => {
    setDisplayMembershipExercises(false);
    setDisplayMembership(true);
    fetchExercises();

  };
  

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
                <a className="nav-link" href="#" onClick={handleToggleMembership}>Manager Gym Membership</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={handleToggleExercises}>Manager Exercises</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={handleToggleAccount}>Manager Account</a>
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
          <h2>Manager Account</h2>
          {/* Account related content goes here */}
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
)}
  </div>
);
}

export default AdminPage;
