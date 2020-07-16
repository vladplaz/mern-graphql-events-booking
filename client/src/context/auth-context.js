import React from 'react'

const noop = () => {
}

export default React.createContext({
  token: null,
  userId: null,
  login: (token, userId, tokenExpiration) => {},
  logout: noop
})
