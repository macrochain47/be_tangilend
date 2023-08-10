
import express from 'express'
import authController from '../controllers/AuthController.js'
import { validate_login } from '../middlewares/index.js'

const router = express.Router()

router.post('/login', validate_login, authController.login)
router.get('/token', authController.reGenerateToken)

export default router