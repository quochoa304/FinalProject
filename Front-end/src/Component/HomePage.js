import React, { useState } from 'react';
// Import CSS trong thư mục src/assets/css
import '../assets/css/bootstrap.min.css';
import '../assets/css/font-awesome.css';
import '../assets/css/templatemo-training-studio.css';
import lineDecImage from '../assets/images/line-dec.png';
import tabsFirstIcon from '../assets/images/tabs-first-icon.png';
import trainingImage01 from '../assets/images/training-image-01.jpg';
import trainingImage02 from '../assets/images/training-image-02.jpg';
import trainingImage03 from '../assets/images/training-image-03.jpg';
import trainingImage04 from '../assets/images/training-image-04.jpg';
// Thay thế đường dẫn với đường dẫn đúng tới hình ảnh và video trong dự án của bạn
import gymVideo from '../assets/images/gym-video.mp4';


const HomePage = () => {
    const [activeTab, setActiveTab] = useState('tabs-1');

    // Hàm để thay đổi tab hiện tại
    const changeTab = (tabId) => {
      setActiveTab(tabId);
    };
  return (
    <div>
      <header className="header-area header-sticky">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                <a href="/" className="logo">
                  GW <em>Fitness</em>
                </a>
                <ul className="nav">
                  <li className="scroll-to-section"><a href="#top" className="active">Home</a></li>
                  <li className="scroll-to-section"><a href="#features">About</a></li>
                    <li className="scroll-to-section"><a href="#our-classes">Our Classes</a></li>
                    <li className="scroll-to-section"><a href="#schedule">Schedule</a></li>
                    <li className="scroll-to-section"><a href="#caloCalculator">Calories Calculator</a></li>
                    <li className="main-button"><a href="/registration">Sign Up</a></li>
                  {/* Thêm các mục menu khác tại đây */}
                </ul>
                <a className='menu-trigger'>
                  <span>Menu</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="main-banner" id="top">
        <video autoPlay muted loop id="bg-video">
          <source src={gymVideo} type="video/mp4" />
        </video>
        <div className="video-overlay header-text">
          <div className="caption">
            <h6>work harder, get stronger</h6>
            <h2>easy with our <em>gym</em></h2>
            <div className="main-button scroll-to-section">
              <a href="#features">Become a member</a>
            </div>
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
                            <img src="/assets/images/features-first-icon.png" alt="First One"/>
                        </div>
                        <div className="right-content">
                            <h4>Basic Fitness</h4>
                            <p>Please do not re-distribute this template ZIP file on any template collection website. This is not allowed.</p>
                            <a href="#" className="text-button">Discover More</a>
                        </div>
                    </li>
                    <li className="feature-item">
                        <div className="left-icon">
                            <img src="/assets/images/features-first-icon.png" alt="second one"/>
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
                        <a href="#our-classNamees">Become a member</a>
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
                    <a href="#">View Schedule</a>
                  </div>
                </article>
              )}
              {activeTab === 'tabs-2' && (
                <article id='tabs-2'>
                  <img src={trainingImage02} alt="Second Training" />
                  <h4>Second Training Class</h4>
                  <p>Integer dapibus, est vel dapibus mattis, sem mauris luctus leo, ac pulvinar quam tortor a velit. Praesent ultrices erat ante, in ultricies augue ultricies faucibus. Nam tellus nibh, ullamcorper at mattis non, rhoncus sed massa. Cras quis pulvinar eros. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
                  <div className="main-button">
                    <a href="#">View Schedule</a>
                  </div>
                </article>
              )}
              {activeTab === 'tabs-3' && (
                <article id='tabs-3'>
                  <img src={trainingImage03} alt="Third Class" />
                  <h4>Third Training Class</h4>
                  <p>Fusce laoreet malesuada rhoncus. Donec ultricies diam tortor, id auctor neque posuere sit amet. Aliquam pharetra, augue vel cursus porta, nisi tortor vulputate sapien, id scelerisque felis magna id felis. Proin neque metus, pellentesque pharetra semper vel, accumsan a neque.</p>
<div className="main-button">
<a href="#">View Schedule</a>
</div>
</article>
)}
{activeTab === 'tabs-4' && (
<article id='tabs-4'>
<img src={trainingImage04} alt="Fourth Training" />
<h4>Fourth Training Class</h4>
<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aenean ultrices elementum odio ac tempus. Etiam eleifend orci lectus, eget venenatis ipsum commodo et.</p>
<div className="main-button">
<a href="#">View Schedule</a>
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

export default HomePage;
export { HomePage };