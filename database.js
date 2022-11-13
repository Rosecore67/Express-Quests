require("dotenv").config();

const mysql = require("mysql2/promise");

const database = mysql.createPool({
    host: process.env.DB_HOST, // address of the server
    port: process.env.DB_PORT, // port of the DB server (mysql), not to be confused with the APP_PORT !
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  database
  .getConnection()
  .then(() => {
    console.log("Can reach database");
  })
  .catch((err) => {
    console.error(err);
  });

  const getMovies = (req, res) => {
    let sql = "select * from movies";
    const sqlValues = [];

    if (req.query.color != null) {
      sql += " where color = ?";
      sqlValues.push(req.query.color);

      if (req.query.max_duration != null) {
        sql += " and duration <= ?";
        sqlValues.push(req.query.max_duration);
      }
        } else if (req.query.max_duration != null) {
          sql += " where duration <= ?";
          sqlValues.push(req.query.max_duration);
      } 
  

    database
      .query(sql, sqlValues)
      .then(([movies]) => {
        res.json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };

const getUsers = (req, res) => {
      let sql = "select * from users";
      const sqlValues = [];

      if (req.query.language != null) {
        sql += " where language = ?";
      sqlValues.push(req.query.color);

      if (req.query.city != null) {
      sql += " and city = ?";
      sqlValues.push(req.query.city);
    }
  } else if (req.query.language != null) {
    sql += " where language = ?";
    sqlValues.push(req.query.language);
  }

    database
    .query("select * from users")
    .then(([user]) => {
      console.log(user);
    })
    .catch((err) => {
      console.error(err);
    });
};
  module.exports = database;