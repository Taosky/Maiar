import { request as wxRequest, showToast, showLoading } from 'remax/wechat'


const baseUrls = {
  'public': 'https://maiar.8610000.xyz/api/v1',
  'user': '',
  'profile': '',
}

const networkError = () => {
  showToast({ icon: 'error', title: '网络错误' })
}
const obj2String = (obj, arr = [], idx = 0) => {
  for (let item in obj) {
    arr[idx++] = [item, obj[item]]
  }
  return new URLSearchParams(arr).toString()
}

const request = (url, options, apiType) => {
  let fetchOptions = {
    method: options.method, //配置method方法
    header: {
      'Content-Type': 'application/json; charset=UTF-8',
      // 'token': token
    },
  }
  if (options.method === 'GET') {
    const urlStr = obj2String(options.data)
    url += '?' + urlStr
  } else if (options.method === 'POST') {
    fetchOptions.body = JSON.stringify(options.data)
  }

  return new Promise(() => {
    fetch(`${baseUrls[apiType]}${url}`, fetchOptions)
  });
}


//封装get方法
const get = (url, options = {}, apiType) => {
  console.log(url)
  return request(url, {
    method: 'GET',
    data: options
  }, apiType)
}
//封装post方法
const post = (url, options) => {
  return request(url, {
    method: 'POST',
    data: options
  }, apiType)
}
//封装put方法
const put = (url, options) => {
  return request(url, {
    method: 'PUT',
    data: options
  }, apiType)
}
//封装remove方法
// 不能声明DELETE（关键字）
const remove = (url, options) => {
  return request(url, {
    method: 'DELETE',
    data: options
  }, apiType)
}

export {
  get,
  post,
  put,
  remove
}