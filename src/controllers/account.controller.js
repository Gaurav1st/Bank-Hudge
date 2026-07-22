import Account from "../models/account.model.js";



export const createAccount = async (req, res) => {
  try {
    const account = await Account.create({
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      account,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAccount = async (req, res) => {
  try {
    const account = await Account.find({
      user: req.user._id,
    });

    if (account.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Accounts Available",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account fetched successfully",
      accounts: account,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBalance = async (req, res) => {
  try {
    const { accountId } = req.params;

    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "Account ID is required",
      });
    }

    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    const balance = await account.getBalance();

    return res.status(200).json({
      success: true,
      message: "Balance fetched successfully",
      balance: balance ,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export default { createAccount,getAccount,getBalance }