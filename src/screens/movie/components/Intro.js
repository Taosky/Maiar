import React, { useState, useMemo } from 'react';
import { Text, View } from 'remax/wechat'
import { Icon } from 'annar';

import styles from './Intro.css'


export default (props) => {
  const [expand, setExpand] = useState(false);
  const expandClass = useMemo(() => (expand ? styles.textFull : styles.text), [expand]);
  const expandIconType = useMemo(() => (expand ? 'triangleupfill' : 'triangledownfill'), [expand]);

  const expandClick = () => {
    setExpand(!expand)
  }

  return (
    <View>
      <Text>简介</Text>
      <Text className={expandClass}>{props.text}</Text>
      <View className={styles.text + ' ' + styles.expandBtn} onClick={expandClick}>
        {
          expand ? '收回' : '展开'
        }
        <Icon color='#CECECE' type={expandIconType} />


      </View>
    </View>
  )
}