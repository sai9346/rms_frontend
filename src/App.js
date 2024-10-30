import React from 'react';
import { Route, Routes } from 'react-router-dom';


import UserManagement from './components/UserManagement';
import RegistrationPage from './components/RegistrationPage';


const App = () => {
  return (
    // console.log(userId);
    <Routes>
      
      <Route path="/" element={<UserManagement />} />
      <Route path="/team-registration/:userId" element={<RegistrationPage/>}/>
      
    </Routes>
  );
};

export default App;
