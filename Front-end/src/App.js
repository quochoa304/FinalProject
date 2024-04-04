import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import HomePage from './Component/HomePage';
import LoginPage from './Component/LoginPage';
import RegisterPage from './Component/RegisterPage';
import MemberPage from './Component/MemberPage';
import CaloCalculator from './Component/CaloCalculator';
import Classes from './Component/Classes';
import ProfilePage from './Component/ProfilePage';
import MembershipPurchase from './Component/MembershipPurchase';
import AdminPage from './Component/AdminPage';
import { gapi } from 'gapi-script';

const clientId = '896387674450-36c0ktb6qabai36ol9271dlh2u1at97k.apps.googleusercontent.com';

function App() {

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: 'profile',
      });
    }
    gapi.load('client:auth2', start);
  });

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} exact />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegisterPage />} />
          <Route path="/member" element={<MemberPage />} />
          <Route path="*" element={<h1>Not Found</h1>} />
          <Route path="/caloCalculator" element={<CaloCalculator />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/meme" element={<MembershipPurchase/>} />
          <Route path='/admin' element = {<AdminPage/>}/>

        </Routes>
      </div>
    </Router>
  );
}


export default App;
