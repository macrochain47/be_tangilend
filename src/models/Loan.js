import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
    evaluation: {
        type: Number,
        required: true,
    },
    principal: {
        type: Number,
        required: true,
    },
    apr: {
        type: Number,
        required: true,
    },
    term: {
        type: Number,
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