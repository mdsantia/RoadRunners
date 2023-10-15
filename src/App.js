import logo from './logo.svg';
import './App.css';
import { Route, Routes, Navigate} from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { createTheme, ThemeProvider } from '@mui/material';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/Dashboard';

const theme = createTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routes> 
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/profile/:pageType/:id" element={<UserProfile />} />
          <Route exact path="/dashboard/:startLocation/:endLocation/:startDate/:endDate" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />}/>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;