import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

// import axios
import axios from 'axios';

// get logged in user and pass it as a prop
axios.get('/api/auth/loggedin')
  .then(response => {
    const user = response.data;
    ReactDOM.render(
      <BrowserRouter>
        <App user={user} />
      </BrowserRouter>,
      document.getElementById('root')
    );
  });
