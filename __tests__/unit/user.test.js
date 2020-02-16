const bcrypt = require('bcryptjs');

const { User } = require('../../src/app/models');
const truncate = require('../utils/truncate');

describe('User', () => {
  beforeEach(async () => {
    await truncate()
  })

  it('should encrypt user password', async () => {
    const user = await User.create({
      name: 'Miqueias Sousa',
      email: 'miqueiassousa80@gmail.com',
      password: 'Qwe123'
    })

    const compare = await bcrypt.compare(user.password, user.password_hash)

    expect(compare).toBe(true)
  })
})
