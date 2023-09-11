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
            valuation,
            principal,
            apr,
            duration,
        } = req.body
        
        const user = req.user;
        console.log(user)
        if (valuation <= 0 || principal <= 0 || apr <= 0 || duration <= 0) {
            res.status(400);
            return next(new Error('Invalid request body for create Loan'));
        }

        try {
            const newLoan = new Loan({
                valuation,
                principal,
                apr,
                duration,
                repayment: principal * (1 + apr / 100 * duration / 365),
                borrower: user.id,
                status: 'pending'
            })
            newLoan.save()

            res.status(201).json(newLoan)
        } catch (error) {
            next(error)
        }
    }

    finalizeLoan = async(req, res, next)  => {
        const idLoan = req.body.id;
        const loan = await Loan.findById(idLoan)

        const user = req.user;

        console.log(idLoan, loan.borrower._id.toString(), user.id)
    
        if (!idLoan || !loan || loan.borrower._id.toString() !== user.id) {
            res.status(400);
            return next(new Error('Invalid request body for finalize Loan'));
        }

        if (loan.status != 'on-loan') {
            res.status(400)
            return next(new Error('Loan is not in progress'))
        } 

        try {
            const loan = await LoanService.finalizeLoan(idLoan, user._id);
            res.status(201).json(loan)

        } catch (error) {
            next(error)
        }
    }

    startLoan = async(req, res, next) => {
        const idLoan = req.body.id;
        const user = req.user;
        console.log(idLoan, user)
        
        if (!idLoan || !user) {
            res.status(400);
            return next(new Error('Invalid request body for start Loan'));
        }
        const loan = await Loan.findById(idLoan)

        console.log(loan)
        if (loan.status != "pending") {
            res.status(400)
            return next(new Error('Loan is not pending'))
        }
        else {
            try {
                let loan = await Loan.findOneAndUpdate(
                    {
                        _id: idLoan
                    }, 
                    {
                        status: 'on-loan',
                        lender: user.id
                    }
                )
                res.status(200).json(loan)
            } catch (error) {
                next(error)
            }
        }
    }

    getMyLend = async(req, res,next) => {
        const user = req.user;

        if (!user) {
            res.status(400);
            return next(new Error('Invalid request body for get my Loan'));
        }

        try {
            const myLoan = await Loan.find({lender: user.id})
            res.status(200).json(myLoan);
        } catch (error) {
            next(error)
        }
    }

    getMyBorrow = async(req, res,next) => {
        const user = req.user;

        if (!user) {
            res.status(400);
            return next(new Error('Invalid request body for get my Loan'));
        }

        try {
            const myLoan = await Loan.find({borrower: user.id})
            res.status(200).json(myLoan);
        } catch (error) {
            next(error)
        }
    }
}

export default new LoanController()

