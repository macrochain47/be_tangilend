import LoanService from "../services/LoanService";
import Loan from "../models/Loan";
import NFT from "../models/NFT";
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
            nftID,
            loanID,
            valuation,
            principal,
            principalType,
            principalAddress,
            apr,
            duration,
            durationType,
            repayment
        } = req.body
        
        const user = req.user;
        console.log(user)
        if (!valuation || !principal || !apr || !duration){
            res.status(400);
            return next(new Error('Invalid request body for create Loan'));
        }
        if (valuation <= 0 || principal <= 0 || apr <= 0 || duration <= 0) {
            res.status(400);
            return next(new Error('Invalid request body for create Loan'));
        }

        try {
            const nft = await NFT.findOneAndUpdate({
                _id:  nftID,
            },{
                status: 'listing',
            })

            const newLoan = new Loan({
                nft: nftID,
                loanID,
                valuation,
                principal,
                principalType,
                principalAddress,
                apr,
                duration,
                durationType,
                repayment,
                borrower: user.id,
                status: 'pending'
            })

            await newLoan.populate({path: 'nft', select: '_id tokenID tokenName image valuation'})
            await newLoan.save()

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
        
        if (!idLoan || !user) {
            res.status(400);
            return next(new Error('Invalid request body for start Loan'));
        }

        const loan = await Loan.findOne({loanID: idLoan})
        res.status(200).json(loan)
        
        if (loan.status != "pending") {
            res.status(400)
            return next(new Error('Loan is not pending'))
        }
        else {
            try {
                let loan = await Loan.findOneAndUpdate(
                    {
                        loanID: idLoan
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
            const myLoan = await Loan.find({lender: user.id, status:'on-loan'}).populate({path: 'nft', select: '_id tokenID tokenName image valuation'})
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
            const myLoan = await Loan.find({borrower: user.id}).populate({path: 'nft', select: '_id tokenID tokenName image valuation'})
            res.status(200).json(myLoan);
        } catch (error) {
            next(error)
        }
    }
    
    getLoan = async (req,res,next) => {
        // id = req.params
        console.log(req.params)
        const loan = await Loan.findOne({_id: req.params.id}).populate({path: 'nft', select: '_id tokenID tokenName image valuation'})
        res.status(200).json(loan);
    } 
}

export default new LoanController()

