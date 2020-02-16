const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../models');

class SessionController {
  static async store(req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    
    if(!user) return res.status(401).json({ message: 'User not found' })

    const compare = await bcrypt.compare(password, user.password_hash)

    if (!compare) return res.status(401).json({ message: 'Incorrect Password' })

    const token = jwt.sign({ id: user.id }, process.env.APP_SECRET)

    return res.status(200).json({ user, token })
  }
}

module.exports = SessionController
