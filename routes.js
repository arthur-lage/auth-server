const express = require("express");
const router = express.Router();

const User = require("./models/User");

const bcrypt = require("bcrypt");

router.get("/api/users/get", async (req, res) => {
  try {
    const users = await User.find();

    return res.send(users);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.get("/api/users/get/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      return res.send(user);
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  });

router.post("/api/users/register", async (req, res) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.sendStatus(400);
    }

    const equalEmail = await User.find({ email: req.body.email })

    if (equalEmail.length == 0) {
      const saltRounds = 10;

      await bcrypt.hash(
        req.body.password,
        saltRounds,
        async (err, encryptedPassword) => {
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          }

          const user = {
            name: req.body.name,
            email: req.body.email,
            password: encryptedPassword,
          };

          await User.create(user, (error, result) => {
            if (error) {
              console.log(error);
              return res.sendStatus(500);
            }

            return res.sendStatus(201);
          });
        }
      );
    } else {
      res.sendStatus(409);
    }
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.post("/api/users/login", async (req, res) => {});

router.delete("/api/users/delete-all", async (req, res) => {
  try {
    await User.deleteMany();

    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.delete("/api/users/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    return res.sendStatus(200);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

module.exports = router;
