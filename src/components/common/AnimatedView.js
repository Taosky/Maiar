import React, { useEffect, useRef } from 'react';
import { Animated } from "react-native";


const FadeView = ({ show, ...rest }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => { show && fadeIn(); }, [show,])


  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver:true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver:true,
    }).start();
  };

  return (
    <Animated.View
      {...rest}
      style={[{ opacity: fadeAnim, }]}
    />
  );
}


export { FadeView, }