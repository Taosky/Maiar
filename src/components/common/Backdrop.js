import React from 'react';
import { useTheme } from '@react-navigation/native';
import { Box } from '../../theme/base'
import { WLR } from '../../utils/index'
import FastImage from 'react-native-fast-image';


export default ({ img, landscape }) => {
  const { dark } = useTheme();

  return (
    <Box style={{ marginTop: landscape ? 0 : -50, marginBottom: landscape ? -20 : -140 }}>
      {img ?
        <FastImage style={{ width: 375 * WLR, height: landscape ? 280 * WLR : 525 * WLR }} source={{ uri: img }}>
          {dark ?
            <FastImage style={{ width: 375 * WLR, height: landscape ? 280 * WLR : 525 * WLR, resizeMode: 'stretch' }} source={landscape ? require('./backdrop/img/backdrop-dark-280.png') : require('./backdrop/img/backdrop-dark-525.png')} />
            :
            <FastImage style={{ width: 375 * WLR, height: landscape ? 280 * WLR : 525 * WLR, resizeMode: 'stretch' }} source={landscape ? require('./backdrop/img/backdrop-light-280.png') : require('./backdrop/img/backdrop-light-525.png')} />
          }
        </FastImage>
        : <Box marginTop='xxxl'></Box>
      }
    </Box>
  )
}