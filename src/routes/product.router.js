const {
    getAll,
    create,
    getOne,
    remove,
    update,
    setImage,
} = require("../controllers/product.controller");
const express = require("express");
const { verifyJwt } = require("../utils/verifyJwt");

const routerProduct = express.Router();

routerProduct
    .route("/")
    .get(getAll) // ruta libre
    .post(verifyJwt, create); // 🔐

routerProduct.route("/:id/images").post(setImage);

routerProduct
    .route("/:id")
    .get(getOne)
    .delete(verifyJwt, remove) // 🔐
    .put(verifyJwt, update); // 🔐

module.exports = routerProduct;
