import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import gymVideo from '../assets/images/gym-video.mp4';
import '../assets/css/ProfilePage.css';
import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom';


function ProfilePage() {
  const [user, setUser] = useState({});
  const [membershipInfo, setMembershipInfo] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeDetail, setShowChangeDetail] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const[showErrorMessage, setShowErrorMessage] = useState(false);
  const [membershipPackages, setMembershipPackages] = useState([]);
  const [showPurchaseMembership, setShowPurchaseMembership] = useState(false);

  useEffect(() => {
    axios.get('/user/info')
      .then(response => {
        setUser(response.data);
        if(response.data.email == "admin@gmail.com"){
          handleLogout();
          
        }
      })
      .catch(error => console.error('There was an error!', error));
  
    axios.get('/user/member')
      .then(response => {
        setMembershipInfo(response.data);
        console.log(response.data);
        console.log(response.data.gymMemberships);
        setMembershipPackages(response.data.gymMemberships);
      })
      .catch(error => console.error('There was an error fetching membership info!', error));
    
    if (localStorage.getItem('membershipPurchaseSuccess') === 'true') {
      // Hiển thị thông báo thành công
      showSuccessNotification();
      
      // Xóa cờ khỏi Local Storage sau khi đã hiển thị thông báo
      localStorage.removeItem('membershipPurchaseSuccess');
    }
  }, []);
  const navigate = useNavigate();
  // Đảm bảo hàm handleLogout có thể truy cập được AuthService và navigate
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate('/login', { state: { errorMessage: 'You need to login first!' } });
      localStorage.removeItem('user');
      // Bạn cũng nên xóa 'userInfo' từ localStorage nếu bạn lưu trữ nó
      localStorage.removeItem('userInfo');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  

  const handleTogglePurchaseMembership = () => {
    setShowPurchaseMembership(!showPurchaseMembership);
    setShowChangePassword(false);
    setShowChangeDetail(false);
    setSelectedMembership(null);
  };
  

  const handleChangeDetail = (e) => {
    e.preventDefault();
    axios.post('/user/change-detail', { newFirstName, newLastName })
      .then(response => {
        setUser(prevState => ({
          ...prevState,
          firstName: newFirstName,
          lastName: newLastName,
        }));
        showSuccessNotification();
        setMessage('Details successfully changed.');
      })
      .catch(error => {
        setMessage(error.response.data || 'Failed to change the details.');
      });

  };
  const handleToggleChangeDetail = () => {
    setShowChangeDetail(!showChangeDetail);
    setShowChangePassword(false); // Ẩn button thay đổi mật khẩu khi button thay đổi chi tiết được nhấn
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Re-enter passwords do not match');
      showErrorMessageNotification();
      return;
    }

    axios.post('/user/change-password', { oldPassword, newPassword })
    .then(response => {
      // Kiểm tra nội dung phản hồi để xác định xem có lỗi không
      if (response.data.startsWith("Error:")) {
        // Xử lý lỗi dựa trên nội dung phản hồi
        setMessage(response.data);
        showErrorMessageNotification();
      } else {
        // Xử lý thành công
        setMessage('Password successfully changed.');
        setShowChangePassword(false);
        showSuccessNotification();
      }
    })
    .catch(error => {
      setMessage(error.response.data || 'Failed to change the password.');
      showErrorMessageNotification();
    });
  
    
  };

  const handleToggleChangePassword = () => {
    setShowChangePassword(!showChangePassword);
    setShowChangeDetail(false); // Ẩn button thay đổi chi tiết khi button thay đổi mật khẩu được nhấn
  };


  const showSuccessNotification = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000); 
  };
  const showErrorMessageNotification = () => {
    setShowErrorMessage(true);
    setTimeout(() => {
      setShowErrorMessage(false);
    }, 2000); 
  }

  const handleMembershipSelection = (membershipId) => {
    axios.post('/user/purchase-membership', { membershipId })
      .then(response => {
        console.log("Membership purchased successfully:", response.data);
        
        // Lưu cờ hoặc thông điệp vào Local Storage
        localStorage.setItem('membershipPurchaseSuccess', 'true');
  
        // Tải lại trang
        window.location.reload();
      })
      .catch(error => {
        console.error('Failed to purchase membership:', error);
        setMessage("This membership is your current membership." );
        showErrorMessageNotification();
      });
  };

  const [selectedMembership, setSelectedMembership] = useState(null);

  const selectMembership = (membership) => {
    setSelectedMembership(membership);
  };

  const buyMembership = () => {
    handleMembershipSelection(selectedMembership.id);
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
      <Header />
      {showSuccessMessage && (
        <div className="success-notification">✔  Success!</div>
      )}
      {showErrorMessage && (
        <div className="error-notification">✘  {message}</div>
      )}
      <div className="main-banner" id="top">
        <video autoPlay muted loop id="bg-video">
          <source src={gymVideo} type="video/mp4" />
        </video>
        <div className="video-overlay header-text">
          <div className="caption" style={styles.caption}>
            <br /><br /><br />
            <br />
            <h6 style={{ fontSize: 'xx-large' }}>User <em style={{ color: 'red' }}>Profile</em></h6>
            <br />
            {!showPurchaseMembership && (
              <div className="user-info" >
                <div>
                  <label>
                    <p style={styles.label}><strong>First Name:</strong> {user.firstName}</p>
                  </label>
                </div>
                <div>
                  <label>
                    <p style={styles.label}><strong>Last Name:</strong> {user.lastName}</p>
                  </label>
                </div>
                <div>
                  <label>
                    <p style={styles.label}><strong>Email:</strong> {user.email}</p>
                  </label>
                </div>
              </div>
            )}

            {showChangePassword && (
              <div className="change-password-form">
                <form onSubmit={handleChangePassword}>
                  <div>
                    <label style={styles.label}>Old Password:
                      <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                    </label>
                  </div>
                  <div>
                    <label style={styles.label}>New Password:
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </label>
                  </div>
                  <div>
                    <label style={styles.label}>Confirm Password:
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </label>
                  </div>
                  <div>
                    <button type="submit">Submit New Password</button>
                  </div>
                </form>
              </div>
            )}

            {showChangeDetail && (
              <div className="change-password-form">
                <form onSubmit={handleChangeDetail}>
                  <div>
                    <label style={styles.label}>New firstName:
                      <input value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} required />
                    </label>
                  </div>
                  <div>
                    <label style={styles.label}>New lastName:
                      <input value={newLastName} onChange={(e) => setNewLastName(e.target.value)} required />
                    </label>
                  </div>
                  <div>
                    <button type="submit">Submit</button>
                  </div>
                </form>
              </div>
            )}

            {!showChangePassword && !showChangeDetail && membershipInfo && (
              <div className="membership-info">
                <div>
                  <label>
                    <p style={styles.label}><strong>Membership Name:</strong> {membershipInfo.currentMembership}</p>
                  </label>
                </div>
                <div>
                  <label>
                    <p style={styles.label}><strong>Expiry Date:</strong> {membershipInfo.expiryDate ? `${membershipInfo.expiryDate[0]}-${membershipInfo.expiryDate[1]}-${membershipInfo.expiryDate[2]}` : 'Not Available'}</p>
                  </label>
                </div>
                <div>
                  <label>
                    <p style={styles.label}><strong>Purchase Date:</strong> {membershipInfo.purchaseDate ? `${membershipInfo.purchaseDate[0]}-${membershipInfo.purchaseDate[1]}-${membershipInfo.purchaseDate[2]}` : 'Not Available'}</p>
                  </label>
                </div>

              </div>

            )}

