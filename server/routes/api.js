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

const {
  createProject,
  readProject,
  readProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/project_controller');

const {
  createTeam,
  readTeam,
  readTeamById,
  updateTeam,
  deleteTeam,
} = require('../controllers/team_controller');

const {
  createTimeCode,
  readTimeCode,
  readTimeCodeById,
  updateTimeCode,
  deleteTimeCode,
} = require('../controllers/time_code_controller');

const {
  createTimeEntry,
  readTimeEntry,
  readTimeEntryById,
  updateTimeEntry,
  deleteTimeEntry,
} = require('../controllers/time_entry_controller');

router
  .post('/user', createUser)
  .get('/user', readUser)
  .get('/user/:id', readUserById)
  .put('/worker/:id', updateUser)
  .delete('/worker/:id', deleteUser);

router
  .post('/auth/login', logIn)
  .post('/auth/register', registerNewUser)
  .post('/auth/refresh', refreshToken)
  .get('/auth/user', getUserOnLogin);

router
  .post('/worker', createWorker)
  .get('/worker', readWorker)
  .put('/worker/:id', updateWorker)
  .delete('/worker/:id', deleteWorker);

router
  .post('/project', createProject)
  .get('/project', readProject)
  .get('/project/:id', readProjectById)
  .put('/project/:id', updateProject)
  .delete('/project/:id', deleteProject);

router
  .post('/team', createTeam)
  .get('/team', readTeam)
  .get('/team/:id', readTeamById)
  .put('/team/:id', updateTeam)
  .delete('/team/:id', deleteTeam);

router
.post('/time_code', createTimeCode)
.get('/time_code', readTimeCode)
.get('/time_code/:id', readTimeCodeById)
.put('/time_code/:id', updateTimeCode)
.delete('/time_code/:id', deleteTimeCode);

router
.post('/time_entry', createTimeEntry)
.get('/time_entry', readTimeEntry)
.get('/time_entry/:id', readTimeEntryById)
.put('/time_entry/:id', updateTimeEntry)
.delete('/time_entry/:id', deleteTimeEntry);

module.exports = router;
