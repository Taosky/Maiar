import React from 'react';
import { Box, Text } from '../../theme/base'
import MovieCard from './MovieCard';


export default ({ items, rank }) => {
  return (
    <Box>
      {items.map((item, index) => (
        <Box key={index} marginTop='ss'>
          {rank && <Text variant='rankNo'>No. {index + 1}</Text>}
          <MovieCard poster={item.poster} title={item.title} subtitle={item.subtitle}
            rating={item.rating} isTv={item.isTv} description={item.description}
            onPressMethod={item.onPressMethod} />
        </Box>
      ))
      }
    </Box>
  )

}