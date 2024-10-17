// src/components/CoachDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './CoachDashboard.css'; // Add a CSS file for styling

const CoachDashboard = () => {
  const [profile, setProfile] = useState({ name: '', coachId: '', bio: '', avatar: '' });
  const [schedules, setSchedules] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState('');
  const navigate = useNavigate(); // Initialize navigate for redirection

  useEffect(() => {
    // Fetch coach profile and schedules from backend
    axios.get('/api/coach/profile').then(res => setProfile(res.data));
    axios.get('/api/coach/schedules').then(res => setSchedules(res.data));
  }, []);

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Save the new bio
      axios.put('/api/coach/profile', { bio: newBio }).then(res => {
        setProfile(res.data);
        setNewBio('');
      });
    } else {
      // Load current bio into the input
      setNewBio(profile.bio);
    }
  };

  const handleLogout = () => {
    // Clear any auth data (this can be token or session data)
    localStorage.removeItem('token'); // Assuming the token is stored in localStorage
    // Redirect to login page
    navigate('/');
  };

  return (
    <div className="coach-dashboard">
      <header>
        <h2>Coach Dashboard</h2>
      </header>

      {/* Profile section at the top-right corner */}
      <section className="profile-section">
        <div className="profile-card">
          <img src={profile.avatar} alt={profile.name} />
          <div className="profile-info">
            <h4>{profile.name}</h4>
            <p>Coach ID: {profile.coachId}</p>
            {isEditing ? (
              <div>
                <textarea
                  value={newBio}
                  onChange={e => setNewBio(e.target.value)}
                  className="bio-input"
                />
                <button className="edit-btn" onClick={handleEditProfile}>Save</button>
              </div>
            ) : (
              <div>
                <p>{profile.bio}</p>
                <button className="edit-btn" onClick={handleEditProfile}>Edit Profile</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming schedules at the center */}
      <section className="schedules-section">
        <h3>Upcoming Schedules</h3>
        <ul className="schedules-list">
          {schedules.map(schedule => (
            <li key={schedule.id} className="schedule-item">
              <div className="schedule-info">
                <h4>{schedule.eventName}</h4>
                <p>{schedule.date}</p>
              </div>
              <ul className="members-list">
                {schedule.members.map(member => (
                  <li key={member.id}>{member.name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {/* Logout button at the bottom center */}
      <div className="logout-section">
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
    </div>
  );
};

export default CoachDashboard;
