import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/bootstrap.min.css';
import '../assets/css/font-awesome.css';
import '../assets/css/templatemo-training-studio.css';
import lineDecImage from '../assets/images/line-dec.png';
import tabsFirstIcon from '../assets/images/tabs-first-icon.png';
import trainingImage01 from '../assets/images/training-image-01.jpg';
import trainingImage02 from '../assets/images/training-image-02.jpg';
import trainingImage03 from '../assets/images/training-image-03.jpg';
import trainingImage04 from '../assets/images/training-image-04.jpg';
import gymVideo from '../assets/images/gym-video.mp4';
import Header from './Header';
import ChatBox from './ChatBox';
import axios from 'axios';
import BecomeTrainer from './BecomeTrainer';

const MemberPage = () => {
  const location = useLocation();
  const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('tabs-1');
    const [showButton, setShowButton] = useState(true);
    const [showHireTrainer, setShowHireTrainer] = useState(false);
    const [showExpertRequest, setShowExpertRequest] = useState(false);
    const token = localStorage.getItem('Authorization');

    const navigate = useNavigate();
    useEffect(() => {
      if (!token) {
        // Nếu chưa đăng nhập, chuyển hướng về trang login
        navigate('/login?errorMessage=You need to login first');
        return; // Dừng việc tiếp tục thực thi các công việc khác trong useEffect
      }
      fetchRequests();
      const currentUrl = window.location.href;
      if (currentUrl.includes("PaymentSuccess")) {
        window.href = '/member';
        handleToggleHire();
    }

    }, []);




  const handlePayButtonClick = async () => {
    const userConfirmed = window.confirm('Are you sure to pay 10 USD for hiring a trainer?');
  
    if (userConfirmed) {
      try {
        const response = await axios.post('http://localhost:8000/pay', { 
        membershipPrice: 250000 ,
        vnp_OrderInfo: "Hire a trainer" }, {
          headers: {
            'Authorization': token
          }
        });
        const { data } = response;
    
        window.location.href = data;
      } catch (error) {
        console.error('Error occurred while making payment:', error);
      }
    }
  };

  
  const handleToggleHire = () => {
    setShowHireTrainer(!showHireTrainer);
    setShowButton(false);
    setShowExpertRequest(false);
  }
  const handleBack = () => {
    setShowHireTrainer(false);
    setShowButton(true);
    setShowExpertRequest(false);
  }
  const handleToggleRequest = () => {
    setShowExpertRequest(!showExpertRequest);
    setShowButton(false);
    setShowHireTrainer(false);
  }

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
      <Header />
      <ChatBox />
      <div className="main-banner" id="top">
        <video autoPlay muted loop id="bg-video">
          <source src={gymVideo} type="video/mp4" />
        </video>
        <div className="video-overlay header-text">
          <div className="caption">

            <h2>Member <em>page</em></h2>
            {showButton && (             
            <div className="main-button scroll-to-section">
              <a onClick={handleToggleHire}>Hire a trainer</a> &nbsp;
              <a onClick={handleToggleRequest}>Become a trainer</a>
            </div>

             )}  
            {showHireTrainer && (
                <div>
                <div style={{display:'block'}}>
                    <h6>Hire a online trainer</h6><br></br>
                    <h7>- Only 10$ fer time (5 hours/time)</h7><br></br>
                    <h7>- Profestional trainer with European PT certificate</h7><br></br>
                    <h7>- Private 1-on-1 training with online meetings</h7><br></br>
                </div><br></br>
          
                <div className="main-button scroll-to-section">
                <a onClick={handlePayButtonClick}>Pay now</a>&nbsp;
                <a onClick={handleBack}>Back</a>
                </div>
                <div><br/>
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
      </table><br/>
      <button onClick={fetchRequests}>Reload</button>
    </div>
                </div>
                )}
            {showExpertRequest && (
                <div>
                <BecomeTrainer/> <br></br>
                <button onClick={handleBack}>Back to member page</button>
                </div>
            )}
          </div>
        </div>
      </div>
      <section className="section" id="features">
    <div className="container">
        <div className="row">
            <div className="col-lg-6 offset-lg-3">
                <div className="section-heading">
                    <h2>Choose <em>Program</em></h2>
                    <img src="../assets/images/line-dec.png" alt="waves"/>
                    <p>Training Studio is free CSS template for gyms and fitness centers. You are allowed to use this layout for your business website.</p>
                </div>
            </div>
            <div className="col-lg-6">
                <ul className="features-items">
                    <li className="feature-item">
                        <div className="left-icon">
                            <img src="../assets/images/features-first-icon.png" alt="First One"/>
                        </div>
                        <div className="right-content">
                            <h4>Basic Fitness</h4>
                            <p>Please do not re-distribute this template ZIP file on any template collection website. This is not allowed.</p>
                            <a href="#" className="text-button">Discover More</a>
                        </div>
                    </li>
                    <li className="feature-item">
                        <div className="left-icon">
                            <img src="../assets/images/features-first-icon.png" alt="second one"/>
                        </div>
                        <div className="right-content">
                            <h4>New Gym Training</h4>
                            <p>If you wish to support TemplateMo website via PayPal, please feel free to contact us. We appreciate it a lot.</p>
                            <a href="#" className="text-button">Discover More</a>
                        </div>
                    </li>
                    <li className="feature-item">
                        <div className="left-icon">
                            <img src="/assets/images/features-first-icon.png" alt="third gym training"/>
                        </div>
                        <div className="right-content">
                            <h4>Basic Muscle Course</h4>
                            <p>Credit goes to <a rel="nofollow noopener" href="https://www.pexels.com" target="_blank">Pexels website</a> for images and video background used in this HTML template.</p>
                            <a href="#" className="text-button">Discover More</a>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="col-lg-6">
                <ul className="features-items">
                    <li className="feature-item">
                        <div className="left-icon">
                            <img src="/assets/images/features-first-icon.png" alt="fourth muscle"/>
                        </div>
                        <div className="right-content">
                            <h4>Advanced Muscle Course</h4>
                            <p>You may want to browse through <a rel="nofollow" href="https://templatemo.com/tag/digital-marketing" target="_parent">Digital Marketing</a> or <a href="https://templatemo.com/tag/corporate">Corporate</a> HTML CSS templates on our website.</p>
                            <a href="#" className="text-button">Discover More</a>
                        </div>
                    </li>
                    <li className="feature-item">
                            <div className="left-icon">
                                <img src="/assets/images/features-first-icon.png" alt="training fifth" />
                            </div>
                            <div className="right-content">
                                <h4>Yoga Training</h4>
                                <p>This template is built on Bootstrap v4.3.1 framework. It is easy to adapt the columns and sections.</p>
                                <a href="#" className="text-button">Discover More</a>
                            </div>
                        </li>
                        <li className="feature-item">
                            <div className="left-icon">
                                <img src="/assets/images/features-first-icon.png" alt="gym training" />
                            </div>
                            <div className="right-content">
                                <h4>Body Building Course</h4>
                                <p>Suspendisse fringilla et nisi et mattis. Curabitur sed finibus nisi. Integer nibh sapien, vehicula et auctor.</p>
                                <a href="#" className="text-button">Discover More</a>
                            </div>
                        </li>
                    </ul>
            </div>
        </div>
    </div>
</section>
     
<section className="section" id="call-to-action">
    <div className="container">
        <div className="row">
            <div className="col-lg-10 offset-lg-1">
                <div className="cta-content">
                    <h2>Don’t <em>think</em>, begin <em>today</em>!</h2>
                    <p>Ut consectetur, metus sit amet aliquet placerat, enim est ultricies ligula, sit amet dapibus odio augue eget libero. Morbi tempus mauris a nisi luctus imperdiet.</p>
                    <div className="main-button scroll-to-section">
                        <a href="#our-classNamees">Discover now</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<br></br>
<br></br>
<br></br>
<section className="section" id="our-classes">
      <div className="container">
        {/* Nội dung còn lại giống như trước */}
        <div className="row" id="tabs">
          <div className="col-lg-4">
          <ul>
              <li><a onClick={() => setActiveTab('tabs-1')}><img src={tabsFirstIcon} alt="" />First Training Class</a></li>
              <li><a onClick={() => setActiveTab('tabs-2')}><img src={tabsFirstIcon} alt="" />Second Training Class</a></li>
              <li><a onClick={() => setActiveTab('tabs-3')}><img src={tabsFirstIcon} alt="" />Third Training Class</a></li>
              <li><a onClick={() => setActiveTab('tabs-4')}><img src={tabsFirstIcon} alt="" />Fourth Training Class</a></li>
            </ul>
          </div>
          <div className="col-lg-8">
          <section className='tabs-content'>
              {activeTab === 'tabs-1' && (
                <article id='tabs-1'>
                  <img src={trainingImage01} alt="First Class" />
                  <h4>First Training Class</h4>
                  <p>Phasellus convallis mauris sed elementum vulputate. Donec posuere leo sed dui eleifend hendrerit. Sed suscipit suscipit erat, sed vehicula ligula. Aliquam ut sem fermentum sem tincidunt lacinia gravida aliquam nunc. Morbi quis erat imperdiet, molestie nunc ut, accumsan diam.</p>
                  <div className="main-button">
                  <a href="/classes">View Schedule</a>
                  </div>
                </article>
              )}
              {activeTab === 'tabs-2' && (
                <article id='tabs-2'>
                  <img src={trainingImage02} alt="Second Training" />
                  <h4>Second Training Class</h4>
                  <p>Integer dapibus, est vel dapibus mattis, sem mauris luctus leo, ac pulvinar quam tortor a velit. Praesent ultrices erat ante, in ultricies augue ultricies faucibus. Nam tellus nibh, ullamcorper at mattis non, rhoncus sed massa. Cras quis pulvinar eros. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
                  <div className="main-button">
                  <a href="/classes">View Schedule</a>
                  </div>
                </article>
              )}
              {activeTab === 'tabs-3' && (
                <article id='tabs-3'>
                  <img src={trainingImage03} alt="Third Class" />
                  <h4>Third Training Class</h4>
                  <p>Fusce laoreet malesuada rhoncus. Donec ultricies diam tortor, id auctor neque posuere sit amet. Aliquam pharetra, augue vel cursus porta, nisi tortor vulputate sapien, id scelerisque felis magna id felis. Proin neque metus, pellentesque pharetra semper vel, accumsan a neque.</p>
<div className="main-button">
<a href="/classes">View Schedule</a>
</div>
</article>
)}
{activeTab === 'tabs-4' && (
<article id='tabs-4'>
<img src={trainingImage04} alt="Fourth Training" />
<h4>Fourth Training Class</h4>
<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean ultrices elementum odio ac tempus. Etiam eleifend orci lectus, eget venenatis ipsum commodo et.</p>
<div className="main-button">
<a href="/classes">View Schedule</a>
</div>
</article>
)}
            </section>
          </div>
        </div>
      </div>
    </section>
<script src="/assets/js/jquery-2.1.0.min.js"></script>
<script src="/assets/js/jquery-2.1.0.min.js"></script>


<script src="/assets/js/popper.js"></script>
<script src="/assets/js/bootstrap.min.js"></script>


<script src="/assets/js/scrollreveal.min.js"></script>
<script src="/assets/js/waypoints.min.js"></script>
<script src="/assets/js/jquery.counterup.min.js"></script>
<script src="/assets/js/imgfix.min.js"></script>
<script src="/assets/js/mixitup.js"></script>
<script src="/assets/js/accordions.js"></script>


<script src="/assets/js/custom.js"></script>
    </div>
  );
};

export default MemberPage;