
# Smart Order Management System

A full-stack **MERN application** that allows restaurants to manage menus, customer orders, and deliveries in real time.  
This project supports role-based dashboards for **Admin** and **Customer**.  

🌐 **Live Demo**: [Smart Order Systems](https://smart-order-systems.vercel.app)  
🔗 **Backend API**: [Render Deployment](https://smartordersystems.onrender.com)  

---

##  Features - 

### Admin Dashboard
- Add, edit, and delete menu items  
- Toggle item availability (Available / Not Available)  
- View and manage customer orders  
- Filter & sort orders by status, date, or amount  

### Customer Dashboard
- View dynamic menu with search and sort options  
- Add items to cart and update quantities  
- Place orders securely with JWT authentication   

### Authentication
- JWT-based authentication  
- Role-based access control (Admin / Customer)  

---

## Tech Stack

**Frontend:** React, Tailwind CSS, Axios, React Router  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Database:** MongoDB Atlas  
**Deployment:**  
- Frontend → Vercel  
- Backend → Render  

---

## Setup Instructions (Local Development)

### 1. Clone the repo
```bash
git clone https://github.com/samradhyadav/SmartOrderSystems.git
cd SmartOrderSystems
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a .env file inside backend/ with:
```
MONGO_URI=your_mongodb_uri
PORT=5001
JWT_SECRET=supersecretkey
NODE_ENV=development
FRONTEND_URLS=http://localhost:5174,https://smart-order-systems.vercel.app
```

Run backend:

```
npm start
```

### 3. Setup Frontend
```
cd frontend
npm install
```

Create a config.js file inside frontend/src/:

```
export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://smartordersystems.onrender.com"
    : "http://localhost:5001";
```

Run frontend:

```
npm run dev
```

Frontend will run at: http://localhost:5174
Backend will run at: http://localhost:5001

**Deployment**

Frontend (Vercel):
```
https://smart-order-systems.vercel.app
```

Backend (Render):
```
https://smartordersystems.onrender.com
```

Make sure FRONTEND_URLS in backend .env includes both localhost and deployed frontend URLs.

**Future Enhancements**

- Delivery dashboard for tracking and updating order delivery status

- Payment integration

- Analytics dashboard for Admin

**Author**
Built with ❤️ by Samradh Singh Yadav

## Links 🔗 
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://portfolio-samradh.vercel.app/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/samradh-singh-yadav/)


