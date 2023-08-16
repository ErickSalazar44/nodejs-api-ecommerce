const User = require("../../models/User");

const userCreate = async () => {
    const user = {
        firstName: "Erick",
        lastName: "Salazar",
        email: "erickearl22@gmail.com",
        password: "123",
        phone: "51+900996311",
    };

    await User.create(user);
};

module.exports = userCreate;
