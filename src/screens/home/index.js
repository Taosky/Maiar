import * as React from 'react';
import { useState, useEffect } from 'react'
import { ScrollView } from "react-native";

import { storage } from '../../utils';
import { Box, Loading } from '../../theme/base'
import PosterScrollList from '../../components/common/PosterScrollList'
import { MoviePoster } from '../../components/common/Poster'
import SearchBar from '../../components/common/SearchBar'

export default ({ route, navigation }) => {

  const [recentHots, setRecentHots] = useState(new Array());


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
    let curRecentHots = new Array();

    let data = await storage.load({ key: 'hot', id: 'movieHotGaia' });
    curRecentHots.push({
      title: '豆瓣热门',
      moviePosters: format(data)
    });
    data = await storage.load({ key: 'hot', id: 'movieShowing' });
    curRecentHots.push({
      title: '正在上映',
      moviePosters: format(data)
    });

    data = await storage.load({ key: 'hot', id: 'tvHot' });
    curRecentHots.push({
      title: '热门剧集',
      moviePosters: format(data)
    });
    data = await storage.load({ key: 'hot', id: 'tvVarietyShow' });
    curRecentHots.push({
      title: '热门综艺',
      moviePosters: format(data)
    });

    setRecentHots(curRecentHots);
  }



  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
    >
      <Box paddingVertical='m'>
        <SearchBar
          onSubmitMethod={(keyword) => navigation.navigate('NoTabScreen', {
            screen: 'SearchResult',
            params: {
              keyword: keyword,
            }
          })}
        />

        {recentHots?.length === 0 && <Box margin='xl'><Loading /></Box>}

        <Box marginVertical='s' marginLeft='s'>
          {
            recentHots?.map((hotList) =>
              <PosterScrollList marginVertical='s' key={hotList.title} title={hotList.title} posterItems={hotList.moviePosters?.map((movie) =>
                <MoviePoster marginRight='m' key={movie.id} movie={movie} />
              )}></PosterScrollList>
            )
          }
        </Box>
      </Box>
    </ScrollView>
  );
};
