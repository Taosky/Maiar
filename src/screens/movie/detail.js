import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, Image, Linking, Alert } from 'react-native';

import Modal from "react-native-modal";
import { Box, Text } from '../../theme/base';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';
import ImageView from "react-native-image-viewing";
import * as api from '../../api/APIUtils'
import { getMovieById, getMovieRatingById, getMovieRecommendationsById, getMoviePhotosById } from '../../api/PublicApi'
import PosterScrollList from '../../components/common/PosterScrollList'

import Backdrop from '../../components/common/Backdrop';
import { MoviePoster, RolePoster, PhotoPoster } from '../../components/common/Poster';
import { FadeView } from '../../components/common/AnimatedView';
import { alert404 } from '../../utils/index'


const MyButton = ({ title, onPressMethod, ...rest }) => {
  const { colors, } = useTheme();
  return (
    <TouchableOpacity onPress={onPressMethod}>
      <Box paddingVertical='s' paddingHorizontal='m' {...rest} style={{ borderRadius: 5, backgroundColor: colors.cardBackground }}>
        <Text variant='button' color={colors.text} >{title}</Text>
      </Box>
    </TouchableOpacity>

  )
}

const ButtonBox = ({ navigation, vendors, trailer, douban_link, imdb_link, setVendorShow, ...rest }) => {
  return (
    <Box>
      <Box flexDirection='row' {...rest}>
        {vendors?.length > 0 && <MyButton marginRight='s' title='片源' onPressMethod={() => { setVendorShow(true); }} />}
        {trailer && <MyButton marginRight='s' title='预告' onPressMethod={() => navigation.navigate('WebView', { uri: trailer, title: '预告' })} />}
        {douban_link && <MyButton marginRight='s' title='豆瓣' onPressMethod={() => navigation.navigate('WebView', { uri: douban_link, title: '豆瓣' })} />}
        {imdb_link && <MyButton marginRight='s' title='IMDB' onPressMethod={() => navigation.navigate('WebView', { uri: imdb_link, title: 'IMDB' })} />}
      </Box>
    </Box>
  )
}

const VendorPopup = ({ vendors, show, setVendorShow }) => {
  const { colors } = useTheme();

  const tryToOpenUri = (uri, url) => {
    console.log('try opening: ', uri)
    Linking.canOpenURL(uri).then((supported) => {
      if (supported) {
        Linking.openURL(uri)
      } else
        Alert.alert('App未安装', '是否从浏览器打开？', [{
          text: "好",
          onPress: () => Linking.openURL(url),
          style: "default",
        }, {
          text: "不了",
          style: "cancel",
        },
        ]);
    });
  }
  return (
    <Modal
      animationType="slide"
      isVisible={show}
      backdropOpacity={0.5}
      onBackdropPress={() => setVendorShow(false)}
      style={{ bottom: 0, flex: 0, margin: 0, width: '100%', position: 'absolute', backgroundColor: colors.cardBackground, borderRadius: 10, padding: 8 }}
    >
      {
        vendors?.length > 0 && vendors.map((vendor, index) =>
          <TouchableOpacity key={index} onPress={() => { tryToOpenUri(vendor.uri, vendor.url) }}>
            <Box flexDirection='row' padding='m' justifyContent='space-around'>
              <Box flexDirection='row'>
                <Image alignSelf='baseline' style={{ height: 16, width: 16, marginHorizontal: 4 }} source={{ uri: vendor.icon }} />
                <Text style={{ textAlign: 'left' }} variant='title2'>
                  {vendor.title}{vendor.payments?.length > 0 && <Text variant='desc2'>（{vendor.payments[0].method}）</Text>}
                </Text>
              </Box>
              {vendor.episodes_info !== '' && <Text variant='subtitle2'>{vendor.episodes_info}</Text>}

              <Icon alignSelf='baseline' size={14} color={colors.text} name='chevron-forward-outline' />
            </Box>
          </TouchableOpacity>)
      }
    </Modal>

  )

}

