import * as React from 'react';
import { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native'
import { Box } from '../../theme/base';
import Photos from '../../components/common/MoviePhotos';
import { storage } from '../../utils';
import Icon from 'react-native-vector-icons/Ionicons';

export default ({ route, navigation }) => {
  const { mid } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Icon style={{ marginLeft: -15 }} size={30} color='#1882FB' name='chevron-back-outline' />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <ScrollView>
        <Photos type='wall' mid={mid} />
    </ScrollView>
  )
};