import React, { useEffect, useState } from 'react';
import API from '../services/api';  // Import API service
import { FaTrash, FaEdit, FaTimes } from 'react-icons/fa';
import './UserManagement.css';

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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await API.get('/users');
      setUsers(response.data);
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

  const handleDelete = async (userId) => {
    try {
      await API.delete(`/users/${userId}`);
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
      setSuccessMessage('User details successfully saved!');
      fetchUsers();
      setNewUser({ name: '', email: '', role: '' });
      setShowAddUserForm(false);
    } catch (error) {
      setError('Failed to add user');
    } finally {
      setLoading(false);
    }
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
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
                          onClick={() => handleDelete(user._id)}
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
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Role:
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
            </label>
            <button type="submit" className="submit-button">Add User</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
