import React, { Component } from 'react';
import axios from 'axios';
import Allfindsthislocation from '../components/Allfindsthislocation';
import Findsspecificsession from '../components/Findsspecificsession';
import { Route, Link, Switch } from 'react-router-dom';
import '../styles/locationDetails.css'

export default class LocationDetails extends Component {

  state = {
    date : '',
    hunts: [],
    longitude: '',
    latitude: ''
  }
  
  componentDidMount() {
    axios.get(`/api/locations/${this.props.match.params.id}`)
    .then(response => {
      this.setState({
        hunts: response.data.hunts,
        longitude: response.data.longitude,
        latitude: response.data.latitude
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
      this.props.history.push(`/locations/${this.props.match.params.id}/${response.data._id}`);
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
      <div onLoad={this.onloadParentComponent}>
        <div className="latlongDetailSection">
          <p><span>Latitude:</span> {this.state.latitude}</p>
          <p><span>Longitude:</span> {this.state.longitude}</p>
          <img className="copyIcon" src="/Edit-copy.svg" alt="" onClick={() => {navigator.clipboard.writeText(this.state.latitude + ',' + this.state.longitude)}}/> 
          <a target="_blank" rel="noreferrer" href={`http://maps.google.com/maps?q=${this.state.latitude},${this.state.longitude}`} style={{fontSize:"16px"}}>Look up coordinates on google maps</a>
        </div>
        
        <div style={{display:"flex", gap:"40px"}}>
          <div className="sessionsListContainer">
            <div>
              <form onSubmit={this.handleSubmit}>
                <input onChange={this.handleChangeDate} type="datetime-local" name="" id=""/>
                <button className="addSessionButton" type="submit">Add Session</button>
              </form>
            </div>

            <div className="sessionsList">
              {this.state.hunts.length > 0 ? <Link id="allfinds" className="sessionDetail" to={`${this.props.match.url}/allfinds`}>All finds in this location</Link> : <></>}
              {this.state.hunts.length > 0 ? this.state.hunts.map(session => (<Link id={session._id} className="sessionDetail" to={`${this.props.match.url}/${session._id}`} key={session._id}>Day: {session.date.split('T')[0].split('-').reverse().join('-')} Time: {session.date.split('T')[1]}</Link>)) : <></>}
            </div>
          </div>
          <Switch>
            <Route path={`${this.props.match.path}/allfinds`}  render={(props) => (<Allfindsthislocation {...props}/>)}/>
            <Route path={`${this.props.match.path}/:sessionId`} render={(props) => (
            <Findsspecificsession  
            key={props.match.params.sessionId} 
            {...props} 
            onReload={() => {this.handleChildChange()}}/>
            )} />
          </Switch>
        </div>
      </div>
    )
  }
}




