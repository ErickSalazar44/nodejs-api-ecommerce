const { create } = require("../controllers/purchase.controller");
const { getAll } = require("../controllers/purchase.controller");
const express = require("express");

const routerPurchase = express.Router();

routerPurchase.route("/").get(getAll);
routerPurchase.route("/").post(create);

module.exports = routerPurchase;
