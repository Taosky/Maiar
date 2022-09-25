import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image'
import { Box, Text } from '../../theme/base'
import Rate from './StarRating'
import { WLR, } from '../../utils/index'


const posterWidth = 90 * WLR;
const squareWidth = 140 * WLR;


const styles = StyleSheet.create({
  poster: {
    width: posterWidth,
    alignItems: 'center',
    marginRight: 20 * WLR,
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

  square: {
    width: squareWidth,
    marginRight: 20 * WLR,
  },
  squareImage: {
    width: squareWidth,
    height: 100 * WLR,
  }
});


const MoviePoster = ({ movie, ...rest }) => {
  return (
    <TouchableOpacity {...rest} onPress={movie.onPressMethod}>
      <Box style={styles.poster}>
        <FastImage style={styles.image} source={{ uri: movie.image, priority: FastImage.priority.normal, }}></FastImage>
        <Text variant='subtitle3' style={styles.title} ellipsizeMode='tail' numberOfLines={1} >{movie.title}</Text>
        <Rate style={styles.rate} rating={movie.rate}></Rate>
      </Box>
    </TouchableOpacity>
  );
};

const RolePoster = ({ role, ...rest }) => {

  return (
    <TouchableOpacity {...rest} onPress={role.onPressMethod}>
      <Box style={styles.poster}>
        <FastImage style={styles.image} source={{ uri: role.cover, priority: FastImage.priority.normal, }}></FastImage>
        <Text variant='subtitle3' style={styles.title} ellipsizeMode='tail' numberOfLines={1} >{role.name}</Text>
        <Text variant='desc3'>{role.role}</Text>
      </Box>
    </TouchableOpacity>
  );
};

const PhotoPoster = ({ photo, ...rest }) => {

  return (
    <TouchableOpacity {...rest} onPress={photo.onPressMethod}>
      <Box style={styles.square}>
        <FastImage style={styles.squareImage} source={{ uri: photo.uri, priority: FastImage.priority.normal, }}></FastImage>
      </Box>
    </TouchableOpacity>
  );

};


export {
  MoviePoster,
  RolePoster,
  PhotoPoster,
}