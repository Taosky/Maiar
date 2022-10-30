import React, { useContext, useEffect, useState } from 'react';
import { Box, Text } from '../../theme/base'
import { useTheme } from '@react-navigation/native';
import { SettingContext } from '../../App';
import * as api from '../../api/APIUtils'
import { getId } from '../../api/ServerAPI';

export default ({ mid }) => {
  const { colors, } = useTheme();
  const setting = useContext(SettingContext);
  const [playable, setPlayable] = useState(false);

  useEffect(() => {
    updatePlayableInfo();
  }, [])
  const updatePlayableInfo = async () => {
    const serverSetting = setting.server;
    if (serverSetting && serverSetting.serverUrl && serverSetting.token) {
      const idData = await api.get(getId(mid), {}, 'server', serverSetting.serverUrl, serverSetting.token);
      if (idData && idData.id) {
        setPlayable(true);
      }
    }
  }

  return (
    <Box>
      {playable &&
        <Box style={{ padding: 2, width: 50, backgroundColor: colors.cardBackground, borderRadius: 4 }} >
          <Text style={{ color: colors.notification, }} variant='title4'>可播放</Text>
        </Box>
      }
    </Box>
  )
}
