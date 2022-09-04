import React from 'react';
import { View, Text, Image, setClipboardData, showToast } from 'remax/wechat'
import { Popup, Icon } from 'annar';

import styles from './VendorPopup.css'

export default (props) => {
  const copyVendorLink = (data) => {
    setClipboardData({
      data: data,
      success (res) {
        showToast({
          title:'已复制播放链接'
        })
      }
    })
  }

  return (
    <Popup
      position='bottom'
      open={props.show}
      onClose={props.onClose}
      closeable
    >
      {props.show &&
        <View className={styles.vendorBox}>
          {
            props.vendors.map((vendor, index) => (
              <View className={styles.vendorCell} key={index} onClick={() => {
                copyVendorLink(vendor.url)
              }
              }>
                <Image className={styles.icon} src={vendor.icon} />
                <View style='display:inline-block'>
                  {vendor.title}
                  <Text className={styles.desc}>
                    （{vendor.payment_desc}）
                  </Text>
                  <View className={styles.right}>
                    <Icon type='right' />
                  </View>
                </View>

              </View>
            ))
          }
        </View>
      }
    </Popup >

  )
}
