import * as React from 'react';
import { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native'
import { Box } from '../../theme/base';
import { MoviePoster } from '../../components/common/Poster'
import PosterWallList from '../../components/common/PosterWallList';
import { storage } from '../../utils';
import Icon from 'react-native-vector-icons/Ionicons';

export default ({ route, navigation }) => {
  const { hid } = route.params;
  const [moviePosters, setMoviePosters] = useState(new Array());

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
    getHot();
  }, []);

  const format = (data) => {
    return data.map((current) => {
      return {
        id: current.id,
        image: current.cover ? current.cover.url : current.pic?.normal,
        title: current.title,
        rate: current.rating ? current.rating.value : 0,
        onPressMethod: () => navigation.navigate('NoTabScreen', {
          screen: 'MovieDetail',
          params: {
            mid: current.id
          }
        }),
      }
    })
  }

  const getHot = async () => {
    let data = await storage.load({ key: 'hot', id: hid });
    setMoviePosters(format(data));
  }

  return (
    <ScrollView>
      <Box padding='m'>
      <PosterWallList posterItems={moviePosters?.map((movie) =>
        <MoviePoster marginBottom='s' key={movie.id} movie={movie} />
      )} />
      </Box>
    </ScrollView>
  )
};