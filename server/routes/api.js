const express = require('express');
const router = express.Router();

const {
  createWorker,
  readWorker,
  updateWorker,
  deleteWorker,
} = require('../controllers/worker_controller');

const {
  logIn,
  logOut,
  refresh,
  getUser
} = require('..controllers/auth_controller')

router
  .post('/worker', createWorker)
  .get('/worker', readWorker)
  .put('/worker/:id', updateWorker)
  .delete('/worker/:id', deleteWorker);

module.exports = router;
