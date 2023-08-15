
import Loan from "../models/Loan";
class LoanService {
    getAllLoanPending = async () => {
        const allLoanPending = await Loan.find({status: 'pending'})
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