import express from 'express'
import authmiddleware from '../middlewares/auth.middleware.js'
import accountController from '../controllers/account.controller.js'



const router=express.Router()

/**
 * -POST createAccount
 * -/api/accounts/create
 */
router.post("/create",authmiddleware.verifyToken,accountController.createAccount)

/**
 * -POST getAllAccount
 * -/api/accounts/account
 */
router.post("/account",authmiddleware.verifyToken,accountController.getAccount)

/**
 * -POST getBalanace
 * -/api/accounts/balance/accountId
 */
router.post("/balance/:accountId",authmiddleware.verifyToken,accountController.getBalance)




export default router