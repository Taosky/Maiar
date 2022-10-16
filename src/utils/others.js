
const timestampIntervalToTomorrow = () => (new Date(new Date().toLocaleDateString()).getTime() + 24 * 3600 * 1000 - Date.parse(new Date()));

const timestampIntervalToSunday = () => (timestampIntervalToTomorrow + (6 - new Date().getDay()) * 24 * 3600 * 1000);

const getDateStrHyphen = (date) => {
  let nowMonth = date.getMonth() + 1;
  let strDate = date.getDate();
  if (nowMonth >= 1 && nowMonth <= 9) {
    nowMonth = "0" + nowMonth;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  return `${date.getFullYear()}-${nowMonth}-${strDate}`;
}

const sleep = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(ms)
    }, ms)
  })
}

export {
  timestampIntervalToTomorrow,
  timestampIntervalToSunday,
  getDateStrHyphen,
  sleep,
}