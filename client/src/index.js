import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import store from './Redux/store'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <React.StrictMode>
  <GoogleOAuthProvider clientId="1081630174481-mil4v6rqooa567v71h17edthcgt22t94.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>;
  </React.StrictMode>
  </Provider>
);

