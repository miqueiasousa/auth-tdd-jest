const jwt = require('jsonwebtoken');

const { User } = require('../models');

class SessionController {
  static async store(req, res) {
    const { name, email, password } = req.body

    const userIsRegistered = await User.findOne({ where: { email } })
    
    if(userIsRegistered) 
      return res.status(409).json({ message: 'user already has been registered' })

    const user = User.create({ name, email, password })

    const token = jwt.sign({ id: user.id }, process.env.APP_SECRET)

    return res.status(200).json({ user, token })
  }
}

module.exports = SessionController
