import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';

export default class Allfindsthislocation extends Component {

  state = {
    finds : []
  }

  componentDidMount = () => {
    axios.get('/api/finds')
    .then(response => {
      this.setState({
        finds: response.data
      })
    })
  }

  render() {
    return (
      <div>

        {(this.state.finds.filter(find => find.location._id === this.props.match.params.id).length > 0) ?

          <div style={{display:"flex", gap:"40px"}}>
            <div>
              {this.state.finds.filter(find => find.location._id === this.props.match.params.id).reverse().map(find => (
              <Link key={find._id} to={`/finds/${find._id}`}>
                <p>{find.objectType}</p>
                <img style={{width:"200px"}} src={find.imageUrl} alt="find"></img>
              </Link>
              )) }
            </div>
            <div>
              <Pie 
                data={{
                  labels: ['uncertain', 'stone age', 'bronze age', 'iron age', 'roman', 'early medieval', 'medieval', 'post medieval', 'modern'],
                  datasets: [
                    {
                      label: 'Points',
                      backgroundColor: ['#f1c40f', '#e67e22', '#16a085', '#2980b9', '#78c4d4', '#f5c0c0', '#7868e6', '#f14668', '#c0e218'],
                      data: [
                        this.state.finds.filter(find => find.location._id === this.props.match.params.id && find.age === "uncertain").length,
                        this.state.finds.filter(find => find.location._id === this.props.match.params.id && find.age === "stone age").length,
                        this.state.finds.filter(find => find.location._id === this.props.match.params.id && find.age === "bronze age").length,
                        this.state.finds.filter(find => find.location._id === this.props.match.params.id && find.age === "iron age").length,
                        this.state.finds.filter(find => find.location._id === this.props.match.params.id && find.age === "roman").length,
                        this.state.finds.filter(find => find.location._id === this.props.match.params.id && find.age === "early medieval").length,
                        this.state.finds.filter(find => find.location._id === this.props.match.params.id && find.age === "medieval").length,
                        this.state.finds.filter(find => find.location._id === this.props.match.params.id && find.age === "post medieval").length,
                        this.state.finds.filter(find => find.location._id === this.props.match.params.id && find.age === "modern").length
                        ]
                    }
                  ]
                }}
      
                height={400} 
                width={600}
              />
            </div>
          </div>
          
        : <></>}
          
      </div>
    )
  }
}
