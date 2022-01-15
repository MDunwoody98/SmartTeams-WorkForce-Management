const bcrypt = require("bcryptjs");
const userModel = require('../models/user_schema');
const workerModel = require('../models/worker_schema');
const teamModel = require('../models/team_schema');
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

const logIn = async (req, res, next) => {
  try {
    const { workerId, password } = req.body;
    const user = await userModel.findOne({ workerId: workerId });

    if (!user) {
      const error = new Error("No employee with this ID exists on SmartTeams");
      error.statusCode = 401;
      throw error;
    }
    // Need await keyword as promise is pending
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      const error = new Error("Error. Wrong password");
      error.statusCode = 401;
      throw error;
    }
    //Does a Worker profile exist for this user?
    let linkedWorkerProfile = await workerModel.findOne({ workerId: workerId });
    console.log("Logged in")
    //Is the worker a manager?
    let workerIsManager = false
    if (await teamModel.find({managerId: workerId})) {
      workerIsManager = true
    }
    //Is the worker an admin?
    let workerIsAdmin = false
    if (user.isAdmin) {
      workerIsAdmin = true
    }
    const token = jwt.sign({ user: user.workerId, isManager: workerIsManager, isAdmin: workerIsAdmin }, process.env.JWT_SECRET, {
      expiresIn: "30m", // it will expire token after 30 minutes
    });
    const refreshToken = jwt.sign({ user: user.workerId, isManager: workerIsManager, isAdmin: workerIsAdmin }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "43200m",
    });
    //maybe don't return the worker profile in the response here ?
    //Return differently based on whether the user has a worker account
    res.status(200).json({ token: token, refresh_token: refreshToken, user: linkedWorkerProfile });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getUserOnLogin = async (req, res, next) => { 
  // this function will send user data to the front-end as I said above authFetch on the user object in nuxt.config.js will send a request and it will execute
  //return stuff differently if a worker profile exists for the user ???
  try {
    const authHeader = req.get("Authorization");//<bearer token>
    if (!authHeader) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }
    if (!decodedToken) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      throw error;
    }
    const loggedInUserId = decodedToken.user;
    let linkedWorkerProfile = await workerModel.findOne({ workerId: loggedInUserId });
    res.status(200).json({
      user: {
        workerId: loggedInUserId,
        worker: linkedWorkerProfile
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
//needs work
const refreshToken = (req, res) => {
  const tokenToRefresh = req.body.refresh_token
  console.log(tokenToRefresh)
  var decoded = jwt.decode(tokenToRefresh)
  const userID = decoded.user
  const exp = decoded.exp
  const admin = decoded.isAdmin
  const manager = decoded.isManager
  if (!decoded || !userID || !exp) {
    res.status(403).send('Input data not valid')
  }
  if (Date.now() >= exp * 1000) {
    res.status(403).send('Refresh Token expired')
  }
  // if refresh token exists and is valid
  if((tokenToRefresh) && (jwt.verify(tokenToRefresh, process.env.JWT_REFRESH_SECRET))) {
    //Check if user is manager and/or admin
     const accessToken = jwt.sign({user: userID, isManager: manager, isAdmin: admin}, process.env.JWT_SECRET, {
       expiresIn: "30m",
     });
     console.log(accessToken)
     res.status(200).json({refresh_token: tokenToRefresh, access_token: accessToken, user: '12342'})  
   } else {
     res.status(403).send('Invalid request')
   }
}

module.exports = {
    registerNewUser,
    logIn,
    getUserOnLogin,
    refreshToken,
};