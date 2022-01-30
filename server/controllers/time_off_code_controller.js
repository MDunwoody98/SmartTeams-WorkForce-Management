'use strict';

const TimeOffCode = require('../models/time_off_code_schema');
const Team = require('../models/team_schema');
const WorkerController = require('./worker_controller');

const createTimeOffCode = (req, res) => {
    TimeOffCode.create(req.body)
    .then((data) => {
      console.log('New Time Off Code Created!', data);
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

const readTimeOffCode = (req, res) => {
    TimeOffCode.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

const readTimeOffCodeById = (req, res) => {
    TimeOffCode.findOne({_id: req.params.id})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

const retrieveTimeOffCodesForWorker = async (req, res) => {
  const token = req.get("Authorization").split(' ')[1]
  const payload = WorkerController.parseJWT(token)
  const currentUser = payload.user
  const requestedWorker = req.params.workerId
  const currentUserIsAdmin = payload.isAdmin
  const currentUserManagesRequestedWorker = WorkerController.checkUserManagesTargetWorker(currentUser, requestedWorker)

  if (req.body.workerId != payload.user && !currentUserIsAdmin && !currentUserManagesRequestedWorker) {
    res.status(401).json(`You are requesting time codes accesible to worker ${requestedWorker} but are logged in as worker ${currentUser}`)
    return
  } 
  //Get all teams where worker is member
  //Get all Time Off Code Ids that are associated with those teams
  //Return array of all time off code objects for those IDs
  try {
    const teams = await Team.find({memberId: req.params.workerId})
    const timeOffCodeIds = teams.map(team => team.timeOffCodeId)[0]
    if (!timeOffCodeIds) {
      res.status(200).json('[]')
      return
    }
    if (timeOffCodeIds.length == 0) {
      res.status(200).json('[]')
      return
    }
    const timeOffCodes = []
    //Using counter as forEach is synchronous and executing in parallel
    var timeOffCodesProcessed = 0
    //To wait for all the iterations to finish before moving on, use a foreach to process in parallel
      await timeOffCodeIds.forEach(async timeOffCodeID => {
      let timeOffCodeObj = await TimeOffCode.find({_id: timeOffCodeID})
      timeOffCodeObj = timeOffCodeObj.map(timeOffCodeObj => {timeOffCodeObj._id, timeOffCodeObj.timeOffCodeName})
      timeOffCodes.push(timeOffCodeObj)
      timeOffCodesProcessed++
      if (timeOffCodesProcessed == timeOffCodeIds.length) {
        res.status(200).json(timeOffCodes)
      }
    })
  }
  catch (err) {
    console.log('time off error '+err)
    res.status(500).json(err)
  }
}

const updateTimeOffCode = (req, res) => {
    TimeOffCode.findByIdAndUpdate(req.params.id, req.body, {
    useFindAndModify: false,
    new: true,
  })
    .then((data) => {
      console.log('Time Code updated!');
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

const deleteTimeOffCode = (req, res) => {
    TimeOffCode.findById(req.params.id)
    .then((data) => {
      if (!data) {
        throw new Error('Time Code not available');
      }
      return data.remove();
    })
    .then((data) => {
      console.log('Time Code removed!');
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

module.exports = {
  createTimeOffCode,
  readTimeOffCode,
  readTimeOffCodeById,
  retrieveTimeOffCodesForWorker,
  updateTimeOffCode,
  deleteTimeOffCode,
};
