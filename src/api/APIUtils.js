const movieUrl = 'https://moviedb.8610000.xyz/';
const movieExtraUrl = 'https://extra.moviedb.8610000.xyz/';
const celebrityUrl = 'https://celebrity.8610000.xyz/';
const rankUrl = 'https://rank.8610000.xyz';
const movieSearchUrl = 'https://dataapi.8610000.xyz';

const obj2String = (obj) => {
  return new URLSearchParams(obj).toString()
}

const request = async (url, options, apiType, api, token) => {
  let headers = {
    'Content-Type': 'application/json',
  };
  let apiUrl = '';
  if (apiType === 'movie') {
    apiUrl = movieUrl;
  } else if (apiType === 'movieExtra') {
    apiUrl = movieExtraUrl;
  } else if (apiType === 'celebrity') {
    apiUrl = celebrityUrl;
  } else if (apiType === 'rank') {
    apiUrl = rankUrl;
  } else if (apiType === 'movieSearch') {
    apiUrl = movieSearchUrl;
    headers['api-key'] = token;
    headers['Origin'] = 'https://moviefront.8610000.xyz';
  }

  if (apiType === 'server') {
    apiUrl = api;
    if (token && token !== '') {
      headers['Authorization'] = 'Bearer ' + token;
    }
  }
  let fetchOptions = {
    method: options.method,
    headers: headers,
  }
  if (options.method === 'GET') {
    const urlStr = obj2String(options.data)
    url += '?' + urlStr
  } else if (options.method === 'POST') {
    fetchOptions.body = JSON.stringify(options.data)
  }
  try {
    let response = await fetch(`${apiUrl}${url}`, fetchOptions);
    if (response.status === 404) {
      return { code: 404, "msg": '信息不存在' }
    }
    res = await response.json();
    return res
  } catch (error) {
    console.log('Request Failed', error);
    return null
  }
}


//封装get方法
const get = (url, options = {}, apiType, api = null, token = '') => {
  return request(url, {
    method: 'GET',
    data: options,
  }, apiType, api, token)
}
//封装post方法
const post = (url, options, apiType, api = null, token = '') => {
  return request(url, {
    method: 'POST',
    data: options
  }, apiType, api, token)
}
export {
  get,
  post,
}