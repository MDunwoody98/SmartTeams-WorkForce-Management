const bcrypt = require("bcryptjs");
const userModel = require('../models/user_schema');
const workerModel = require('../models/worker_schema');
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
let loadedWorker;

const logIn = async (req, res, next) => {
  const { workerId, password } = req.body;
  try {
    const user = await userModel.findOne({ workerId: workerId });

    if (!user) {
      const error = new Error("No employee with this ID exists on SmartTeams");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user
    // Need await keyword as promise is pending
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      const error = new Error("Error. Wrong password");
      error.statusCode = 401;
      throw error;
    }
    //Does a Worker profile exist for this user?
    loadedWorker = await workerModel.findOne({ workerId: workerId });
    console.log("Logged in")
    const token = jwt.sign({ user: loadedUser.workerId }, process.env.JWT_SECRET, {
      expiresIn: "30m", // it will expire token after 30 minutes and if the user then refresh the page will log out
    });
    // do the database authentication here, with user name and password combination.
    const refreshToken = jwt.sign({user: loadedUser.workerId}, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "43200m",
    });
    res.status(200).json({ token: token, refresh_token: refreshToken, user: loadedWorker });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getUserOnLogin = (req, res, next) => { // this function will send user data to the front-end as I said above authFetch on the user object in nuxt.config.js will send a request and it will execute
  //return stuff differently if a worker profile exists for the user ???
  console.log("Hello")
  res.status(200).json({
    user: {
      workerId: loadedUser._id,
      worker: loadedWorker
    },
  });
};

const refreshToken = (req, res) => {

}

module.exports = {
    registerNewUser,
    logIn,
    getUserOnLogin,
    refreshToken,
};