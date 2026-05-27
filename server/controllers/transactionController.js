const Transaction = require("../models/Transaction");

const addTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({
        createdAt: -1,
    });

    res.status(200).json(transactions);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteTransaction = async (req, res) => {
    try {
       const transaction = await Transaction.findByIdAndDelete(req.params.id);

       if(!transaction) {
        return res.status(400).json({
            message: "No transactions to delete",
        })
       }
        res.status(200).json({
            message: "Transaction deleted",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if(!transaction) {
            return res.status(400).json({
                message: "Transaction not found",
            });
        }

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({
            message: error.messagel,
        });
    }
};

module.exports = { 
    addTransaction,
    getTransactions,
    deleteTransaction,
    updateTransaction,
};