import React, { useState, useEffect } from 'react';
// import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

const RegistrationForm = () => {
//   const { userId } = useParams();  // Extract userId from the URL
//   const history = useHistory();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     // Fetch user data based on userId (optional)
//     const fetchUser = async () => {
//       try {
//         // const response = await axios.get(`/api/users/${userId}`);
//         setFormData({ ...formData, name: response.data.name, email: response.data.email });
//       } catch (error) {
//         setError('Error fetching user data.');
//       }
//     };

//     fetchUser();
//   },);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Send registration data to the backend
    //   await axios.post(`/api/users/register/${userId}`, { password });
      setSuccess(true);
    //   setTimeout(() => {
    //     // history.push('/login'); // Redirect to login page after success
    //   }, 2000);
    } catch (error) {
      setError('Error completing registration.');
    }
  };

  return (
    <div className="registration-form">
      <h1>Complete Your Registration</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Registration successful! Redirecting to login...</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            disabled
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Complete Registration</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
