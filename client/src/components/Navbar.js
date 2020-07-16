import React from 'react'
import {NavLink} from 'react-router-dom'
import './Navbar.css'
import AuthContext from '../context/auth-context'

export const Navbar = () => {

  const context = React.useContext(AuthContext)

  return (
    <header className="main-navigation">
      <div className="main-navigation-logo">
        <h1>Events App</h1>
      </div>
      <nav className="main-navigation-items">
        <ul>
          {
            !context.token &&
            <li><NavLink to='/auth'>Login</NavLink></li>
          }
          <li><NavLink to='/events'>Events</NavLink></li>
          {
            context.token &&
            <>
              <li><NavLink to='/bookings'>Bookings</NavLink></li>
              <button onClick={context.logout}>Logout</button>
            </>
          }
        </ul>
      </nav>
    </header>
  )
}
