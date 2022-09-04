import React from 'react';
import { View, ScrollView } from 'remax/wechat'

import styles from './PosterScrollList.css';


export default (props) => {

  return (
    <View>
      <View className={styles.title}>{props.title}</View>
      <ScrollView className={styles.scroller} scrollX>
        <View class={styles.posterbox}>{props.posterItems} </View>
      </ScrollView>
    </View>
  );
}; 