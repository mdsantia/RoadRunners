import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'
import { UserContextProvider } from './context/UserContext'
import { DirectionContextProvider } from './context/DirectionContext';
import { GOOGLE_MAPS_API_KEY } from './Constants';
import { LoadScript } from '@react-google-maps/api';
const GOOGLE_MAPS_LIBRARIES = ['places', 'geometry'];


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={GOOGLE_MAPS_LIBRARIES}>
    <UserContextProvider>
      <DirectionContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DirectionContextProvider>
    </UserContextProvider>
    </LoadScript>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
