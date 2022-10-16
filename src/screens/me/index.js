import * as React from 'react';
import { useState, useEffect } from 'react'
import { ScrollView, Image, SafeAreaView } from "react-native";
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import CalendarHeatmap from 'react-native-calendar-heatmap-count';
import { readWatchedValuesInCalendar, getDateStrHyphen } from '../../utils'

import { Box, Text } from '../../theme/base'
import { WLR } from '../../utils'

const BackgroundBox = ({ ...rest }) => {
  const { colors } = useTheme();
  return (
    <Box  {...rest} padding='ss' style={{ color: colors.text, backgroundColor: colors.cardBackground, borderRadius: 6 }} />
  )
}

const Tag = ({ isTv, text }) => {
  const { colors } = useTheme();
  return (
    <Box style={{ backgroundColor: isTv ? colors.tvBorder : colors.movieBorder, borderColor: isTv ? colors.tvText : colors.movieText, borderWidth: 1, borderRadius: 3, padding: 3 }}>
      <Text variant='title2' style={{ color: isTv ? colors.tvText : colors.movieText }}>{text}</Text>
    </Box>
  )
}

const UserBasic = (navigation) => {
  return (
    <Box>
      <Box flexDirection='row' alignItems='center'>
        <Image style={{ width: 70 * WLR, height: 70 * WLR, borderRadius: 70 * WLR / 2 }} source={{ uri: 'https://pic2.zhimg.com/v2-0e1ebe66bc6f4a695c2b05ac114bf35d_b.jpg' }} />
        <Box style={{ width: 250 * WLR }} marginLeft='s'>
          <Text ellipsizeMode='tail' numberOfLines={1} variant='title1'>喜马拉雅小熊猫</Text>
          <Text style={{ marginTop: 6 * WLR }} ellipsizeMode='tail' numberOfLines={2} variant='desc1'> 电影发明以后，人类的生命，比起以前延长了至少三倍...</Text>
        </Box>
        <Text>
          <Icon name='chevron-forward-outline' size={26 * WLR} />
        </Text>
      </Box>
    </Box>

  )
}

const WatchCount = () => {
  const { colors } = useTheme();
  const [valendarValues, setValues] = useState([]);
  const [monthCount, setMonthCount] = useState(0);
  const getData = async () => {
    const values = await readWatchedValuesInCalendar();
    if (values) {
      setValues(values);
      const dateStrPrefix = getDateStrHyphen(new Date()).slice(0, 7);
      let count = 0
      for (const date of values) {
        if (date['date'].startsWith(dateStrPrefix)) {
          count += 1;
        }
      }
      setMonthCount(count)
    }
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <Box marginVertical='s'>
      <Text variant='title0'>观影趋势</Text>
      <Box marginTop='s' flexDirection='row' justifyContent='space-between'>
        <BackgroundBox>
          <Box paddingVertical='m' style={{ width: 100 }} alignItems='center'>
            <Text variant='header'>
              {monthCount}
            </Text>
            <Text></Text>
            <Text>本月已看</Text>
          </Box>
        </BackgroundBox>

        <BackgroundBox>
          <CalendarHeatmap
            showMonthLabels={false}
            colorArray={[colors.card, "#d6e685", "#8cc665", "#44a340", "#1e6823"]}
            endDate={new Date()}
            numDays={68}
            values={valendarValues}
          />
        </BackgroundBox>
      </Box>
    </Box>

  )
}

const WatchAnalyze = () => {
  const { colors } = useTheme();


  return (
    <Box marginVertical='s'>
      <Text variant='title0'>观影分析</Text>
      <Box marginTop='s'>
        <BackgroundBox>
          <Box margin='s' flexDirection='row' alignItems='flex-end'>
            <Box flexDirection='row' justifyContent='space-between' style={{ width: 110 * WLR }}>
              <Text style={{ color: colors.movieText }}><Icon name='film-outline' size={24} /></Text>
              <Text variant='title0' style={{ color: colors.movieText }}><Text variant='box' style={{ color: colors.movieText }}>672</Text> 看过</Text>
            </Box>
            <Box marginLeft='m' flexDirection='row' justifyContent='space-around' style={{ width: 160 * WLR }}>
              <Tag isTv={false} text='科幻' />
              <Tag isTv={false} text='悬疑' />
              <Tag isTv={false} text='诺兰' />
            </Box>
            <Box marginLeft='m' flexDirection='row' justifyContent='space-around' style={{ width: 30 * WLR }}>
              <Text><Icon name='chevron-forward-outline' size={26 * WLR} /></Text>
            </Box>
          </Box>
          <Box margin='s' flexDirection='row' alignItems='flex-end'>
            <Box flexDirection='row' justifyContent='space-between' style={{ width: 110 * WLR }}>
              <Text style={{ color: colors.movieText }}><Icon name='tv-outline' size={24} /></Text>
              <Text variant='title0' style={{ color: colors.tvText }}><Text variant='box' style={{ color: colors.tvText }}>672</Text> 看过</Text>
            </Box>
            <Box marginLeft='m' flexDirection='row' justifyContent='space-around' style={{ width: 160 * WLR }}>
              <Tag isTv={true} text='喜剧' />
              <Tag isTv={true} text='网剧' />
              <Tag isTv={true} text='2020' />
            </Box>
            <Box marginLeft='m' flexDirection='row' justifyContent='space-around' style={{ width: 30 * WLR }}>
              <Text><Icon name='chevron-forward-outline' size={26 * WLR} /></Text>
            </Box>
          </Box>
        </BackgroundBox>
      </Box>

    </Box>

  )
}

export default (navigation) => {

  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  return (
    <SafeAreaView>
      <ScrollView>
        <Box padding='m'>
          <UserBasic />
          <WatchCount />
          <WatchAnalyze />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};
