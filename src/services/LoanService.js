
import Loan from "../models/Loan";
class LoanService {
    getAllLoanPending = async () => {
        const allLoanPending = await Loan.find({status: 'pending'}).populate({path: 'nft', select: '_id tokenID tokenName image valuation'})
        const length = allLoanPending.length;
        return allLoanPending
    }

    getStatistics = async () => {
        const allLoanCompleted = await Loan.find({status: 'completed'})
        const numLoansPending = await Loan.countDocuments({status: 'pending'})
        const numLoansCompleted = await Loan.countDocuments({status: 'completed'})


        const totalAmount = allLoanCompleted.length === 0 ? 0 :
            allLoanCompleted.reduce((acc, loan) => {
                return acc + loan.amount
            })

        const totalInterest = allLoanCompleted.length === 0 ? 0 :
            allLoanCompleted.reduce((acc, loan) => {
                return acc + loan.repayment
            })
        return {
            totalAmount,
            totalInterest,
            numLoansPending,
            numLoansCompleted
        }
    }

    getLoan = async (res,req,next) => {
        id = req.params.id
        const loan = await Loan.findOne({_id: req.params.id}).populate({path: 'nft', select: '_id tokenID tokenName image valuation'})
        return loan
    } 

    createLoan = async (body) => {
        const newLoan = new Loan({
            ...body,
            status: 'pending'
        })
        await newLoan.save()
        return newLoan
    }

    finalizeLoan = async (body) => {
        let loan = await Loan.findOneAndUpdate(
            {
                _id: body.idLoan
            }, 
            {
                status: 'completed',
            }
        )
        return loan;
    }
}

export default new LoanService()