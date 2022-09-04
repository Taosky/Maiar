import * as React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { getMovieHotGaia, getMovieShowing, getTvHot, getTvVarietyShow } from '../../api/PublicApi'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});


export default () => {

  const [recentHots, setRecentHots] = useState(new Array());
  const [loading, setLoading] = useState(true);

  const format = (data) => {
    return data.map((current) => {
      return {
        id: current.id,
        image: current.cover ? current.cover.url : current.pic?.normal,
        title: current.title,
        rate: current.rating ? Number(current.rating.value) / 2 : 0,
        onClickMethod: () => navigateTo({ url: `/pages/movie/detail?id=${current.id}` }),
      }
    })

  }

  const getRcentHots = async () => {
    setLoading(true);
    let curRecentHots = new Array();

    let data = await api.get(getMovieHotGaia(), {}, 'public');
    curRecentHots.push({
      title: '热门电影',
      moviePosters: format(data)
    });
    data = await api.get(getMovieShowing(), {}, 'public');
    curRecentHots.push({
      title: '当前热映',
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


  const searchTitle = (keyword) => {
    navigateTo({ url: `/pages/search/result?q=${keyword}` })
  }

  usePageEvent('onLoad', async () => {
    getRcentHots();
  });


  return (
    <View className={styles.app}>
      <LoadingMask show={loading} />
      <View className={styles.header}>
        <View className={styles.searchBar}>
          <SearchBar placeholder="搜索" onSubmit={searchTitle}></SearchBar>
        </View>
      </View>
      <View className={styles.main}>
        <View>
          {
            recentHots?.map((hotList) =>
              <PosterScrollList key={hotList.title} title={hotList.title} posterItems={hotList.moviePosters.map((moviePoster) =>
                <MoviePoster key={moviePoster.id} moviePoster={moviePoster} />
              )}></PosterScrollList>
            )
          }
        </View >
      </View>
    </View>
  );
};
