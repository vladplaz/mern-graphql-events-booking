import React from 'react'
import './EventList.css'

export const BookingList = ({bookings,onDelete}) => {

  return (
    <ul className="bookings-list">
      {
        bookings.map(book => {
          return (
            <li className="bookings-item" key={book._id}>
              <div className="bookings-item-data">
                {book.event.title}
              </div>
              <div className="bookings-item-actions">
                <button className="btn"
                onClick={()=>onDelete(book._id)}
                >Cancel</button>
              </div>
            </li>
          )
        })
      }
    </ul>
  )
}
