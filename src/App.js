import React from 'react';
import { Route, Routes } from 'react-router-dom';


import UserManagement from './components/UserManagement';


const App = () => {
  return (
    <Routes>
      
      <Route path="/" element={<UserManagement />} />
      
    </Routes>
  );
};

export default App;
