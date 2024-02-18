require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const firmRoutes = require('./routes/firm');
const customerRoutes = require('./routes/customer');
const contactRoutes = require('./routes/contact');
const supplierRoutes = require('./routes/supplier');
const supplierProductRoutes = require('./routes/supplierProduct');
const rigCompanyRoutes = require('./routes/rigCompany');
const rigRoutes = require('./routes/rig');
const productRoutes = require('./routes/product');
const projectRoutes = require('./routes/project');
const requestRoutes = require('./routes/request');
const requestBidRoutes = require('./routes/requestBid');
const userRoutes = require('./routes/user');

// express app
const app = express();

// middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use('/api/firm', firmRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/rigcompany', rigCompanyRoutes);
app.use('/api/rig', rigRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/product', productRoutes);
app.use('/api/supplierproduct', supplierProductRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/requestBid', requestBidRoutes);
app.use('/api/user', userRoutes);

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

