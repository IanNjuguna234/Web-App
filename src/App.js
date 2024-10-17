import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import MemberDashboard from './Member';
import AdminDashboard from './Admin';
import CoachDashboard from './Coach';

function App() {
  return (
    <Router>
   
   <Routes>
    
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/member" element={<MemberDashboard />} />
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/coach" element={<CoachDashboard />} /> /
    
</Routes>
    
</Router>
  );
}

export default App;
