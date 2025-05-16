# 🛒 E-commerce API

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Getting Started](#getting-started)
- [Technologies Used](#technologies-used)
- [License](#license)

## Overview
This project is a robust e-commerce API built using Node.js and Express. It provides a comprehensive set of endpoints for managing products, users, cart, categories, brands, and checkout processes. The API is designed to be scalable, secure, and easy to use.

## Features

### User Management
- **Sign Up**: Register a new user.
- **Login**: Authenticate users and return a JWT token.
- **Logout**: Log out the currently authenticated user.
- **Forgot Password**: Request a password reset link.
- **Reset Password**: Reset the user's password using a token.
- **Update Profile**: Update user profile information.
- **Delete Profile**: Delete the user's profile.

### Product Management
- **Get All Products**: Retrieve a list of all products.
- **Get Product by ID**: Retrieve a specific product by its ID.
- **Add Product**: Add a new product (admin only).
- **Update Product**: Update product details (admin only).
- **Delete Product**: Delete a product (admin only).
- **Update Product Images**: Update product images (admin only).

### Cart Management
- **Get My Cart**: Retrieve the user's cart.
- **Add Item to Cart**: Add an item to the user's cart.
- **Delete All Items**: Delete all items in the user's cart.
- **Delete Item**: Delete a specific item from the user's cart.
- **Decrease Item Quantity**: Decrease the quantity of an item in the user's cart.

### Category Management
- **Get All Categories**: Retrieve a list of all categories.
- **Add Category**: Add a new category (admin only).
- **Get Category by ID**: Retrieve a specific category by its ID.
- **Update Category**: Update category details (admin only).
- **Delete Category**: Delete a category (admin only).
- **Update Category Image**: Update the image of a category (admin only).

### Brand Management
- **Get All Brands**: Retrieve a list of all brands.
- **Add Brand**: Add a new brand (admin only).
- **Get Brand by ID**: Retrieve a specific brand by its ID.
- **Update Brand**: Update brand details (admin only).
- **Delete Brand**: Delete a brand (admin only).
- **Update Brand Image**: Update the image of a brand (admin only).

### Order Management
- **Get All Orders**: Retrieve a list of all orders (admin only).
- **Get Order by ID**: Retrieve a specific order by its ID.
- **Get My Orders**: Retrieve the user's orders.
- **Create Order**: Create a new order.
- **Update Order**: Update order details.
- **Cancel Order**: Cancel an order.

### Payment Management
- **Create Checkout**: Create a checkout session for payment.
- **Payment Success**: Handle successful payment.
- **Payment Cancel**: Handle cancelled payment.

## API Documentation
The API documentation is available using Swagger UI. You can access it by running the server and navigating to `http://localhost:3000/api-docs`.

## Getting Started
1. **Clone the Repository**: 
   ```bash
   git clone <repository-url>
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set Up Environment Variables**: Create a `config.env` file in the root directory and add your environment variables.
4. **Run the Server**:
   ```bash
   npm start
   ```

## Technologies Used
- **Node.js**: Runtime environment.
- **Express**: Web framework.
- **MongoDB**: Database.
- **JWT**: Authentication.
- **Swagger**: API documentation.

## License
This project is copyrighted, and all rights are reserved. Unauthorized use, modification, or distribution is prohibited. 
