import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    loan: {
        type: String,
        required: true,
    },
    principal: {
        type: Number,
    },
    apr: {
        type: Number,
    },
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lender: {
        type: String,
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

const Offer = mongoose.model('Offer', OfferSchema)
export default Loan