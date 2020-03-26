const request = require('supertest');

const app = require('../../src/app');
const truncate = require('../utils/truncate');

const user = {
  name: 'Fulano de Tal',
  email: 'fulano@gmail.com',
  password: 'Qwe123'
}

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate()
  })

  it('should register new user and return jwt token', async () => {
    const response = await request(app)
      .post('/sessions')
      .send(user)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })

  it('should not register new user if email has been already used', async () => {
    await request(app).post('/sessions').send(user)

    const response = await request(app)
      .post('/sessions')
      .send(user)

    expect(response.status).toBe(409)
  })

  it('should be able to access private routes when authenticated', async () => {
    const { body } = await request(app)
      .post('/sessions')
      .send(user)

    const response = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${body.token}`)

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
