import userService from "../services/UserService.js";
import Loan from "../models/Loan.js";
class UserController {
    // [GET] /api/users/lends
    getMyLend = async (req, res, next) => {
        const {
            status
        } = req.query;

        try {
            const myLend = await Loan.find({lender: req.user.id});
            res.status(200).json(myLend);
        } catch (error) {
            next(error)
        }
    }

    // [GET] /api/users/borrow
    getMyBorrow = async (req, res, next) => {
        try {
            const myBorrow = await Loan.find({borrower: req.user.id});
            res.status(200).json(myBorrow);
        } catch (error) {
            next(error)
        }
    }

    // getInfoUser = async (req, res, next) => {
    //     try {
    //         const lendsInProgress = await Loan.find({lender: req.user.id, status: ["pending", "on-loan", "overdue"]});
    //         const lendsCompleted = await Loan.find({lender: req.user.id, status: "completed"});
            
    //         const borrowsPending = await Loan.find({borrower: req.user.id, status: ["on-loan", "pending"]});
    //         const borrowsCompleted = await Loan.find({borrower: req.user.id, status: "completed"});


    //         const totalLendInProgress = lendsInProgress.reduce((total, lend) => total + lend.amount, 0) + lendsCompleted.reduce((total, lend) => total + lend.amount, 0);
            
            
            
    //         const totalBorrow = borrowsPending.length + borrowsCompleted.length;
    //     } catch (error) {
    //         next(error)
    //     }
    // }



}

export default new UserController(userService)