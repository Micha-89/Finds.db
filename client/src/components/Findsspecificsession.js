import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';

export default class Findsspecificsession extends Component {
  state = {
    objectType: '',
    age: 'uncertain',
    description: '',
    imageUrl: '',
    fileInputValue: '',
    imageUploaded: false,
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

  handleFileUpload = (e) => {
    const uploadData = new FormData();
    uploadData.append('imageUrl', e.target.files[0]);
    axios.post('/api/upload', uploadData)
    .then(response => 
      this.setState({
        imageUrl: response.data.secure_url,
        imageUploaded: true
      })
    )
    .catch(err => {
      console.log(err)
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/finds', {
      objectType: this.state.objectType,
      description: this.state.description,
      age: this.state.age,
      location: this.state.hunt.location,
      hunt: this.props.match.params.sessionId,
      imageUrl: this.state.imageUrl
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
            description: '',
            imageUrl: '',
            imageUploaded: false
          })
          this.props.onReload()
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

  removeSession = () => {
    axios.delete(`/api/hunts/${this.props.match.params.sessionId}`)
    .then(
      axios.put(`/api/locations/removeHunt/${this.props.match.params.id}`, { hunt: this.props.match.params.sessionId})
      .then(() => {
        this.props.onReload()
        this.props.history.push(`/locations/${this.props.match.params.id}`)
      })
      .catch(err => {
        console.log(err)
      })
    )
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    return (

      <div style={{display:"flex"}}>
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
            <label style={{backgroundColor:"grey", marginTop:"5px"}} htmlFor="imageUrl">Upload image</label>
            <input style={{display:"none"}} type="file"  id="imageUrl" name="imageUrl" value={this.state.fileInputValue} onChange={e => this.handleFileUpload(e)}/>
            {this.state.imageUploaded ? <p>image uploaded</p> : <p>no image uploaded</p>}
            <button type="submit">Add Find</button>
          </form>

          {this.state.hunt._id !== undefined ? (this.state.finds.length > 0) ? 

            <div>
              {this.state.finds.map(find => (
              <Link key={find._id} to={`/finds/${find._id}`}>
              <p>{find.objectType}</p>
              <img style={{width:"200px"}} src={find.imageUrl} alt="find"></img>
              </Link>)) }
            </div>

          : <button onClick={() => {this.removeSession()}}>Delete session</button> : <></>}

        </div>

        <div>
        
        {(this.state.finds.length > 0) ? 
          <div>
          <Pie 
                data={{
                  labels: ['uncertain', 'stone age', 'bronze age', 'iron age', 'roman', 'early medieval', 'medieval', 'post medieval', 'modern'],
                  datasets: [
                    {
                      label: 'Points',
                      backgroundColor: ['#f1c40f', '#e67e22', '#16a085', '#2980b9', '#78c4d4', '#f5c0c0', '#7868e6', '#f14668', '#c0e218'],
                      data: [
                        this.state.finds.filter(find => find.age === "uncertain").length,
                        this.state.finds.filter(find => find.age === "stone age").length,
                        this.state.finds.filter(find => find.age === "bronze age").length,
                        this.state.finds.filter(find => find.age === "iron age").length,
                        this.state.finds.filter(find => find.age === "roman").length,
                        this.state.finds.filter(find => find.age === "early medieval").length,
                        this.state.finds.filter(find => find.age === "medieval").length,
                        this.state.finds.filter(find => find.age === "post medieval").length,
                        this.state.finds.filter(find => find.age === "modern").length
                        ]
                    }
                  ]
                }}
      
                height={400} 
                width={600}
              />
          </div>
          : <></>}

        </div>
      </div>
    )
  }
}
