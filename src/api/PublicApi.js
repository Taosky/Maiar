
function getTodayStr() {
  let date = new Date();
  let nowMonth = date.getMonth() + 1;
  let strDate = date.getDate();
  if (nowMonth >= 1 && nowMonth <= 9) {
    nowMonth = "0" + nowMonth;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  return `${date.getFullYear()}${nowMonth}${strDate}`;
}

const getMovieHotGaia = () => {
  return `/hot/${getTodayStr()}/movie_hot_gaia`
}
const getMovieShowing = () => {
  return `/hot/${getTodayStr()}/movie_showing`
}
const getTvHot = () => {
  return `/hot/${getTodayStr()}/tv_hot`
}
const getTvVarietyShow = () => {
  return `/hot/${getTodayStr()}/tv_variety_show`
}

const getMovieById = (id) => {
  return `/movie/${id}`
}
const getMovieRatingById = (id) => {
  return `/movie/${id}/rating`
}
const getMovieRecommendationsById = (id) => {
  return `/movie/${id}/recommendations`
}
const getMoviePhotosById = (id) => {
  return `/movie/${id}/photos`
}
const getMoviesByTitle = () => {
  return `/movies`
}
const getCelebrityById = (id)=>{
  return `/celebrity/${id}`
}

const getRankMovies = (_type)=>{
  return `/rank/${_type}`
}


export {
  getMovieHotGaia,
  getMovieShowing,
  getTvHot,
  getTvVarietyShow,
  getMovieById,
  getMoviesByTitle,
  getMovieRatingById,
  getMovieRecommendationsById,
  getMoviePhotosById,
  getCelebrityById,
  getRankMovies,
}