import * as React from 'react';
import { useState, useEffect } from 'react'
import { RefreshControl, View, Text, ScrollView } from "react-native";
import { useTheme } from '@react-navigation/native';
import * as api from '../../api/APIUtils'
import { getMovieHotGaia, getMovieShowing, getTvHot, getTvVarietyShow } from '../../api/PublicApi'


export default (navigation) => {

  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  return (
    <ScrollView
    >
      <Text style={{ color: colors.text }}>施工中👷‍♀️</Text>

    </ScrollView>
  );
};
