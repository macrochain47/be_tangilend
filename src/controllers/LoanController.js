import Loan from "../models/Loan.js";
import Offer from "../models/Offer.js";
import Asset from "../models/Asset.js"

class LoanController {
    getAllLoanPending = async(req, res, next)  => {
        try {
            const allLoanPending = await Loan.find({status: 'pending'}).populate({path: 'nft', select: '_id tokenID tokenName image valuation'})
            res.status(200).json(allLoanPending);

        } catch (error) {
            next(error)
        }
    }
    getLoan = async (req,res,next) => {
        try {
            const loan = await Loan
                .findOne({_id: req.params.id})
                .populate({path: 'nft', select: '_id tokenID tokenName image valuation'})
    
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
        if (!idLoan) {
            res.status(400);
            return next(new Error('Invalid request body for get Offer'));
        }
        try {
            const offers = Offer.find({loanID: idLoan})
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
        const collateral = Asset.findOne({_id: collateralID})
        
        if (collateral.status != 'default') {
            res.status(400);
            return next(new Error('Collateral is not default'));
        }
        

        try {
            await Asset.findOneAndUpdate({
                _id:  collateralID,
            },{
                status: 'listing',
            })

            const newOffer = new Offer({
                loanID,
                principal,
                principalType,
                principalAddress,
                apr,
                duration,
                durationType,
                repayment,
            })
            await newOffer.save()

            const newLoan = new Loan({
                loanID: loanID,
                collateral: collateralID,
                defaultOffer: newOffer._id,
                borrower: user.id,
                status: 'pending',
            })  
            await newLoan.save()
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
            principal,
            principalType,
            principalAddress,
            apr,
            duration,
            durationType,
            repayment
        } = req.body;

        const user = req.user;
        
        if (!user || !loanID || !principal || !apt || !duration || principal <= 0 || apt <= 0 || duration <= 0) {
            res.status(400);
            return next(new Error("Invalid request body for create Offer"));
        }
        const loan = Loan.findOne({loanID: loanID})

        if (!loan || loan.status != 'pending') {
            res.status(400);
            return next(new Error("Loan is not pending"));
        }

        try {
            const newOffer = new Offer({
                loanID,
                principal,
                principalType,
                principalAddress,
                apr,
                duration,
                durationType,
                repayment,
                lender: user.id,
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
        const offer = Offer.findById(offerID);

        if (!loanID || !offerID || !user || offer.loan != loanID) {
            res.status(400);
            return next(new Error('Invalid request body for start Loan'));
        }

        if (offer.status != 'pending') {
            res.status(400);
            return next(new Error('Offer is not pending'));
        }

        try {
            const updatedOffer = await Offer.findByIdAndUpdate(offerID, {status: 'accepted'})
            const updatedLoan = await Loan.findByIdAndUpdate(loanID, {acceptedOffer: offerID, status: 'on-loan', lender: user.id})

            res.status(201).json(updatedLoan)
        } catch (error) {
            next(error)
        }
    } 
    repayLoan = async(req, res, next)  => {
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
            const loan = await Loan.findOneAndUpdate(
                {
                    _id: body.idLoan
                }, 
                {
                    status: 'completed',
                }
            )
            
            await Asset.findOneAndUpdate(
                {
                    _id: loan.collateral
                },
                {
                    status: 'default'
                }

            )

            res.status(201).json(loan)
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
    
    