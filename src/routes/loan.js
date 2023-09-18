
import express from 'express'
import LoanController from '../controllers/LoanController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/all', LoanController.getAllLoanPending)
router.get('/statistics', LoanController.getStatistics)
router.get('/offers/:id', LoanController.getOfferOfLoan)

router.post('/create', verifyToken, LoanController.createLoan)
router.post('/start-lend', verifyToken, LoanController.startLending)
router.post('/make-offer', verifyToken, LoanController.makeOffer) 
router.post('/start-borrow', verifyToken, LoanController.startBorrowing)
router.post('/repay', verifyToken, LoanController.repayLoan)
router.post('/cancel', verifyToken, LoanController.cancelLoan)
router.post('/forfeit', verifyToken, LoanController.forfeit)
router.post('/cancel-offer', verifyToken, LoanController.withdrawOffer)

router.get('/:id', LoanController.getLoan)


export default router
