import * as React from 'react';
import { useState, useEffect } from 'react'
import { ScrollView, Platform, SafeAreaView, TouchableOpacity, Switch, TextInput, Alert } from "react-native";
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { Box, Text } from '../../theme/base'
import { WLR } from '../../utils'

import { getSetting, writeSetting } from '../../utils';
import * as api from '../../api/APIUtils'
import { getServerToken, getUserInfo } from '../../api/ServerAPI'


const SettingLine = ({ ...rest }) => {
  return (
    <Box {...rest} paddingVertical='s' flexDirection='row' justifyContent='space-between' />
  )
}

const SettingInput = ({ ...rest }) => {
  const { colors, } = useTheme();

  return (
    <TextInput
      {...rest}
      autoCapitalize={'none'}
      autoCorrect={false}
      style={{ height: 28, padding: 2, borderColor: 'gray', borderWidth: 1, borderRadius: 4, color: colors.text, width: 250 * WLR }}
      placeholderTextColor={colors.desc}
    />
  )
}


const ServerSetting = ({ }) => {
  const { colors, } = useTheme();

  const [playerList, setPlayerList] = useState([]);
  const [selectedPlayer, onChangePlayer] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [serverUrl, onChangeServerUrl] = React.useState('');
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [authorizeShow, setAuthorizeShow] = useState(false);
  const [tokenExpired, onChangeTokenExpired] = useState(true);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);


  useEffect(() => {
    initPlayerList();
    getSettingData();
  }, []);

  const checkToken = async (serverUrl, token) => {
    const data = await api.get(getUserInfo, {}, 'server', serverUrl, token);
    if (data && data.id) {
      console.log(data)
      onChangeTokenExpired(false);
    }
  }

  const initPlayerList = () => {
    if (Platform.OS === 'ios') {
      setPlayerList([
        { label: 'NPlayer', value: 'nplayer' },
        { label: 'VLC', value: 'vlc' },
      ]);

    } else {
      setPlayerList([
        { label: 'MXPlayer', value: 'mxplayer' },
        { label: 'MXPlayer Pro', value: 'mxplayerpro' },
        { label: 'VLC', value: 'vlc' },
      ]);
    }

  }

  const getSettingData = async () => {
    if (authorizeShow) {
      return;
    }
    const setting = await getSetting('serversetting');
    if (setting) {
      onChangeServerUrl(setting.serverUrl);
      setIsEnabled(true);
      await checkToken(setting.serverUrl, setting.token);
    }
  }

  const authAndSave = async () => {
    const data = await api.post(getServerToken, { username: username, password: password }, 'server', serverUrl);
    if (data && data.access_token) {
      await writeSetting('serversetting', { serverUrl: serverUrl, token: data.access_token, player: selectedPlayer ? selectedPlayer : playerList[0].value });
      Alert.alert('授权完成');
      getSettingData();
      setAuthorizeShow(false);
    } else {
      Alert.alert('请求出错', '检查网络及验证信息');
    }
  }

  return (
    <Box>
      <Text variant='title0'>影视服务设定</Text>
      <SettingLine>
        <Text variant='title2'>启用功能</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </SettingLine>
      {isEnabled &&
        <Box>
          <SettingLine>
            <Text variant='title2'>播放器</Text>
          </SettingLine>
          <Picker
            itemStyle={{ color: colors.text, fontSize: 14 }}
            selectedValue={selectedPlayer}
            onValueChange={(itemValue, itemIndex) =>
              onChangePlayer(itemValue)
            }>
            {playerList.map((player, index) => <Picker.Item key={index} label={player.label} value={player.value} />)}
          </Picker>
          <SettingLine>
            <Text variant='title2'>服务器地址</Text>
            <SettingInput
              placeholder='http://xxx.xx.xx:xxxx'
              value={serverUrl}
              onChangeText={text => onChangeServerUrl(text)}
            />
          </SettingLine>
          {tokenExpired ?
            <TouchableOpacity onPress={() => { setAuthorizeShow(true); }}>
              <Box><Text style={{ textAlign: 'center' }}>未授权（或过期</Text></Box>
            </TouchableOpacity> :
            <TouchableOpacity onPress={() => { setAuthorizeShow(true); }}>
              <Box><Text style={{ textAlign: 'center' }}>清除授权</Text></Box>
            </TouchableOpacity>
          }

          <Modal isVisible={authorizeShow} backdropOpacity={0.5} onBackdropPress={() => setAuthorizeShow(false)} style={{ margin: 0, }}>
            <Box style={{ backgroundColor: colors.cardBackground, borderRadius: 10, padding: 8 }}>
              <SettingLine>
                <Text variant='title2'>账号</Text><SettingInput placeholder='' value={username} onChangeText={text => onChangeUsername(text)} />
              </SettingLine>
              <SettingLine>
                <Text variant='title2'>密码</Text><SettingInput placeholder='' value={password} onChangeText={text => onChangePassword(text)} />
              </SettingLine>
              <TouchableOpacity onPress={() => authAndSave()}>
                <Box><Text style={{ textAlign: 'center' }}>提交</Text></Box>
              </TouchableOpacity>
            </Box>
          </Modal>
        </Box>
      }

    </Box>
  )

}

export default ({ route, navigation, }) => {

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Icon style={{ marginLeft: -15 }} size={30} color='#1882FB' name='chevron-back-outline' />
        </TouchableOpacity>
      ),
    }
    )
  }, []);

  return (
    <SafeAreaView>
      <Box padding='s'>
        <ServerSetting />

      </Box>

    </SafeAreaView>
  )
}