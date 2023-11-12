const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

const url = "mongodb+srv://danarech99:" + process.env.MONGO_ATLAS_PW + "@node-rest-shop.rbwypuu.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(
    url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
   if (req.method === "OPTIONS") {
       res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
       return res.status(200).json({});
   }
   next();
});

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