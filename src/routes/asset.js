
import express from 'express'
import AssetController from '../controllers/AssetController.js'
import { verifyToken } from '../middlewares/index.js'

const router = express.Router()

router.get('/my', verifyToken, AssetController.getAssets)
router.post('/grant', verifyToken, AssetController.grantAsset)
router.post('/add', verifyToken, AssetController.addAsset)
router.post('/mint', verifyToken, AssetController.mintAsset)

export default router
