import React, {useState} from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import {AuthPage} from './pages/Auth'
import {EventsPage} from './pages/Events'
import {BookingsPage} from './pages/Bookings'
import {Navbar} from './components/Navbar'
import './App.css'
import AuthContext from './context/auth-context'

function App() {

  const [user, setUser] = useState({
    token: null,
    userId: null
  })

  const login = (token, userId, tokenExpiration) => {
    setUser({token, userId})
  }

  const logout = () => {
    setUser({token: null, userId: null})
  }

  return (
    <Router>
      <>
        <AuthContext.Provider value={{
          token: user.token,
          userId: user.userId,
          login,
          logout
        }}>
          <Navbar/>
          <main className="main-content">
            <Switch>
              {
                !user.token &&
                <Redirect from='/' to='/auth' exact/>
              }
              {
                user.token &&
                <Redirect from='/' to='/events' exact/>
              }
              {
                !user.token &&
                <Route path='/auth' component={AuthPage}/>
              }
              <Route path='/events' component={EventsPage}/>
              {
                user.token &&
                <Route path='/bookings' component={BookingsPage}/>
              }
              <Redirect to='/'/>
            </Switch>
          </main>
        </AuthContext.Provider>
      </>
    </Router>
  )
}

export default App
