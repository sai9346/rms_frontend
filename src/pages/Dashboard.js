import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [hover, setHover] = useState(null);

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: '50px 20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '30px 20px',
    width: '300px',
    margin: '20px',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',
  };

  const cardHoverStyle = {
    transform: 'translateY(-10px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    marginBottom: '15px',
    fontWeight: 'bold',
  };

  const descriptionStyle = {
    fontSize: '1rem',
    color: '#555',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ textAlign: 'center', width: '100%', marginBottom: '40px', color: '#333' }}>
        Recruiter Dashboard
      </h1>

      {/* User Management Card */}
      <Link
        to="/usermanagement"
        style={hover === 'user' ? { ...cardStyle, ...cardHoverStyle } : cardStyle}
        onMouseEnter={() => setHover('user')}
        onMouseLeave={() => setHover(null)}
      >
        <h3 style={titleStyle}>User Management</h3>
        <p style={descriptionStyle}>View and manage all users.</p>
      </Link>

      {/* Role Assignment Card */}
      <Link
        to="/roleassignment"
        style={hover === 'role' ? { ...cardStyle, ...cardHoverStyle } : cardStyle}
        onMouseEnter={() => setHover('role')}
        onMouseLeave={() => setHover(null)}
      >
        <h3 style={titleStyle}>Role Assignment</h3>
        <p style={descriptionStyle}>Assign roles and manage access levels.</p>
      </Link>
    </div>
  );
};

export default Dashboard;
