import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    loan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan",
        required: true,
    },
    type: {
        type: String,
        enum: ['loan', 'extend'],
        default: 'loan',
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
    lender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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

const Offer = mongoose.model('Offer', OfferSchema)
export default Offer