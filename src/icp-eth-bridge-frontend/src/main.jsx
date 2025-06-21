import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ErrorBoundary from './Components/Errorboundary';


const root = ReactDOM.createRoot(document.getElementById('root'));
const GOOGLE_CLIENT_ID = "168430416898-capc1bl4oj1vihgvfshrf1g4d954jkf8.apps.googleusercontent.com"
root.render(
  <React.StrictMode>
    <ErrorBoundary>
    <GoogleOAuthProvider clientId = {GOOGLE_CLIENT_ID}>
    <App />
    </GoogleOAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
