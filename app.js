const express = require("express");
const path = require("path");
const { connectDB, sequelize } = require("./config/database");
const Gym = require("./models/gym");
const Cities = require("./models/city");
const app = express();

connectDB();

sequelize.sync({ force: true })
    .then(() => {
        console.log("Synchronizacja z bazą danych zakończona pomyślnie");
    })
    .catch((error) => {
        console.error("Błąd synchronizacji z bazą danych:", error);
    });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get("/", (req, res) => {
    res.render("home");
})

app.get("/gym", async (req, res) => {
    const gym = new Gym({ name: "Chudy", location: "Wroclaw", price: 20 })
    await gym.save();
    res.send(gym);
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})