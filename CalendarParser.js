const moment = require("moment");
const CsvReader = require("promised-csv");
const reader = new CsvReader();

const events = [];
const freeBlocks = [];

const findFreeTime = events => {
  console.log(events);
};

reader.on("row", data => {

  // checks up to 1 week from request time
  if (moment(data[1]).isBefore(moment().add(8, "days"))) {

    // convert raw data into json format with date objects
    const jsonData = {
      userId: data[0],
      startDate: moment(data[1]),
      endDate: moment(data[2])
    };

    events.push(jsonData);
  }
  return;
});

// read raw data into events array and operate on it
reader.read("calendar.csv", events).then(findFreeTime);
