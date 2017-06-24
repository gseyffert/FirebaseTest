'use strict';
const utils = require('./utils.js');

module.exports = (database) => {
  const entity          = 'drivers';
  const driverFunctions = {};

  driverFunctions.addDriver = function addDriver(req, res) {
    return utils.addEntity(database, req.body, entity);
  }

  driverFunctions.getAllDrivers = function getAllDrivers(req, res) {
    return utils.getEntity(database, entity);
  }

  driverFunctions.getDriver = function getDriver(email) {
    return utils.getSingleOfEntity(database, email, entity);
  }

  return driverFunctions;
}
