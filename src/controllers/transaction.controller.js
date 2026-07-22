

import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import Ledger from "../models/ledger.model.js";
import emailService from '../services/email.service.js'
import Account from "../models/account.model.js";
import { User } from "../models/user.model.js";
/**
 * ============================================
 * CREATE TRANSACTION - 10 STEP TRANSFER FLOW
 * ============================================
 *
 * Step 1: Validate request payload
 *   - Check required fields
 *
 * Step 2: Validate idempotency key
 *   - Prevent duplicate transactions
 *
 * Step 3: Verify both accounts
 *   - Sender account exists & ACTIVE
 *   - Receiver account exists & ACTIVE
 *
 * Step 4: Calculate sender balance
 *   - Read immutable ledger entries
 *   - Ensure sufficient funds
 *
 * Step 5: Create transaction record
 *   - Status = PENDING
 *
 * Step 6: Create DEBIT ledger entry
 *   - Deduct amount from sender
 *
 * Step 7: Create CREDIT ledger entry
 *   - Add amount to receiver
 *
 * Step 8: Complete transaction
 *   - Update status = COMPLETED
 *
 * Step 9: Commit database transaction
 *   - Commit MongoDB session
 *   - Rollback on failure
 *
 * Step 10: Send response & notification
 *   - Return transaction details
 *   - Send email/SMS notification (optional)
 */



async function createTransaction(req, res) {
  let session = null;

  try {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    /**
     * 1.Validate Request
     */

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
      return res.status(400).json({
        message: "fromAccount , toAccount , amount, idempotency is required",
      });
    }

    const fromUserAccount = await Account.findById(fromAccount).populate(
      "user",
      "name email"
    );

    const toUserAccount = await Account.findById(toAccount).populate(
      "user",
      "name email"
    );

    if (!fromUserAccount || !toUserAccount) {
      return res.status(400).json({
        message: "fromAccount or toAccount is Invalid",
      });
    }
    /**
     * 2. Validate idempotencyKey
     */

    const isTransactionExist = await Transaction.findOne({
      idempotencyKey: idempotencyKey,
    });

    if (isTransactionExist) {
      if (isTransactionExist.status === "completed")
        return res.status(200).json({
          message: "Transaction already Completed",
          transaction: isTransactionExist,
        });
      if (isTransactionExist.status === "pending")
        return res.status(200).json({
          message: "Transaction is Processing",
        });
      if (isTransactionExist.status === "failed")
        return res.status(500).json({
          message: "Transaction Failed",
        });

      if (isTransactionExist.status === "reversed")
        return res.status(500).json({
          message: "Transaction is Reversed",
        });
    }

    /**
     * 3.Status OF Account
     */

    if (
      fromUserAccount.status == "FROZEN" ||
      fromUserAccount.status == "CLOSED" ||
      toUserAccount.status == "FROZEN" ||
      toUserAccount.status == "CLOSED"
    ) {
      return res.status(500).json({
        message: " Senders or Receiver Account is Closed Or Frozen",
      });
    }

    /**
     * 4. Sender Balance check
     */

    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
      return res.status(400).json({
        message: ` Insuffucient Balance .  Current Balance is ${balance} . Requested Amount is ${amount}`,
      });
    }

    /**
     * 5. Create Transaction (Pending)
     */

    session = await mongoose.startSession();

    session.startTransaction();

    // Create Transaction
    const [transaction] = await Transaction.create(
      [
        {
          fromAccount,
          toAccount,
          amount,
          idempotencyKey,
          status: "pending",
        },
      ],
      { session }
    );

    // Debit Ledger
    await Ledger.create(
      [
        {
          account: fromAccount,
          amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session }
    );

    //wait
    console.log("Processing...");

    await new Promise((resolve) => setTimeout(resolve, 20 * 1000));

    // Credit Ledger
    await Ledger.create(
      [
        {
          account: toAccount,
          amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session }
    );

    // Complete Transaction
    transaction.status = "completed";
    await transaction.save({ session });

    // Commit
    await session.commitTransaction();

    // Sender Email
    await emailService.transactionEmail({
      userEmail: fromUserAccount.user.email,
      name: fromUserAccount.user.name,
      transactionId: transaction._id,
      amount: transaction.amount,
      type: "DEBIT",
      status: "SUCCESS",
    });

    // Receiver Email
    await emailService.transactionEmail({
      userEmail: toUserAccount.user.email,
      name: toUserAccount.user.name,
      transactionId: transaction._id,
      amount: transaction.amount,
      type: "CREDIT",
      status: "SUCCESS",
    });

    return res.status(200).json({
      success: true,
      message: "Transaction completed successfully",
      transaction,
    });
  } catch (error) {
    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }

    const isRetryError =
      error.hasErrorLabel?.("TransientTransactionError") ||
      error.code === 112 || // WriteConflict error code
      (error.message && error.message.includes("Please retry your operation"));

    if (isRetryError) {
      return res.status(200).json({
        success: true,
        message: "Transaction is Processing",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}



export const createInitialTransactionFunds = async (req, res) => {
  const { toAccount, amount, idempotencyKey } = req.body;

  // Step 1 - Validate Input
  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      success: false,
      message: "toAccount, amount and idempotencyKey are required",
    });
  }

  const existingTransaction = await Transaction.findOne({
  idempotencyKey,
});

if (existingTransaction) {
  return res.status(409).json({
    success: false,
    message: "Duplicate transaction request",
  });
}

  // Step 2 - Find Receiver Account
  const toUserAccount = await Account.findOne({
    _id: toAccount,
  }).populate("user", "name email")

  if (!toUserAccount) {
    return res.status(404).json({
      success: false,
      message: "Receiver account not found",
    });
  }

  // Step 3 - Find System User Account
  const fromUserAccount = await Account.findOne({
    user: req.user._id,
  });

  if (!fromUserAccount) {
    return res.status(404).json({
      success: false,
      message: "System User Account not found",
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Step 4 - Create Transaction
    const [transaction] = await Transaction.create(
      [
        {
          fromAccount: fromUserAccount._id,
          toAccount: toUserAccount._id,
          amount,
          idempotencyKey,
          status: "pending",
        },
      ],
      { session }
    );

    // Step 5 - Debit Ledger
    await Ledger.create(
      [
        {
          account: fromUserAccount._id,
          transaction: transaction._id,
          amount,
          type: "DEBIT",
        },
      ],
      { session }
    );

    // Step 6 - Credit Ledger
    await Ledger.create(
      [
        {
          account: toUserAccount._id,
          transaction: transaction._id,
          amount,
          type: "CREDIT",
        },
      ],
      { session }
    );

    transaction.status = "completed";
await transaction.save({ session });

    // Step 7 - Commit Transaction
    await session.commitTransaction();



   await emailService.transactionEmail({
  userEmail: toUserAccount.user.email,
  name: toUserAccount.user.name,
  transactionId: transaction._id,
  amount,
  type: "CREDIT",
  status: "SUCCESS",
});


    return res.status(201).json({
      success: true,
      message: "Initial funds transferred successfully",
      transaction,
    });
  } catch (error) {
    await session.abortTransaction();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

export default { createTransaction,createInitialTransactionFunds }