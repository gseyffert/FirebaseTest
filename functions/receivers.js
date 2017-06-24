'use strict';
const utils = require('./utils.js');

module.exports = (database) => {
  const entity            = 'receivers';
  const receiverFunctions = {};

  receiverFunctions.addReceiver = function addReceiver(req, res, next) {
    return utils.addEntity(database, req.body, entity);
  }

  receiverFunctions.getAllReceivers = function getAllReceivers(req, res, next) {
    return utils.getEntity(database, entity);
  }

  receiverFunctions.getReceiver = function getReceiver(email) {
    return utils.getSingleOfEntity(database, email, entity);
  }

  return receiverFunctions;
};