const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);

module.exports = {
  isWithinWeek: date => moment(date).isBefore(moment().add(8, "days"), "day"),
  findFreeTime: events => {
    const freeTimeThisWeek = [];

    for (let i = 0; i < 8; i += 1) {
      const sameDayEvents = [];
      const date = moment().add(i, "days").hours(8).startOf("hour");
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
      let freeTimeStart = date;
      const freeTimeEnd = moment(date).add(14, "hours");
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
  }
};
