const express = require("express");
const router = express.Router();
const { verifyJwt } = require("../utils/verifyJwt");

const routerUser = require("./user.router");
const routerCategory = require("./category.router");
const routerProduct = require("./product.router");
const routerCart = require("./cart.router");
const routerPurchase = require("./purchase.router");
const routerProductImg = require("./ProductImg.router");

router.use("/users", routerUser);
router.use("/categories", routerCategory);
router.use("/products", routerProduct);

// rutas protegidas 🔐
router.use("/cart", verifyJwt, routerCart);
router.use("/purchase", verifyJwt, routerPurchase);
router.use("/product_images", verifyJwt, routerProductImg);
module.exports = router;
