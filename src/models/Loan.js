import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
    nft: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NFT",
        required: true,
    },
    loanID: {
        type: String,
        required: true,
    },
    valuation: {
        type: Number,
        required: true,
    },
    principal: {
        type: Number,
        required: true,
    },
    principalType: {
        type: String,
        required: true,
    },
    principalAddress: {
        type: String,
        required: true,
    },
    apr: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    durationType: {
        type: String,
        required: true,
    },
    repayment: {
        type: Number,
        required: true,
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
        enum: ['pending', 'on-loan', 'overdue', 'completed', 'cancelled'],
        default: 'pending',
        required: true
    },
}, {
    timestamps: true
})

const Loan = mongoose.model('Loan', loanSchema)
export default Loan