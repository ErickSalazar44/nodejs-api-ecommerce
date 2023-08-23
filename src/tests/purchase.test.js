const request = require("supertest");
const app = require("../app");
const Product = require("../models/Product");
require("../models");

const URL_BASE = "/api/v1/purchase";
const URL_LOGIN = "/api/v1/users/login";

let TOKEN;
let product;
let userId;

let cartBody;
let productBody;

beforeAll(async () => {
    // LOGIN
    const user = { email: "erickearl22@gmail.com", password: "123" };
    const login = await request(app).post(URL_LOGIN).send(user);

    TOKEN = login.body.token;
    userId = login.body.user.id;

    // PRODUCT
    productBody = {
        title: "Lg oled 55",
        description: "lroem10",
        price: 20.3,
    };
    product = await Product.create(productBody);

    // CART
    cartBody = {
        quantity: 3,
        productId: product.id,
    };

    await request(app)
        .post("/api/v1/cart")
        .send(cartBody)
        .set("Authorization", `Bearer ${TOKEN}`);
});

test("POST -> 'URL_BASE' should return status code 201 and res.body.quantity === bodyCart.quantity  ", async () => {
    const res = await request(app)
        .post(URL_BASE)
        .set("Authorization", `Bearer ${TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body[0]).toHaveProperty("quantity", cartBody.quantity);
});

test("GET 'URL' should return status code 200 res.body.length === 1", async () => {
    const res = await request(app)
        .get(URL_BASE)
        .set("Authorization", `Bearer ${TOKEN}`);

    console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveLength(1);

    // verificar si el include es correcto
    const { productImgs } = res.body[0].product;
    expect(productImgs).toBeDefined();
    expect(productImgs).toHaveLength(0);

    await product.destroy();
});
