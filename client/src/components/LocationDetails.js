import React, { Component } from 'react';
import axios from 'axios';
import Allfindsthislocation from '../components/Allfindsthislocation';
import Findsspecificsession from '../components/Findsspecificsession';
import { Route, Link, Switch } from 'react-router-dom';

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

  handleChildChange = () => {
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
        <div style={{display:"flex", gap:"40px"}}>
          <div style={{display:"flex", flexDirection:"column", gap:"20px"}}>
            <div>
              <form onSubmit={this.handleSubmit}>
                <input onChange={this.handleChangeDate} type="datetime-local" name="" id=""/>
                <button type="submit">Add Session</button>
              </form>
            </div>
            <Link to={`${this.props.match.url}/allfinds`}>All finds in this location</Link>
            {this.state.hunts.length > 0 ? this.state.hunts.map(session => (<Link to={`${this.props.match.url}/${session._id}`} key={session._id}>Day: {session.date.split('T')[0].split('-').reverse().join('-')} Time: {session.date.split('T')[1]}</Link>)) : <p>No sessions yet</p>}
          </div>
          <Switch>
            <Route path={`${this.props.match.path}/allfinds`} render={(props) => (<Allfindsthislocation {...props}/>)}/>
            <Route path={`${this.props.match.path}/:sessionId`} render={(props) => (<Findsspecificsession  key={props.match.params.sessionId} {...props} onReload={() => {this.handleChildChange()}}/>)} />
          </Switch>
        </div>
      </div>
    )
  }
}




