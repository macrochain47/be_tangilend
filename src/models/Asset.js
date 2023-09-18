import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
    tokenID: {
        type: Number,
        required: true,
    },
    uri: {
        type: String,
        required: true,
    },
    tokenName: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image: {
        type: String,
        required: true,
    }, 
    valuation: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['not-activated','default', 'listing', 'on-loan'],
    },
    signatura: {
        type: String,
    }
}, {
    timestamps: true
})

const Asset = mongoose.model('Asset', assetSchema)
export default Asset