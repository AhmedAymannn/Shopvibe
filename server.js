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
const orderRoutes = require('./routes/order');
const brandRoutes = require('./routes/brand');
const checkoutRoutes = require ('./routes/payment');
const cookieParser = require('cookie-parser');
const Db_connection = require('./config/db');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml'); // Load your YAML file

// Enable CORS for all routes
app.use(cors());
//middleweres
app.use(express.json());
// access the images via => {{root}}images/imageName
app.use('/public', express.static(path.join(__dirname, 'public')));
// Routes
app.use('/api/v1/ecommerce/products', productRoutes);
app.use('/api/v1/ecommerce/users', userRoutes);
app.use('/api/v1/ecommerce/cart', cartRoutes);
app.use('/api/v1/ecommerce/categories', categoryRoutes);
app.use('/api/v1/ecommerce/reviews', reviewRoutes);
app.use('/api/v1/ecommerce/orders', orderRoutes);
app.use('/api/v1/ecommerce/brands', brandRoutes);
app.use('/api/v1/ecommerce/checkout', checkoutRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
Db_connection.connectDB();
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})



// async function hashPassword() {
//     const plainPassword = '224802';
//     const saltRounds = 12;
//     const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
//     console.log("Hashed Password:", hashedPassword);
// }
// hashPassword()