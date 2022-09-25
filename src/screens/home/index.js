import * as React from 'react';
import { useState, useEffect } from 'react'
import { RefreshControl, ScrollView } from "react-native";
import * as api from '../../api/APIUtils'
import { getMovieHotGaia, getMovieShowing, getTvHot, getTvVarietyShow } from '../../api/PublicApi'

import { Box, Loading } from '../../theme/base'
import PosterScrollList from '../../components/common/PosterScrollList'
import { MoviePoster } from '../../components/common/Poster'
import SearchBar from '../../components/common/SearchBar'

export default ({ route, navigation }) => {

  const [recentHots, setRecentHots] = useState(new Array());
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    getRcentHots();
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

  const getRcentHots = async () => {
    setLoading(true);
    let curRecentHots = new Array();

    let data = await api.get(getMovieHotGaia(), {}, 'public');
    curRecentHots.push({
      title: '豆瓣热门',
      moviePosters: format(data)
    });
    data = await api.get(getMovieShowing(), {}, 'public');
    curRecentHots.push({
      title: '正在上映',
      moviePosters: format(data)
    });

    data = await api.get(getTvHot(), {}, 'public');
    curRecentHots.push({
      title: '热门剧集',
      moviePosters: format(data)
    });
    data = await api.get(getTvVarietyShow(), {}, 'public');
    curRecentHots.push({
      title: '热门综艺',
      moviePosters: format(data)
    });

    setRecentHots(curRecentHots);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }



  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      // refreshControl={
      //   <RefreshControl
      //     refreshing={loading}
      //     onRefresh={getRcentHots}
      //     title="正在加载中..."
      //   />}
    >
      <Box paddingVertical='m'>
        <SearchBar
          onSubmitMethod={(keyword) => navigation.navigate('NoTabScreen', {
            screen: 'SearchResult',
            params:{
            keyword: keyword,}
          })}
        />

        {recentHots?.length === 0 && <Box margin='xl'><Loading /></Box>}

        <Box marginVertical='s' marginLeft='m'>
          {
            recentHots?.map((hotList) =>
              <PosterScrollList marginVertical='s' key={hotList.title} title={hotList.title} posterItems={hotList.moviePosters?.map((movie) =>
                <MoviePoster key={movie.id} movie={movie} />
              )}></PosterScrollList>
            )
          }
        </Box>
      </Box>
    </ScrollView>
  );
};
