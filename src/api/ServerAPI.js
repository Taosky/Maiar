const getServerToken = '/api/user/login';
const getUserInfo = '/api/user/whoiam';
const getVideos = (douban_id) => {
  return `/api/movie/${douban_id}/videos`
}


export {
  getServerToken,
  getUserInfo,
  getVideos,
}