const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);
const CsvReader = require("promised-csv");
const reader = new CsvReader();

const events = [];

const findFreeTime = events => {
  const freeTimeThisWeek = [];

  for (let i = 0; i < 8; i += 1) {
    const sameDayEvents = [];
    const date = moment().add(i, "days").format("YYYY-MM-DD");
    events.map(event => {
      if (event.startDate.isSame(date, "day")) {
        sameDayEvents.push(event);
      }
    });

    sameDayEvents.sort((a, b) => a.startDate > b.startDate);

    let index = 0;

    for (let j = 0; j < sameDayEvents.length; j += 1) {
      const isOverlap = (ind, arr, count) => {
        return arr[ind - 1].startDate.isSameOrBefore(arr[count].endDate);
      };
      if (index !== 0 && isOverlap(index, sameDayEvents, j)) {
        while (index !== 0 && isOverlap(index, sameDayEvents, j)) {
          sameDayEvents[index - 1].endDate = moment.max(
            sameDayEvents[index - 1].endDate,
            sameDayEvents[j].endDate
          );
          sameDayEvents[index - 1].startDate = moment.max(
            sameDayEvents[index - 1].startDate,
            sameDayEvents[j].startDate
          );
          index -= 1;
        }
      } else {
        sameDayEvents[index] = sameDayEvents[j];
      }

      index += 1;
    }

    const freeRanges = [];
    let freeTimeStart = moment(date).add(8, "hours");
    const freeTimeEnd = moment(date).add(22, "hours");
    for (let k = 0; k < index; k += 1) {
      if (freeTimeStart.isBefore(sameDayEvents[k].startDate)) {
        freeRanges.push(
          moment.range(freeTimeStart, sameDayEvents[k].startDate)
        );
      }
      freeTimeStart = sameDayEvents[k].endDate;
    }
    freeRanges.push(moment.range(freeTimeStart, freeTimeEnd));

    let maxRange = freeRanges[0];
    for (let l = 0; l < freeRanges.length; l += 1) {
      if (maxRange < freeRanges[l]) {
        maxRange = freeRanges[l];
      }
    }

    freeTimeThisWeek.push(maxRange);
  }

  let maxRangeThisWeek = freeTimeThisWeek[0];
  for (let m = 0; m < freeTimeThisWeek.length; m += 1) {
    if (maxRangeThisWeek < freeTimeThisWeek[m]) {
      maxRangeThisWeek = freeTimeThisWeek[m];
    }
  }

  return maxRangeThisWeek;
};

const isWithinWeek = date => moment(date).isBefore(moment().add(8, "days"));

const isWithinDayTime = date => {
  const timeFormat = "hh:mm:ss";
  const startTime = moment("08:00:00", timeFormat);
  const endTime = moment("22:00:00", timeFormat);

  return moment(date).isBetween(startTime, endTime);
};

reader.on("row", data => {
  // checks up to 1 week from request time
  if (isWithinWeek(data[1])) {
    const busyRange = {
      startDate: moment(data[1]),
      endDate: moment(data[2])
    };
    events.push(busyRange);
  }
  return;
});

// read raw data into events array and operate on it
reader.read("calendar.csv", events).then(events => {
  const maxFreeRange = findFreeTime(events).toDate();
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
