import express from 'express'
import UserController from '../controllers/UserController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/lends', verifyToken, UserController.getMyLend)
router.get('/borrows', verifyToken, UserController.getMyBorrow)
router.get('/offers', verifyToken, UserController.getMyOffer)

export default router
