import { Alert } from "react-native";

const baseUrls = {
  'public': 'https://maiar.8610000.xyz/api/v1',
  'user': '',
  'profile': '',
}


const obj2String = (obj) => {
  return new URLSearchParams(obj).toString()
}

const request = async (url, options, apiType, navigation) => {
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
  try {
    let response = await fetch(`${baseUrls[apiType]}${url}`, fetchOptions);
    res = await response.json();
    if (!res) {
      Alert.alert('请求失败', '未接收到数据',
        [
          {
            text: "OK",
            style: "default",
          },
        ]);
    }
    return res
  } catch (error) {
    console.log('Request Failed', error);
    Alert.alert('请求失败', '网络连接出错')
    return null
  }
}


//封装get方法
const get = (url, options = {}, apiType, navigation = null) => {
  console.log(url)
  return request(url, {
    method: 'GET',
    data: options
  }, apiType, navigation)
}
//封装post方法
const post = (url, options, navigation = null) => {
  return request(url, {
    method: 'POST',
    data: options
  }, apiType, navigation)
}
//封装put方法
const put = (url, options, navigation = null) => {
  return request(url, {
    method: 'PUT',
    data: options
  }, apiType, navigation)
}
//封装remove方法
// 不能声明DELETE（关键字）
const remove = (url, options, navigation = null) => {
  return request(url, {
    method: 'DELETE',
    data: options
  }, apiType, navigation)
}

export {
  get,
  post,
  put,
  remove
}