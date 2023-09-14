const mongoose = require('mongoose');

// Defined the schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    brand: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    rating: { type: Number, required: true },
   
    //reviews: { type: [String], required: true },
}, { timestamps: true }
);

// Created the model
const Products = mongoose.model('Products', productSchema);

module.exports = Products;
