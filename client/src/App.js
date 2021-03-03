import './App.css';
import React, { Component } from 'react';
import axios from 'axios';

export default class App extends Component {
  state = {
    locations: []
  }

  componentDidMount(){
    this.getData();
  }

  getData = () => {
    axios.get('/api/locations')
    .then(response => {
      console.log(response)
      this.setState({
        locations: response.data
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <div>
        {
          this.state.locations.map(location => (<h1 key={location._id}>{location.name}</h1>))
        }
      </div>
    )
  }
}
