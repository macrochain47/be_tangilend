import Loan from "../models/Loan.js";
import Offer from "../models/Offer.js";
class UserController {
    // [GET] /api/users/lends
    getMyLend = async(req, res,next) => {
        const user = req.user;

        if (!user) {
            res.status(400);
            return next(new Error('Invalid request body for get my Loan'));
        }

        try {
            const myLoan = await Loan.find({lender: user.id})
                .populate({path: 'asset', select: '_id tokenID uri tokenName image valuation'})
                .populate({path: 'defaultOffer', select: '_id principal principalType principalAddress apr duration durationType repayment status'})
                .populate({path: 'acceptedOffer', select: '_id principal principalType principalAddress apr duration durationType repayment status'})
            res.status(200).json(myLoan);
        } catch (error) {
            next(error)
        }
    }


    // [GET] /api/users/borrow
    getMyBorrow = async(req, res,next) => {
        const user = req.user;

        if (!user) {
            res.status(400);
            return next(new Error('Invalid request body for get my Loan'));
        }

        try {
            const myLoan = await Loan.find({borrower: user.id})
                .populate({path: 'asset', select: '_id tokenID uri tokenName image valuation'})
                .populate({path: 'defaultOffer', select: '_id principal principalType principalAddress apr duration durationType repayment status'})
                .populate({path: 'acceptedOffer', select: '_id principal principalType principalAddress apr duration durationType repayment status'})
                res.status(200).json(myLoan);
        } catch (error) {
            next(error)
        }
    }

    getMyOffer = async (req, res, next) => {
        const user = req.user;
        if (!user) {
            res.status(400);
            return next(new Error('Invalid request body for get my Loan'));
        }
        try {
            const myOffer = await Offer.find({
                lender: user.id,
            }).populate({path: "loan", select: "_id principal principalType principalAddress apr duration durationType repayment status", populate: {path: "nft", select: "_id tokenID tokenName image valuation"}})
            res.status(200).json(myOffer);
        } catch (error) {
            
        }
    }
}

export default new UserController()