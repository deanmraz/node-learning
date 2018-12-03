import ms from 'ms';
import millisecondsUntil from './millisecondsUntil.js';

const getNextLunchtime = function (hours, minutes) {
  var lunchtime = new Date();

  lunchtime.setHours(hours);
  lunchtime.setMinutes(minutes);
  lunchtime.setSeconds(0);
  lunchtime.setMilliseconds(0);

  // if we've already had lunch today, start planning
  // tomorrow's lunch
  if (lunchtime < Date.now()) lunchtime.setDate(lunchtime.getDate() + 1);

  console.log('here', lunchtime);

  return lunchtime;
}

export default function (hours, minutes) {
  // lunch is at 12.30
  if (hours === undefined) hours = 12;
  if (minutes === undefined) minutes = 30;

  var millisecondsUntilLunchTime = millisecondsUntil(getNextLunchtime(hours, minutes));
  return ms(millisecondsUntilLunchTime, {
    long: true
  });
}
