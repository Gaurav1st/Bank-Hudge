# 🏦 Bank-Hudge

> A banking backend that simulates real-world money movement using a **Ledger-Based Accounting System**.

![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📖 Overview

Bank-Hudge is a backend banking application built with **Node.js**, **Express.js**, and **MongoDB** that simulates real-world banking operations using a **double-entry ledger system**.

The project focuses on secure money transfers, transactional integrity, idempotency, and account balance calculation from immutable ledger entries.

---

## ✨ Features

- 🔐 JWT Authentication
- 👤 User Management
- 🏦 Account Management
- 💸 Money Transfers
- 📒 Ledger-Based Accounting
- 🔄 Idempotent Transactions
- 📧 Email Notifications
- 🛡️ MongoDB ACID Transactions

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime |
| Express.js | Backend Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Nodemailer | Email Service |

---

## 📂 Project Structure

```text
Bank-Hudge/
│
├── docs/
│   ├── API.md
│   ├── DATABASE.md
│   ├── SETUP.md
│   └── TRANSACTIONS.md
│
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── ...
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Quick Start

Clone the repository

```bash
git clone https://github.com/Gaurav1st/Bank-Hudge.git
```

Move into the project

```bash
cd Bank-Hudge
```

Install dependencies

```bash
npm install
```

Run the server

```bash
npm run dev
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| 📘 **SETUP.md** | Installation & Environment Setup |
| 🔌 **API.md** | REST API Documentation |
| 💳 **TRANSACTIONS.md** | Complete Money Transfer Flow |
| 🗄️ **DATABASE.md** | Database Design & Collections |

---

## 🔒 Core Concepts

- Double Entry Ledger
- MongoDB Transactions
- JWT Authentication
- Idempotency Keys
- Immutable Ledger Entries

---

## 📬 API Base URL

```text
/api
```

---

## 👨‍💻 Author

**Gaurav Dwivedi**

- GitHub: https://github.com/Gaurav1st

---

## ⭐ Support

If you like this project, don't forget to ⭐ the repository.