const request = require("supertest");
const app = require("../app");
const Category = require("../models/Category");
const ProductImg = require("../models/ProductImg");

require("../models");

const URL_BASE = "/api/v1/products";
const URL_LOGIN = "/api/v1/users/login";

let productID;

let TOKEN;
let product;
let category;
let image;

beforeAll(async () => {
    // inicio de session para obtener el token
    const user = {
        email: "erickearl22@gmail.com",
        password: "123",
    };
    const res = await request(app).post(URL_LOGIN).send(user);

    TOKEN = res.body.token;

    // creamos una categoria
    const categoryBody = {
        name: "smart Tv",
    };
    category = await Category.create(categoryBody);

    // asignamos el id de la categoria a categoryId
    product = {
        title: "Lg oled 55",
        description: "lroem10",
        price: 20.3,
        categoryId: category.id,
    };
});

//? create product

test("POST -> 'URL_BASE', should resturn status code 201 and res.body.title = product.title", async () => {
    const res = await request(app)
        .post(URL_BASE)
        .send(product)
        .set("Authorization", `Bearer ${TOKEN}`);

    productID = res.body.id;

    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("title", product.title);
});

//? Get products for id

test("GET -> 'URL_BASE', should resturn status code 200 and res.body.length = 1", async () => {
    const res = await request(app).get(URL_BASE);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveLength(1);

    expect(res.body[0].category).toBeDefined();
    expect(res.body[0].category).toHaveProperty("id", category.id);

    expect(res.body[0].productImgs).toBeDefined();
    expect(res.body[0].productImgs).toHaveLength(0);
});

//? Get products query category

test("GET -> 'URL_BASE?category=id', should resturn status code 200, res.body.length === 1, res.body[0].category tobeDefined() and res.body[0].category.id === category.id", async () => {
    const res = await request(app).get(`${URL_BASE}?category=${category.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveLength(1);

    expect(res.body[0].category).toBeDefined();
    expect(res.body[0].category).toHaveProperty("id", category.id);
});

//? Get product for id

test("GET -> 'URL_BASE/:id', should resturn status code 200 and res.body.title = product.title", async () => {
    const res = await request(app).get(`${URL_BASE}/${productID}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("title", product.title);

    expect(res.body.productImgs).toBeDefined();
    expect(res.body.productImgs).toHaveLength(0);
});

//? Update category for id

test("PUT -> 'URL_BASE/:id', should resturn status code 200 and res.body.title = productUpdate.title", async () => {
    const productUpdate = {
        title: "Samsung oled 55",
    };

    const res = await request(app)
        .put(`${URL_BASE}/${productID}`)
        .send(productUpdate)
        .set("Authorization", `Bearer ${TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("title", productUpdate.title);
});

test("POST -> 'URL_BASE/:id/images' should return status code 200", async () => {
    // Crea una instancia de ProductImg
    image = await ProductImg.create({
        url: "http://localhost:8080/uploads/gato-payaso.jpg",
        filename: "gato-payaso",
    });

    // establece la imagen en el producto
    const res = await request(app)
        .post(`${URL_BASE}/${productID}/images`)
        .set("Authorization", `Bearer ${TOKEN}`)
        .send([image.id]);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
});

//? Delete category for id

test("DELETE -> 'URL_BASE/:id', should resturn status code 204", async () => {
    const res = await request(app)
        .delete(`${URL_BASE}/${productID}`)
        .set("Authorization", `Bearer ${TOKEN}`);

    expect(res.status).toBe(204);
    await category.destroy();
    await image.destroy();
});
