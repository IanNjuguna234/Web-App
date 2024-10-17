// src/components/MemberDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MemberPage.css'; // Add a CSS file for styling
import axios from 'axios';

const MemberDashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [enrolledSchedules, setEnrolledSchedules] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false); // Assume login status
  const [newMember, setNewMember] = useState({ name: '', email: '' });
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const navigate = useNavigate(); // Use for navigation

  useEffect(() => {
    // Fetch schedules and coaches from the backend
    axios.get('/api/schedules').then(res => setSchedules(res.data));
    axios.get('/api/coaches').then(res => setCoaches(res.data));

    // Check if user is logged in
    const token = localStorage.getItem('token'); // Assume login token in localStorage
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleEnroll = (scheduleId) => {
    if (!loggedIn) {
      alert("Please log in to enroll in a schedule.");
      navigate('/login');
      return;
    }
    axios.post(`/api/enroll/${scheduleId}`).then(res => {
      setEnrolledSchedules([...enrolledSchedules, scheduleId]);
    }).catch(err => {
      console.error(err);
    });
  };

  const handleViewCoachProfile = (coachId) => {
    // Navigate to coach profile page
    navigate(`/coach-profile/${coachId}`);
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    axios.post('/api/members', newMember).then(res => {
      alert("Account created! You will now receive email updates.");
      setEmailSubscribed(true);
    }).catch(err => {
      console.error(err);
    });
  };
  
  const handleLogout = () => {
    // Clear any auth data (this can be token or session data)
    localStorage.removeItem('token'); // Assuming the token is stored in localStorage
    // Redirect to login page
    navigate('/');
  };


  return (
    <div className="member-dashboard">
      <header>
        <h2>Member Dashboard</h2>
      </header>

      <div className="dashboard-container">
        {/* Create Account and Email Subscription */}
        <section className="create-account-section">
          {!emailSubscribed && (
            <div>
              <h3>Create an Account & Stay Updated</h3>
              <form onSubmit={handleCreateAccount}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  required
                />
                <button type="submit" className="btn btn-primary">Create Account</button>
              </form>
            </div>
          )}
        </section>

        {/* Display Upcoming Schedules */}
        <section className="schedules-section">
          <h3>Your Upcoming Schedules</h3>
          <div className="schedule-cards">
            {schedules.map(schedule => (
              <div key={schedule.id} className="schedule-card">
                <h4>{schedule.eventName}</h4>
                <p>Date: {schedule.date}</p>
                <p>Coach: {schedule.coachName}</p>
                {loggedIn && (
                  <div>
                    {enrolledSchedules.includes(schedule.id) ? (
                      <button disabled className="btn enrolled">Enrolled</button>
                    ) : (
                      <button
                        className="btn enroll-btn"
                        onClick={() => handleEnroll(schedule.id)}
                      >
                        Enroll
                      </button>
                    )}
                  </div>
                )}
                <button
                  className="btn view-coach-btn"
                  onClick={() => handleViewCoachProfile(schedule.coachId)}
                >
                  View Coach Profile
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* List of Coach Profiles */}
        <section className="coaches-section">
          <h3>Coach Profiles</h3>
          <div className="coach-cards">
            {coaches.map(coach => (
              <div key={coach.id} className="coach-card">
                <h4>{coach.name}</h4>
                <button
                  className="btn view-coach-btn"
                  onClick={() => handleViewCoachProfile(coach.id)}
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
            {/* Logout button at the bottom center */}
            <div className="logout-section">
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
    </div>
  );
};

export default MemberDashboard;
