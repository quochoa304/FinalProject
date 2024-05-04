import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import gymVideo from '../assets/images/gym-video.mp4';
import '../assets/css/ProfilePage.css';
import { useNavigate, Redirect  } from 'react-router-dom';
import ChatBox from './ChatBox';
import { toast } from 'react-toastify';

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
  const [masterId, setMasterId] = useState(null);
  const token = localStorage.getItem('Authorization');
  
  useEffect(() => {
    const url = window.location.href;
    const isPaymentSuccess = checkPaymentStatus(url);
    const isBuyMembershipOrder = checkOrderInfo(url);
    const isRentOrder = checkRentInfo(url);

    if (isPaymentSuccess && isBuyMembershipOrder && !isRentOrder) {
        const storedMembership = localStorage.getItem('selectedMembership');
        if (storedMembership) {
            const selectedMembership = JSON.parse(storedMembership);
            console.log("Membership purchased successfully.");
            handleMembershipSelection(selectedMembership.id);
        } else {
            const storedMembership = localStorage.getItem('upgradeMembership');
            const upgradeMembership = JSON.parse(storedMembership);
            console.log("Membership purchased successfully.");
            handleMembershipSelection(upgradeMembership.id);
        }
    } else if (isPaymentSuccess && isRentOrder && !isBuyMembershipOrder) {
      createRentRequest();
    } else  {
        console.log("Payment failed.");
    }
    
    if (!token) {
      // Nếu chưa đăng nhập, chuyển hướng về trang login
      navigate('/login?errorMessage=You need to login first');
      return; // Dừng việc tiếp tục thực thi các công việc khác trong useEffect
    }
    axios.get('http://localhost:8000/user/info', {
        headers: {
            'Authorization': token
        }
    })
    .then(response => {
        setUser(response.data);

    })
    .catch(error => console.error('There was an error!', error));

    axios.get('http://localhost:8000/user/member', {
        headers: {
            'Authorization': token
        }
    })
    .then(response => {
        setMembershipInfo(response.data);
        console.log(response.data);
        console.log(response.data.gymMemberships);
        setMembershipPackages(response.data.gymMemberships);
    })
    .catch(error => console.error('There was an error fetching membership info!', error));

    if (localStorage.getItem('membershipPurchaseSuccess') === 'true') {
        showSuccessNotification();
        localStorage.removeItem('membershipPurchaseSuccess');
    }
}, [token]);

const createRentRequest = async () => {
  try {
    axios.post('http://localhost:8000/api/rentRequests',null,
      {
        headers: {
          'Authorization': token
        }
      }
    );
    window.location.href = `/member?PaymentSuccess`; 
  } catch (error) {
    const errorMessage = error.response.data.message;
    localStorage.setItem('rentRequestErrorMessage', errorMessage);
    window.location.href = `/member?Payment`; 
  }
};

const checkOrderInfo = (url) => {
  // Phân tích URL để lấy các tham số
  const urlParts = url.split('?');
  if (urlParts.length < 2) {
      // URL không có tham số
      return false;
  }
  const queryString = urlParts[1];

  // Phân tích query string để trích xuất giá trị của vnp_OrderInfo
  const params = {};
  queryString.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      params[key] = value;
  });

  // Lấy giá trị của vnp_OrderInfo
  const vnp_OrderInfo = decodeURIComponent(params['vnp_OrderInfo']);

  // Kiểm tra vnp_OrderInfo để xác định nội dung đơn hàng
  return vnp_OrderInfo === 'Buy+a+membership';
};


