import React from 'react';
import { View as RNView, Text as RNText, ActivityIndicator, Modal } from 'react-native';
import { useTheme } from '@react-navigation/native';


const Box = ({ style,
  margin, marginVertical, marginHorizontal, marginTop, marginBottom, marginLeft, marginRight,
  padding, paddingVertical, paddingHorizontal, paddingTop, paddingBottom, paddingLeft, paddingRight, backgroundColor,
  ...rest }) => {
  const { spacing } = useTheme();
  return (
    <RNView
      style={{
        margin: spacing[margin],
        marginVertical: spacing[marginVertical],
        marginHorizontal: spacing[marginHorizontal],
        marginTop: spacing[marginTop],
        marginBottom: spacing[marginBottom],
        marginLeft: spacing[marginLeft],
        marginRight: spacing[marginRight],
        padding: spacing[padding],
        paddingVertical: spacing[paddingVertical],
        paddingHorizontal: spacing[paddingHorizontal],
        paddingTop: spacing[paddingTop],
        paddingBottom: spacing[paddingBottom],
        paddingLeft: spacing[paddingLeft],
        paddingRight: spacing[paddingRight],
        // backgroundColor: colors.background,
        ...style,
      }}
      {...rest}
    />
  );
};

const Text = ({ style, variant, color, ...rest }) => {
  const { colors, textVariants } = useTheme();

  return (
    <RNText
      style={{
        color: colors.text,
        ...textVariants[variant],
        ...style,
      }}
      {...rest}
    />
  );
};


const Loading = (...rest) => {
  const { colors, spacing } = useTheme();
  return (
    <RNView {...rest}>
      <ActivityIndicator size={18} color={colors.text} />
      <RNText style={{ textAlign: 'center', color: colors.text, margin: spacing['s'] }}>正在加载中...</RNText>
    </RNView>
  )
}

const Popup = (show, ...rest) => {
  const { colors, spacing } = useTheme();
  return (
    <RNView  style={{zIndex:100,backgroundColor:'white'}} {...rest}>
      <Modal
        animationType="slide"
        visible={show}
      ><Text>1123123sdssssdadaeasddaewe23</Text></Modal>
    </RNView>
  )
}

export {
  Box,
  Text,
  Loading,
  Popup,
}