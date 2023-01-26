
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
  return `/hot/${getTodayStr()}/movie_hot_gaia.json`
}
const getMovieShowing = () => {
  return `/hot/${getTodayStr()}/movie_showing.json`
}
const getTvHot = () => {
  return `/hot/${getTodayStr()}/tv_hot.json`
}
const getTvVarietyShow = () => {
  return `/hot/${getTodayStr()}/tv_variety_show.json`
}

const getMovieById = (id) => {
  return `/data/${id}.json`
}
const getMovieRatingById = (id) => {
  return `/rating/${id}.json`
}
const getMovieRecommendationsById = (id) => {
  return `/recommendation/${id}.json`
}
const getMoviePhotosById = (id) => {
  return `/photo/${id}.json`
}
const getMoviesByTitle = () => {
  return `/`
}
const getCelebrityById = (id)=>{
  return `/data/${id}.json`
}

const getRankMovies = (_type, page=1, limit=20)=>{
  console.log('page: ',page, 'limit: ', limit);
  if (_type==='movie_top250'){
    return `/top250/${page}.json`
  } else if (_type==='movie_weekly_best' || _type==='tv_chinese_weekly_best' || _type==='tv_global_weekly_best'){
    return `/weekly_best/${_type.replace('_weekly_best','')}/${page}.json`
  }
  return `/category/${_type.replace('movie_','')}/${page}.json`
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