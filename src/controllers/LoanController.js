import Loan from "../models/Loan.js";
import Offer from "../models/Offer.js";
import Asset from "../models/Asset.js"

class LoanController {
    getAllLoanPending = async(req, res, next)  => {
        try {
            const allLoanPending = await Loan.find({status: 'pending'})
                .populate({path: 'asset', select: '_id tokenID tokenName image valuation'})
                .populate({path: 'defaultOffer', select: '_id principal principalType principalAddress apr duration durationType repayment lender status'})
            res.status(200).json(allLoanPending);

        } catch (error) {
            next(error)
        }
    }
    getLoan = async (req,res,next) => {
        try {
            const loan = await Loan
                .findOne({_id: req.params.id})
                .populate({path: 'asset', select: '_id tokenID uri tokenName user image valuation'})
                .populate({path: 'defaultOffer', select: '_id principal principalType principalAddress apr duration durationType repayment lender status'})
                .populate({path: 'borrower' , select: '_id address'})
    
            res.status(200).json(loan);
        } catch (error) {
            next(error)            
        }
    } 
    getStatistics = async(req, res, next)  => {
        try {
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
            res.status(200).json({
                totalAmount,
                totalInterest,
                numLoansPending,
                numLoansCompleted
            })            
        } catch (error) {
            next(error)
        }
    }
    getOfferOfLoan = async (req, res, next) => {
        const idLoan = req.params.id;
        console.log(idLoan)
        if (!idLoan) {
            res.status(400);
            return next(new Error('Invalid request body for get Offer'));
        }
        try {
            const offers = await Offer.find({loan: idLoan})
                .populate({path:'lender', select: '_id address'})
            res.status(200).json(offers)
        } catch (error) {
            next(error)
        }
    }
    // --------------------------- //

