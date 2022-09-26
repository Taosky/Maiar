import * as React from 'react';
import { useState, useEffect } from 'react'
import { ScrollView, TouchableOpacity } from "react-native";

import { storage, sleep } from '../../utils';
import { Box, Text, Loading } from '../../theme/base'
import Icon from 'react-native-vector-icons/Ionicons';
import MovieCard from '../../components/common/MovieCard'


export default ({ route, navigation }) => {
  const pageSize = 20;
  const { type_ } = route.params;
  const [page, setPage] = useState(1);
  const [rankInfo, setRankInfo] = useState(null);
  const [movies, setMovies] = useState([]);
  const [noMore, setNoMore] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

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
    if (rankInfo) {
      navigation.setOptions({
        title: rankInfo.title,
      });
    }
  }, [rankInfo,]);

  const getData = async () => {
    setLoading(true)
    await sleep(200);
    const data = await storage.load({ key: 'rank', id: `${type_.replace(/_/g, '-')}+${page}`, syncParams: { page: page, limit: pageSize } });
    if (data.total <= page * pageSize) {
      setNoMore(true);
    }
    if (!rankInfo) {
      setRankInfo({
        total: data.total,
        updateAt: data.subject_collection.updated_at,
        title: data.subject_collection.title,
      });
    }

    let newMovies = [];
    for (let movie of data.subject_collection_items) {
      movie.onPressMethod = () => navigation.push('MovieDetail', {
        mid: movie.id,
      })
      newMovies.push(movie);
    }
    const currentMovies = movies;
    const newAllMovies = currentMovies.concat(newMovies);
    setMovies(newAllMovies);
    setPage(page + 1);
    setTimeout(() => {
      setLoading(false)
    }, 200)
  }

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  return (
    <Box>
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            if (noMore) {
              return
            }
            getData();
          }
        }}
        scrollEventThrottle={400}
      >
        <Box padding='m'>
          {
            rankInfo && <Box flexDirection='row'>
              <Text variant='title3'>
                共{rankInfo?.total}部，更新于{rankInfo?.updateAt}
              </Text>
            </Box>
          }
          <Box>
            {
              movies.map((movie, index) => (
                <Box key={movie.id} marginTop='ss'>
                  <Text variant='rankNo'>No. {index + 1}</Text>
                  <MovieCard item={movie} />
                </Box>
              ))
            }
          </Box>
          {loading && <Loading />}
          <Box margin='m'>
            <Text variant='tip'>{noMore && '(´・ω・｀) 没有更多了'}</Text>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  )

}