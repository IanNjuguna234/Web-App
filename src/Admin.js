// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './AdminDashboard.css'; // Add a CSS file for styling

const AdminDashboard = () => {
  const [members, setMembers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    eventName: '',
    date: '',
    coachName: '',
  });

  const navigate = useNavigate(); // Initialize navigate for redirection

  useEffect(() => {
    // Fetch all members and schedules from backend
    axios.get('/api/members').then(res => setMembers(res.data));
    axios.get('/api/schedules').then(res => setSchedules(res.data));
  }, []);

  const handleCreateSchedule = (e) => {
    e.preventDefault();
    axios.post('/api/schedules', newSchedule).then(res => {
      setSchedules([...schedules, res.data]); // Add new schedule to the list
      setNewSchedule({
        eventName: '',
        date: '',
        coachName: '',
      });
    });
  };

  const handleLogout = () => {
    // Clear any auth data (this can be token or session data)
    localStorage.removeItem('token'); // Assuming the token is stored in localStorage
    // Redirect to login page
    navigate('/');
  };

  return (
    <div className="admin-dashboard">
      <header>
        <h2>Admin Dashboard</h2>
      </header>

      {/* Container for the sections to display them side by side */}
      <div className="dashboard-content">
        {/* Create Schedule Form */}
        <section className="create-schedule-section">
          <h3>Create Schedule</h3>
          <form onSubmit={handleCreateSchedule}>
            <div className="form-group">
              <label>Event Name:</label>
              <input
                type="text"
                value={newSchedule.eventName}
                onChange={(e) => setNewSchedule({ ...newSchedule, eventName: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                value={newSchedule.date}
                onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Coach Name:</label>
              <input
                type="text"
                value={newSchedule.coachName}
                onChange={(e) => setNewSchedule({ ...newSchedule, coachName: e.target.value })}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Schedule</button>
          </form>
        </section>

        {/* Members List */}
        <section className="members-section">
          <h3>Members List</h3>
          <ul className="members-list">
            {members.map((member) => (
              <li key={member.id}>{member.name}</li>
            ))}
          </ul>
        </section>

        {/* Schedules List */}
        <section className="schedules-section">
          <h3>All Schedules</h3>
          <ul className="schedules-list">
            {schedules.map((schedule) => (
              <li key={schedule.id}>
                {schedule.eventName} - {schedule.date} - {schedule.coachName}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Logout Button */}
      <div className="logout-section">
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
