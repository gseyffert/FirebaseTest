'use strict';
const functions = require('firebase-functions');
const utils = require('./utils.js');

const firebase = require('firebase-admin');
const serviceAccount = require('./testproject-key.json');
firebase.initializeApp({
  credential:  firebase.credential.cert(serviceAccount),
  databaseURL: 'https://testproject-19ef3.firebaseio.com/',
});

const database = firebase.database();
const driverEndpoints = require('./drivers.js')(database);
const donorEndpoints = require('./donors.js')(database);
const receiverEndpoints = require('./receivers.js')(database);

function generateMatches(req, res, next) {
  console.log('Generating matches');
  next();
}

function gettingMatches(req, res, next) {
  console.log('Getting matches');
  next();
}

const populateDatabase = require('./populateDatabase.js').populateDatabase;
exports.populateDatabase = functions.https.onRequest((req, res) => {
  populateDatabase(driverEndpoints, donorEndpoints, receiverEndpoints)
    .then(() => res.status(201).send('database populated'))
    .catch((err) => res.status(500).json(err));
});

exports.generateMatches = functions.https.onRequest((req, res) => {
  switch (req.method) {
    case 'POST':
      generateMatches(req, res,
        () => res.status(200).send('Matches generated')
      );
      break;
    
    case 'GET':
      generateMatches(req, res,
        () => res.status(200).send('Got matches')
      );

    default:
      res.status(403).json('Forbidden').end();
      break;
  }
});

exports.drivers = functions.https.onRequest((req, res) => {
  switch (req.method) {
    case 'POST':
      driverEndpoints.addDriver(req, res)
        .then(() => res.status(201).send('Donor successfully added'))
        .catch((err) => res.status(400).json(err));
      break;

    case 'GET':
      const queryPromise = (req.query && req.query.email)
        ? driverEndpoints.getDriver(req.query.email)
        : driverEndpoints.getAllDrivers();
      
      queryPromise
        .then((driverData) => res.status(200).json(driverData))
        .catch((err) => res.status(400).json(err));
      break;

    case 'PUT':
      console.log('Invoke PUT fn');
      res.status(200).send('Called');
      break;

    default:
      res.status(403).json('Forbidden').end();
      break;
  }
});

exports.donors = functions.https.onRequest((req, res) => {
  switch (req.method) {
    case 'POST':
      donorEndpoints.addDonor(req, res)
        .then(() => res.status(201).send('Donor successfully added'))
        .catch((err) => res.status(400).json(err));
      break;

    case 'GET':
      const queryPromise = (req.query && req.query.email)
        ? donorEndpoints.getDonor(req.query.email)
        : donorEndpoints.getAllDonors();

      queryPromise
        .then((donorData) => res.status(200).json(donorData))
        .catch((err) => res.status(400).json(err));
      break;

    case 'PUT':
      console.log('Invoke PUT fn');
      res.status(200).send('Called');
      break;

    default:
      res.status(403).json('Forbidden').end();
      break;
  }
});

exports.receivers = functions.https.onRequest((req, res) => {
  switch (req.method) {
    case 'POST':
      receiverEndpoints.addReceiver(req, res)
        .then(() => res.status(201).send('Receiver successfully added'))
        .catch((err) => res.status(400).json(err));
      break;

    case 'GET':
      const queryPromise = (req.query && req.query.email)
        ? receiverEndpoints.getReceiver(req.query.email)
        : receiverEndpoints.getAllReceivers();

      queryPromise
        .then((receiverData) => res.status(200).json(receiverData))
        .catch((err) => res.status(400).json(err));
      break;

    case 'PUT':
      console.log('Invoke PUT fn');
      res.status(200).send('Called');
      break;

    default:
      res.status(403).json('Forbidden').end();
      break;
  }
});
