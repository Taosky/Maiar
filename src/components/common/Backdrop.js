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
            <FastImage style={{ width: 375 * WLR, height: landscape ? 280 * WLR : 525 * WLR, resizeMode: 'stretch' }} source={require('./backdrop/img/backdrop-dark.png')} />
            :
            <FastImage style={{ width: 375 * WLR, height: landscape ? 280 * WLR : 525 * WLR, resizeMode: 'stretch' }} source={require('./backdrop/img/backdrop-light.png')} />
          }
        </FastImage>
        : <Box marginTop='xxxl'></Box>
      }
    </Box>
  )
}