const TitleBox = ({ title, year, subtitle, ...rest }) => {
  return (
    <Box {...rest}>
      <Text variant='title0'>{title}（{year}）</Text>
      {
        subtitle !== '' && <Box><Text variant='subtitle2'>{subtitle}</Text></Box>
      }
    </Box>
  )
}

const RatingInfo = ({ mid, ...rest }) => {
  const [rating, setRating] = useState(new Object)
  const getRating = async () => {
    if (!mid) {
      return
    }
    let data = await api.get(getMovieRatingById(mid), {}, 'public');
    setRating(data);
  }

  useEffect(() => {
    getRating();
  }, [mid,])

  return (
    <Box>
      {rating.type_ranks && rating.type_ranks != [] &&
        <Box flexDirection='row' {...rest}>
          {rating.type_ranks.map((rank) => {
            <Box marginRight='s'>
              <Text>`好于${(rank.rank * 100).toFixed(2)}的${rank.type}`</Text>
            </Box>
          })}
        </Box>
      }
    </Box>
  )
}

const BasicInfo = ({ rate, duration, episodes_count, pubdate, akas, ...rest }) => {
  const akaText = '又名:  ' + akas?.join('  /  ');
  return (
    <Box {...rest}>
      {akas?.length > 0 &&
        <Box marginBottom='s' flexDirection='row'>
          <Text variant='desc3' >{akaText}</Text>
        </Box>
      }
      <Box flexDirection='row' >
        <Icon name='star' size={14} color='red' />
        <Text numberOfLines={2} ellipsizeMode='tail'>{rate !== 0 ? rate : '无评分'}  {pubdate}  {duration} {episodes_count ? (episodes_count !== 0 && `共${episodes_count}集`) : ''}</Text>
      </Box>
    </Box>
  )
}

const Tags = ({ tags, ...rest }) => {
  return (
    <Box>
      {
        tags?.length > 0 &&
        <Box {...rest} flexDirection='row'>
          {tags?.map((tag, index) =>
            <Box key={index} marginRight='ss'><Text variant='tag' key={index}>{tag.name}</Text></Box>
          )}
        </Box>
      }
    </Box>
  )
}

const Directors = ({ directors, ...rest }) => {
  return (
    <Box>
      {directors?.length > 0 &&
        <Box {...rest} flexDirection='row' alignItems='center'>
          <Text >
            导演:
          </Text>
          {
            directors?.map((director, index) => (
              <Box key={index} marginRight='ss'>
                <Text key={index} >{director.name}</Text>
              </Box>
            ))}
        </Box>
      }
    </Box>
  )
}

const Intro = ({ text, ...rest }) => {
  const { colors } = useTheme();
  const minLinesNum = 4;
  const [expand, setExpand] = useState(false);
  const [showexpand, setShowexpand] = useState(false);
  const onTextLayout = useCallback(e => {
    setShowexpand(e.nativeEvent.lines.length > minLinesNum);
  }, []);
  return (
    <Box {...rest}>
      <Box style={{ position: 'absolute', zIndex: -100 }}><Text style={{ color: colors.background }} variant='desc2' onTextLayout={onTextLayout}>{text}</Text></Box>
      <Text variant='desc2' numberOfLines={expand ? 1000 : minLinesNum} ellipsizeMode='tail'>
        {text}
      </Text>
      {showexpand && <TouchableOpacity onPress={() => { setExpand(!expand) }}>
        <Text style={{ textAlign: 'right' }} variant='desc2'>{expand ? '收起\u25B2' : '展开\u25BC'}</Text>
      </TouchableOpacity>}
    </Box>
  )
}

const Roles = ({ directors, actors, ...rest }) => {
  const roles = directors?.concat(actors);
  return (
    <Box {...rest}>
      {directors && actors &&
        <PosterScrollList title={'演职人员'} posterItems={
          roles?.map((role, index) => <RolePoster key={index} role={role} />)
        } />
      }
    </Box>

  )
}

