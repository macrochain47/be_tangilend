
import express from 'express'
import LoanController from '../controllers/LoanController'
import { verifyToken } from '../middlewares' 

const router = express.Router()

router.get('/all', LoanController.getAllLoanPending)
router.get('/statistics', LoanController.getStatistics)

router.post('/create', verifyToken, LoanController.createLoan)
router.post('/finalizeLoan', verifyToken, LoanController.finalizeLoan)

export default router
