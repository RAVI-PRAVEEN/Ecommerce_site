# Ecommerce Site

## Overview
A full-stack e-commerce web application built with **React** for the frontend and **Python (Tornado framework)** for the backend. Users can browse products, manage their cart, and place orders. The project demonstrates modern state management, routing, and RESTful API integration.

---

## Technologies Used
- **Frontend:** React
- **Backend:** Python (Tornado)
- **Database:** MySQL

---

## Main Features

### Frontend

#### Login/Signup Page
- User registration and login
- Email and password form validation
- Persistent user state after login for checkout access
- Real-time feedback on authentication errors

#### Home Page
- Hero section with “Shop Now” button
- Products grouped by category

#### Products Page
- Grid display of all products
- Filter by category, price, and search query
- Sort products by price or name
- Add new products dynamically (admin feature)

#### Cart Page
- View items in cart with quantity management
- Remove items from cart
- Checkout modal with order summary

---

### Backend (REST API Endpoints)

- `GET /api/products` – Fetch all products
- `POST /api/products` – Add new product
- `POST /api/orders` – Place an order

- Stores product details: name, description, price, stock, category, image
- Handles order placement, linked to user accounts

---

## Installation & Setup

### Backend
1. **Install dependencies:**
    ```bash
    pip install tornado mysql-connector-python
    ```
2. **Run backend server:**
    ```bash
    python app.py
    ```
3. **API available at:**  
   [http://localhost:8888/api/](http://localhost:8888/api/)

### Frontend
1. **Install dependencies:**
    ```bash
    npm install
    ```
2. **Start frontend:**
    ```bash
    npm start
    ```
3. **Open browser at:**  
   [http://localhost:5173](http://localhost:5173)

---
