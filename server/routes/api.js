const express = require('express');
const router = express.Router();

const {
  createUser,
  readUser,
  readUserById,
  updateUser,
  deleteUser,
} = require('../controllers/user_controller');

const {
  logIn,
  refreshToken,
  registerNewUser,
  getUserOnLogin,
} = require('../controllers/auth_controller');

const {
  createWorker,
  readWorker,
  updateWorker,
  deleteWorker,
} = require('../controllers/worker_controller');

router
  .post('/user', createUser)
  .get('/user', readUser)
  .get('/user/:id', readUserById)
  .put('/worker/:id', updateUser)
  .delete('/worker/:id', deleteUser);

router
  .post('/auth/login', logIn)
  .post('/auth/register', registerNewUser)
  //.post('/auth/refresh', refreshToken)
  .get('/auth/user', getUserOnLogin);

router
  .post('/worker', createWorker)
  .get('/worker', readWorker)
  .put('/worker/:id', updateWorker)
  .delete('/worker/:id', deleteWorker);

module.exports = router;
