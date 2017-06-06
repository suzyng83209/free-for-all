const moment = require("moment");
const CsvReader = require("promised-csv");
const reader = new CsvReader();

const events = [];
const freeWeek = [];

const findFreeTime = events => {
  const freeDay = {
    date: moment().add
  };
};

reader.on("row", data => {
  // checks up to 1 week from request time
  const timeFormat = "hh:mm:ss";
  const startTime = moment("08:00:00", timeFormat);
  const endTime = moment("22:00:00", timeFormat);
  const isWithinWeek = moment(data[1]).isBefore(moment().add(8, "days"));
  const isWithinDayTime = moment(data[1]).isBetween(startTime, endTime);

  if (isWithinDayTime && isWithinWeek) {
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
