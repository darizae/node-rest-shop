const express = require("express");
const app = express();
const morgan = require("morgan");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

app.use(morgan("dev"));

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// Handling errors
// If it reaches the following middleware, it means that no fitting route was found before/above
// In that case, no route for the request exists, and so this new error thing is created
app.use((req, res, next) => {
    const error = Error("Not found");
    error.status = 404;
    next(error);
});

// This final middleware receives the error created and returns a json with the error message
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;