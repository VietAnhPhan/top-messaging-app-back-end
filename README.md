# ⚙️ **Messaging App Backend**

*The RESTful API server powering the Messaging App frontend.*

---

### 🏷️ **Badges**

![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![Express](https://img.shields.io/badge/Framework-Express-black?logo=express)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192?logo=postgresql)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)
![Passport.js](https://img.shields.io/badge/Auth-Passport.js-33A6B8?logo=passport)
![License](https://img.shields.io/badge/License-MIT-yellow?logo=open-source-initiative)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 🧩 **Overview**

The **Messaging App Backend** provides secure and efficient **RESTful API endpoints** that support the frontend client.  
It handles user authentication, message management, and database operations through a clean and scalable architecture.

---

## 🚀 **Key Features**

- 🧑‍💻 **User Authentication** – Secure login and registration using **Passport.js** (JWT strategy).  
- 📨 **RESTful API** – Well-structured endpoints to interact with the frontend.  
- 🧠 **Database Management** – Built with **PostgreSQL** using **Prisma ORM** for efficient queries.  
- 🔒 **Secure Middleware** – Input validation, error handling, and CORS configuration.  
- ⚙️ **Environment Configuration** – Customizable `.env` file for all sensitive variables.  
- 📄 **Scalable Folder Structure** – Organized for maintainability and growth.  

---

## 💻 **Tech Stack**

| Layer | Technology |
|-------|-------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Authentication** | Passport.js (JWT) |
| **Environment** | dotenv |
| **Validation** | express-validator |

---

## 🧰 **Getting Started**

### **1️⃣ Clone the Repository**
\`\`\`bash
git clone https://github.com/VietAnhPhan/top-messaging-app-back-end.git
cd top-messaging-app-backend
\`\`\`

### **2️⃣ Install Dependencies**
\`\`\`bash
npm install
\`\`\`

### **3️⃣ Setup Prisma**
\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

### **4️⃣ Run the Server**
\`\`\`bash
npm run dev
\`\`\`

Server runs at: **http://localhost:5000**

---

## 🔍 **Testing the API**

You can test endpoints using **Postman** or **cURL**.  
Example request:

\`\`\`bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username": "john_doe", "email": "john@example.com", "password": "123456"}'
\`\`\`

---

## 🤝 **Contributing**

1. **Fork** the project  
2. **Create** a new branch (\`git checkout -b feature/AmazingFeature\`)  
3. **Commit** your changes (\`git commit -m 'Add some AmazingFeature'\`)  
4. **Push** to the branch (\`git push origin feature/AmazingFeature\`)  
5. **Open a Pull Request**

---

## 📄 **License**

Distributed under the **MIT License**.  
See the \`LICENSE\` file for details.

---

## 📧 **Contact**

**Viet Anh Phan** – vietanhphan2810@gmail.com  
**Project Link:** [GitHub Repository](https://github.com/VietAnhPhan/top-messaging-app-back-end)
