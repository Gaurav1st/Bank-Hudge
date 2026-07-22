import 'dotenv/config'
import express from 'express'
import dns from 'dns'
import authRouter from './src/routes/auth.route.js';
import accountRouter from './src/routes/account.route.js'
import transactionRouter from './src/routes/transaction.route.js'
import cookieParser from 'cookie-parser';




const app=express()

app.use(express.json());

app.use(cookieParser())

app.get("/",(req,res) =>
{
    res.send("Bank Hudger Ledger Service Is Running ")
})

/**
 * -routes Used
 */
app.use("/api/auth",authRouter)
app.use("/api/accounts",accountRouter)
app.use("/api/transactions",transactionRouter)



dns.setServers(
    ["1.1.1.1","8.8.8.8"]
)


export default app;
