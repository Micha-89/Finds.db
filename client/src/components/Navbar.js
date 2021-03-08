import React from 'react'
import { Link } from 'react-router-dom';
import { logout } from '../services/auth';

const handleLogout = props => {
  logout().then(() => {
    props.setUser(null);
  });
};

const Navbar = props => {
  return (
    <div className='nav justify-content-end' bg='primary'>
      {props.user && <div>Welcome, {props.user.username}</div>}
      {props.user ? (
        <>
          <div>
            <Link to='/finds'>Finds</Link>
          </div>

          <div>
            <Link to='/locations'>Locations</Link>
          </div>
          <div>
            <Link to='/' onClick={() => handleLogout(props)}>
              Logout
            </Link>
          </div>
        </>
      ) : (
          <>
            <div>
              <Link to='/signup'>Signup</Link>
            </div>
            <div>
              <Link to='/login'>Login</Link>
            </div>
          </>
        )}
    </div>
  )
}

export default Navbar;