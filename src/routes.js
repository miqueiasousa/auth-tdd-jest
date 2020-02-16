const { Router } = require('express');

const authMiddleware = require('./app/middleware/auth');

const SessionController = require('./app/controllers/SessionController');

const router = Router()

router.post('/sessions', SessionController.store)

router.use(authMiddleware)

router.get('/dashboard', (req, res) => res.status(200).send())

module.exports = router
