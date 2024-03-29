'use strict';

const Worker = require('../models/worker_schema');
const Team = require('../models/team_schema');

const createWorker = (req, res) => {
  const token = req.get("Authorization").split(' ')[1]
  const payload = parseJWT(token)
  if (!payload.isAdmin) {
    return res.status(501).json('Only admin users can create workers')
  }
  Worker.create(req.body)
    .then((data) => {
      console.log('New Worker Created!', data);
      res.status(201).json(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.error('Error Validating!', err);
        res.status(422).json(err);
      } else {
        console.error(err);
        res.status(500).json(err);
      }
    });
};

const readWorker = (req, res) => {
  const token = req.get("Authorization").split(' ')[1]
  const payload = parseJWT(token)
  if (!payload.isAdmin) {
    return res.status(501).json('Only admin users can retrieve all workers')
  }
  Worker.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

const readWorkerByWorkerId = (req, res) => {
  const token = req.get("Authorization").split(' ')[1]
  const payload = parseJWT(token)
  const currentUser = payload.user
  const requestedWorker = req.params.workerId
  const currentUserIsAdmin = payload.isAdmin
  const currentUserManagesRequestedWorker = validateManageMent(currentUser, requestedWorker)

  if (req.body.workerId != payload.user && !currentUserIsAdmin && !currentUserManagesRequestedWorker) {
    res.status(401).json(`You are data for worker ${requestedWorker} but are logged in as worker ${currentUser}`)
    return
  }

  Worker.findOne({ workerId: req.params.id })
    .then((data) => {
      res.status(200).json(data);
      return
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
      return
    });
};

const updateWorker = (req, res) => {
  const token = req.get("Authorization").split(' ')[1]
  const payload = parseJWT(token)
  if (!payload.isAdmin) {
    return res.status(501).json('Only admin users can update workers')
  }

  Worker.findOneAndUpdate({ workerId: String(req.params.id) }, req.body, {
    useFindAndModify: false,
    new: true,
  })
    .then((data) => {
      console.log('Worker updated!');
      res.status(201).json(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.error('Error Validating!', err);
        res.status(422).json(err);
      } else {
        console.error(err);
        res.status(500).json(err);
      }
    });
};

const deleteWorker = (req, res) => {
  const token = req.get("Authorization").split(' ')[1]
  const payload = parseJWT(token)
  if (!payload.isAdmin) {
    return res.status(501).json('Only admin users can delete workers')
  }
  Worker.findOne({ workerId: String(req.params.id) })
    .then((data) => {
      if (!data) {
        throw new Error('Worker not available');
      }
      return data.remove();
    })
    .then((data) => {
      console.log('Worker removed!');
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

const validateManageMent = async (currentUser, targetWorker) => {
  //find all teams for which currentUser is a manager
  //get worker IDs of all members of those teams
  if (!targetWorker || !currentUser) return
  const managedTeams = await Team.find({ managerId: currentUser })
  if (managedTeams.length == 0) return false
  //Array of arrays => flatten to 1 array => remove duplicates
  const membersInManagedTeams = flatten(managedTeams.map(team => team.memberId)).reduce(function (a, b) { if (a.indexOf(b) < 0) a.push(b); return a; }, [])
  return membersInManagedTeams.includes(parseInt(targetWorker))
}

const checkUserManagesTargetWorker = async (req, res) => {
  const requestedWorker = req.params.id
  const token = req.get("Authorization").split(' ')[1]
  const payload = parseJWT(token)
  const currentUser = payload.user
  const currentUserIsAdmin = payload.isAdmin
  const currentUserManagesRequestedWorker = await validateManageMent(currentUser, requestedWorker)
  return res.status(200).json(currentUserManagesRequestedWorker);
}

function parseJWT(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString().split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};

module.exports = {
  parseJWT,
  createWorker,
  readWorker,
  readWorkerByWorkerId,
  validateManageMent,
  flatten,
  checkUserManagesTargetWorker,
  updateWorker,
  deleteWorker,
};
