import { Dimensions, Alert, Linking } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard';

const WINDOWWIDTH = Dimensions.get('window').width;
const WLR = WINDOWWIDTH / 375;

const POSTERWIDTH = 90 * WLR;
const PHOTOWIDTH = 100 * WLR;

const alert404 = (navigation = null) => Alert.alert(
  '请求失败',
  '数据不存在',
  [
    {
      text: "OK",
      onPress: () => navigation?.goBack(),
      style: "default",
    },
  ]);

const tryToOpenUri = (uri, url) => {
  if (!uri || uri === '') {
    Linking.openURL(url);
    return;
  }
  console.log('try opening: ', uri)
  Linking.canOpenURL(uri).then((supported) => {
    if (supported) {
      Linking.openURL(uri)
    } else
      Alert.alert('App未安装', '是否从浏览器打开链接？', [{
        text: '打开',
        onPress: () => Linking.openURL(url),
        style: 'default',
      }, {
        text: '仅复制',
        onPress: () => Clipboard.setString(url),
        style: 'cancel',
      },
      ]);
  });
}

export {
  WLR,
  WINDOWWIDTH,
  POSTERWIDTH,
  PHOTOWIDTH,
  alert404,
  tryToOpenUri,
}