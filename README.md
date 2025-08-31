**Ecommerce site
**
**Overview**

This is a React-based e-commerce application with a backend API, enabling users to browse products, add them to a cart, and place orders. The project demonstrates state management, routing, and API integration.

The technologies used for this project are:-
Frontend codebase: React 
Backend codebase: Python with tornado framework 
Database: MySQL

The features oof the app are :-
**Frontend**
Login/signup page
->Users can register a new account or login with existing credentials.
->Form validation for email and password.
->Successful login sets user state, enabling checkout.
->Provides feedback on authentication errors.

Home Page
->Hero section with “Shop Now” button.
->Products grouped by category.

Products Page
->Display all products in a grid layout.
->Filter by category, price, and search query.
->Sort products by price or name.
->Add new products dynamically.

Cart Page
->View cart items with quantity management.
->Remove items from cart.
->Checkout modal with order summary.

**Backend**
REST API endpoints:
->GET /api/products – Fetch all products.
->POST /api/products – Add new product.
->POST /api/orders – Place an order.

Stores product details including name, description, price, stock, category, and image.
Handles orders linked to a user.

**Installation & Setup**
Backend
Install dependencies:
->pip install tornado mysql-connector-python

Run backend server:
->python app.py

API runs on: http://localhost:8888/api/

Frontend
Install dependencies:
->npm install

Start frontend:
->npm start

Open browser at: http://localhost:5173 
