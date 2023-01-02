require("dotenv").config();
const express = require("express");
const {
    hashPassword,
    verifyPassword,
    verifyToken,
    verifyUser,
} = require("./auth.js");
const movieHandlers = require("./movieHandlers");
const usersHandlers = require("./usersHandlers");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
    res.send("Welcome to my favourite movie list");
};

//public routes
app.get("/", welcome);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", usersHandlers.getUsers);
app.get("/api/users/:id", usersHandlers.getUsersById);
app.post(
    "/api/login",
    usersHandlers.getUserByEmailWithPasswordAndPassToNext,
    verifyPassword
);
app.post("/api/users", hashPassword, userHandlers.postUser);

// private routes
app.use(verifyToken);
app.put("/api/users/:id", verifyUser, usersHandlers.updateUser);
app.delete("/api/users/:id", verifyUser, usersHandlers.deleteUser);
app.post("/api/movies", movieHandlers.postMovie);
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

app.listen(port, (err) => {
    if (err) {
        console.error("Something bad happened");
    } else {
        console.log(`Server is listening on ${port}`);
    }
});