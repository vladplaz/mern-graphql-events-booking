const Event = require('../../models/Event')
const User = require('../../models/User')

module.exports = {
  events: async() => {
    return await Event.find().populate('creator')
  },
  createEvent: async({eventInput: {title, price, description, date}}, req) => {
    if(!req.isAuth) {
      throw new Error('Not auth')
    }
    const event = new Event({
      title,
      price,
      description,
      creator: req.userId,
      date
    })
    await event.save()
    const user = await User.findById(req.userId)
    user.createdEvents.push(event)
    await user.save()
    return event
  }
}
