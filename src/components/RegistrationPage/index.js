import React, { useState } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams
import styled from 'styled-components';

const RegistrationFormContainer = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9; /* Light background */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #333;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #333; /* Dark text */
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.p`
  color: green;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #333;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff; /* Blue highlight on focus */
  }

  &:disabled {
    background-color: #e9ecef;
    color: #6c757d;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #333;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #007bff; /* Blue submit button */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const RegistrationForm = () => {
  const { userId } = useParams();  // Get userId from URL params
  console.log(userId);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    jobRole: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword, name, email, jobRole } = formData;
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/users/register/confirm/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          jobRole,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setSuccess(true);
        setError('');
        // Optionally, reset form data after success
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          jobRole: '',
        });
      } else {
        setError(result.message || 'Error completing registration.');
      }
    } catch (error) {
      setError('Error completing registration.');
    }
  };
  

  return (
    <RegistrationFormContainer>
      <Title>Complete Your Registration.</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>Registration successful!</SuccessMessage>}
      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </InputContainer>
        <InputContainer>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </InputContainer>
        <InputContainer>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </InputContainer>
        <InputContainer>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </InputContainer>
        <InputContainer>
          <Label>Job Role</Label>
          <Select
            name="jobRole"
            value={formData.jobRole}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Select your role</option>
            <option value="Interview Scheduler">Interview Scheduler</option>
            <option value="job-post-editor">Job Post Editor</option>
            <option value="candidate-reviewer">Candidate Reviewer</option>
            
          </Select>
        </InputContainer>
        <SubmitButton type="submit">Register</SubmitButton>
      </Form>
    </RegistrationFormContainer>
  );
};

export default RegistrationForm;
