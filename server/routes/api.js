const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");

// a middleware function with no mount path. This code is executed for EVERY request to the router
// Token auth for API requests. Should apply to every endpoint except /auth
// If it fails, client should refresh token and retry
router.use(function (req, res, next) {
  if (req.path.substring(1,5) == "auth") return next('route');
    const authHeader = req.headers.authorization;
    // also validate that user is who they claim to be
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.sendStatus(403).json(err);
            }
            req.decoded = decoded;
            next('route');
        });
    } else {
      res.sendStatus(401);
    }
});
//MULTI TENANCY MULTIPLE SECRETS
// var secretCallback = function(req, payload, done){
//   var issuer = payload.iss;

//   data.getTenantByIdentifier(issuer, function(err, tenant){
//     if (err) { return done(err); }
//     if (!tenant) { return done(new Error('missing_secret')); }

//     var secret = utilities.decrypt(tenant.secret);
//     done(null, secret);
//   });
// };

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
  readWorkerByWorkerId,
  checkUserManagesTargetWorker,
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
  readTeamsByManager,
  updateTeam,
  deleteTeam,
} = require('../controllers/team_controller');

const {
  createTimeCode,
  readTimeCode,
  readTimeCodeById,
  retrieveTimeCodesForWorker,
  updateTimeCode,
  deleteTimeCode,
} = require('../controllers/time_code_controller');

const {
  createTimeOffCode,
  readTimeOffCode,
  readTimeOffCodeById,
  retrieveTimeOffCodesForWorker,
  updateTimeOffCode,
  deleteTimeOffCode,
} = require('../controllers/time_off_code_controller');

const {
  createTimeEntry,
  readTimeEntry,
  readTimeEntryById,
  retrieveTimeEntriesForDay,
  approveTimeEntry,
  approveTimeEntries,
  rejectTimeEntry,
  updateTimeEntry,
  submitEntriesForDay,
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
  .get('/worker/:id', readWorkerByWorkerId)
  .get('/worker/checkManager/:id',checkUserManagesTargetWorker)
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
  .get('/team/manager/:id', readTeamsByManager)
  .put('/team/:id', updateTeam)
  .delete('/team/:id', deleteTeam);

router
.post('/time_code', createTimeCode)
.get('/time_code', readTimeCode)
.get('/time_code/:id', readTimeCodeById)
.get('/time_code/worker/:workerId', retrieveTimeCodesForWorker)
.put('/time_code/:id', updateTimeCode)
.delete('/time_code/:id', deleteTimeCode);

router
.post('/time_off_code', createTimeOffCode)
.get('/time_off_code', readTimeOffCode)
.get('/time_off_code/:id', readTimeOffCodeById)
.get('/time_off_code/worker/:workerId', retrieveTimeOffCodesForWorker)
.put('/time_off_code/:id', updateTimeOffCode)
.delete('/time_off_code/:id', deleteTimeOffCode);

router
.post('/time_entry', createTimeEntry)
.post('/time_entry/full_day', retrieveTimeEntriesForDay)
.get('/time_entry', readTimeEntry)
.get('/time_entry/:id', readTimeEntryById)
.put('/time_entry/approve/:id', approveTimeEntry)
.put('/time_entry/approveDay', approveTimeEntries)
.put('/time_entry/reject/:id', rejectTimeEntry)
.put('/time_entry/:id', updateTimeEntry)
.put('/time_entry/submit/day', submitEntriesForDay)
.delete('/time_entry/:id', deleteTimeEntry);

module.exports = router;
