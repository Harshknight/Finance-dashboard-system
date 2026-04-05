# Finance Dashboard System

A comprehensive backend system for managing financial records, user roles, and analytics for a finance dashboard application. This project demonstrates clean architecture, role-based access control, and efficient data processing.

## Features

### 👥 User & Role Management
- Register users (default role: Viewer)
- Admin can:
  - Create users with specific roles
  - Update user roles
  - Activate/Deactivate users
  - Delete users
- Role-based access control (Viewer, Analyst, Admin)
- Secure password hashing using bcrypt

### 💵 Financial Records Management
- Create, read, update, and delete financial records
- Record fields:
  - Amount
  - Type (Income / Expense)
  - Category
  - Date
  - Notes
- Advanced filtering:
  - By type
  - By category
  - By date range
- Pagination support
- User-specific data ownership

### 📊 Dashboard & Analytics
- Total income and expenses
- Net balance calculation
- Category-wise breakdown
- Monthly trends
- Weekly trends
- Recent activity tracking

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based authorization middleware
- Protected API routes
- User activity validation


### 🔐 Role-Based Access Control

| Role     | Permissions |
|----------|------------|
| Viewer   | View dashboard |
| Analyst  | View records + analytics |
| Admin    | Full access (users + records) |


### 🔐 Validation & Error Handling
- Request validation using Zod
- Centralized error handling middleware
- Proper HTTP status codes and responses

## Prerequisites

Before running the project, ensure you have:

- **Node.js** (version v16 or higher)
- **MongoDB** (local or cloud)
- **Git** (for version control)

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/Harshknight/Finance-dashboard-system.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/finance-db
   JWT_SECRET=your_secret_key
   ```

## ▶️ Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

**Server runs at:**
```bash
http://localhost:5000
```

## Project Structure

```
src/
├── config/                     # Database connection
├── controllers/                # Business logic
├──  models/                    # Mongoose schemas
├── routes/                     # API routes
├── middleware/                 # Auth, validation, roles
├── utils/                      # Validators (Zod)
└── app.js                      # App configuration
```

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint              | Description              |
|--------|----------------------|--------------------------|
| POST   | /api/auth/register   | Register new user        |
| POST   | /api/auth/login      | Login and receive JWT    |

---

### 👥 Users (Admin Only)

| Method | Endpoint                  | Description              |
|--------|--------------------------|--------------------------|
| GET    | /api/users               | Get all users            |
| POST   | /api/users/create        | Create user              |
| PATCH  | /api/users/:id/role      | Update role              |
| PATCH  | /api/users/:id/status    | Toggle active status     |
| DELETE | /api/users/:id           | Delete user              |

---

### 🙍 Profile

| Method | Endpoint                     | Description              |
|--------|------------------------------|--------------------------|
| PATCH  | /api/users/me                | Update profile           |
| PATCH  | /api/users/me/password       | Change password          |

---

### 💵 Records

| Method | Endpoint              | Description                          |
|--------|----------------------|--------------------------------------|
| POST   | /api/records         | Create record                        |
| GET    | /api/records         | Get records (filters + pagination)   |
| PUT    | /api/records/:id     | Update record                        |
| DELETE | /api/records/:id     | Delete record                        |

---

### 📊 Dashboard

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | /api/dashboard   | Get analytics summary    |

---

## 📥 Example Requests

### 🔑 Login

**Request**
```json
{
  "email": "user@gmail.com",
  "password": "123456"
}
```

**Response**
```json
{
  "token": "jwt_token_here"
}
```
### Dashboard Response

```json
{ "totalIncome": 5000,
 "totalExpense": 2000,
 "netBalance": 3000,
 "categoryTotals": [
{ "category": "Food", "total": 500 }
 ],
"monthlyTrends": [],
 "weeklyTrends": [],
 "recentActivity": []
}
```

### 🗄️ Database Design
- User Schema
  - name
  - email
  - password
  - role (viewer, analyst, admin)
  - isActive
- User Schema
  - amount
  - type(income,expense)
  - category
  - date
  - note
  - created By Harsh Ranjan

### ⚡ Performance Optimizations
- Indexed fields:
  - createdBy
  - category
  - date
  - type
- Efficient MongoDB aggregation pipelines for analytics

### 🧠 Design Decisions
- Role-based access handled via middleware
- Separation of concerns (routes, controllers, models)
- Aggregation used instead of multiple queries for performance
- Secure authentication using JWT

### 🚧 Future Improvements
- Swagger API documentation
- Unit & integration testing
- Soft delete functionality
- Rate limiting
- Caching for dashboard APIs

### 🤝 Contributing
1. **Fork the repository**
1. **Create a feature branch**
     - git checkout -b feature-name
3. **Commit your changes**
4. **Push and open a Pull Request**

### 👨‍💻 Author
- Harsh Ranjan

### 📌 Conclusion
- This project showcases a well-structured backend system with strong access control, clean API design, and efficient financial data processing suitable for real-world applications.
