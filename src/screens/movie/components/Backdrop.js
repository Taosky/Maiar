import React from 'react';
import {View} from 'remax/wechat'
import styles from './Backdrop.css'

export default (props) => {

  return (
    <View>
      { props.img
      ? <View className={styles.backdrop} style={{backgroundImage: `url(${props.img})`}} />
      : <View className={styles.topadjust}></View>
    }
    </View>
  )
}