import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './LoginPage.css'; // Add a CSS file for styling

// Hardcoded users for demonstration purposes
const users = {
  member: { email: 'member@example.com', password: 'member123' },
  coach: { email: 'coach@example.com', password: 'coach123' },
  admin: { email: 'admin@example.com', password: 'admin123' },
};

const LoginPage = () => {
  const [email, setEmail] = useState('');  // State for email input
  const [password, setPassword] = useState('');  // State for password input
  const navigate = useNavigate();  // Use useNavigate for routing

  // Function to handle login when form is submitted
  const handleLogin = (e) => {
    e.preventDefault();  // Prevent form from refreshing page
    // Find user role based on the entered email and password
    const userRole = Object.keys(users).find(
      (role) => users[role].email === email && users[role].password === password
    );
    
    // If valid credentials are found
    if (userRole) {
      const user = { role: userRole, name: `${userRole.charAt(0).toUpperCase()}${userRole.slice(1)}` };
      localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage

      // Navigate to different dashboard based on user role
      if (userRole === 'member') navigate('/member');
      if (userRole === 'coach') navigate('/coach');
      if (userRole === 'admin') navigate('/admin');
    } else {
      // If credentials are incorrect, display an alert
      alert('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login to Tennis Club</h2>
      <form onSubmit={handleLogin}> {/* Handle form submission */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="login-btn"> {/* Button triggers form submit */}
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
