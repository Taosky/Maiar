const publicUrl = 'https://maiar.8610000.xyz/api/v1'

const obj2String = (obj) => {
  return new URLSearchParams(obj).toString()
}

const request = async (url, options, apiType, api, token) => {
  let apiUrl = publicUrl;
  let headers = {
    'Content-Type': 'application/json',
  };
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
    res = await response.json();
    return res
  } catch (error) {
    console.log('Request Failed', error);
    return null
  }
}


//封装get方法
const get = (url, options = {}, apiType, api = null, token = '') => {
  console.log(url)
  return request(url, {
    method: 'GET',
    data: options,
  }, apiType, api, token)
}
//封装post方法
const post = (url, options, apiType, api = null, token = '') => {
  console.log(url)
  return request(url, {
    method: 'POST',
    data: options
  }, apiType, api, token)
}
export {
  get,
  post,
}