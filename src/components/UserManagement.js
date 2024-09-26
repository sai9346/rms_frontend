import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { FaTrash, FaEdit } from 'react-icons/fa';
import './UserManagement.css'; // Ensure you import the CSS file

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPermission, setSelectedPermission] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true); // Show loading state
    try {
      const response = await API.get('/users');
      setUsers(response.data);
      setError(''); // Clear any previous error on success
    } catch (error) {
      setError('Failed to fetch users');
    }
    setLoading(false); // Hide loading state
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

  // Handle saving changes to user roles and permissions
  const handleSaveChanges = async (userId) => {
    const updatedRoles = [{
      role: selectedRole,
      accessLevel: selectedPermission,
    }];

    try {
      await API.put(`/users/${userId}`, { roles: updatedRoles });
      fetchUsers(); // Fetch updated users after saving changes
      setEditingUser(null); // Exit editing mode
    } catch (error) {
      setError('Failed to update user');
    }
  };

  return (
    <div className="user-management-container">
      <h2>User Management</h2>
      
      {error && <p className="error-message">{error}</p>} {/* Display error messages */}
      
      <div className="search-filter">
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.roles.map((r) => r.role).join(', ')}</td>
                  <td>
                    <button onClick={() => handleEditClick(user)} className="edit-button">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="delete-button">
                      <FaTrash />
                    </button>
                    {editingUser === user._id && (
                      <div className="edit-dropdown">
                        <select
                          onChange={(e) => handleRoleChange(e.target.value)}
                          value={selectedRole}
                          className="role-dropdown"
                        >
                          <option value="Job Post Editor">Job Post Editor</option>
                          <option value="Candidate Reviewer">Candidate Reviewer</option>
                          <option value="Interview Scheduler">Interview Scheduler</option>
                        </select>

                        <select
                          onChange={(e) => handlePermissionChange(e.target.value)}
                          value={selectedPermission}
                          className="permission-dropdown"
                        >
                          <option value="">Select Permission</option>
                          <option value="View-only">View-only</option>
                          <option value="Edit">Edit</option>
                          <option value="Full Control">Full Control</option>
                        </select>

                        <button
                          onClick={() => handleSaveChanges(user._id)}
                          className="save-button"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-users-message">No users found matching the criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
