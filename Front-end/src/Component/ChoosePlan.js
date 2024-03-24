import React, { useState, useEffect } from 'react';
import Header from './Header';
import gymVideo from '../assets/images/gym-video.mp4';
import '../assets/css/classes.css';
const Classes = () => {
  const myHTML = {
    __html: '<div>Đây là HTML </div>'
  };
  return (
    <div>
      <Header />
      <div className="main-banner" id="top">
        <video autoPlay muted loop id="bg-video">
          <source src={gymVideo} type="video/mp4" />
        </video>
        </div> 
    <div dangerouslySetInnerHTML={myHTML} />
    
    </div>
  )

  }
export default Classes;
