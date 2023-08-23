const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");
require("../models");

const URL_BASE = "/api/v1/cart";
const URL_LOGIN = "/api/v1/users/login";

let TOKEN;
let product;
let userId;

let cartId;

beforeAll(async () => {
    const user = {
        email: "erickearl22@gmail.com",
        password: "123",
    };

    const login = await request(app).post(URL_LOGIN).send(user);

    TOKEN = login.body.token;

    userId = login.body.user.id;

    const productBody = {
        title: "Lg oled 55",
        description: "lroem10",
        price: 20.3,
    };

    product = await Product.create(productBody);
});

test("POST -> 'URL_BASE' should return status code 201, res.body.toBeDefined() and res.body.userId === userId", async () => {
    const cart = {
        quantity: 3,
        productId: product.id,
    };

    const res = await request(app)
        .post(URL_BASE)
        .send(cart)
        .set("Authorization", `Bearer ${TOKEN}`);

    cartId = res.body.id;

    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("userId", userId);
});

test("GET ALL -> 'URL_BASE' should return status code 200, res.body toBeDefined() and res.body.length === 1", async () => {
    const res = await request(app)
        .get(URL_BASE)
        .set("Authorization", `Bearer ${TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty("userId", userId);

    const cartProduct = res.body[0].product;

    expect(cartProduct).toBeDefined();
    expect(cartProduct).toHaveProperty("id", product.id);
    expect(cartProduct).toHaveProperty("title", product.title);

    const productImgs = cartProduct.productImgs;

    expect(productImgs).toBeDefined();
    expect(productImgs).toHaveLength(0);
});

test("PUT -> 'URL_BASE' should return status code 200, res.body toBeDefined() and res.body.quantity === newCart.quantity", async () => {
    const newCart = {
        quantity: 3,
    };

    const res = await request(app)
        .put(`${URL_BASE}/${cartId}`)
        .send(newCart)
        .set("Authorization", `Bearer ${TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("quantity", newCart.quantity);
});

test("DELETE -> 'URL_BASE' should return status code 204", async () => {
    const res = await request(app)
        .delete(`${URL_BASE}/${cartId}`)
        .set("Authorization", `Bearer ${TOKEN}`);

    expect(res.status).toBe(204);
    await product.destroy();
});
