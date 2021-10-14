const express = require('express');
const router = express.Router();

const {
  createData,
  readData,
  getData,
  updateData,
  deleteData,
} = require('../controllers/user_controller');

router
  .post('/', createData)
  .get('/', readData)
  .get('/:id', getData)
  .put('/:id', updateData)
  .delete('/:id', deleteData);

const {
  createWorker,
  readWorker,
  updateWorker,
  deleteWorker,
} = require('../controllers/worker_controller');

router
  .post('/worker', createWorker)
  .get('/worker', readWorker)
  .put('/worker/:id', updateWorker)
  .delete('/worker/:id', deleteWorker);

module.exports = router;
