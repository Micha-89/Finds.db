import React, { Component } from 'react';
import { signup } from '../services/auth';

export default class Signup extends Component {
  state = {
    username: '',
    password: '',
    message: '',
    longitude: '',
    latitude: ''
  };

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    const { username, password, longitude, latitude } = this.state;

    signup(username, password, longitude, latitude).then(data => {
      if (data.message) {
        this.setState({
          message: data.message,
          username: '',
          password: ''
        });
      } else {
        this.props.setUser(data);
        this.props.history.push('/locations');
      }
    });
  };

  render() {
    return (
      <>
        <h2>Signup</h2>
        <form onSubmit={this.handleSubmit}>
          
            <label htmlFor='username'>Username: </label>
            <input
              type='text'
              name='username'
              value={this.state.username}
              onChange={this.handleChange}
              id='username'
            />
          
         
            <label htmlFor='password'>Password: </label>
            <input
              type='password'
              name='password'
              value={this.state.password}
              onChange={this.handleChange}
              id='password'
            />

            <label htmlFor="longitude">Fill in latitude and longitude to center map</label>
            <input type="number" name="latitude" id="latitude" placeholder="latitude" value={this.state.latitude} onChange={this.handleChange}/>
            <input type="number" name="longitude" id="longitude" placeholder="longitude" value={this.state.longitude} onChange={this.handleChange}/>
            
      
          {this.state.message && (
            <h2>{this.state.message}</h2>
          )}
          <button type='submit'>Signup</button>
        </form>
      </>
    );
  }
}
