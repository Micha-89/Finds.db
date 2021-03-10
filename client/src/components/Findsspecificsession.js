import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import '../styles/findsspecs.css'


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
    if(this.state.imageUploaded === false || this.state.objectType === '') return console.log('please fill in all fields')
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

        <form className="findInput" onSubmit={this.handleSubmit}>
            {(this.state.hunt.date !== undefined) ? 
              <p style={{height:"15px"}}>{this.state.hunt.date.split('T')[0].split('-').reverse().join('-')} {this.state.hunt.date.split('T')[1]}</p> 
            : <p style={{height:"15px"}}></p>}

            <div style={{display:"flex", gap:"10px"}}>
              <div style={{display:"flex", flexDirection:"column"}}>
                <label htmlFor="objectType">Type</label>
                <input type="text" id="objectType" name="objectType" value={this.state.objectType} onChange={this.handleChange}/>
              </div>
              <div style={{display:"flex", flexDirection:"column"}}>
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
              </div>
            </div>
            <div style={{display:"flex", flexDirection:"column"}}>
              <label htmlFor="description">Description</label>
              <textarea name="description" id="description" cols="38" rows="3" value={this.state.description} onChange={this.handleChange}></textarea>
            </div>

            <div className="imageUpload">
              <label className="imageUploadLabel" htmlFor="imageUrl"><p>Upload image</p></label>
              <input style={{display:"none"}} type="file"  id="imageUrl" name="imageUrl" value={this.state.fileInputValue} onChange={e => this.handleFileUpload(e)}/>
              {this.state.imageUploaded ? <p className="imageWarning" style={{backgroundColor:"#43c7bea3"}}><img style={{width:"20px", marginRight:"3px"}} src="/Check_green_icon.svg" alt="check icon"/> Image uploaded</p> : <p className="imageWarning" style={{backgroundColor:"#f1466896"}}><img style={{width:"20px", marginRight:"3px"}} src="/redIcon.png" alt="check icon"/> Please upload image!</p>}
            </div> 
            
            <div>
              <button className="findFormButton" type="submit">Add Find</button>
              {this.state.hunt._id !== undefined ? (this.state.finds.length > 0) ? <></>
                : <button className="findFormButton" onClick={() => {this.removeSession()}}>Delete session</button> : <></>}
            </div>
            


          </form>

          {(this.state.finds.length > 0) ? 

            <div className="findLinkWrapper">
              {this.state.finds.map(find => (
              <Link className="findLink" key={find._id} to={`/finds/${find._id}`}>
                <div className="findLinkText">
                  <p style={{fontSize:"22px", fontWeight:"bold"}}>{find.objectType}</p>
                  <p style={{fontSize:"20px"}}>{find.age}</p>
                </div>
                <img src={find.imageUrl} alt="find"></img>
              </Link>)) }
            </div>

          : <></>}

        </div>

        <div>
        
        {(this.state.finds.length > 0) ? 
          <div style={{padding:"100px"}}>
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
