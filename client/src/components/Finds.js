import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/allfinds.css'

export default class Finds extends Component {
  state = {
    finds: [],
    filter: '',
    age: 'all'
  }

  componentDidMount = () => {
    axios.get('/api/finds')
    .then(response => {
      console.log(response.data)
      const filteredArr = response.data.filter(find => find.location.owner === this.props.user._id).reverse()
      this.setState({
        finds: filteredArr
      })
    })
  }

  changeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name] : value
    })
  }

  render() {
    return (
      <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
        <div className="filterSection">
          <input type="text" name="filter" value={this.state.filter} onChange={this.changeHandler}/>
          <select name="age" value={this.state.age} onChange={this.changeHandler}>
            <option value="all">all</option>
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

        <div className="allfindLinkWrapper">
          {this.state.finds.length > 0 ? this.state.finds.filter(find => find.objectType.toLowerCase().includes(this.state.filter.toLocaleLowerCase()) || find.description.toLowerCase().includes(this.state.filter.toLocaleLowerCase())).filter(find => find.age === this.state.age || this.state.age === 'all').map(find => (
            <Link className="allfindLink" key={find._id} to={`/finds/${find._id}`}>
                <div className="allfindLinkText">
                  <p style={{fontSize:"22px", fontWeight:"bold"}}>{find.objectType}</p>
                  <p style={{fontSize:"20px"}}>{find.age}</p>
                </div>
              <img style={{width:"200px"}} src={find.imageUrl} alt="find"></img>
            </Link>
          )) : <></>}
        </div>
      </div>
    )
  }
}
