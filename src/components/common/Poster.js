import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image'
import { Box, Text } from '../../theme/base'
import Rate from './StarRating'
import { WLR, } from '../../utils'
import PlayableTag from './PlayableTag';

const posterWidth = 90 * WLR;
const photoHeight = 100 * WLR;


const styles = StyleSheet.create({
  poster: {
    width: posterWidth,
    alignItems: 'center',
  },
  image: {
    width: posterWidth,
    height: 126 * WLR,
    borderRadius: 5,
  },
  postertitle: {
    width: posterWidth,
    textAlign: 'center'
  },
  rate: {
    width: posterWidth,
  },

});


const MoviePoster = ({ movie, ...rest }) => {

  return (
    <Box {...rest}>
      <TouchableOpacity onPress={movie.onPressMethod}>
        <Box style={styles.poster}>
          <FastImage style={styles.image} source={{ uri: movie.image }}>
            <PlayableTag mid={movie.id} />
          </FastImage>
          <Text variant='subtitle3' style={styles.title} ellipsizeMode='tail' numberOfLines={1} >{movie.title}</Text>
          {movie.rate != -2 && <Rate style={styles.rate} rating={movie.rate}></Rate>}
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

const RolePoster = ({ role, ...rest }) => {

  return (
    <Box {...rest}>
      <TouchableOpacity onPress={role.onPressMethod}>
        <Box style={styles.poster}>
          <FastImage style={styles.image} source={{ uri: role.cover }}></FastImage>
          <Text variant='subtitle3' style={styles.title} ellipsizeMode='tail' numberOfLines={1} >{role.name}</Text>
          <Text variant='desc3' ellipsizeMode='tail' numberOfLines={1}>{role.role}</Text>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

const PhotoPoster = ({ photo, ...rest }) => {

  return (
    <Box {...rest}>
      <TouchableOpacity onPress={photo.onPressMethod}>
        <Box style={{ height: photoHeight }}>
          <FastImage style={{ height: photoHeight, width: photoHeight }} source={{ uri: photo.uri }}></FastImage>
        </Box>
      </TouchableOpacity>
    </Box>
  );

};


export {
  MoviePoster,
  RolePoster,
  PhotoPoster,
}