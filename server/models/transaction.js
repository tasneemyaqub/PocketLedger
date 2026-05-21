const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },

    transactionType: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },

    category: {
        type: String,
        required: true
    },

    note: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now()
    }
},
{
    timestamps: true,
});

module.exports = mongoose.model("Transaction", transactionSchema);