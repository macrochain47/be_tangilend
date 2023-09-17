import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
    loanID: {
        type: String,
        required: true,
    },
    collateral: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
        required: true,
    },
    defaultOffer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
        required: true,
    },
    acceptedOffer: {
        type: String,   
    },
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    lender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    status: {
        type: String,
        enum: ['pending', 'on-loan', 'overdue', 'completed', 'cancelled', 'forfeited'],
        default: 'pending',
        required: true
    },
}, {
    timestamps: true
})

const Loan = mongoose.model('Loan', loanSchema)
export default Loan