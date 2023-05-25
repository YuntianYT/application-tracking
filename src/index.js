import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { FirebaseAppProvider } from 'reactfire';

import { BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));

const firebaseConfig = {
  apiKey: 'AIzaSyAa_pOQ4zyKLGoZUTG8FIN78ODkaVP6uv0',
  authDomain: 'fir-1a467.firebaseapp.com',
  projectId: 'fir-1a467',
  storageBucket: 'fir-1a467.appspot.com',
  messagingSenderId: '373681117791',
  appId: '1:373681117791:web:96989a838ee5a9c23fd9ea',
};

root.render(
  <BrowserRouter>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <App />
    </FirebaseAppProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
