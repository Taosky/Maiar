import React from 'react';
import { Text } from 'remax/wechat'

import styles from './Tag.css'

export default (props) => {

  return (
    <Text className={styles.tag} onClick={props.onClickMethod}>{props.text}</Text>
  )
}