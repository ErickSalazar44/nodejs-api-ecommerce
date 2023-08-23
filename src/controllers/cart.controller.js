const catchError = require("../utils/catchError");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Category = require("../models/Category");
const ProductImg = require("../models/ProductImg");

const getAll = catchError(async (req, res) => {
    const userId = req.user.id;

    const results = await Cart.findAll({
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
    return res.json(results);
});

const create = catchError(async (req, res) => {
    const userId = req.user.id;

    // productId lo envia el front para asignar que producto esta agregando el user loggeado
    const { quantity, productId } = req.body;

    const body = { userId, quantity, productId };

    const result = await Cart.create(body);
    return res.status(201).json(result);
});

const remove = catchError(async (req, res) => {
    const { id } = req.params;
    // traemos el id del usuario logeado
    const userId = req.user.id;
    // userId debe coincidir con el id del usuario logeado
    const result = await Cart.destroy({ where: { id, userId } });

    if (!result) return res.sendStatus(404);
    return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
    const { id } = req.params;

    const userId = req.user.id;

    const { quantity } = req.body;

    const result = await Cart.update(
        { quantity },
        { where: { id, userId }, returning: true }
    );

    if (result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

module.exports = {
    getAll,
    create,
    remove,
    update,
};
