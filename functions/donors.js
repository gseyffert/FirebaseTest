'use strict';
const utils = require('./utils.js');

module.exports = (database) => {
  const entity         = 'donors';
  const donorFunctions = {};

  donorFunctions.addDonor = function addDonor(req, res) {
    return utils.addEntity(database, req.body, entity);
  }

  donorFunctions.getAllDonors = function getAllDonors(req, res, next) {
    return utils.getEntity(database, entity);
  }

  donorFunctions.getDonor = function getDonor(email) {
    return utils.getSingleOfEntity(database, email, entity);
  }

  return donorFunctions;
}