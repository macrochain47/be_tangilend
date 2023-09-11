
import express from 'express'
import NFTController from '../controllers/NFTController'
import { verifyToken } from '../middlewares'

const router = express.Router()

router.post('/add', verifyToken, NFTController.addNFT)
router.get('/my', verifyToken, NFTController.getNFTs)

export default router
