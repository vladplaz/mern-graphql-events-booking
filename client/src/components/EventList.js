import React from 'react'
import './EventList.css'
import {EventItem} from './EventItem'

export const EventList = ({events, onDetail}) => {

  return (
    <section className="events-list">
      <ul className="events-list">
        {
          events.map(event => <EventItem key={event._id}
                                         event={event}
                                         onDetail={onDetail}/>)
        }
      </ul>
    </section>
  )
}