{showPurchaseMembership && !selectedMembership && (
      <div className="membership-info">
        <h3 style={styles.label}>Choose Membership Package:</h3>
        {membershipPackages.map((membership) => (
          <li key={membership.id}>
            <br />
            <button onClick={() => selectMembership(membership)}>
              <span>{membership.name} - {membership.price}$</span>
            </button>
          </li>
        ))}
      </div>
    )}

    {selectedMembership && (
      <div className="membership-info" style={{ whiteSpace: 'pre-wrap' }}>
        <p style={styles.xLabel}>{selectedMembership.name}</p>
        <br></br>
        <p style={styles.label}>{selectedMembership.description}</p>
        <br></br>
        <button onClick={buyMembership}>Buy this membership</button>
      </div>
    )}
                <br />
                <button
                  onClick={handleTogglePurchaseMembership}
                  style={{
                    display: showChangePassword || showChangeDetail ? 'none' : 'block',
                    backgroundColor: showPurchaseMembership ? "#ed563b" : "",
                    color: showPurchaseMembership ? "#fff" : "",
                  }}
                >
                  {showPurchaseMembership ? "Cancel" : "Buy A Membership"}
                </button>
            <br />
            {!showPurchaseMembership && (
              <div>
                <button
                  onClick={handleToggleChangePassword}
                  style={{
                    display: showChangeDetail ? 'none' : 'block', // Ẩn nút khi nút Change Detail được nhấn
                    backgroundColor: showChangePassword ? "#ed563b" : "",
                    color: showChangePassword ? "#fff" : "",
                  }}
                >
                  {showChangePassword ? "Cancel" : "Change Password"}
                </button>

                <br />
                <button
                  onClick={handleToggleChangeDetail}
                  style={{
                    display: showChangePassword ? 'none' : 'block',
                    backgroundColor: showChangeDetail ? "#ed563b" : "",
                    color: showChangeDetail ? "#fff" : "",
                    margin: 'auto',
                  }}
                >
                  {showChangeDetail ? "Cancel" : "Change Detail"}
                </button>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
