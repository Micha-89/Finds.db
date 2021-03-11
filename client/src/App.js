import React from 'react';
import './styles/App.css';
import { Route, Redirect } from 'react-router-dom';
import Locations from './components/Locations';
import LocationDetails from './components/LocationDetails'
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import Finds from './components/Finds';
import Findsdetails from './components/FindsDetails'

class App extends React.Component {

  state = {
    user: this.props.user
  }

  setUser = user => {
    this.setState({
      user: user
    })
  }

  componentDidMount = () => {

  }

  render() {
    return (
      <div className='App' >
        <Navbar user={this.state.user} setUser={this.setUser} />

        <Route exact path="/">
          <Redirect to="/locations" />
        </Route>

        <Route
          exact path='/locations'
          render={props => {
            if (this.state.user) return <Locations user={this.state.user} {...props}/>
            else return <Redirect to='/login' />
          }}
        />

        <Route
          path='/locations/:id'
          render={props => {
            if (this.state.user) return <LocationDetails {...props}/>
            else return <Redirect to='/login' />
          }}
        />

        <Route
          exact path='/finds'
          render={props => {
            if (this.state.user) return <Finds user={this.state.user} {...props}/>
            else return <Redirect to='/login' />
          }}
        />

        <Route
          exact path='/finds/:id'
          render={props => {
            if (this.state.user) return <Findsdetails {...props}/>
            else return <Redirect to='/login' />
          }}
        />

        <Route
          exact
          path='/signup'
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