import storage from "./storage";
import { getDateStrHyphen } from './others'

const WATCHED = 1;
const TOWATCH = 0;
const NOWATCH = -1;

const readWatchedValuesInCalendar = async () => {

  let calendarValues = [];
  try {
    const watchDict = await storage.load({ key: 'watch' });
    Object.keys(watchDict).forEach(mid => {
      const watch = watchDict[mid];
      if (watch['value'] === WATCHED) {
        const ts = watch['timestamp'];
        const date = new Date(ts);
        const dateStr = getDateStrHyphen(new Date(date));
        calendarValues.push({ date: dateStr });
      }
    });
  } catch (error) {
    console.log(error)
    return null;
  }
  return calendarValues;
}

const readWatchStatus = async (mid) => {
  console.log(`reading watch status: ${mid}`)
  let status = null;
  try {
    const watchDict = await storage.load({ key: 'watch' });
    if (mid in watchDict) {
      status = watchDict[mid];
    }
  } catch (error) {
    console.log(error)
  }
  return status;
}

const writeWatchStatus = async (mid, value, tags, comment) => {
  console.log(`writing watch status: ${mid}`)
  let watchDict = {};
  try {
    watchDict = await storage.load({ key: 'watch' });
    if (mid in watchDict) {
      watchDict[mid]['value'] = value;
      watchDict[mid]['timestamp'] = Date.parse(new Date());
      watchDict[mid]['tags'] = tags;
      watchDict[mid]['comment'] = comment;
    } else {
      watchDict[mid] = { 'value': value, 'timestamp': Date.parse(new Date()), 'tags': tags, 'comment': comment };
    }
  } catch (error) {
    console.log(error);
    watchDict[mid] = { 'value': value, 'timestamp': Date.parse(new Date()), 'tags': tags, 'comment': comment };
  }

  await storage.save({ key: 'watch', data: watchDict })
}

const removeWatchStatus = async (mid) => {
  console.log(`remove watch status: ${mid}`)
  let watchDict = await storage.load({ key: 'watch' });
  if (mid in watchDict) {
    delete watchDict[mid];
  }
  await storage.save({ key: 'watch', data: watchDict });
}


export {
  readWatchStatus,
  writeWatchStatus,
  removeWatchStatus,
  readWatchedValuesInCalendar,
}