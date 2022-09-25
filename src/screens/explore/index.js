import * as React from 'react';
import { useState, useEffect } from 'react'
import { ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from '@react-navigation/native';
import { Box, Text } from '../../theme/base'
import * as api from '../../api/APIUtils'
import { getMovieHotGaia, getMovieShowing, getTvHot, getTvVarietyShow } from '../../api/PublicApi'

import { WLR } from '../../utils/index'

const RankBox = ({ title, color, type_, navigation, ...rest }) => {

  return (
    <TouchableOpacity onPress={() => { navigation.navigate('NoTabScreen', { screen: 'RankDetail', params: { type_: type_ } }) }}>
      <Box padding='s' {...rest} style={{ width: 100 * WLR, height: 100 * WLR, backgroundColor: color, borderRadius: 8 }}>
        <Text variant='box' style={{ textAlign: 'center', verticalAlign: 'middle' }} numberOfLines={2} ellipsizeMode='tail'>{title}</Text>
      </Box>
    </TouchableOpacity>
  )
}


export default ({ route, navigation }) => {

  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();
  const rankList = [
    { title: '一周口碑电影', color: 'orange', type_: 'movie_weekly_best' },
    { title: '华语口碑剧集', color: '#8a8a88', type_: 'tv_chinese_best_weekly' },
    { title: '全球口碑剧集', color: '#885929', type_: 'tv_global_best_weekly' },
    { title: '电影Top250', color: '#373841', type_: 'movie_top250' },
    { title: '动作片', color: 'orange', type_: 'movie_action' },
    { title: '喜剧片', color: 'orange', type_: 'movie_comedy' },
    { title: '科幻片', color: 'orange', type_: 'movie_scifi' },
    { title: '爱情片', color: 'orange', type_: 'movie_love' },
  ]

  return (
    <ScrollView>
      <Box paddingHorizontal='m'>
        <Box flexDirection='row' flexWrap='wrap' justifyContent='space-around'  >
          {
            rankList.map((rank, index) => (
              <RankBox key={index} marginVertical='s' title={rank.title} color={rank.color} type_={rank.type_} navigation={navigation} />
            ))
          }
        </Box>
      </Box>
    </ScrollView>
  );
};
