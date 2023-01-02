const argon2 = require("argon2");

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (req, res, next) => {
  argon2
    .hash(req.body.password, hashingOptions)
    .then((hashedPassword) => {
      req.body.hashedPassword = hashedPassword;
      delete req.body.password;
      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyPassword = async (req, res) => {
  try {
      if (await argon2.verify(req.user.hashedPassword, req.body.password)) {
          const payload = {
              fistname: req.user.firstname,
              email: req.user.email,
              city: req.user.city,
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
              expiresIn: "1h",
          });
          delete req.user.hashedPassword;
          res.send(token);
      } else res.sendStatus(401);
  } catch (err) {
      console.log(err);
  }
};

const verifyToken = (req, res, next) => {
  try {
      const authorizationHeader = req.get("Authorization");
      if (authorizationHeader == null) {
          throw new Error("Auth header is missing");
      }
      const [type, token] = authorizationHeader.split(" ");

      if (type != "Bearer")
          throw new Error("Auth header has not the Bearer type");
      req.payload = jwt.verify(token, process.env.JWT_SECRET);
      next();
  } catch (err) {
      console.log(err);
      res.sendStatus(401);
  }
};

const verifyUser = (req, res, next) => {
  const id = req.params.id;
  database
      .query("select email from users where id = ?", [id])
      .then(([result]) => {
          if (result[0].email === req.payload.email) {
              console.log("test");
              next();
          } else {
              res.sendStatus(403);
          }
      });
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyUser
};