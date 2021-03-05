import React from 'react';
import './App.css';
import { Route, Redirect } from 'react-router-dom';
import Locations from './components/Locations';
import LocationDetails from './components/LocationDetails'
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';

class App extends React.Component {

  state = {
    user: this.props.user
  }

  setUser = user => {
    this.setState({
      user: user
    })
  }

  render() {
    return (
      <div className='App' >
        <Navbar user={this.state.user} setUser={this.setUser} />

        <Route
          exact path='/locations'
          render={props => {
            if (this.state.user) return <Locations user={this.state.user} {...props}/>
            else return <Redirect to='/' />
          }}
        />

        <Route
          exact path='/locations/:id'
          render={props => {
            if (this.state.user) return <LocationDetails {...props}/>
            else return <Redirect to='/' />
          }}
        />

        <Route
          exact
          path='/signup'
          // to the Signup we have to pass a reference to the setUser method
          // this we cannot do via component={<some component>}
          // For this we use the render prop - The term “render prop” refers to a technique for sharing 
          // code between React components using a prop whose value is a function.
          // A component with a render prop takes a function that returns a React element and calls it 
          // instead of implementing its own render logic.
          render={props => <Signup setUser={this.setUser} {...props} />}
        />
        <Route
          exact
          path='/login'
          render={(props) => <Login setUser={this.setUser} {...props}/>}
        />
      </div>
    );
  }
}

export default App;