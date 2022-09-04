import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { Rate } from 'annar';

import styles from './MoviePoster.css';
import './MoviePoster.wrap.css'

export default (props) => {

  return (
    <View style={props.style} className={styles.poster} onClick={props.moviePoster.onClickMethod}>
      <Image className={styles.image} src={props.moviePoster.image}></Image>
      <Text className={styles.title}>{props.moviePoster.title}</Text>
      <Rate className={styles.rate}
       readOnly size='30px'
        value={props.moviePoster.rate}
        icon="favor"
        iconFill="favor_fill_light" />
    </View>


  );
}; 