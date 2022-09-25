import { Dimensions,Alert } from 'react-native'

const WLR = Dimensions.get('window').width / 375;

const alert404 = (navigation=null) => Alert.alert(
  '请求失败',
  '数据不存在',
  [
    {
      text: "OK",
      onPress: () => navigation?.goBack(),
      style: "default",
    },
  ]);

export {
  WLR,
  alert404,
}