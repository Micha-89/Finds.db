import React, { Component } from 'react';
import axios from 'axios';

export default class FindsDetails extends Component {

  state = {
    find: {},
    showEdit: '',
    age: '',
    description: '',
    imageUrl: '',
    objectType: ''
  }

  componentDidMount = () => {
    axios.get(`/api/finds/${this.props.match.params.id}`)
    .then(response => {
      this.setState({
        find: response.data,
        showEdit: false,
        age: response.data.age,
        description: response.data.description,
        imageUrl: response.data.imageUrl,
        objectType: response.data.objectType
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

  cancelEdit = () => {
    this.setState(prevState => ({
      showEdit: false,
      age: prevState.find.age,
      description: prevState.find.description,
      imageUrl: prevState.find.imageUrl,
      objectType: prevState.find.objectType
    }))
  }

  handleFileUpload = (e) => {
    const uploadData = new FormData();
    uploadData.append('imageUrl', e.target.files[0]);
    axios.post('/api/upload', uploadData)
    .then(response => 
      this.setState({
        imageUrl: response.data.secure_url
      })
    )
    .catch(err => {
      console.log(err)
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/finds/${this.props.match.params.id}`, 
    { objectType: this.state.objectType, 
      age: this.state.age, 
      description: this.state.description, 
      imageUrl: this.state.imageUrl 
    }).then(() => {
      window.location.reload()
    }).catch(err => {
      console.log(err)
    })

  }

  deleteFind = () => {
    axios.delete(`/api/finds/${this.props.match.params.id}`)
    .then(() => {
      axios.put(`/api/hunts/removeFind/${this.state.find.hunt}`, { find: this.props.match.params.id})
      .then(() => {
        this.props.history.goBack()
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
        
        {this.state.age !== '' ? !this.state.showEdit ? (
          <div>
            <label style={{fontWeight:"bold"}}>Type:</label>
            <p>{this.state.find.objectType}</p>
            <label style={{fontWeight:"bold"}}>Period:</label>
            <p>{this.state.find.age}</p>
            <label style={{fontWeight:"bold"}}>Description:</label>
            <p>{this.state.find.description}</p>
            <img src={this.state.find.imageUrl} alt="find"/>
            <br/>
            <button onClick={() => {this.setState({showEdit:true})}}>Edit</button>
            <button onClick={this.deleteFind}>Delete</button>
            <button onClick={() => this.props.history.goBack()}>back</button>
          </div>
        ) : 
        (
          <div>
            <form onSubmit={this.handleSubmit} style={{display:"flex", flexDirection:"column", alignItems:"flex-start", gap:"10px"}}>
              <label style={{fontWeight:"bold"}}>Type:</label>
              <input type="text" name="objectType" value={this.state.objectType} onChange={this.handleChange}/>
              <label style={{fontWeight:"bold"}}>Period:</label>
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
              <label style={{fontWeight:"bold"}}>Description:</label>
              <textarea name="description" id="" cols="30" rows="10" value={this.state.description}  onChange={this.handleChange}></textarea>
              <input type="file" onChange={e => this.handleFileUpload(e)}/>
              <img src={this.state.imageUrl} alt="find"/>
              <br/>
              <button type="submit">Submit</button>
            </form>
            <button onClick={this.cancelEdit}>Cancel</button>
          </div>
        ) : <></>}
        
      </div>
    )
  }
}
