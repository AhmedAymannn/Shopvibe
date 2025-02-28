const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = express();
const port = process.env.PORT;
const path = require('path');
const productRoutes = require('./routes/product')
const userRoutes = require('./routes/user')
const cartRoutes = require('./routes/cart')
const categoryRoutes = require('./routes/category');
const reviewRoutes = require('./routes/review');

const cookieParser = require('cookie-parser');
const Db_connection = require('./config/db')
//middleweres
app.use(express.json());

// app.use(cookieParser());

// access the images via => {{root}}images/imageName
app.use('/images', express.static(path.join(__dirname, 'public/images')));
// Routes
app.use('/api/v1/ecommerce/products', productRoutes);
app.use('/api/v1/ecommerce/users', userRoutes);
app.use('/api/v1/ecommerce/cart', cartRoutes);
app.use('/api/v1/ecommerce/categories', categoryRoutes);
app.use('/api/v1/ecommerce/reviews', reviewRoutes);

// async function hashPassword() {
//     const plainPassword = '224802'; // Replace with your desired password
//     const saltRounds = 12;
//     const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
//     console.log("Hashed Password:", hashedPassword);
// }
// hashPassword()
Db_connection.connectDB();
app.listen(port, () => {
    console.log('server is running on port 3000');
})