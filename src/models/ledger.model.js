import mongoose from "mongoose";



const ledgerSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Account is required."],
      index: true,
      immutable: true,
    },

    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: [true, "Transaction is required."],
      index: true,
      immutable: true,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required."],
      min: [1, "Amount must be greater than 0."],
      immutable: true,
    },

    type: {
      type: String,
      enum: {
        values: ["CREDIT", "DEBIT"],
        message: "{VALUE} is not a valid ledger type.",
      },
      required: [true, "Ledger type is required."],
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);

function preventLedgerModification() {
  throw new Error("Ledger entries are immutable.");
}

ledgerSchema.pre("updateOne", preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);
ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("replaceOne", preventLedgerModification);
ledgerSchema.pre("deleteOne", preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);

const Ledger = mongoose.model("Ledger", ledgerSchema);

export default Ledger;