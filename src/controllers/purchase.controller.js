const catchError = require("../utils/catchError");
const Purchase = require("../models/Purchase");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Category = require("../models/Category");
const ProductImg = require("../models/ProductImg");

const getAll = catchError(async (req, res) => {
    const userId = req.user.id;

    // filtramos por el id del usuario logeado
    const result = await Purchase.findAll({
        where: { userId },
        include: [
            {
                model: Product,
                include: [
                    {
                        model: Category,
                        attributes: ["name"],
                    },
                    {
                        model: ProductImg,
                    },
                ],
            },
        ],
    });

    return res.json(result);
});

const create = catchError(async (req, res) => {
    // traemos el id del usuario logeado
    const userId = req.user.id;

    // traemos la info del cart del usuario logeado
    const cart = await Cart.findAll({
        where: { userId },
        raw: true, // para traer solo la inf
        attributes: ["quantity", "userId", "productId"],
    });

    // creamos todos los elementos de cart en purchase -> ticket
    const result = await Purchase.bulkCreate(cart);

    // si algo sale mal retornar 404
    if (!result) return res.sendStatus(404);

    // borramos todo los productos del usuario logeado almacenados en cart
    await Cart.destroy({ where: { userId } });

    // retornamos los productos comprados por el usuario -> factura
    return res.json(result);
});

module.exports = {
    getAll,
    create,
};
