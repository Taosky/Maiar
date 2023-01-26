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
    const limit = 20;
    let request_body = {
      collection: "movie",
      database: "Douban",
      dataSource: "Cluster0",
      filter: {},
      sort: {},
      skip: (page - 1) * limit,
      limit: limit,
    };
    request_body["filter"]["title"] = {};
    request_body["filter"]["title"]["$regex"] = keyword;
    request_body["filter"]["title"]["$options"] = "i";
    request_body["sort"]["year"] = -1;
    request_body["sort"]["_id"] = -1;
    const response = await api.post(getMoviesByTitle(), request_body, 'movieSearch',null, 'LLppSL7L7bjMm7uHavkXOICu9iymDvwn51rADdUM7hXDjEhxVGZ8zPRqnKOdnLu8');
    const results = response.documents;
    if (results.length < limit) {
      setTimeout(() => {
        setNoMore(true);
      }, 300);
    }
    for (const result of results) {
      let subtitle = result.year;
      if (result.tags.length > 0){
        for (const tag of result.tags.slice(0, 6)){
          if (tag !== result.year){
            subtitle += ' / ' + tag;
          }
        }
      }
      const formatedMovie = {
        id: result.id,
        poster: result.poster,
        title: result.title,
        subtitle: subtitle,
        rating: {value: result.rating},
        isTv: result.is_tv,
        description: null,
        onPressMethod: () => {
          navigation.navigate('MovieDetail', {
            mid: result.id
          })
        }
      }
      currentMovies.push(formatedMovie);
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
            <MovieCard marginVertical='s' key={movie.id} {...movie} />
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