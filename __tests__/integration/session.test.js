const request = require('supertest');
const jwt = require('jsonwebtoken');

const app = require('../../src/app');
const { User } = require('../../src/app/models');
const truncate = require('../utils/truncate');

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate()
  })

  it('should authenticate with valid credentials', async () => {
    const user = await User.create({
      name: 'Miqueias Sousa',
      email: 'miqueiassousa80@gmail.com',
      password: 'Qwe123'
    })

    const response = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: user.password })

    expect(response.status).toBe(200)
  })

  it('should not authenticate with invalid credentials', async () => {
    const user = await User.create({
      name: 'Miqueias Sousa',
      email: 'miqueiassousa80@gmail.com',
      password: 'Qwe123'
    })

    const response = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: 'qwe12345' })

    expect(response.status).toBe(401)
  })

  it('should return jwt token when authenticated', async () => {
    const user = await User.create({
      name: 'Miqueias Sousa',
      email: 'miqueiassousa80@gmail.com',
      password: 'Qwe123'
    })

    const response = await request(app)
      .post('/sessions')
      .send({ email: user.email, password: user.password })

    expect(response.body).toHaveProperty('token')
  })

  it('should be able to access private routes when authenticated', async () => {
    const user = await User.create({
      name: 'Miqueias Sousa',
      email: 'miqueiassousa80@gmail.com',
      password: 'Qwe123'
    })
    
    const token = jwt.sign({ id: user.id }, process.env.APP_SECRET)

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
  })

  it('should not be able to access private routes without jwt token', async () => {
    const response = await request(app).get('/dashboard')

    expect(response.status).toBe(401)
  })

  it('should not be able to access private routes with invalid jwt token', async () => {
    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer 12345`)

    expect(response.status).toBe(401)
  })
})
