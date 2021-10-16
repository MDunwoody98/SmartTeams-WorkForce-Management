'use strict';

const bcrypt = require("bcryptjs");
const userModel = require('../models/user_schema');
const jwt = require("jsonwebtoken");

const registerNewUser = async (req, res, next) => {
  const { workerId, password } = req.body;
  try {
    const userExists = await userModel.findOne({ workerId: workerId });
    if (userExists) {
      const error = new Error(
        "A user account already exists for this worker"
      );
      res.status(409).json({
        error: "A user account already exists for this worker",
      });
      error.statusCode = 409;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new userModel({
      workerId: workerId,
      password: hashedPassword,
    });
    const result = await user.save();
    res.status(200).json({
      message: "User created",
      user: { objectId: result._id, workerId: result.workerId },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

let loadedUser;
const logIn = async (req, res, next) => {
  const { workerId, password } = req.body;
  try {
    const user = await userModel.findOne({ workerId: workerId });

    if (!user) {
      const error = new Error("No employee with this ID exists on SmartTeams");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;

    const comparePassword = bcrypt.compare(password, user.password);

    if (!comparePassword) {
      const error = new Error("Error. Wrong password");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({ email: loadedUser.email }, process.env.JWT_SECRET, {
      expiresIn: "30m", // it will expire token after 20 minutes and if the user then refresh the page will log out
    });
    res.status(200).json({ token: token });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getUser = (req, res, next) => { // this function will send user data to the front-end as I said above authFetch on the user object in nuxt.config.js will send a request and it will execute
  res.status(200).json({
    user: {
      id: loadedUser._id,
      fullname: loadedUser.fullname,
      email: loadedUser.email,
    },
  });
};
module.exports = {
    registerNewUser,
    logIn,
};