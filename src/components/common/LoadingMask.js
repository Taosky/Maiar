import React from 'react';

import { View } from 'remax/wechat'
import { Loading } from 'annar';
import styles from './LoadingMask.css'


export default (props) => {

  return (
    <View>
      {
        props.show &&
        <View className={styles.wrapper}>
          <View className={styles.loader}>
            <Loading type="wave" />
          </View>
        </View>
      }
    </View>
  )
}