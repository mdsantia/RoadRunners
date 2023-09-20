import logo from './logo.svg';
import './App.css';

import LoginPage from './pages/LoginPage';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          >
          Learn React
        </a>
      </header>
      <button onClick={newData}>TEST NEW DATA</button>
      <button onClick={updateData}>TEST UPDATE DATA</button>
    </div>
  );
}

export default App;
