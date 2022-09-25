import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';

import { Box, Text } from '../../theme/base';
import { RolePoster, MoviePoster } from '../../components/common/Poster';
import { FadeView } from '../../components/common/AnimatedView';
import PosterWall from '../../components/common/PosterWall';


import * as api from '../../api/APIUtils'
import { getCelebrityById } from '../../api/PublicApi'



export default ({ route, navigation }) => {
  const { cid } = route.params;
  const [celebrity, setCelebrity] = useState(new Object);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCelebrityDetail();
  }, []);

  const formatedMovies = (movies) => {
    return movies.map((current) => {
      return {
        id: current.id,
        title: current.title,
        image: current.poster,
        rate: current.rating ? current.rating.value : 0,
        onPressMethod: () => navigation.push('MovieDetail', {
          mid: current.id
        }),
      }
    });
  }

  const getCelebrityDetail = async () => {
    setLoading(true);
    const data = await api.get(getCelebrityById(cid), {}, 'public');
    const movies = data?.movies;
    data.movies = formatedMovies(movies);
    setCelebrity(data);
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }


  return (
    <Box style={{ flex: 1 }}>
      <ScrollView>
        <SafeAreaView>
          <FadeView show={!loading}>
            <Box padding='m'>
              <Box marginTop='m' justifyContent='center' flexDirection='row'>
                <RolePoster role={{ cover: celebrity?.cover_url ? celebrity?.cover_url : celebrity?.avatar?.normal }} />
              </Box>
              <Box style={{ marginTop: -20 }}>
                <Text style={{ textAlign: 'center' }} variant='title1'>{celebrity?.name}</Text>
                <Text style={{ textAlign: 'center' }} variant='desc2'>{celebrity?.roles?.join(', ')}</Text>
              </Box>
              <Box marginVertical='ss'>
                <Text variant='title2'>简介</Text>
                <Text variant='desc2'>
                  {celebrity?.abstract}
                </Text>
              </Box>
              <PosterWall marginVertical='s' title={'相关作品'} posterItems={
                celebrity?.movies?.map((movie, index) => <MoviePoster key={index} movie={movie} />)
              } />
            </Box>
          </FadeView>
        </SafeAreaView>
      </ScrollView>

    </Box>
  )

}