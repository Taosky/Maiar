import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { Box, Text, Loading } from '../../theme/base'
import Icon from 'react-native-vector-icons/Ionicons';
import { getMoviesByTitle, } from '../../api/PublicApi'
import * as api from '../../api/APIUtils'
import MovieCard from '../../components/common/MovieCard';


export default ({ route, navigation }) => {
  const { keyword } = route.params;
  const [noMore, setNoMore] = useState(false);
  const [movies, setMovies] = useState(new Array());
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getResultDetails();
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Icon style={{ marginLeft: -15 }} size={30} color='#1882FB' name='chevron-back-outline' />
        </TouchableOpacity>
      ),
    });
  }, [keyword]);

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };


  const getResultDetails = async () => {
    if (loading || noMore) {
      return
    }
    setLoading(true);
    let currentMovies = movies;
    const results = await api.get(getMoviesByTitle(), { q: keyword, page: page, limit: 10 }, 'public');
    if (results.length === 0) {
      setTimeout(() => {
        setNoMore(true);
      }, 300);
    }
    for (const result of results) {
      result.onPressMethod = () => navigation.navigate('MovieDetail', {
        mid: result.id
      });
      currentMovies.push(result);
    }

    setMovies(currentMovies);
    setPage(page + 1);
    setTimeout(() => {
      setLoading(false);
    }, 200);


  }
  return (
    <Box>
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            getResultDetails();
          }
        }}
        scrollEventThrottle={400}
      >
        <Box padding='s'>
          {movies?.map((movie) =>
            <MovieCard marginVertical='s' key={movie.id} item={movie} />
          )}
        </Box>
        {loading && <Loading />}
        <Box margin='m'>
          <Text variant='tip'>{noMore && '(´・ω・｀) 没有更多了'}</Text>
        </Box>
      </ScrollView>
    </Box >
  )
}