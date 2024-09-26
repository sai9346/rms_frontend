import React, { useState, useEffect } from 'react';
import API from '../services/api';

const rolesList = ['Job Post Editor', 'Candidate Reviewer', 'Interview Scheduler'];
const accessLevelsList = ['View-only', 'Edit', 'Full Control'];

const RoleAssignment = () => {
  const [roles, setRoles] = useState([{ role: 'Job Post Editor', accessLevel: 'View-only' }]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await API.get('/roles'); // Fetch all roles if you have an endpoint
        setRoles(response.data.roles || [{ role: 'Job Post Editor', accessLevel: 'View-only' }]);
      } catch (error) {
        setUpdateMessage('Failed to fetch roles. Please try again later.');
      }
    };

    fetchRoles();
  }, []);

  const updateRoles = async () => {
    setIsUpdating(true);
    setUpdateMessage('');
    try {
      await API.put('/roles', { roles }); // Update roles directly
      setUpdateMessage('Roles successfully updated.');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update roles. Please try again.';
      setUpdateMessage(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRoleChange = (index, event) => {
    const updatedRoles = [...roles];
    updatedRoles[index].role = event.target.value;
    setRoles(updatedRoles);
  };

  const handleAccessLevelChange = (index, event) => {
    const updatedRoles = [...roles];
    updatedRoles[index].accessLevel = event.target.value;
    setRoles(updatedRoles);
  };

  const addRole = () => {
    setRoles([...roles, { role: 'Job Post Editor', accessLevel: 'View-only' }]);
  };

  const removeRole = (index) => {
    const updatedRoles = roles.filter((_, i) => i !== index);
    setRoles(updatedRoles);
  };

  return (
    <div className="role-assignment-container">
      <h3>Assign Roles to User</h3>

      {roles.map((roleObj, index) => (
        <div key={index} className="role-selection">
          <select
            className="dropdown"
            value={roleObj.role}
            onChange={(e) => handleRoleChange(index, e)}
          >
            {rolesList.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <select
            className="dropdown"
            value={roleObj.accessLevel}
            onChange={(e) => handleAccessLevelChange(index, e)}
          >
            {accessLevelsList.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <button onClick={() => removeRole(index)}>Remove</button>
        </div>
      ))}

      <button className="add-role-btn" onClick={addRole}>
        + Add Another Role
      </button>

      <button className="update-btn" onClick={updateRoles} disabled={isUpdating}>
        {isUpdating ? 'Updating...' : 'Update Roles'}
      </button>

      {updateMessage && <p className="update-message">{updateMessage}</p>}

      <style>
        {`
          .role-assignment-container {
            max-width: 600px;
            margin: 50px auto;
            padding: 30px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .role-selection {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }
          .dropdown {
            width: 30%;
            padding: 8px;
            border-radius: 5px;
            border: 1px solid #ccc;
            font-size: 1rem;
          }
          .add-role-btn, .update-btn {
            padding: 10px 20px;
            border-radius: 5px;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            margin-top: 10px;
          }
          .update-message {
            color: green;
            margin-top: 10px;
          }
        `}
      </style>
    </div>
  );
};

export default RoleAssignment;
