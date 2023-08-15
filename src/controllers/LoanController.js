import LoanService from "../services/LoanService";
import Loan from "../models/Loan";
class LoanController {
    getAllLoanPending = async(req, res, next)  => {
        try {
            res.status(200).json(await LoanService.getAllLoanPending());
        } catch (error) {
            next(error)
        }
    }
    getStatistics = async(req, res, next)  => {
        try {
            res.status(200).json(await LoanService.getStatistics())            
        } catch (error) {
            next(error)
        }
    }

    createLoan = async(req, res, next)  => {
        const {
            evaluation,
            principle,
            apr,
            term,
        } = req.body

        const user = req.user;

        if (evaluation <= 0 || principle <= 0 || apr <= 0 || term <= 0 || repayment <= 0 || !borrower) {
            res.status(400);
            return next(new Error('Invalid request body for create Loan'));
        }
        try {
            const newLoan = await LoanService.createLoan({
                evaluation,
                principle,
                apr,
                term,
                repayment,
                borrower: user._id
            });
            res.status(201).json(newLoan)
        } catch (error) {
            next(error)
            
        }
    }

    finalizeLoan = async(req, res, next)  => {
        const idLoan = req.body.id;
        const loan = Loan.findById(idLoan)

        const user = req.user;
    
        if (!idLoan || !loan || loan.borrower !== user._id) {
            res.status(400);
            return next(new Error('Invalid request body for finalize Loan'));
        }

        if (loan.status != 'on-loan') {
            res.status(400)
            return next(new Error('Loan is not in progress'))
        } 

        try {
            const loan = await LoanService.finalizeLoan(idLoan, user._id);
            res.status(200).json(loan)
        } catch (error) {
            next(error)
        }
    }
}

export default new LoanController()

