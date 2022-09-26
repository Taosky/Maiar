
const timestampIntervalToTomorrow = () => (new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000 - Date.parse(new Date()));

const timestampIntervalToSunday = () => (timestampIntervalToTomorrow + (6 - new Date().getDay()) * 24 * 3600 * 1000);

const sleep = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Done waiting");
      resolve(ms)
    }, ms)
  })
}

export {
  timestampIntervalToTomorrow,
  timestampIntervalToSunday,
  sleep
}