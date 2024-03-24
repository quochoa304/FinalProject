import React from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import HomePage from './Component/HomePage';
import LoginPage from './Component/LoginPage';
import RegisterPage from './Component/RegisterPage';
import MemberPage from './Component/MemberPage';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} exact />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegisterPage />} />
          <Route path="/member" element={<MemberPage/>} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
