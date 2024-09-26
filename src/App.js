import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import UserManagement from './components/UserManagement';
import RoleAssignment from './components/RoleAssignment';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/usermanagement" element={<UserManagement />} />
      <Route path="/roleassignment" element={<RoleAssignment />} />
    </Routes>
  );
};

export default App;
