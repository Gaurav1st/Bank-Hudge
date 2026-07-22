import express from 'express'
import authmiddleware from '../middlewares/auth.middleware.js'
import transactionController from '../controllers/transaction.controller.js'


const router=express.Router()


/**
 * -POST create Transactions 
 * /api/transactions/create
 */
router.post("/create",authmiddleware.verifyToken,transactionController.createTransaction)

/**
 * -POST Create Initial FUnds
 * -/api/transactions/system/initial-funds
 */

router.post("/system/initial-funds",authmiddleware.authSystemMiddleware,transactionController.createInitialTransactionFunds)




export default router