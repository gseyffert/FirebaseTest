'use strict';

function sanitizeString(str) {
  str = str.replace(/[^a-z0-9áéíóúñü @\.,_-]/gim, '');
  return str.trim();
}

function sanitizeObject(obj) {
  const sanitized = {};
  Object.keys(obj).forEach(key => {
    if (Array.isArray(obj[key])) {
      sanitized[key] = obj[key].map(sanitizeString);
    } else if (typeof obj[key] === 'object') {
      sanitized[key] = sanitizeObject(obj[key]);
    } else if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeString(obj[key]);
    }
  });
  return sanitized;
}

const daysOfTheWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

function buildAvailability(availability) {
  const fullAvailability = {};
  daysOfTheWeek.forEach(day => {
    fullAvailability[day] = availability[day] || false;
  });
  return fullAvailability;
}

function encodePeriodChars(string) {
  return string.replace(/\./g, '%2E');
}

function decodePeriodChars(string) {
  return string.replace(/\%2E/g, '.');
}

const validEntities = [
  'donors', 'drivers', 'receivers',
];

function addEntity(database, body, entity) {
  return new Promise((resolve, reject) => {
    if (validEntities.indexOf(entity) === -1) reject(new Error('Invalid Entity parameter'));

    const entityFields = sanitizeObject(body);

    let err;
    if      (!body.name)         err = 'Missing required field "name"';
    else if (!body.email)        err = 'Missing required field "email"';
    else if (!body.address)      err = 'Missing required field "address"';
    else if (!body.phoneNumber)  err = 'Missing required field "phone number"';
    else if (!body.availability) err = 'Missing user availabilities';
    
    if (err) reject(err);
    else {
      const availability = buildAvailability(body.availability);

      const emailRef = encodePeriodChars(body.email);
      const entityData = {
        name:         body.name,
        email:        body.email,
        address:      body.address,
        phoneNumber:  body.phoneNumber,
        availability: availability,
      };
      const updates = {};
      updates[entity + '/' + emailRef] = entityData;
      Object.keys(availability).forEach(day => {
        if (availability[day]) {
          updates['availability/' + day + '/' + entity + '/' + emailRef] =
            emailRef;
        }
      });
      const entityRef = database.ref().update(updates)
        .then(() => resolve())
        .catch((err) => { console.log(err); reject(err) });
    }
  });
}

function getEntity(database, entity) {
  return new Promise((resolve, reject) => {
    if (validEntities.indexOf(entity) === -1) reject(new Error('Invalid Entity parameter'));
    database.ref(entity).once('value')
      .then((data) => resolve(data.val()))
      .catch((err) => { console.log(err); reject(err); });
  });
}

function getSingleOfEntity(database, email, entity) {
  return new Promise((resolve, reject) => {
    if (!email) reject(new Error('No email provided to getEntity.'));
    if (validEntities.indexOf(entity) === -1) reject(new Error('Invalid Entity parameter'));
    const encodedEmail = encodePeriodChars(email);
    database.ref(entity + '/' + encodedEmail).once('value')
      .then((data) => resolve(data.val()))
      .catch((err) => { console.log(err); reject(err); });
  });
}

exports.sanitizeString = sanitizeString;
exports.sanitizeObject = sanitizeObject;
exports.buildAvailability = buildAvailability;
exports.addEntity = addEntity;
exports.getEntity = getEntity;
exports.getSingleOfEntity = getSingleOfEntity;
