import React from 'react';
import { View, reLaunch, getMenuButtonBoundingClientRect, navigateBack } from 'remax/wechat'
import { Icon } from 'annar'
import styles from './NavigationBar.css'

export default (props) => {
  const { height, width, top, right } = getMenuButtonBoundingClientRect();
  const heightCss = height * 2 + 'rpx';
  const widthCss = width * 2 + 'rpx';
  const topCss = top * 2 + 'rpx';
  const leftCss = `calc(100vw - ${right * 2}px)`;

  const homePage = 'pages/home/index';


  const toHomePageOrGoBack = () => {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]
    console.log(prevPage.route)    
    if(prevPage.route ===homePage){
      navigateBack();
    }else{
      reLaunch({url:homePage});
    }

  }
  return (
    <View style={{ top: topCss, left: leftCss, height: heightCss, width: widthCss }} class={styles.capsule}>
      <View className={styles.btn} onClick={navigateBack}>
        <Icon color='white' type='back' size='40px' style={{ height: heightCss, verticalAlign: 'middle' }}></Icon>
      </View>
      <View className={styles.splitter}>
        |
      </View>
      <View className={styles.btn} onClick={toHomePageOrGoBack}>
        <Icon color='white' type='home' size='40px' style={{ height: heightCss, verticalAlign: 'middle' }}></Icon>
      </View>
    </View>
  )
}