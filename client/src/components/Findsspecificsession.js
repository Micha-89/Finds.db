import React, { Component } from 'react';
import axios from 'axios';

export default class Findsspecificsession extends Component {
  state = {
    objectType: '',
    age: 'uncertain',
    description: '',
    hunt: {},
    finds: []
  }

  componentDidMount = () => {
    axios.get(`/api/hunts/${this.props.match.params.sessionId}`)
    .then(response => {
      this.setState({
        hunt: response.data,
        finds: response.data.finds
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name] : value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/finds', {
      objectType: this.state.objectType,
      description: this.state.description,
      age: this.state.age,
      location: this.state.hunt.location,
      hunt: this.props.match.params.sessionId
    })
    .then(response => {
      axios.put(`/api/hunts/${this.props.match.params.sessionId}`, { find: response.data._id})
      .then(() => {
        axios.get(`/api/hunts/${this.props.match.params.sessionId}`)
        .then(response => {
          this.setState({
            hunt: response.data,
            finds: response.data.finds,
            objectType: '',
            age: 'uncertain',
            description: ''
          })
        })
        .catch(err => {
          console.log(err)
        })
      })
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <div>
        <form style={{display:"flex", flexDirection:"column"}} onSubmit={this.handleSubmit}>
          <label htmlFor="objectType">Type</label>
          <input type="text" id="objectType" name="objectType" value={this.state.objectType} onChange={this.handleChange}/>
          <label htmlFor="age">Age</label>
          <select name="age" id="age" value={this.state.age} onChange={this.handleChange}>
            <option value="uncertain">uncertain</option>
            <option value="stone age">stone age</option>
            <option value="bronze age">bronze age</option>
            <option value="iron age">iron age</option>
            <option value="roman">roman</option>
            <option value="early medieval">early medieval</option>
            <option value="medieval">medieval</option>
            <option value="post medieval">post medieval</option>
            <option value="modern">modern</option>
          </select>
          <label htmlFor="description">Description</label>
          <textarea name="description" id="description" cols="30" rows="10" value={this.state.description} onChange={this.handleChange}></textarea>
          <button type="submit">Add Find</button>
        </form>
        {(this.state.finds.length > 0) ? this.state.finds.map(find => (<p key={find._id}>{find.objectType}</p>)) : <></>}
      </div>
    )
  }
}
