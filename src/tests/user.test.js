const request = require("supertest");

const URL_USER = "/api/v1/users";

const user = {
    firstName: "Erick",
    lastName: "Salazar",
    email: "erickearl22@gmail.com",
    password: "123",
    phone: "51+900996311",
};

const app = require("../app");
test("POST -> '/api/v1/users'should return status 200 createuser", async () => {
    const res = await request(app).post(URL_USER).send(user);

    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveProperty("firstName", user.firstName);
});
