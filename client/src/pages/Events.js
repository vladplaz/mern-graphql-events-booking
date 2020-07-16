import React, {useEffect, useState} from 'react'
import './Events.css'
import {Modal} from '../components/Modal'
import AuthContext from '../context/auth-context'
import {EventList} from '../components/EventList'
import {Spinner} from '../components/Spinner'

export const EventsPage = () => {

  const [creating, setCreating] = useState(false)
  const [events, setEvents] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  const [event, setEvent] = useState({
    title: '',
    price: 1,
    date: '',
    description: ''
  })

  const context = React.useContext(AuthContext)

  const fetchEvents = async() => {
    try {
      const requestBody = {
        query: `
            query {
              events {
                _id
                title   
                price    
                description
                date   
                creator {
                  _id     
                }           
              }
            }
      `
      }
      const res = await fetch('http://localhost:5000/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const {data} = await res.json()
      setEvents(data.events)
    } catch(e) {

    }
    setLoading(false)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const changeHandler = ({target: {name, value}}) => {
    setEvent({...event, [name]: value})
  }

  const confirmHandler = async() => {
    setCreating(false)
    const {
      title,
      price,
      date,
      description
    } = event
    if(title.trim() && price > 0 && date.trim() && description.trim()) {
      const requestBody = {
        query: `
          mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
              _id            
            }
          }
      `
      }
      try {
        setLoading(true)
        const token = context.token
        await fetch('http://localhost:5000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        )
        fetchEvents()
      } catch(e) {

      }
    }
    setEvent({
      title: '',
      price: 1,
      date: '',
      description: ''
    })
  }

  const cancelHandler = () => {
    setCreating(false)
    setEvent({
      title: '',
      price: 1,
      date: '',
      description: ''
    })
    setIsOpen(false)
  }

  const showDetailHandler = (id) => {
    setEvent({
      ...events.find(e => e._id === id)
    })
    setIsOpen(true)
  }

  const bookEventHandler = async() => {
    setIsOpen(false)
    if(!context.token) {
      setEvent({
        title: '',
        price: 1,
        date: '',
        description: ''
      })
      return
    }
    const requestBody = {
      query: `
          mutation {
            bookEvent(eventId: "${event._id}") {            
              updatedAt
            }
          }
      `
    }
    try {
      const token = context.token
      await fetch('http://localhost:5000/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )
    } catch(e) {

    }
    setEvent({
      title: '',
      price: 1,
      date: '',
      description: ''
    })
  }

  if(isLoading) {
    return (
      <Spinner/>
    )
  }

  return (
    <>
      {
        context.token &&
        <div className="events-control">
          <p>Share your events</p>
          <button className="btn" onClick={() => setCreating(true)}>Create Event</button>
        </div>
      }
      <EventList events={events} onDetail={showDetailHandler}/>
      {
        creating &&
        <Modal title='Add Event' canCancel canConfirm
               onCancel={cancelHandler}
               onConfirm={confirmHandler}
               confirmText='Create'
        >
          <form className="form-control">
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" name="title"
                     onChange={changeHandler} value={event.title}/>
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" name="price"
                     onChange={changeHandler} value={event.price}/>
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" name="date"
                     onChange={changeHandler} value={event.date}/>
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea type="date" id="description" name="description"
                        rows="4" onChange={changeHandler} value={event.description}>
            </textarea>
            </div>
          </form>
        </Modal>
      }
      {
        isOpen &&
        <Modal title='Add Event' canCancel canConfirm
               onCancel={cancelHandler}
               onConfirm={bookEventHandler}
               confirmText={context.token ? 'Book' : 'Ok'}
        >
          <form className="form-control">
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" disabled id="title"
                     value={event.title}/>
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" disabled id="price"
                     value={event.price}/>
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" disabled id="date"
                     value={event.date}/>
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea disabled type="date"
                        id="description" rows="4"
                        value={event.description}>
            </textarea>
            </div>
          </form>
        </Modal>
      }
    </>
  )
}
