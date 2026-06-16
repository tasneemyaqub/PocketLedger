const Transaction = require("../models/transaction");

const addTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create({
            ...req.body,
            user: req.user._id
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
        user: req.user._id
    }).sort({
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
        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id,
            },
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
            message: error.message,
        });
    }
};

module.exports = { 
    addTransaction,
    getTransactions,
    deleteTransaction,
    updateTransaction,
};
