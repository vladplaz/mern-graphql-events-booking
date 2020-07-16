const Event = require('../../models/Event')
const Bookings = require('../../models/Booking')

module.exports = {
  bookings: async(args, req) => {
    return await Bookings.find(
      {user: req.userId},
      null,
      {sort: {createdAt: 1}}
    )
      .populate('user').populate('event')
  },
  bookEvent: async({eventId}, req) => {
    if(!req.isAuth) {
      throw new Error('Not auth')
    }
    const event = await Event.findById(eventId)
    const booking = new Bookings({
      user: req.userId,
      event
    })
    await booking.save()
    return booking
  },
  cancelBooking: async({bookingId}, req) => {
    if(!req.isAuth) {
      throw new Error('Not auth')
    }
    const booking = await Bookings.findById(bookingId).populate('event')
    const event = booking.event
    await Bookings.deleteOne({_id: bookingId})
    return event
  }
}
