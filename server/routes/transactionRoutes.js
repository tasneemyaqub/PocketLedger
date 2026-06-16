const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    addTransaction,
    getTransactions,
    deleteTransaction,
    updateTransaction,
} = require("../controllers/transactionController");

router.get("/", protect, getTransactions);
router.post("/", protect, addTransaction);
router.delete("/:id", protect, deleteTransaction);
router.put("/:id", protect, updateTransaction);

module.exports = router; 
