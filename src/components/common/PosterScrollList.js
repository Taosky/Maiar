import React from 'react';
import { ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { Box, Text } from '../../theme/base'

export default ({ title, posterItems, ...rest }) => {
  const iconName = {
    '正在上映': 'film-outline',
    '豆瓣热门': 'flame-outline',
    '热门剧集': 'tv-outline',
    '热门综艺': 'flower-outline',
  }


  return (
    <Box {...rest}>
      <Box marginBottom='s'>
        <Text variant='title2'><Icon name={iconName[title]} /> {title}</Text>
      </Box>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {posterItems}
      </ScrollView>
    </Box>
  );
}; 