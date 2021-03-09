import React from 'react'
import { Link } from 'react-router-dom';
import { logout } from '../services/auth';
import '../styles/navbar.css'

const handleLogout = props => {
  logout().then(() => {
    props.setUser(null);
  });
};

const Navbar = props => {
  return (
    <div className='navbar'>
      <h1 className='appName'>Finds.db</h1>
      {props.user ? (
        <div className='navLinksWrap'>
          <div>
            <Link className='navLink' to='/finds'>Finds</Link>
          </div>

          <div>
            <Link className='navLink' to='/locations'>Locations</Link>
          </div>
          <div>
            <Link className='navLink' to='/' onClick={() => handleLogout(props)}>
              Logout
            </Link>
          </div>
        </div>
      ) : (
          <div className='navLinksWrap'>
            <div>
              <Link className='navLink' to='/signup'>Signup</Link>
            </div>
            <div>
              <Link className='navLink' to='/login'>Login</Link>
            </div>
          </div>
        )}
    </div>
  )
}

export default Navbar;