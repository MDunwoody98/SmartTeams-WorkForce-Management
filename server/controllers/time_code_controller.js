'use strict';

const TimeCode = require('../models/time_code_schema');
const Team = require('../models/team_schema');

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
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

const retrieveTimeCodesForWorker = async (req, res) => {
  //Get all teams where worker is member
  //Get all project Ids that are associated with that team
  //Get all time codes for those projects
  //Return Map String -> String[] of project ID -> Time Codes
  let projectsAndAssociatedTimeCodes = new Map()
  try {
    const teams = await Team.find({memberId: req.params.workerId})
    const projects = teams.map(team => team.projectId)[0]
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
      projectsAndAssociatedTimeCodes.set(project, linkedTimeCodes)
      projectsProcessed++
      if (projectsProcessed == projects.length) {
        res.status(200).json(Object.fromEntries(projectsAndAssociatedTimeCodes))
      }
    })
  }
  catch (err) {
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
