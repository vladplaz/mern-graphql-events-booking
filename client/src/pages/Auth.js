import React, {useState} from 'react'
import './Auth.css'
import AuthContext from '../context/auth-context'

export const AuthPage = () => {

  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  const context = React.useContext(AuthContext)

  const [isLogin, setType] = useState(true)

  const changeHandler = ({target: {name, value}}) => {
    setUser({...user, [name]: value})
  }

  const changeType = () => {
    setType(!isLogin)
  }

  const submitHandler = async(e) => {
    e.preventDefault()
    if(!user.email.trim() || !user.password.trim()) {
      return
    }
    let requestBody

    if(isLogin) {
      requestBody = {
        query: `
        query{
          login(email:"${user.email}", password:"${user.password}"){
            userId
            token
            tokenExpiration
          }
        }
      `
      }
    } else {
      requestBody = {
        query: `
        mutation{
          createUser(userInput:{email:"${user.email}", password:"${user.password}"}){
            _id
            email
          }
        }
      `
      }
    }

    try {
      const res = await fetch('http://localhost:5000/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const data = await res.json()
      if(data.data.login.token) {
        context.login(
          data.data.login.token,
          data.data.login.userId,
          data.data.login.tokenExpiration
        )
      }
    } catch(e) {

    }
  }

  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <div className="form-control">
        <label htmlFor="email">Email</label>
        <input type="text" id="email" onChange={changeHandler}
               name="email" value={user.email}/>
      </div>
      <div className="form-control">
        <label htmlFor="email">Password</label>
        <input type="text" id="password" onChange={changeHandler}
               name="password" value={user.password}/>
      </div>
      <div className="form-actions">
        <button type="submit">Sign {isLogin ? 'In' : 'Up'}</button>
        <button type="button" onClick={changeType}>
          Switch to {isLogin ? 'Sign Up' : 'Sing In'}
        </button>
      </div>
    </form>
  )
}
