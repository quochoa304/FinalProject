import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import gymVideo from '../assets/images/gym-video.mp4';

function ProfilePage() {
  const [user, setUser] = useState({});
  const [membershipInfo, setMembershipInfo] = useState(null); // Thêm state này
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Lấy thông tin người dùng
    axios.get('/user/info')
      .then(response => {
        setUser(response.data);
        console.log(response.data);
      })
      .catch(error => console.error('There was an error!', error));

    // Lấy thông tin membership
    axios.get('/user/member')
      .then(response => {
        setMembershipInfo(response.data);
        console.log(response.data);
      })
      .catch(error => console.error('There was an error fetching membership info!', error));
  }, []);

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New passwords don't match.");
      return;
    }

    axios.post('/user/change-password', { oldPassword, newPassword })
      .then(response => {
        setMessage('Password successfully changed.');
        setShowChangePassword(false);
      })
      .catch(error => {
        setMessage(error.response.data || 'Failed to change the password.');
      });
  };

  return (
    <div>
      <Header />
      <div className="main-banner" id="top">
        <video autoPlay muted loop id="bg-video">
          <source src={gymVideo} type="video/mp4" />
        </video>
        <div className="video-overlay header-text">
          <div className="caption">
            <h6>Profile <em>page</em></h6>
            <p><strong>First Name:</strong> {user.firstName}</p>
            <p><strong>Last Name:</strong> {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>

            {membershipInfo ? (
  <div>
    <p><strong>Membership ID:</strong> {membershipInfo.currentMembership}</p>
    <p><strong>Expiry Date:</strong> {membershipInfo.expiryDate ? `${membershipInfo.expiryDate[0]}-${membershipInfo.expiryDate[1]}-${membershipInfo.expiryDate[2]}` : 'Not Available'}</p>
    <p><strong>Purchase Date:</strong> {membershipInfo.purchaseDate ? `${membershipInfo.purchaseDate[0]}-${membershipInfo.purchaseDate[1]}-${membershipInfo.purchaseDate[2]}` : 'Not Available'}</p>
    {/* Bạn có thể format ngày tháng để hiển thị đẹp hơn */}
  </div>
) : (
  <p>No active membership.</p>
)}


            <button onClick={() => setShowChangePassword(!showChangePassword)}>
              Change Password
            </button>

            {showChangePassword && (
              <form onSubmit={handleChangePassword}>
              <label>
                  Old Password:
                  <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
              </label>
              <br />
              <label>
                  New Password:
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </label>
              <br />
              <label>
                  Confirm New Password:
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </label>
              <br />
              <button type="submit">Submit New Password</button>
          </form>
            )}
            {message && <p>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
