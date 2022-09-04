import React, { useState } from 'react';
import { View, Text, Button, navigateToMiniProgram } from 'remax/wechat'
import { Icon, Space } from 'annar'

import Tag from './Tag'
import Intro from './Intro'
import styles from './MovieInfo.css'
import VideoPopup from './VideoPopup';
import VendorPopup from './VendorPopup';
import RolePoster from '../../common/RolePoster';
import PosterScrollList from '../../common/PosterScrollList';

export default (props) => {
  const info = props.info;
  const [videoPopupShow, setVideoPopupShow] = useState(false);
  const [vendorPopupShow, setVendorPopupShow] = useState(false);

  const douban_appid = 'wx2f9b06c1de1ccfca';

  const toDouban = (page) => {
    navigateToMiniProgram({
      appId: douban_appid,
      path: info.douban_page
    })
  }

  const roles = info.directors?.concat(info.actors);

  return (
    <View className={styles.infobox}>
      <Space size={24} direction='vertical' style='width:100%'>
        <View>
          <View className={styles.title + ' ' + styles.textbox}>
            {info.title}
          </View>
          {info.original_title !== "" &&
            <View className={styles.originalTitle + ' ' + styles.textbox}>
              {info.original_title}
            </View>
          }
        </View>
        <View className={styles.databox + ' ' + styles.textbox}>
          <Icon color="#FF6666" type="favorfill" />
          <Text className={styles.inlineText}>
            {info.rate}
          </Text>

          <Text className={styles.inlineText}>
            {info.pubdate}
          </Text>

        </View>
        {info.tags && info.tags.length > 0 &&
          <View className={styles.databox + ' ' + styles.textbox}>
            {info.tags && info.tags.length > 0 && info.tags?.map((tag, index) => (
              <Tag key={index} className={styles.inlineText} text={tag.name} />
            ))
            }
          </View>
        }
        <View className={styles.databox + ' ' + styles.textbox}>
          {
            info.directors &&
            <Text className={styles.inlineText}>
              导演:
            </Text>
          }
          {info.directors?.map((director, index) => (
            <Text key={index} className={styles.inlineText}>{director.name}</Text>
          ))
          }
        </View>
        <View class={styles.btnbox}>
          <Space size={18}>
            {info.vendors?.length > 0 && <Button className={styles.btn} onClick={() => { setVendorPopupShow(true) }}>片源</Button>}
            {info.trailer && <Button className={styles.btn} onClick={() => { setVideoPopupShow(true) }}>预告</Button>}
            {info.douban_page && <Button className={styles.btn} onClick={toDouban}>豆瓣</Button>}
          </Space>
        </View>
        <Intro text={info.intro} />
        <PosterScrollList title='影人' posterItems={roles?.map((role, index) => (
          <RolePoster key={index} title={role.name} subtitle={role.role} image={role.cover} />))} />
      </Space>
      <VendorPopup show={vendorPopupShow} vendors={info.vendors} onClose={() => { setVendorPopupShow(false) }} />
      <VideoPopup show={videoPopupShow} src={info.trailer} onClose={() => { setVideoPopupShow(false) }} />

    </View>
  )
}