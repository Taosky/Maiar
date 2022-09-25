import React from 'react'
import { Box } from '../../theme/base'
import { TextInput } from 'react-native'
import { useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';


export default ({ onSubmitMethod }) => {
  const { colors } = useTheme();
  const [text, setText] = React.useState('');

  return (
    <Box paddingHorizontal='m'>
      <TextInput
        style={{ height: 40, paddingHorizontal: 15, borderColor: 'gray', borderWidth: 1, borderRadius: 20, fontSize: 14, color: colors.text }}
        placeholder='搜索'
        onChangeText={text => setText(text)}
        onSubmitEditing={() => { onSubmitMethod && onSubmitMethod(text) }}
        value={text}
      ></TextInput>
    </Box>
  )
}