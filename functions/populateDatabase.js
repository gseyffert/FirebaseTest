'use strict';
const utils = require('./utils');
const emptyAvailability = {
  'Monday': null,
  'Tuesday': null,
  'Wednesday': null,
  'Thursday': null,
  'Friday': null,
  'Saturday': null,
  'Sunday': null
};

const idxMapping = {
  0: 'Monday',
  1: 'Tuesday',
  2: 'Wednesday',
  3: 'Thursday',
  4: 'Friday',
  5: 'Saturday',
  6: 'Sunday'
};

const getRandom = function(min, max) {
	return Math.ceil(Math.random() * (max - min)) + min;
}

const randomAvailability = function() {
		const numDaysAvailable = getRandom(0, 7);
    const randomStart =	getRandom(0, 7);
    const availability = {};
    let randomRangeStart = 0;
    let randomRangeEnd = 0
    
    for (let i = 0; i < numDaysAvailable; ++i) {
    	randomRangeStart = getRandom(0, 23);
      randomRangeEnd = getRandom(randomRangeStart, 23);
    	availability[idxMapping[(i + randomStart) % 7]] =
      	randomRangeStart.toString() + '-' + randomRangeEnd.toString();
    }
    return availability;
}

exports.populateDatabase = (driverFuncs, donorFuncs, receiverFuncs) => {
  const promises     = [];
  const numDrivers   = 500;
  const numDonors    = 250;
  const numReceivers = 50;

  const nameArr = new Array(numDrivers + numDonors + numReceivers)
    .fill(0)
    .map(() => { return (Math.random() + 1).toString(36).substring(2, 12); });

  let i;

  // Populate mock drivers
  for (i = 0; i < numDrivers; ++i) {
    const mockDriver = {
      name:         nameArr[i],
      email:        nameArr[i] + '@gmail.com',
      address:      '1234 Something Lane, Somewhere, SomeState, USA',
      phoneNumber:  '555-555-5555',
      availability: randomAvailability(),
    }
    promises.push(
      driverFuncs.addDriver({ body: mockDriver })
    );
  }

  // Populate mock donors
  for (i = numDrivers; i < numDrivers + numDonors; ++i) {
    const mockDonor = {
      name:         nameArr[i],
      email:        nameArr[i] + '@gmail.com',
      address:      '1234 Something Lane, Somewhere, SomeState, USA',
      phoneNumber:  '555-555-5555',
      availability: randomAvailability(),
    }
    promises.push(
      donorFuncs.addDonor({ body: mockDonor })
    );
  }


  // Populate mock receivers
  for (i = numDrivers + numDonors; i < numDrivers + numDonors + numReceivers; ++i) {
    const mockReceiver = {
      name:         nameArr[i],
      email:        nameArr[i] + '@gmail.com',
      address:      '1234 Something Lane, Somewhere, SomeState, USA',
      phoneNumber:  '555-555-5555',
      availability: randomAvailability(),
    }
    promises.push(
      receiverFuncs.addReceiver({ body: mockReceiver })
    );
  }
  return Promise.all(promises);
}
