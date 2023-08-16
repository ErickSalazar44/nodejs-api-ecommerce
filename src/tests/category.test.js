const app = require("../app");
const request = require("supertest");

const URL_BASE = "/api/v1/categories";
const URL_LOGIN = "/api/v1/users/login";
let TOKEN;
let categoryId;

beforeAll(async () => {
    const user = {
        email: "erickearl22@gmail.com",
        password: "123",
    };

    const login = await request(app).post(URL_LOGIN).send(user);
    TOKEN = login.body.token;
});

test("POST -> 'URL_BASE' should return status 201", async () => {
    const category = {
        name: "celulares",
    };

    const res = await request(app)
        .post(URL_BASE)
        .send(category)
        .set("Authorization", `Bearer ${TOKEN}`);

    categoryId = res.body.id;

    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
});

test("GET -> 'URL_BASE' should return status 200", async () => {
    const res = await request(app).get(URL_BASE);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveLength(1);
});

test("DELETE -> 'URL_BASE' should return status 204", async () => {
    const res = await request(app)
        .delete(`${URL_BASE}/${categoryId}`)
        .set("Authorization", `Bearer ${TOKEN}`);

    expect(res.status).toBe(204);
});
