import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default class Finds extends Component {
  state = {
    finds: [],
    filter: ''
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
    this.setState({
      filter: e.target.value
    })
  }

  render() {
    return (
      <div>
        <div>
          <input type="text" value={this.state.filter} onChange={this.changeHandler}/>
          <select name="" id="">
            <option value="">all</option>
            <option value="">uncertain</option>
            <option value="">stone age</option>
            <option value="">bronze age</option>
            <option value="">iron age</option>
            <option value="">roman</option>
            <option value="">early medieval</option>
            <option value="">post medieval</option>
            <option value="">modern</option>
          </select>
        </div>
        <div>
        {this.state.finds.length > 0 ? this.state.finds.filter(find => find.objectType.toLowerCase().includes(this.state.filter.toLocaleLowerCase()) || find.description.toLowerCase().includes(this.state.filter.toLocaleLowerCase())).map(find => (
          <Link key={find._id}>
            <p>{find.objectType}</p>
            <img style={{width:"200px"}} src={find.imageUrl} alt="find"></img>
          </Link>
        )) : <></>}
        </div>
      </div>
    )
  }
}
