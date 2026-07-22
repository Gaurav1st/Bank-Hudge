import express from 'express'
import authController from '../controllers/auth.controller.js'
const router=express.Router();



/**
 * - Post Register
 * - /api/auth/register
 */
router.post("/register",authController.registerUser)


/**
 * - POST Login
 * - /api/auth/login
 */
router.post("/login",authController.loginUser)

/**
 * -POST Logout
 * -/api/auth/logout
 */
router.post("/logout",authController.logoutUser)




export default router;