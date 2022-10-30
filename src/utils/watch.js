import storage from "./storage";
import { getDateStrHyphen, sleep } from './others'

const WATCHED = 1;
const TOWATCH = 0;
const NOWATCH = -1;


const genStatistics = async () => {
  try {
    const lastStatistics = await storage.load({ key: 'statistics' });
    if (Date.parse(new Date()) - lastStatistics.updatedAt < 5000) {
      console.log('skip statistic generation...')
      return
    }
  } catch (error) {
    console.log(error)
  }

  console.log('generating statistics...')
  let total = 0;
  let watched = { total: 0, tags: [] };
  let watchedTags = [];
  let towatchTags = [];
  let toWatch = { total: 0, tags: [] };
  let addedWatchedDict = {};
  let addedTowatchDict = {};
  try {
    const watchDict = await storage.load({ key: 'watch' });
    total = Object.keys(watchDict).length;
    Object.keys(watchDict).forEach(mid => {
      if (watchDict[mid]['value'] === WATCHED) {
        watched['total'] += 1;
      } else if (watchDict[mid]['value'] === TOWATCH) {
        toWatch['total'] += 1;
      }
      if ('tags' in watchDict[mid]) {
        watchDict[mid].tags.forEach(tag => {
          if (watchDict[mid]['value'] === WATCHED) {
            if (tag in addedWatchedDict) {
              addedWatchedDict[tag] += 1;
            } else {
              addedWatchedDict[tag] = 1;
            }
          } else if (watchDict[mid]['value'] === TOWATCH) {
            if (tag in addedTowatchDict) {
              addedTowatchDict[tag] += 1;
            } else {
              addedTowatchDict[tag] = 1;
            }
          }
        });
      }

    });
    Object.keys(addedWatchedDict).forEach(tag => {
      watchedTags.push({ tag: tag, count: addedWatchedDict[tag] });
    });
    watchedTags.sort((a, b) => { return b.count - a.count });

    watched['tags'] = watchedTags.slice(0, 20);


    Object.keys(addedTowatchDict).forEach(tag => {
      towatchTags.push({ tag: tag, count: addedTowatchDict[tag] });
    });
    towatchTags.sort((a, b) => { return b.count - a.count })
    toWatch['tags'] = towatchTags.slice(0, 20);

  } catch (error) {
    console.log(error)
    return
  }
  console.log('statistics generated')
  await storage.save({
    key: 'statistics', data: {
      total: total,
      watched: watched,
      toWatch: toWatch,
      updatedAt: Date.parse(new Date()),
    }
  });
}

const readStatistics = async () => {
  console.log('reading statistics...')
  let lastStatistics = null;
  try {
    lastStatistics = await storage.load({ key: 'statistics' });
  } catch (error) {
    console.log(error);
  }
  return lastStatistics;
}


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

  await storage.save({ key: 'watch', data: watchDict });

  // 保存观看状态后执行统计（暂定）
  sleep(1000);
  genStatistics();
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
  readStatistics,
}