# 🗄️ Database Design

## Collections

- Users
- Accounts
- Transactions
- Ledgers
- BlackLists

---

## Relationships

```
User
 │
 └───── Account
           │
           ├──── Ledger
           │
           └──── Transaction
```

---

## User

Stores user information.

---

## Account

Stores account details.

---

## Transaction

Stores transfer records.

---

## Ledger

Stores debit and credit entries.

---

## BlackList

Stores invalidated JWT tokens.