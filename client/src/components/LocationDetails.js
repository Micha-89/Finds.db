import React, { Component } from 'react';
import axios from 'axios';

export default class LocationDetails extends Component {

  state = {
    date : '',
    hunts: []
  }

  componentDidMount() {
    axios.get(`/api/locations/${this.props.match.params.id}`)
    .then(response => {
      this.setState({
        hunts: response.data.hunts
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  handleChangeDate = e => {
    this.setState({
      date: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/hunts', {
      date: this.state.date,
      location: this.props.match.params.id,
      finds: []
    })
    .then(response => {
      axios.put(`/api/locations/${this.props.match.params.id}`, { hunt: response.data._id})
      .then(() => {
        axios.get(`/api/locations/${this.props.match.params.id}`)
        .then(response => {
          this.setState({
            hunts: response.data.hunts
          })
        })
        .catch(err => {
          console.log(err)
        })
      })
      .catch(err => {
        console.log(err)
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <div>
        <h1>Location Id: {this.props.match.params.id}</h1>
        
        <ul>
          <li>
            <form onSubmit={this.handleSubmit}>
              <input onChange={this.handleChangeDate} type="datetime-local" name="" id=""/>
              <button type="submit">Add Session</button>
            </form>
          </li>
          {this.state.hunts.length > 0 ? this.state.hunts.map(session => (<li key={session._id}>Day: {session.date.split('T')[0].split('-').reverse().join('-')} Time: {session.date.split('T')[1]}</li>)) : <></>}
        </ul>
        <ul>
          <li>Find</li>
          <li>Find</li>
          <li>Find</li>
          <li>Find</li>
          <li>Find</li>
          <li>Find</li>
          <li>Find</li>
          <li>Find</li>
          <li>Find</li>
          <li>Find</li>
        </ul>
      </div>
    )
  }
}
