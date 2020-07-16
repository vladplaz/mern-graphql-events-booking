import React, {useEffect} from 'react'
import {Spinner} from '../components/Spinner'
import AuthContext from '../context/auth-context'
import {BookingList} from '../components/BookingList'

const {useState} = require('react')

export const BookingsPage = () => {

  const [isLoading, setLoading] = useState(true)
  const [bookings, setBookings] = useState([])

  const context = React.useContext(AuthContext)

  const fetchBookings = async() => {
    try {
      const requestBody = {
        query: `
            query {
              bookings {
                  _id
                  createdAt
                  event {
                    _id
                    title
                    date
                  }
              }
            }
      `
      }
      const token = context.token
      const res = await fetch('http://localhost:5000/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )
      const {data} = await res.json()
      setBookings(data.bookings)
    } catch(e) {

    }
    setLoading(false)
  }

  const deleteHandler = async (id) => {
    try {
      setLoading(true)
      const requestBody = {
        query: `
            mutation {
              cancelBooking(bookingId: "${id}") {
                  _id
                  title
              }
            }
      `
      }
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
      fetchBookings()
    } catch(e) {

    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  if(isLoading) {
    return <Spinner/>
  }

  return (
    <BookingList onDelete={deleteHandler} bookings={bookings}/>
  )
}
