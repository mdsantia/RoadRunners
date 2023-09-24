import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import LoginPage from './pages/LoginPage';
import VehicleForm from './pages/VehicleForm';
import HomePage from './pages/HomePage';


function App() {
  return (
    <div className="App">
      <Routes> 
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/vehicle" element={<VehicleForm />} />
      </Routes>
    </div>
  );
}

export default App;
