import React from 'react';
import { Box, Text } from '../../theme/base'
import { WINDOWWIDTH, POSTERWIDTH, PHOTOWIDTH, WLR } from '../../utils'

export default ({ title = '', posterItems, isPhoto = false, ...rest }) => {
  let posterWidth = POSTERWIDTH
  if (isPhoto) {
    posterWidth = PHOTOWIDTH;
  }
  const marginWidth = 8 * WLR;
  const items = posterItems

  if (posterItems?.length > 0) {
    const lineNum = parseInt(WINDOWWIDTH / (posterWidth + 2 * marginWidth));
    const exNum = lineNum - posterItems.length % lineNum;
    console.log(exNum);
    for (const x of Array(exNum).keys()) {
      items.push(
        <Box style={{ height: 10, width: posterWidth }} marginVertical='s' key={-1}>
        </Box>
      );
    }
  }


  return (
    <Box {...rest}>
      {title !== '' && <Box marginBottom='s' marginHorizontal='m'>
        <Text variant='title2'>{title}</Text>
      </Box>}
      <Box>
        <Box flexDirection='row' flexWrap='wrap' justifyContent='space-around' >
          {items?.map((item, index) => <Box marginVertical='s' style={{ marginHorizontal: marginWidth }} key={index}>
            {item}
          </Box>)}
        </Box>

      </Box>
    </Box>
  )

}