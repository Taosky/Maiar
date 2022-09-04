import React from 'react';
import { View, Text, Image } from 'remax/wechat'

import styles from './RolePoster.css';

export default (props) => {

  return (
    <View style={props.style} className={styles.poster} onClick={props.onClickMethod}>
      <Image className={styles.image} src={props.image} mode="aspectFill" />
      <Text className={styles.title}>{props.title}</Text>
      <Text className={styles.subtitle}>{props.subtitle}</Text>
    </View>
  );
}; 