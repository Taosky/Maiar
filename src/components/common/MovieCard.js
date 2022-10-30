import React, { } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Box, Text } from '../../theme/base'
import Rate from './StarRating'
import { WLR } from '../../utils/index'
import { useTheme } from '@react-navigation/native';
import PlayableTag from './PlayableTag';

const Tag = ({ color, text }) => {
  const colors = {
    orange: ['#e6a23c', '#fdf6ec', '#faecd8'],
    blue: ['#409eff', '#ecf5ff', '#d9ecff']
  }
  const colorType = colors[color] ? color : 'blue';
  return (
    <Box style={{ backgroundColor: colors[colorType][1], borderColor: colors[colorType][2], borderWidth: 1, borderRadius: 5, paddingHorizontal: 4 * WLR, marginBottom: -3 * WLR }}>
      <Text style={{ fontSize: 11, fontWeight: 'bold', color: colors[colorType][0] }}>{text}</Text>
    </Box>
  )
}


const cardHeight = 110 * WLR;
const styles = StyleSheet.create({
  poster: {
    width: 79 * WLR,
    height: cardHeight,
    borderRadius: 8,
  },
  detail: {
    width: 276 * WLR,
  }
});

export default ({ id, poster, title, subtitle, rating, isTv, description, playable, onPressMethod, ...rest }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={() => onPressMethod()}>
      <Box {...rest} >
        <Box style={{ height: cardHeight, borderRadius: 6, borderBottomLeftRadius: description ? 0 : 6, borderBottomRightRadius: description ? 0 : 6, backgroundColor: colors.cardBackground }} flexDirection='row'>
          <FastImage style={styles.poster} source={{ uri: poster }}>
            <PlayableTag mid={id}/>
          </FastImage>
          <Box style={styles.detail} padding='s'>
            <Box flexDirection='row' flexWrap='wrap'>
              <Text numberOfLines={1} ellipsizeMode='tail' variant='title3'>{title}</Text>
            </Box>
            <Box marginVertical='ss' flexDirection='row' flexWrap='wrap'>
              <Rate rating={rating?.value} />
              <Box marginLeft='ss'><Text>{rating?.value !== 0 ? rating?.value.toFixed(1) : '无评分'}</Text></Box>
            </Box>
            <Text numberOfLines={2} ellipsizeMode='tail' style={{ verticalAlign: 'top' }} >
              {(isTv === true || isTv === false) && <Tag color={isTv ? 'blue' : 'orange'} text={isTv ? '剧集' : '电影'} />}
              <Text variant='desc3'>  {subtitle}</Text>
            </Text>
          </Box>
        </Box>
        {description &&
          <Box padding='s' style={{ backgroundColor: colors.subcard, borderRadius: 6, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
            <Text variant='desc3'>{description}</Text>
          </Box>
        }
      </Box>
    </TouchableOpacity>
  )
}