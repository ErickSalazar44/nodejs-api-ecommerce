const request = require("supertest");
const app = require("../app");

const URL_BASE = "/api/v1/users";
let TOKEN;
let userID;

beforeAll(async () => {
    const user = {
        email: "erickearl22@gmail.com",
        password: "123",
    };
    const login = await request(app).post(`${URL_BASE}/login`).send(user);
    TOKEN = login.body.token;
});

test("GET -> 'URL_BASE'should return status 200 and res.body.length === 1", async () => {
    const res = await request(app)
        .get(URL_BASE)
        // Agregar el token al encabezado de autorización)
        .set("Authorization", `Bearer ${TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveLength(1);
});

test("POST -> 'URL_BASE'should return status code 201 and res.body definido", async () => {
    const user = {
        firstName: "Jos",
        lastName: "Salazar",
        email: "erickearl@gmail.com",
        password: "123",
        phone: "51+900996311",
    };

    const res = await request(app).post(URL_BASE).send(user);
    userID = res.body.id;

    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("firstName", user.firstName);
    expect(res.body.firstName).toBe(user.firstName);
});

test(" PUT -> 'URL_BASE/:id' should return status 200", async () => {
    const userActualizado = {
        firstName: "Josep",
        lastName: "Salaz",
    };

    const res = await request(app)
        .put(`${URL_BASE}/${userID}`)
        .send(userActualizado)
        .set("Authorization", `Bearer ${TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("firstName", userActualizado.firstName);
});

test(" POST -> 'URL_BASE/login'should return status code 200, res.body.email = user.email and res.body.token to be defined", async () => {
    const user = {
        email: "erickearl@gmail.com",
        password: "123",
    };

    const res = await request(app).post(`${URL_BASE}/login`).send(user);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.user).toHaveProperty("email", user.email);
    expect(res.body.token).toBeDefined();
});

test(" POST -> 'URL_BASE/login'should return status code 401", async () => {
    const user = {
        email: "erickearl@gmail.com",
        password: "contraseñaInvalida",
    };

    const res = await request(app).post(`${URL_BASE}/login`).send(user);

    expect(res.status).toBe(401);
});

test("DELETE -> 'URL_BASE/:id' should return status code 204", async () => {
    const res = await request(app)
        .delete(`${URL_BASE}/${userID}`)
        .set("Authorization", `Bearer ${TOKEN}`);

    expect(res.status).toBe(204);
});
