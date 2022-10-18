import * as React from 'react';
import { useState, useEffect } from 'react'
import { ScrollView, Image, SafeAreaView } from "react-native";
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import CalendarHeatmap from 'react-native-calendar-heatmap-count';
import { readWatchedValuesInCalendar, getDateStrHyphen, readStatistics } from '../../utils'

import { Box, Text } from '../../theme/base'
import { WLR } from '../../utils'

const BackgroundBox = ({ ...rest }) => {
  const { colors } = useTheme();
  return (
    <Box  {...rest} padding='ss' style={{ color: colors.text, backgroundColor: colors.cardBackground, borderRadius: 6 }} />
  )
}

const Tag = ({ isTv, text, ...rest }) => {
  const { colors } = useTheme();
  return (
    <Box {...rest} style={{ maxWidth: 60, backgroundColor: isTv ? colors.tvBorder : colors.movieBorder, borderColor: isTv ? colors.tvText : colors.movieText, borderWidth: 1, borderRadius: 3, padding: 2 }}>
      <Text variant='title3' ellipsizeMode='tail' numberOfLines={1} style={{ color: isTv ? colors.tvText : colors.movieText }}>{text}</Text>
    </Box>
  )
}

const UserBasic = (navigation) => {
  return (
    <Box>
      <Box flexDirection='row' alignItems='center'>
        <Image style={{ width: 70 * WLR, height: 70 * WLR, borderRadius: 70 * WLR / 2 }} source={{ uri: 'https://pic2.zhimg.com/v2-0e1ebe66bc6f4a695c2b05ac114bf35d_b.jpg' }} />
        <Box style={{ width: 250 * WLR }} marginLeft='s'>
          <Text ellipsizeMode='tail' numberOfLines={1} variant='title2'>喜马拉雅小熊猫</Text>
          <Text style={{ marginTop: 6 * WLR }} ellipsizeMode='tail' numberOfLines={2} variant='desc2'> 电影发明以后，人类的生命，比起以前延长了至少三倍...</Text>
        </Box>
        <Text>
          <Icon name='chevron-forward-outline' size={26 * WLR} />
        </Text>
      </Box>
    </Box>

  )
}

const WatchCount = ({ ...rest }) => {
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
    <Box {...rest}>
      <Text variant='title0'>观影趋势</Text>
      <Box marginTop='s' flexDirection='row' justifyContent='space-between'>
        <BackgroundBox>
          <Box paddingVertical='m' style={{ width: 100 * WLR }} alignItems='center'>
            <Text variant='header'>
              {monthCount}
            </Text>
            <Text>本月已看</Text>
          </Box>
        </BackgroundBox>
        <BackgroundBox>
          <CalendarHeatmap
            showMonthLabels={false}
            colorArray={[colors.subcard, "#d6e685", "#8cc665", "#44a340", "#1e6823"]}
            endDate={new Date()}
            numDays={66}
            values={valendarValues}
          />
        </BackgroundBox>
      </Box>
    </Box>

  )
}

const WatchAnalyze = ({ statistics, ...rest }) => {
  const { colors } = useTheme();


  return (
    <Box {...rest}>
      <Text variant='title0'>观影分析</Text>
      <Box marginTop='s'>
        <BackgroundBox>
          <Box margin='s' flexDirection='row' alignItems='flex-end'>
            {/* width 337 */}
            <Box flexDirection='row' justifyContent='space-between' style={{ width: 100 * WLR }}>
              <Text style={{ color: colors.movieText }}><Icon name='film-outline' size={20} /></Text>
              <Text variant='title1' style={{ color: colors.movieText }}><Text variant='box' style={{ color: colors.movieText }}>{statistics ? statistics.watched.total : 0}</Text> 看过</Text>
            </Box>
            <Box marginLeft='m' flexDirection='row' style={{ width: 188 * WLR }}>
              {statistics?.watched.tags.slice(0, 3).map((tag) => <Tag marginHorizontal='s' key={tag.tag} isTv={false} text={tag.tag} />)}
            </Box>
            <Box marginLeft='s' flexDirection='row' justifyContent='space-around' style={{ width: 30 * WLR }}>
              <Text><Icon name='chevron-forward-outline' size={26 * WLR} /></Text>
            </Box>
          </Box>
          <Box margin='s' flexDirection='row' alignItems='flex-end'>
            <Box flexDirection='row' justifyContent='space-between' style={{ width: 100 * WLR }}>
              <Text style={{ color: colors.movieText }}><Icon name='star-half-outline' size={20} /></Text>
              <Text variant='title1' style={{ color: colors.tvText }}><Text variant='box' style={{ color: colors.tvText }}>{statistics ? statistics.toWatch.total : 0}</Text> 想看</Text>
            </Box>
            <Box marginLeft='m' flexDirection='row' style={{ width: 188 * WLR }}>
              {statistics?.toWatch.tags.slice(0, 3).map((tag) => <Tag marginHorizontal='s' key={tag.tag} isTv={true} text={tag.tag} />)}
            </Box>
            <Box marginLeft='s' flexDirection='row' justifyContent='space-around' style={{ width: 30 * WLR }}>
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
  // const { colors } = useTheme();
  const [statistics, setStatistics] = useState(null);

  const getData = async () => {
    const lastStatistics = await readStatistics();
    setStatistics(lastStatistics);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <Box padding='s'>
          <UserBasic />
          <WatchCount marginVertical='s' />
          <WatchAnalyze marginVertical='s' statistics={statistics} />
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};
