'use strict';

const TimeCode = require('../models/time_code_schema');
const Team = require('../models/team_schema');
const Project = require('../models/project_schema');
const WorkerController = require('./worker_controller');

const createTimeCode = (req, res) => {
    TimeCode.create(req.body)
    .then((data) => {
      console.log('New Time Code Created!', data);
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

const readTimeCode = (req, res) => {
    TimeCode.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

const readTimeCodeById = (req, res) => {
    TimeCode.findOne({_id: req.params.id})
    .then((data) => {
      res.status(200).json(data);
      return
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

const retrieveTimeCodesForWorker = async (req, res) => {
  const token = req.get("Authorization").split(' ')[1]
  const payload = WorkerController.parseJWT(token)
  const currentUser = payload.user
  const requestedWorker = req.params.workerId
  const currentUserIsAdmin = payload.isAdmin
  const currentUserManagesRequestedWorker = WorkerController.validateManageMent(currentUser, requestedWorker)

  if (req.body.workerId != payload.user && !currentUserIsAdmin && !currentUserManagesRequestedWorker) {
    res.status(401).json(`You are requesting time codes accesible to worker ${requestedWorker} but are logged in as worker ${currentUser}`)
    return
  } 
  //Get all teams where worker is member
  //Get all project Ids that are associated with that team
  //Get all time codes for those projects
  //Return Map String -> String[] of project ID -> Time Codes
  let projectsAndAssociatedTimeCodes = new Map()
  try {
    const teams = await Team.find({memberId: requestedWorker})
    // Get all project IDs from all teams that the worker is a member of, then flatten the nested arrays into 1 array and remove duplicates
    let projects = WorkerController.flatten(teams.map(team => team.projectId)).reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[])
    if (!projects) {
      res.status(200).json('{}')
      return
    }
    //Using counter as forEach is synchronous and executing in parallel
    var projectsProcessed = 0
    //To wait for all the iterations to finish before moving on, use a foreach to process in parallel
    await projects.forEach(async project => {
    let linkedTimeCodes = await TimeCode.find({projectId: project})
    linkedTimeCodes = linkedTimeCodes.map(timeCode => [timeCode._id, timeCode.timeCodeName])
    let projectObj = await Project.findById(project)
    projectObj = JSON.stringify(projectObj)
    projectsAndAssociatedTimeCodes.set(projectObj, linkedTimeCodes)
    projectsProcessed++
    if (projectsProcessed == projects.length) {
      res.status(200).json(Object.fromEntries(projectsAndAssociatedTimeCodes))
      return
    }
    })
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

const updateTimeCode = (req, res) => {
    TimeCode.findByIdAndUpdate(req.params.id, req.body, {
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

const deleteTimeCode = (req, res) => {
  //TODO - project manager can also delete time code
  const token = req.get("Authorization").split(' ')[1]
  const payload = WorkerController.parseJWT(token)
  if (!payload.isAdmin) {
    return res.status(501).json('Only admin users can delete time codes')
  }
  TimeCode.findById(req.params.id)
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
  createTimeCode,
  readTimeCode,
  readTimeCodeById,
  retrieveTimeCodesForWorker,
  updateTimeCode,
  deleteTimeCode,
};
