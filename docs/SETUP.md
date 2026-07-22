# 🚀 Setup Guide

This guide explains how to run the project locally.

---

## Prerequisites

- Node.js (v18 or later)
- MongoDB Atlas / Local MongoDB
- Git

---

## Clone Repository

```bash
git clone https://github.com/Gaurav1st/Bank-Hudge.git
cd Bank-Hudge
```

---

## Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000

MONGODB_URI=

JWT_SECRET=

CLIENT_ID=

CLIENT_SECRET

EMAIL=

REFRESH_TOKEN=
```

---

## Run Development Server

```bash
npm run dev
```

---

## Production

```bash
npm start
```

---

## Project Structure

```
src/
controllers/
middlewares/
models/
routes/
services/
```