
import express from 'express'
import LoanController from '../controllers/LoanController'
import { verifyToken } from '../middlewares' 

const router = express.Router()

router.get('/all', LoanController.getAllLoanPending)
router.get('/statistics', LoanController.getStatistics)

router.post('/create', verifyToken, LoanController.createLoan)
router.post('/start', verifyToken, LoanController.startLoan)

router.post('/finalize', verifyToken, LoanController.finalizeLoan)

router.get('/myLend', verifyToken, LoanController.getMyLend)
router.get('/myBorrow', verifyToken, LoanController.getMyBorrow)

router.get('/:id', LoanController.getLoan)


export default router