const ImageFooter = ({ imageIndex, imagesCount }) => (
  <Box style={{
    height: 64,
    backgroundColor: "#00000077",
    alignItems: "center",
    justifyContent: "center"
  }}>
    <Text style={{
      fontSize: 17,
      color: "#FFF"
    }}>{`${imageIndex + 1} / ${imagesCount}`}</Text>
  </Box>
)

const Photos = ({ mid, ...rest }) => {
  const [visible, setIsVisible] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [smalls, setSmalls] = useState([]);
  const [larges, setLarges] = useState([]);

  useEffect(() => { getData(); }, [mid,])

  const getData = async () => {
    if (!mid) {
      return
    }
    let data = await api.get(getMoviePhotosById(mid), {}, 'public');
    if (data.photos?.length > 0) {
      let smallImages = [];
      let largeImages = [];
      let index = 0;
      for (const photo of data.photos) {
        if (photo.image?.is_animated === false && photo.image?.large && photo.image?.small) {
          if (index < 10) {
            const photoIndex = index;
            smallImages.push({
              uri: photo.image.small.url,
              onPressMethod: () => {
                setPhotoIndex(photoIndex);
                setIsVisible(true);
              },
            });
          }
          largeImages.push({ uri: photo.image.large.url });
          index += 1;
        }
      }
      setSmalls(smallImages);
      setLarges(largeImages);
    }
  }
  return (
    <Box>
      {smalls.length > 0 &&
        <Box {...rest}>
          <PosterScrollList title={'剧照'} posterItems={
            smalls?.map((photo, index) => <PhotoPoster key={index} photo={photo} />)
          } />
          <ImageView
            images={larges}
            imageIndex={photoIndex}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
            FooterComponent={({ imageIndex }) => (
              <ImageFooter imageIndex={imageIndex} imagesCount={larges.length} />
            )}
          />
        </Box>
      }
    </Box>
  )
}

const Recomendations = ({ mid, navigation, ...rest }) => {
  const [recommendations, setRecommendations] = useState([])

  const getData = async () => {
    if (!mid) {
      return
    }
    let data = await api.get(getMovieRecommendationsById(mid), {}, 'public');
    if (data?.recommendations) {
      let movies = [];
      for (const current of data.recommendations) {
        movies.push({
          id: current.id,
          image: current.pic?.normal,
          title: current.title,
          rate: current.rating ? current.rating.value : 0,
          onPressMethod: () =>
            navigation.push('MovieDetail', {
              mid: current.id
            }),
        });
      }
      setRecommendations(movies);
    }
  }

  useEffect(() => {
    getData();
  }, [mid])

  return (
    <Box {...rest}>
      {recommendations.length > 0 &&
        <PosterScrollList title={'相关推荐'} posterItems={
          recommendations?.map((movie, index) => <MoviePoster key={index} movie={movie} />)
        } />
      }
    </Box>

  )
}

