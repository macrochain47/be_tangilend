import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    address: {type: String, required: true},
    
    inProgress: {type: Number, require: true, default: 0},
    completed: {type: Number, require: true, default: 0},

    totalBorrowed: {type: Number, require: true, default: 0},
    totalRepaid: {type: Number, require: true, default: 0},

    totalLended: {type: Number, require: true, default: 0},
    totalInterested: {type: Number, require: true, default: 0},
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)
export default User