import React from 'react';
import { Box, Text } from '../../theme/base'

export default ({ title = '', posterItems, ...rest }) => {
  return (
    <Box {...rest}>
      {title !== '' && <Box marginBottom='s'>
        <Text variant='title2'>{title}</Text>
      </Box>}

      <Box flexDirection='row' flexWrap='wrap' justifyContent='space-between' >
        {posterItems}
      </Box>
    </Box>
  )

}