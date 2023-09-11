
import express from 'express'
import LoanController from '../controllers/LoanController'
import { verifyToken } from '../middlewares' 

const router = express.Router()

router.get('/all', LoanController.getAllLoanPending)
router.get('/statistics', LoanController.getStatistics)

router.post('/create', verifyToken, LoanController.createLoan)
router.post('/startLoan', verifyToken, LoanController.startLoan)

router.post('/finalizeLoan', verifyToken, LoanController.finalizeLoan)

router.get('/myLend', verifyToken, LoanController.getMyLend)
router.get('/myBorrow', verifyToken, LoanController.getMyBorrow)

export default router
