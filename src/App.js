import logo from './logo.svg';
import './App.css';
import { Route, Routes, Navigate} from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import LoginPage from './pages/LoginPage';
import VehicleForm from './pages/VehicleForm';
import HomePage from './pages/HomePage';
import UserProfile from './pages/UserProfile';
import VehiclesPage from './pages/VehiclesPage';
import Dashboard from './pages/Dashboard';
import PreferencesForm from './pages/PreferencesForm';

function App() {
  return (
    <div className="App">
      <Routes> 
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/profile/:id" element={<UserProfile />} />
        <Route exact path="/vehicles" element={<VehiclesPage />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />}/>
      </Routes>
    </div>
  );
}

export default App;