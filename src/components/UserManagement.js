import React, { useEffect, useState } from 'react';
import API from '../services/api';  // Import API service
import { FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import './UserManagement.css';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPermission, setSelectedPermission] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await API.get('/users');
      setUsers(response.data);
      console.log(response.data)
      setError('');
    } catch (error) {
      setError('Failed to fetch users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesRole = roleFilter ? user.roles.some((role) => role.role === roleFilter) : true;
    return matchesSearch && matchesRole;
  });

   // Separate the users based on their registration status
   const registeredUsers = filteredUsers.filter(user => user.registrationStatus === 'Registered');
   const notRegisteredUsers = filteredUsers.filter(user => user.registrationStatus === 'Not Registered');

  const handleDelete = async (userId) => {
    try {
      await API.delete(`/users/${userId}`);
      setDeleteConfirmationVisible(false);
      setSuccessMessage('User deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 5000); // Clear message after 5 seconds
      fetchUsers();
    } catch (error) {
      setError('Failed to delete user');
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id === editingUser ? null : user._id);
    setSelectedRole(user.roles[0].role);
    setSelectedPermission(user.roles[0].accessLevel);
  };

  const handleRoleChange = (newRole) => {
    setSelectedRole(newRole);
  };

  const handlePermissionChange = (newPermission) => {
    setSelectedPermission(newPermission);
  };

  const handleSaveChanges = async (userId) => {
    const updatedRoles = [{ role: selectedRole, accessLevel: selectedPermission }];
    try {
      await API.put(`/users/${userId}`, { roles: updatedRoles });
      fetchUsers();
      setEditingUser(null);
      setSuccessMessage('User updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000); // Clear message after 5 seconds
    } catch (error) {
      setError('Failed to update user');
    }
  };

  const handleAddUserClick = () => {
    setShowAddUserForm(!showAddUserForm);
  };

  const handleCloseAddUserForm = () => {
    setShowAddUserForm(false);
    setNewUser({ name: '', email: '', role: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.role) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    try {
      await API.post('/users', {
        name: newUser.name,
        email: newUser.email,
        roles: [{ role: newUser.role, accessLevel: 'View-only' }],
      });
       
      setSuccessMessage('Email sent to the user');
      setTimeout(() => setSuccessMessage(''), 5000); // Clear message after 5 seconds
      fetchUsers();
      setNewUser({ name: '', email: '', role: '' });
      setShowAddUserForm(false);
    } 
    catch (error) {
      setError('Failed to add user');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteUser = (userId) => {
    setUserToDelete(userId);
    setDeleteConfirmationVisible(true);
  };

  const cancelDelete = () => {
    setDeleteConfirmationVisible(false);
    setUserToDelete(null);
  };

  return (
    <div className="user-management-container">
      <h2>User Management</h2>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select onChange={(e) => setRoleFilter(e.target.value)} className="role-filter">
          <option value="">All Roles</option>
          <option value="Job Post Editor">Job Post Editor</option>
          <option value="Candidate Reviewer">Candidate Reviewer</option>
          <option value="Interview Scheduler">Interview Scheduler</option>
        </select>
        <button onClick={handleAddUserClick} className="add-user-button">
          Add User
        </button>
      </div>

      {loading ? (
        <div className="loading-message">Loading...</div>
      ) : (
        <>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Permissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registeredUsers.length > 0 ? (
                registeredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {editingUser === user._id ? (
                        <select
                          className="role-dropdown"
                          value={selectedRole}
                          onChange={(e) => handleRoleChange(e.target.value)}
                        >
                          <option value="Job Post Editor">Job Post Editor</option>
                          <option value="Candidate Reviewer">Candidate Reviewer</option>
                          <option value="Interview Scheduler">Interview Scheduler</option>
                        </select>
                      ) : (
                        user.roles.map((role) => role.role).join(', ')
                      )}
                    </td>
                    <td>
                      {editingUser === user._id ? (
                        <select
                          className="permission-dropdown"
                          value={selectedPermission}
                          onChange={(e) => handlePermissionChange(e.target.value)}
                        >
                          <option value="Full-control">Full-Control</option>
                          <option value="View-only">View-only</option>
                          <option value="Editor">Editor</option>
                        </select>
                      ) : (
                        user.roles.map((role) => role.accessLevel).join(', ')
                      )}
                    </td>
                    <td>
                      {editingUser === user._id ? (
                        <button
                          className="save-button"
                          onClick={() => handleSaveChanges(user._id)}
                        >
                          Save
                        </button>
                      ) : (
                        <div>
                          <button
                            className="edit-button"
                            onClick={() => handleEditClick(user)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => confirmDeleteUser(user._id)} // Updated to use confirm function
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-users-message">
                    No registered users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <h3>Not Registered Users</h3>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notRegisteredUsers.length > 0 ? (
                notRegisteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.roles.map((role) => role.role).join(', ')}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => confirmDeleteUser(user._id)} // Updated to use confirm function
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-users-message">
                    No not-registered users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
   

      {showAddUserForm && (
        <div className="add-user-popup">
          <div className="add-user-header">
            <h3>Add User</h3>
            <button className="close-button" onClick={handleCloseAddUserForm}>
              <FaTimes />
            </button>
          </div>
          <form className="add-user-form" onSubmit={handleAddUserSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newUser.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleInputChange}
              required
            />
            <select
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Role</option>
              <option value="Job Post Editor">Job Post Editor</option>
              <option value="Candidate Reviewer">Candidate Reviewer</option>
              <option value="Interview Scheduler">Interview Scheduler</option>
            </select>
            <button type="submit" className="submit-button">
              Add User
            </button>
          </form>
        </div>
      )}

      {deleteConfirmationVisible && (
        <div className="delete-confirmation">
          <p>Are you sure you want to delete this user?</p>
          <button onClick={() => handleDelete(userToDelete)}>Yes</button>
          <button onClick={cancelDelete}>No</button>
        </div>
      )}
    </div>
  );
};

// user management deployment

export default UserManagement;
