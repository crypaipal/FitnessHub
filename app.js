const express = require("express");
const path = require("path");
const { connectDB, sequelize } = require("./config/database");
const Gym = require("./models/gym");
const methodOverride = require("method-override");
const Cities = require("./models/city");

connectDB();
sequelize.sync()
    .then(() => {
        console.log("Synchronisation with the database successfully completed");
    })
    .catch((error) => {
        console.error("Database synchronisation error:", error);
    });

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


app.get("/", (req, res) => {
    res.render("home");
})

app.get("/gyms", async (req, res) => {
    const gyms = await Gym.findAll({});
    res.render("gyms/index", { gyms });
})

app.get("/gyms/new", (req, res) => {
    res.render("gyms/new")
})

app.post("/gyms", async (req, res) => {
    const gym = new Gym(req.body.gym);
    await gym.save();
    res.redirect(`/gyms/${gym.id}`);
})

app.get("/gyms/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const gym = await Gym.findByPk(id);
    res.render("gyms/show", { gym });
})

app.get("/gyms/:id/edit", async (req, res) => {
    const id = parseInt(req.params.id);
    const gym = await Gym.findByPk(id);
    res.render("gyms/edit", { gym });
})

app.put("/gyms/:id", async (req, res) => {
    const { id } = req.params;
    const findGym = await Gym.findByPk(id);
    const gym = await findGym.update({ ...req.body.gym });
    res.redirect(`/gyms/${gym.id}`);
})

app.delete("/gyms/:id", async (req, res) => {
    const { id } = req.params;
    const findGym = await Gym.findByPk(id);
    const gym = await findGym.destroy();
    res.redirect("/gyms");
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})