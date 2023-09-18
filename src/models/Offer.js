import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
    loan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan",
    },
    offerID: {
        type: String,
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
    lender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'cancelled'],
        default: 'pending',
        required: true
    },
}, {
    timestamps: true
})

const Offer = mongoose.model('Offer', offerSchema)
export default Offer