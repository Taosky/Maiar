import React from 'react';
import { Box, Text } from '../../theme/base'
import { WLR, } from '../../utils/index'


export default ({ title, posterItems, ...rest }) => {
  return (
    <Box {...rest}>
      <Box marginBottom='s'>
        <Text variant='title2'>{title}</Text>
      </Box>
        <Box style={{ marginLeft: 10 * WLR }} flexDirection='row' flexWrap='wrap' >
          {posterItems}
        </Box>
    </Box>
  )

}
