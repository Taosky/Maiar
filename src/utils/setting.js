import storage from "./storage";


const getSetting = async (key,) => {
  console.log('reading setting: ',key)
  let setting = null;
  try {
    setting = await storage.load({ key: key });
    // settings.server = await storage.load({ key: 'settingServer' });
    // settings.server = await storage.load({ key: 'settingServer' });
  } catch (error) {
    console.log(error);
  }
  return setting;
}

const writeSetting = async (key, data) => {
  console.log('writing setting: ',key)
  await storage.save({ key: key, data: data });
}


export {
  getSetting, 
  writeSetting,
}