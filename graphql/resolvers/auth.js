const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../../keys')

module.exports = {
  users: async() => {
    return await User.find().populate('createdEvents')
  },
  createUser: async({userInput: {email, password}}) => {
    const candidate = await User.findOne({email})
    if(candidate) {
      throw new Error('User exists')
    }
    const salt = await bcrypt.genSalt(6)
    const hash = await bcrypt.hash(password, salt)
    const user = new User({
      email,
      password: hash
    })
    await user.save()
    return user
  },
  login: async({email, password}) => {
    const user = await User.findOne({email})
    if(!user) {
      throw new Error('User not found')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
      throw new Error('Incorrect password')
    }
    const token = jwt.sign({
      userId: user._id,
      email: user.email
    }, JWT_SECRET, {
      expiresIn: '1h'
    })
    return {
      userId: user._id,
      token,
      tokenExpiration: 1
    }
  }
}
