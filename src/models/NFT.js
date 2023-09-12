import mongoose from "mongoose";

const NFTSchema = new mongoose.Schema({
    tokenID: {
        type: Number,
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
        enum: ['default', 'listing', 'on-loan'],
    }
}, {
    timestamps: true
})

const NFT = mongoose.model('NFT', NFTSchema)
export default NFT