    createLoan = async(req, res, next)  => {
        const {
            collateralID,
            loanID,
            principal,
            principalType,
            principalAddress,
            apr,
            duration,
            durationType,
            repayment
        } = req.body
        
        const user = req.user;
        if (!principal || !apr || !duration || principal <= 0 || apr <= 0 || duration <= 0){
            res.status(400);
            return next(new Error('Invalid request body for create Loan'));
        }
   
        try {
            const collateral = await Asset.findById(collateralID)
        
            
            if (collateral.status != 'default') {
                res.status(400);
                return next(new Error('Collateral is not default'));
            }
            

            const newOffer = new Offer({
                principal,
                principalType,
                principalAddress,
                apr,
                duration,
                durationType,
                repayment,
                lender: user.id,
                status: 'pending'
            })
            await newOffer.save()

            const newLoan = new Loan({
                loanID: loanID,
                asset: collateralID,
                defaultOffer: newOffer._id,
                borrower: user.id,
                status: 'pending',
            })  
            await newLoan.save()

            await Asset.findByIdAndUpdate( collateralID
            ,{
                status: 'listing',
            })
    
            res.status(201).json(newLoan)
        } catch (error) {
            next(error)
        }
    }
    startLending = async(req, res, next) => {
        const idLoan = req.body.id;
        const user = req.user;
        
        if (!idLoan || !user ) {
            res.status(400);
            return next(new Error('Invalid request body for start Loan'));
        }
        const loan = await Loan.findOne({loanID: idLoan})
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
                    },
                    {
                        new: true
                    }
                )
                await Asset.findByIdAndUpdate(loan.collateral, {status: 'on-loan'})
                res.status(200).json(loan)
            } catch (error) {
                next(error)
            }
        }
    }
    makeOffer = async (req, res, next) => {
        const {  
            loanID,
            offerID,
            principal,
            principalType,
            principalAddress,
            apr,
            duration,
            durationType,
            repayment
        } = req.body;

        const user = req.user;
        
        if (!user || !offerID || !loanID || !principal || !apr || !duration || principal <= 0 || apr <= 0 || duration <= 0) {
            res.status(400);
            return next(new Error("Invalid request body for create Offer"));
        }

        try {
            
            const loan = await Loan.findById(loanID)

            if (!loan || loan.status != 'pending') {
                res.status(400);
                return next(new Error("Loan is not pending"));
            }

            const newOffer = new Offer({
                loan: loanID,
                offerID: offerID,
                principal,
                principalType,
                principalAddress,
                apr,
                duration,
                durationType,
                repayment,
                lender: user.id,
                status: 'pending'
            })
            await newOffer.save()
            res.status(201).json(newOffer)
        } catch (error) {
            next(error)            
        }
    }
    startBorrowing = async (req, res, next) => {
        const {loanID, offerID} = req.body;
        const user =  req.user;
        
        if (!loanID || !offerID || !user) {
            res.status(400);
            return next(new Error('Invalid request body for start Loan'));
        }
        
        try {
            const offer = await Offer.findById(offerID);

            console.log(offer)

            if (offer.loan != loanID) {
                res.status(400);
                return next(new Error('Offer does not match loan'))
            }
            if (offer.status != 'pending') {
                res.status(400);
                return next(new Error('Offer is not pending'));
            }

            const updatedOffer = await Offer.findByIdAndUpdate(offerID, {status: 'accepted'}, {new: true})
            const updatedLoan = await Loan.findByIdAndUpdate(loanID, {acceptedOffer: offerID, status: 'on-loan', lender: user.id})

            res.status(201).json(updatedLoan)
        } catch (error) {
            next(error)
        }
    } 
    repayLoan = async(req, res, next)  => {
        const {id} = req.body;

        console.log(id)
        try {
            const loan = await Loan.findById(id)
            

            const user = req.user;
            
            console.log(loan.borrower == user.id)
            if (!id || !loan || loan.borrower != user.id) {
                res.status(400);
                return next(new Error('Invalid request body for finalize Loan'));
            }

            if (loan.status != 'on-loan') {
                res.status(400)
                return next(new Error('Loan is not in progress'))
            } 

            const newLoan = await Loan.findByIdAndUpdate(
                id, 
                {
                    status: 'completed',
                }
            )
            
            await Asset.findByIdAndUpdate(
                loan.asset,
                {
                    status: 'default'
                }
            )
            res.status(201).json(newLoan)
        } catch (error) {
            next(error)
        }
    }
    cancelLoan = async(req, res, next)  => {
        const idLoan = req.body.id;
        const loan = await Loan.findById(idLoan)

        const user = req.user;
    
        if (!idLoan || !loan || loan.borrower._id.toString() !== user.id) {
            res.status(400);
            return next(new Error('Invalid request body for finalize Loan'));
        }

        if (loan.status != 'pending') {
            res.status(400)
            return next(new Error('Loan is not in progress'))
        } 

        try {
            const loan = await Loan.findByIdAndUpdate(idLoan, {status: 'cancelled'})
            res.status(201).json(loan)
        } catch (error) {
            next(error)
        }
    }
    forfeit = async (req, res, next) => {
        const idLoan = req.body.id;
        const loan = await Loan.findById(idLoan)

        const user = req.user;
        
        if (!idLoan || !loan || loan.borrower._id.toString() !== user.id) {
            res.status(400);
            return next(new Error('Invalid request body for finalize Loan'));
        }

        if (loan.status != 'on-loan') {
            res.status(400)
            return next(new Error('Loan is not in progress'))
        } 

        try {
            const loan = await Loan.findByIdAndUpdate(idLoan, {status: 'forfeited'})
            await Asset.findOneAndUpdate(
                { _id: loan.collateral },
                { status: 'default', user: user.id}
            )
            res.status(201).json(loan)
        } catch (error) {
            next(error)
        }
    }
    withdrawOffer = async (req, res, next) => {
        const offerID = req.body.id;
        const user = req.user;
        
        if (!offerID || !offer) {
            res.status(400);
            return next(new Error('Invalid request body for withdraw Offer'));
        }
        const offer = await Offer.findById(offerID)

        if (offer.lender !== user.id) {
            res.status(400);
            return next(new Error('User is not lender'))
        }

        if (offer.status != 'pending') {
            res.status(400)
            return next(new Error('Offer is not pending'))
        }   

        try {
            const offer = await Offer.findByIdAndUpdate(offerID, {status: 'cancelled'})
            res.status(201).json(offer)
        } catch (error) {
            next(error)
        }     
    }
}

    
export default new LoanController()
    
    