const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);
const CsvReader = require("promised-csv");
const reader = new CsvReader();

const EventTimeUtils = require("./EventTimeUtils.js");
const fileName = "calendar.csv";
const events = [];

// read raw data into events array and operate on it
reader.read(fileName, events).then(events => {
  const maxFreeRange = EventTimeUtils.findFreeTime(events).toDate();
  const meetingDate = moment(maxFreeRange[0]).format("YYYY-MM-DD");
  const startTime = moment(maxFreeRange[0]).format("HH:mm:ss");
  const endTime = moment(maxFreeRange[1]).format("HH:mm:ss");

  console.log(
    "Everyone should meet this week on " +
      meetingDate +
      " from " +
      startTime +
      " to " +
      endTime +
      "."
  );
});
