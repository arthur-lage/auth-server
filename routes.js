const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken")

const User = require("./model/User");

const bcrypt = require("bcrypt");

const auth = require('./middleware/auth')

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

router.get("/api/users/user-info", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id)

    const info = {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }
  
    res.status(200).json(info)
  } catch (e) {
    console.log(e)
  }
})

router.post("/api/users/register", async (req, res) => {
  try {
    const saltRounds = 10;
    const { name, email, password } = req.body

    if (!(name && email && password)) {
      return res.status(400).send("All fields are required");
    }

    const oldUser = await User.findOne({ email })

    if(oldUser) {
      return res.status(409).send("User already exists. Please login...")
    }

    let encryptedPassword = await bcrypt.hash(password, saltRounds)

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    })

    const token = jwt.sign({
      user_id: user._id,
      email
    }, process.env.JWT_SECRET, {
      expiresIn: "2h"
    })

    user.token = token

    res.status(201).json(user)
  } catch (e) {
    console.log(e);
  }
});

router.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if(!(email && password)) {
      res.status(400).send("All fields are required")
    }

    const user = await User.findOne({ email })

    if(user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({
        user_id: user._id,
        email
      }, process.env.JWT_SECRET, {
        expiresIn: "2h"
      })

      user.token = token

      res.status(200).json(user)
    }
    
    res.status(400).send("Invalid credentials")
  } catch(e) {
    console.log(e)
  }
});

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
