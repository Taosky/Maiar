import React, { } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Box, Text } from '../../theme/base'
import Rate from './StarRating'
import { WLR } from '../../utils/index'
import { useTheme } from '@react-navigation/native';

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
    width: 260 * WLR,
  }
});

export default ({ item, ...rest }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={() => item.onPressMethod()}>
      <Box {...rest} >
        <Box style={{ height: cardHeight, borderRadius: 6, borderBottomLeftRadius: item.description ? 0 : 6, borderBottomRightRadius: item.description ? 0 : 6, backgroundColor: colors.cardBackground }} flexDirection='row'>
          <FastImage style={styles.poster} source={{ uri: item.poster ? item.poster : item.cover_url }}></FastImage>
          <Box style={styles.detail} padding='s'>
            <Box flexDirection='row' flexWrap='wrap'>
              <Text numberOfLines={1} ellipsizeMode='tail' variant='title3'>{item.title}</Text>
            </Box>
            <Box marginVertical='ss' flexDirection='row' flexWrap='wrap'>
              <Rate rating={item.rating?.value} />
              <Box marginLeft='ss'><Text>{item.rating?.value !== 0 ? item.rating?.value : '无评分'}</Text></Box>
            </Box>
            <Text numberOfLines={2} ellipsizeMode='tail' style={{ verticalAlign: 'top' }} >
              {item.is_tv && <Tag color={item.is_tv ? 'blue' : 'orange'} text={item.is_tv ? '剧集' : '电影'} />}
              <Text variant='desc3'>  {item.card_subtitle}</Text>
            </Text>
          </Box>
        </Box>
        {item.description &&
          <Box padding='s' style={{ backgroundColor: colors.subcard, borderRadius: 6, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
            <Text variant='desc3'>{item.description}</Text>
          </Box>
        }
      </Box>
    </TouchableOpacity>
  )
}