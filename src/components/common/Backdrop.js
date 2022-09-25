import React from 'react';
import { Image } from 'react-native'
import { SrcOverComposition, LinearGradient, } from 'react-native-image-filter-kit'
import { useTheme } from '@react-navigation/native';
import { Box } from '../../theme/base'
import { WLR } from '../../utils/index'


export default ({ img, landscape }) => {
  const { colors } = useTheme();

  return (
    <Box style={{ marginTop: landscape ? 0 : -50,marginBottom: landscape ? -20 : -140}}>
      {img ?
        <SrcOverComposition
          resizeCanvasTo={'dstImage'}
          dstImage={
            <Image
              style={{ width: 375 * WLR, height: landscape ? 210 * WLR : 525 * WLR }}
              source={{ uri: img, cache: 'force-cache' }}
            />
          }
          srcAnchor={{ y: 0 }}
          srcImage={
            <LinearGradient
              start={{ x: 0, y: '100h' }}
              end={{ x: 0, y: 0 }}
              colors={['transparent', colors.backdropMask]}
            />
          }
        />
        : <Box marginTop='xxxl'></Box>
      }
    </Box>
  )
}