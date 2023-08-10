import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
    collateral: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loan',
        required: true,
    },    
    apr: {
        type: Number,
    },
    borrower: {
        type: String,
        required: true,
    },
    term: {
        type: Number,
        required: true,
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['loan', 'extend'],
        default: 'lend',
    },
    status: {
        type: String,
        enum: ['pending', 'accepted'],
        default: 'pending',
        required: true
    },
}, {
    timestamps: true
})

const Loan = mongoose.model('Loan', loanSchema)
export default Loan