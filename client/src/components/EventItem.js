import React from 'react'
import './EventItem.css'
import AuthContext from '../context/auth-context'

export const EventItem = ({event, onDetail}) => {

  const context = React.useContext(AuthContext)

  return (
    <li className="events-list-item">
      <div>
        <h1>{event.title}</h1>
        <h2>${event.price}</h2>
      </div>
      <div>
        {
          context.userId === event.creator._id
            ? <p>You are the owner of this</p>
            : <button className="btn"
                      onClick={() => onDetail(event._id)}
            >View Details</button>
        }
      </div>
    </li>
  )
}
