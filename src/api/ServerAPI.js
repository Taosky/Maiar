const getServerToken = '/api/user/login';
const getUserInfo = '/api/user/whoiam';

const getVideos = (douban_id) => {
  return `/api/movie/db/${douban_id}/videos`
}

const getId = (douban_id) => {
  return `/api/movie/db/${douban_id}/id`
}


export {
  getServerToken,
  getUserInfo,
  getVideos,
  getId,
}