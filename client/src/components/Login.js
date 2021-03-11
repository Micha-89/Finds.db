import React, { Component } from 'react';
import { login } from '../services/auth';
import '../styles/login.css'

export default class Login extends Component {
  state = {
    username: '',
    password: '',
    message: ''
  };

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { username, password } = this.state;

    login(username, password).then(data => {
      if (data.message) {
        this.setState({
          message: data.message,
          username: '',
          password: ''
        });
      } else {
        // successfully logged in
        // update the state for the parent component
        this.props.setUser(data);
        this.props.history.push('/locations');
      }
    });
  };

  render() {
    return (
    <div style={{display:"flex"}}>
      <div className="imageDivLogin">

      </div>

      <div  className="loginFormWrap">
        <form onSubmit={this.handleSubmit} className="loginForm">
            <h2>Login</h2>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              name='username'
              value={this.state.username}
              onChange={this.handleChange}
              id='username'
            />
      
          
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              name='password'
              value={this.state.password}
              onChange={this.handleChange}
              id='password'
            />
        
          <button type='submit' className="loginButton">Login</button>

          {this.state.message && (
            <h4>{this.state.message}</h4>
          )}
          
        </form>
      </div>

    </div>
    );
  }
}

