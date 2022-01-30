'use strict';

const TimeEntry = require('../models/time_entry_schema');
const TimeCode = require('../models/time_code_schema');
const WorkerController = require('./worker_controller');

const createTimeEntry = (req, res) => {
    TimeEntry.create(req.body)
    .then((data) => {
      console.log('New Time Entry Created!', data);
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

const readTimeEntry = (req, res) => {
    TimeEntry.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

const readTimeEntryById = (req, res) => {
    TimeEntry.findOne({id: req.params.id})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

const retrieveTimeEntriesForDay = async (req, res) => {
  //Router has already validated JWT at this point
  //We must validate that the worker sending this HTTP request is the same worker in the request body
  const token = req.get("Authorization").split(' ')[1]
  const payload = WorkerController.parseJWT(token)
  const currentUser = payload.user
  const requestedWorker = req.body.workerId
  const currentUserIsAdmin = payload.isAdmin
  const currentUserManagesRequestedWorker = WorkerController.checkUserManagesTargetWorker(currentUser, requestedWorker)

  if (req.body.workerId != payload.user && !currentUserIsAdmin && !currentUserManagesRequestedWorker) {
    res.status(401).json(`You are requesting time entries for worker ${requestedWorker} but are logged in as worker ${currentUser}`)
    return
  } 
  await TimeEntry.find({date: req.body.date, workerId: requestedWorker})
  .then( async (data) => {
    const timeCodes = data.map(timeEntry => timeEntry.timeCodeId)
    const timeCodeIdNameMap = {}
    //Also want the time code name for each entry when returning data
    for await (const timeCode of timeCodes) {
      const linkedTimeCode = await TimeCode.findById(timeCode);
      timeCodeIdNameMap[timeCode] = linkedTimeCode.timeCodeName;
    }
    const entriesToReturn = []
    for await (let timeEntry of data) {
      let jsonEntry = JSON.parse(JSON.stringify(timeEntry))
      jsonEntry ={...jsonEntry , timeCodeName: timeCodeIdNameMap[timeEntry.timeCodeId]} 
      entriesToReturn.push(jsonEntry)
    }
    return res.status(200).json(JSON.stringify(entriesToReturn));
  })
  .catch((err) => {
    console.error(err);
    res.status(500).json(err);
  });
}

const updateTimeEntry = (req, res) => {
    TimeEntry.findByIdAndUpdate(req.params.id, req.body, {
    useFindAndModify: false,
    new: true,
  })
    .then((data) => {
      console.log('Time Entry updated!');
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

const submitEntriesForDay = async (req, res) => {
  try {
    const date = new Date(req.body.date.key)
    const entries = await TimeEntry.find({workerId: req.body.workerId, date: date })
    if (entries.length == 0) {
      return res.status(200).json('No entries for date')
    }
    const entryIDs = entries.map(entry => entry._id.toString())
    //Using counter as forEach is synchronous and executing in parallel
    var entriesProcessed = 0
    //To wait for all the iterations to finish before moving on, use a foreach to process in parallel
    entryIDs.forEach(async (entryID) => {
      await TimeEntry.findByIdAndUpdate(entryID, { submitted: true }, {
        new: true,
      });
      entriesProcessed++;
      if (entriesProcessed == entryIDs.length) {
        return res.status(200).json("Successfully submitted time entries");
      }
    });
  } catch (err) {
    return res.status(500).json(err)
  }
};

const deleteTimeEntry = (req, res) => {
    TimeEntry.findById(req.params.id)
    .then((data) => {
      if (!data) {
        throw new Error('Time Entry not available');
      }
      return data.remove();
    })
    .then((data) => {
      console.log('Time Entry removed!');
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(err);
    });
};

module.exports = {
  createTimeEntry,
  readTimeEntry,
  readTimeEntryById,
  retrieveTimeEntriesForDay,
  updateTimeEntry,
  submitEntriesForDay,
  deleteTimeEntry
};