export default ({ route, navigation }) => {
  const { colors } = useTheme();
  const { mid } = route.params;
  const [movie, setMovie] = useState(new Object);
  const [loading, setLoading] = useState(true);
  const [vendorShow, setVendorShow] = useState(false);
  const [headerOpacity, setHeaderOpacity] = useState(0);

  useEffect(() => {
    getMovieDetail();
  }, []);

  // 设置标题栏title、透明度
  useEffect(() => {
    navigation.setOptions({
      title: headerOpacity > 0.8 ? movie?.title : '',
      headerTransparent: true,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Icon style={{ marginLeft: -15 }} size={30} color='#1882FB' name='chevron-back-outline' />
        </TouchableOpacity>
      ),
      headerStyle: {
        opacity: headerOpacity,
      },
      headerBackground: () => (
        <Box
          style={{
            backgroundColor: colors.background,
            ...StyleSheet.absoluteFillObject,
            opacity: headerOpacity,
          }}
        />
      ),
    });
  }, [headerOpacity,])


  const getRoleCover = (role) => {
    if (role.cover_url) {
      return role.cover_url;
    } else if (role.avatar) {
      if (role.avatar.normal) {
        return role.avatar.normal;
      } else if (role.avatar.large) {
        return role.avatar.large;
      }
    }
    return 'https://s2.loli.net/2022/08/16/W5si62xlkGyBuep.png'
  }

  const formatRoleData = (roles, type) => {
    if (!roles) {
      return null;
    }
    return roles.map((role) => {
      const role_ = role.character ? role.character : type;
      return {
        id: role.id ? role.id : '-1',
        name: role.name ? role.name : '未知',
        role: role_,
        cover: getRoleCover(role),
        onPressMethod: () => {
          if (role.id) {
            navigation.push('CelebrityDetail', {
              cid: role.id,
            })
          }
        }
      }
    });
  }

  const formatMovieData = (current) => ({
    id: current.id,
    backdrop: (current.extra?.backdrops && current.extra?.backdrops.length > 0) ? current.extra.backdrops[0].replace(/original/i, 'w1066_and_h600_bestv2') : null,
    poster: current.cover_url ? current.cover_url : current.pic?.normal,
    title: current.title,
    original_title: current.original_title != current.title ? current.original_title : '',
    year: current.year,
    rate: current.rating ? Number(current.rating.value) : 0,
    duration: current.durations?.length > 0 ? current.durations[0] : null,
    tags: current.tags,
    intro: current.intro,
    trailer: current.trailer ? current.trailer.video_url : null,
    vendors: current.vendors,
    douban_link: `https://m.douban.com/movie/subject/${current.id}/`,
    imdb_link: (current.extra && current.extra.imdb_id) ? `https://m.imdb.com/title/${current.extra.imdb_id}/` : null,
    pubdate: current.pubdate,
    episodes_count: current.episodes_count,
    directors: formatRoleData(current.directors, '导演'),
    actors: formatRoleData(current.actors, '演员'),
    akas: current.aka,
  })

  const getMovieDetail = async () => {
    setLoading(true);
    let data = await api.get(getMovieById(mid), {}, 'public', navigation = navigation);
    if (data.code === 404) {
      alert404(navigation);
    }
    let formated_movie = formatMovieData(data)
    setMovie(formated_movie);
    setTimeout(() => {
      setLoading(false);
    }, 100)
  }

  return (
    <Box>
      <ScrollView
        onScroll={(event) => {
          const scrollY = event.nativeEvent.contentOffset.y;
          setHeaderOpacity(((scrollY - 0) * (1 - 0)) / (100 - 0) + 0);
        }}
        scrollEventThrottle={10}
      >
        {/* {loading && <Box margin='xl'><Loading /></Box>} */}
        <FadeView show={!loading}>
          <Backdrop img={movie.backdrop ? movie.backdrop : movie.poster} landscape={movie.backdrop} />
          <Box padding='m'>
            <TitleBox marginVertical='ss' title={movie.title} year={movie.year} subtitle={movie.original_title} />
            <BasicInfo marginVertical='ss' rate={movie.rate} duration={movie.duration} episodes_count={movie.episodes_count} pubdate={movie.pubdate} akas={movie.akas} />
            <RatingInfo marginVertical='ss' mid={movie.id} />
            <Tags marginVertical='ss' tags={movie.tags} />
            <Directors marginVertical='ss' directors={movie.directors} />
            <ButtonBox marg33inVertical='ss' navigation={navigation} vendors={movie.vendors} trailer={movie.trailer} douban_link={movie.douban_link} imdb_link={movie.imdb_link} setVendorShow={setVendorShow} />
            <Intro marginVertical='s' text={movie.intro} />
            <Roles marginVertical='ss' actors={movie.actors} directors={movie.directors} />
            <Photos marginVertical='ss' mid={movie.id} />
            <Recomendations marginVertical='s' navigation={navigation} mid={movie.id} />
          </Box>
        </FadeView>
      </ScrollView >
      <VendorPopup show={vendorShow} vendors={movie.vendors} setVendorShow={setVendorShow} />

    </Box>
  )
};