const checkRentInfo = (url) => {
  // Phân tích URL để lấy các tham số
  const urlParts = url.split('?');
  if (urlParts.length < 2) {
      // URL không có tham số
      return false;
  }
  const queryString = urlParts[1];

  // Phân tích query string để trích xuất giá trị của vnp_OrderInfo
  const params = {};
  queryString.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      params[key] = value;
  });

  // Lấy giá trị của vnp_OrderInfo
  const vnp_OrderInfo = decodeURIComponent(params['vnp_OrderInfo']);

  // Kiểm tra vnp_OrderInfo để xác định nội dung đơn hàng
  return vnp_OrderInfo === 'Hire+a+trainer';
};


  const navigate = useNavigate();


  const handleTogglePurchaseMembership = () => {
    setShowPurchaseMembership(!showPurchaseMembership);
    setShowChangePassword(false);
    setShowChangeDetail(false);
    setSelectedMembership(null);
    localStorage.removeItem('upgradeMembership');
  };
  

  const handleChangeDetail = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/user/change-detail', { newFirstName, newLastName }, {
      headers: {
          'Authorization': token
      },

    })

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

    axios.post('http://localhost:8000/user/change-password', { oldPassword, newPassword }, {
      headers: {
          'Authorization': token
      }
    })
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
    axios.post('http://localhost:8000/user/purchase-membership', { membershipId }, {
      headers: {
          'Authorization': token
      }
    })
      .then(response => {
        console.log("Membership purchased successfully:", response.data);
        
        // Lưu cờ hoặc thông điệp vào Local Storage
        localStorage.setItem('membershipPurchaseSuccess', 'true');
        localStorage.removeItem('selectedMembership');
        localStorage.removeItem('upgradeMembership');
        // Tải lại trang
        window.location.href = '/profile';
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
    console.log('Selected membership:', membership.price);
    if (membershipInfo.currentMembership === membership.name) {
      setMessage("This membership is your current membership.");
      showErrorMessageNotification();
      setSelectedMembership(null);
    } else if (membership.price < membershipInfo.price) {
      setMessage("You can't downgrade your membership.");
      showErrorMessageNotification();
      setSelectedMembership(null);
    } else if (membership.price > membershipInfo.price) {
      const newPriceDifference = membership.price - membershipInfo.price;
      console.log('Curent membership:', membershipInfo.price);
      console.log('Need pay membership:', newPriceDifference);
      const isConfirmed = window.confirm(`You will need to pay an additional $${newPriceDifference} for this membership upgrade. Do you want to proceed?`);
      if (isConfirmed) {
        setMessage(`You've upgraded your membership!`);
        const upgradedMembership = { ...membership }; // Tạo bản sao của membership
        upgradedMembership.price = newPriceDifference; // Thay đổi giá trị của bản sao
        localStorage.removeItem('selectedMembership'); // Xóa bản sao cũ khỏi localStorage
        localStorage.setItem('upgradeMembership', JSON.stringify(upgradedMembership)); // Lưu bản sao vào localStorage
      } else {
        setSelectedMembership(null);
      }
    } else {
      localStorage.setItem('selectedMembership', JSON.stringify(membership));
    }
  };
  
  
  

  const handlePayButtonClick = async () => {
    try {
      let priceInVND;
      const upgradeMembershipStr = localStorage.getItem('upgradeMembership');
      if (upgradeMembershipStr) {
        const upgradeMembership = JSON.parse(upgradeMembershipStr);
        priceInVND = upgradeMembership.price * 24000;
      } else if (selectedMembership && selectedMembership.price !== undefined) {
        priceInVND = selectedMembership.price * 24000;
      } 
  
      const response = await axios.post('http://localhost:8000/pay', { membershipPrice: priceInVND, vnp_OrderInfo: "Buy a membership" }, {
        headers: {
          'Authorization': token
        }
      });
      const { data } = response;
  
      // Truy cập URL thanh toán
      window.location.href = data;
    } catch (error) {
      console.error('Error occurred while making payment:', error);
    }
  };
  
  
  


  const checkPaymentStatus = (url) => {
    // Phân tích URL để lấy các tham số
    const urlParts = url.split('?');
    if (urlParts.length < 2) {
      // URL không có tham số
      return false;
    }
    const queryString = urlParts[1];
  
    // Phân tích query string để trích xuất giá trị của ResponseCode
    const params = {};
    queryString.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      params[key] = value;
    });
  
    // Lấy giá trị của ResponseCode
    const vnp_ResponseCode = params['vnp_ResponseCode'];
  
    // Kiểm tra ResponseCode để xác định trạng thái thanh toán
    return vnp_ResponseCode === '00'; 
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
      {showSuccessMessage && (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: 'green',
        color: 'white',
        padding: '10px'
      }}>
        Trạng thái: Thành công
      </div>
    )}
      <Header />
      <ChatBox />
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
        <button onClick={handlePayButtonClick}>Buy this membership</button>
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
