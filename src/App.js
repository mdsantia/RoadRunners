import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import VehicleForm from './pages/VehicleForm';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HomePage from './pages/HomePage';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


function App({children}) {
  const [data, setData] = useState({});


  useEffect(() => {
    axios.get('/api/data')
      .then(response => {
        setData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    }, []);
    
  const newData = () => {
    axios.post('/api/newData')
      .then(response => {
        setData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }
  const updateData = () => {
    axios.post('/api/updateData')
      .then(response => {
        setData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    
    <div className="App">
      <LoginPage/>
      <HomePage></HomePage>
      {/* <VehicleForm/> */}
      <button onClick={newData}>TEST NEW DATA</button>
      <button onClick={updateData}>TEST UPDATE DATA</button>
    </div>
  );
}

export default App;
