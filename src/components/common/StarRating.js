import React from 'react';
import { Text, Box } from '../../theme/base'


function Star({ marked, starId }) {
  return (
    <Text>
      {
        marked ? <Text star-id={starId} variant='starMarked' >{'\u2605'}</Text> :
          <Text star-id={starId} variant='star' > {'\u2606'}</Text>
      }
    </Text>
  );
}


export default (props) => {
  const rating = (typeof props.rating == 'number' && props.rating !== -1) ? (props.rating / 2).toFixed(1) : 0
  return (
    <Box style={{ flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center' }}>
      {Array.from({ length: 5 }, (v, i) => (
        <Star
          starId={i + 1}
          key={`star_${i + 1} `}
          marked={rating >= i + 1}
        />
      ))}
      {props?.showNumber && <Text variant='starText'>{rating}</Text>}
    </Box>
  );
}