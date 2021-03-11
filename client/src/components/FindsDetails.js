import React, { Component } from 'react';
import axios from 'axios';
import '../styles/finddetails.css'

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
          <div className="findDetailWrapper">
            <div style={{width:"20vw"}}>
              <label className="findDetailLabel">Type</label>
              <p>{this.state.find.objectType}</p>
              <label className="findDetailLabel">Period</label>
              <p>{this.state.find.age}</p>
              <label className="findDetailLabel">Description</label>
              <p>{this.state.find.description === '' ? "No description" : this.state.description}</p>
              <button className="locationDetailButton" onClick={() => {this.setState({showEdit:true})}}>Edit</button>
              <button className="locationDetailButton" onClick={this.deleteFind}>Delete</button>
              <button className="locationDetailButton" onClick={() => this.props.history.goBack()}>back</button>
            </div>
            <img src={this.state.find.imageUrl} alt="find"/>
          </div>
        ) : 
        (
          <div>
            <div className="findDetailWrapper">
              <form onSubmit={this.handleSubmit} style={{display:"flex", flexDirection:"column", alignItems:"flex-start", gap:"10px", width:"20vw"}}>
                <label className="findDetailLabel">Type</label>
                <input type="text" name="objectType" value={this.state.objectType} onChange={this.handleChange}/>
                <label className="findDetailLabel">Period</label>
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
                <label className="findDetailLabel">Description</label>
                <textarea name="description" id="" cols="21" rows="1" value={this.state.description}  onChange={this.handleChange}></textarea>
                <input type="file" onChange={e => this.handleFileUpload(e)}/>
                <div>
                  <button className="locationDetailButton" type="submit">Submit</button>
                  <button className="locationDetailButton" onClick={this.cancelEdit}>Cancel</button>
                </div>
                </form>
                <img src={this.state.imageUrl} alt="find"/>
            </div>
          </div>
        ) : <></>}
        
      </div>
    )
  }
}
