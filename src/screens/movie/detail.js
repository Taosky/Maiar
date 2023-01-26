import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ScrollView, RefreshControl, TouchableOpacity, TouchableWithoutFeedback, Keyboard, StyleSheet, Image, Alert, TextInput } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Modal from 'react-native-modal';
import { Box, Text } from '../../theme/base';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';
import InputTags from 'react-native-tags';
import { storage, alert404, sleep } from '../../utils';
import PosterScrollList from '../../components/common/PosterScrollList'
import Backdrop from '../../components/common/Backdrop';
import { MoviePoster, RolePoster } from '../../components/common/Poster';
import Photos from '../../components/common/MoviePhotos';
import { FadeView } from '../../components/common/AnimatedView';
import { readWatchStatus, writeWatchStatus, tryToOpenUri } from '../../utils';
import * as api from '../../api/APIUtils'
import { getVideos, getUserInfo } from '../../api/ServerAPI'
import { SettingContext } from '../../App'


const PlayListButton = ({ show, onPressMethod, ...rest }) => {

  return (
    <Box>
      {show &&
        <Box {...rest} flexDirection='row'>
          <CommonButton primary title='播放列表' onPressMethod={() => onPressMethod()} />
        </Box>
      }
    </Box>

  )
}

const WatchStatusButton = ({ mid, status, setWatchShow, ...rest }) => {
  const { colors, } = useTheme();
  const TOWATCH = 0;

  const BtnText = !status ? '未标记' : (status.value === TOWATCH ? '已想看' : '已看过');

  return (
    <TouchableOpacity onPress={() => setWatchShow(true)}>
      <Box {...rest} paddingVertical='s' paddingHorizontal='m' style={{ borderRadius: 5, backgroundColor: status ? colors.enableBackground : colors.disableBackground }}>
        <Text variant='button'>{BtnText}</Text>
      </Box>
    </TouchableOpacity>
  )
}

const CommonButton = ({ title, onPressMethod, primary, ...rest }) => {
  const { colors, } = useTheme();
  return (
    <TouchableOpacity onPress={onPressMethod}>
      <Box paddingVertical='s' paddingHorizontal='m' {...rest} style={{ minWidth: 60, borderRadius: 5, backgroundColor: primary ? colors.notification : colors.cardBackground }}>
        <Text style={{ textAlign: 'center' }} variant='button' color={colors.text} >{title}</Text>
      </Box>
    </TouchableOpacity>
  )
}

const ButtonBox = ({ navigation, mid, vendors, trailer, douban_link, imdb_link, setVendorShow, watchStatus, setWatchShow, ...rest }) => {
  return (
    <Box>
      <Box flexDirection='row' {...rest}>
        <WatchStatusButton mid={mid} status={watchStatus} setWatchShow={setWatchShow} marginRight='s' />
        {vendors?.length > 0 && <CommonButton marginRight='s' title='片源' onPressMethod={() => { setVendorShow(true); }} />}
        {trailer && <CommonButton marginRight='s' title='预告' onPressMethod={() => navigation.navigate('WebView', { uri: trailer, title: '预告' })} />}
        {douban_link && <CommonButton marginRight='s' title='豆瓣' onPressMethod={() => navigation.navigate('WebView', { uri: douban_link, title: '豆瓣' })} />}
        {/* {imdb_link && <CommonButton marginRight='s' title='IMDB' onPressMethod={() => navigation.navigate('WebView', { uri: imdb_link, title: 'IMDB' })} />} */}
      </Box>
    </Box>
  )
}

const WatchPopup = ({ mid, status, userTags, setWatchShow, updateStatusMethod, show }) => {
  const { colors, } = useTheme();
  const WATCHED = 1;
  const TOWATCH = 0;
  const NOWATCH = -1;
  const [select, setSelect] = useState(NOWATCH);
  const [comment, setComment] = useState('');
  const [tags, setTags] = useState([]);


  const initStatus = () => {
    if (status) {
      setSelect(status.value);
      setComment(status.comment);
      if (status.value !== WATCHED && status.tags instanceof Array && status.tags.length === 0) {
        setTags(userTags);
      } else {
        setTags(status.tags);
      }
    } else {
      setSelect(NOWATCH);
      setTags(userTags);
    }
  }

  useEffect(() => {
    if (!mid) {
      return;
    }
    initStatus();
  }, [show,]);

  const saveStatus = () => {
    if (select === NOWATCH) {
      return;
    }
    try {
      writeWatchStatus(mid, select, tags, comment);
      Alert.alert('保存成功', '');
      setWatchShow(false);
    }
    catch (err) {
      console.log(err);
      Alert.alert('保存出错', '', [{
        text: '好',
        style: 'destructive',
      }]);
    }
    sleep(300);
    updateStatusMethod();
  }
  return (
    <Modal
      isVisible={show}
      backdropOpacity={0.5}
      onBackdropPress={() => setWatchShow(false)}
      style={{ margin: 0, }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Box padding='m' style={{ backgroundColor: colors.cardBackground, borderRadius: 10, padding: 8 }} >
          <Box padding='m' flexDirection='row' justifyContent='space-around' >
            <Box flexDirection='row'>
              <CheckBox
                style={{ width: 18, height: 18, marginRight: 10 }}
                value={select === TOWATCH ? true : false}
                onValueChange={(value) =>
                  value !== false ?
                    setSelect(0) : setSelect(NOWATCH)} />
              <Text variant='title1'>想看</Text>
            </Box>
            <Box flexDirection='row'>
              <CheckBox
                style={{ width: 18, height: 18, marginRight: 10 }}
                value={select === WATCHED ? true : false}
                onValueChange={(value) =>
                  value !== false ?
                    setSelect(1) : setSelect(NOWATCH)} />
              <Text variant='title1'>已看</Text>
            </Box>
          </Box>
          {show && select === WATCHED &&
            <Box>
              <InputTags
                textInputProps={{ placeholder: '自定义标签(空格添加)' }}
                initialText=''
                initialTags={tags}
                onChangeTags={tags => setTags(tags)}
                containerStyle={{ justifyContent: 'center' }}
                inputStyle={{ backgroundColor: colors.subcard, color: colors.text, borderRadius: 4, }}
                renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
                  <Box margin='ss' key={`${tag}-${index}`}>
                    <TouchableOpacity onPress={onPress}>
                      <Box flexDirection='row' alignItems='baseline' style={{ backgroundColor: colors.tag, borderRadius: 3, padding: 4 }}>
                        <Text variant='subtitle4' style={{ color: 'black' }}>{tag}</Text>
                        <Text variant='subtitle5' style={{ color: 'black' }}> X</Text>
                      </Box>
                    </TouchableOpacity>
                  </Box>
                )}
              />
            </Box>
          }
          <Box>
            {
              select === WATCHED &&
              <Box padding='m'>
                <TextInput
                  multiline={true}
                  style={{ height: 80, borderColor: 'gray', borderWidth: 1, borderRadius: 4, color: colors.text }}
                  onChangeText={text => setComment(text)}
                  value={comment}
                  placeholder='写点想法...'
                  placeholderTextColor={colors.desc}
                />
              </Box>
            }
            {select != NOWATCH && <CommonButton title='保存' onPressMethod={() => saveStatus()} />}
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const VendorPopup = ({ vendors, show, setVendorShow }) => {
  const { colors } = useTheme();

  return (
    <Modal
      isVisible={show}
      backdropOpacity={0.5}
      onBackdropPress={() => setVendorShow(false)}
      style={{ justifyContent: 'flex-end', margin: 0, }}
    >
      <Box style={{ backgroundColor: colors.cardBackground, borderRadius: 10, padding: 8 }}>
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
                {/* {vendor.episodes_info !== '' && <Text variant='subtitle2'>{vendor.episodes_info}</Text>} */}

                <Icon alignSelf='baseline' size={14} color={colors.text} name='chevron-forward-outline' />
              </Box>
            </TouchableOpacity>)
        }

      </Box>
    </Modal>

  )

}

const VideoPopup = ({ videos, show, setVideoShow, server, player, ...rest }) => {
  const genPlayLink = (videoLink) => {
    const encodeVideoLink = encodeURIComponent(server + videoLink)
    switch (player) {
      case 'nplayer':
        return `nplayer-${server}${videoLink}`;
      case 'vlc':
        return `vlc-x-callback://x-callback-url/stream?url=${encodeVideoLink}`;
      // case 'mxplayer':
      //   return 
    }
  }

  return (
    <Modal
      {...rest}
      isVisible={show}
      onBackdropPress={() => setVideoShow(false)}
      backdropOpacity={0.8}
    >
      <Box >
        <ScrollView>
          <TouchableOpacity onPress={() => setVideoShow(false)}>
            <Box marginVertical='m' marginHorizontal='s' flexDirection='row' flexWrap='wrap'>

              {
                videos?.map((video, index) => <CommonButton margin='s' key={index} title={index + 1} onPressMethod={() => { tryToOpenUri(genPlayLink(video), server + video); }} />)
              }
            </Box>
          </TouchableOpacity>
        </ScrollView>
      </Box>
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
    let data = await storage.load({ key: 'rating', id: mid });
    setRating(data);
  }

  useEffect(() => {
    getRating();
  }, [mid,])

  return (
    <Box>
      {rating?.type_ranks && rating?.type_ranks != [] &&
        <Box flexDirection='row' {...rest}>
          {rating?.type_ranks.map((rank) => {
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
        <Text numberOfLines={2} ellipsizeMode='tail'>{rate !== 0 ? rate?.toFixed(1) : '无评分'}  {pubdate}  {duration} {episodes_count ? (episodes_count !== 0 && `共${episodes_count}集`) : ''}</Text>
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
          roles?.map((role, index) => <RolePoster marginRight='m' key={index} role={role} />)
        } />
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
    let data = await storage.load({ key: 'recommendations', id: mid });
    if (data?.recommendations) {
      let movies = [];
      for (const current of data.recommendations) {
        movies.push({
          id: current.id,
          image: current.pic?.normal,
          title: current.title,
          // rate: current.rating ? current.rating.value : 0,
          rate: -2,
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
          recommendations?.map((movie, index) => <MoviePoster marginRight='m' key={index} movie={movie} />)
        } />
      }
    </Box>

  )
}

export default ({ route, navigation }) => {
  const { colors } = useTheme();

  const setting = useContext(SettingContext);

  const [headerOpacity, setHeaderOpacity] = useState(0);

  const [loading, setLoading] = useState(true);
  const { mid } = route.params;
  const [movie, setMovie] = useState(new Object);
  const [vendorShow, setVendorShow] = useState(false);

  const [watchShow, setWatchShow] = useState(false);
  const [watchStatus, setWatchStatus] = useState(null);

  const [videoShow, setVideoShow] = useState(false);
  const [playOn, setPlayOn] = useState(false);
  const [player, setPlayer] = useState(null);
  const [serverUrl, setServerUrl] = useState(null);
  const [videos, setVideos] = useState([]);


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
  }, [headerOpacity,]);

  // 初始化
  useEffect(() => {
    if (!mid) {
      return;
    }
    getMovie();
    getWatchStatus();
    tryToGetServerVideos();
  }, []);

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
        cover: genRoleCoverUrl(role),
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

  const genRoleCoverUrl = (role) => {
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
    user_tags: current.card_subtitle.replace(/ \/ /g, ' ').split(' '),
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

  const getMovie = async (refresh = false) => {
    setLoading(true);
    if (refresh) {
      await storage.remove({ key: 'movie', id: mid });
    }
    let data = await storage.load({ key: 'movie', id: mid });
    if (data?.code === 404) {
      alert404(navigation);
      return;
    }
    let formated_movie = formatMovieData(data)
    setMovie(formated_movie);
    setTimeout(() => {
      setLoading(false);
    }, 80)
  }

  const getWatchStatus = async () => {
    const statusInStorage = await readWatchStatus(mid);
    setWatchStatus(statusInStorage);
  }

  const tryToGetServerVideos = async () => {
    const serverSetting = setting.server;
    if (serverSetting && serverSetting.serverUrl && serverSetting.token) {
      const data = await api.get(getUserInfo, {}, 'server', serverSetting.serverUrl, serverSetting.token);
      if (data && data.id) {
        setPlayer(serverSetting.player);
        setServerUrl(serverSetting.serverUrl);
        const videosData = await api.get(getVideos(mid), {}, 'server', serverSetting.serverUrl, serverSetting.token);
        if (videosData && videosData instanceof Array) {
          setVideos(videosData);
          setPlayOn(true);
        }
      }
    }
  }

  const onScrollEnd = (event) => {
    const offSetY = event.nativeEvent.contentOffset.y; // 获取滑动的距离
    const contentSizeHeight = event.nativeEvent.contentSize.height; // scrollView  contentSize 高度
    const oriageScrollHeight = event.nativeEvent.layoutMeasurement.height; // scrollView高度
    if (offSetY + oriageScrollHeight >= contentSizeHeight - 1) {
      navigation.navigate('WebView', { uri: movie.douban_link, title: '豆瓣' })
    }
  };

  return (
    <Box>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => { getMovie(refresh = true); }}
            progressViewOffset={25}
          />
        }
        onScroll={(event) => {
          const scrollY = event.nativeEvent.contentOffset.y;
          setHeaderOpacity(((scrollY - 0) * (1 - 0)) / (100 - 0) + 0);
        }}
        onScrollEndDrag={onScrollEnd}
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
            <ButtonBox marginVertical='ss' navigation={navigation} mid={movie.id} vendors={movie.vendors} trailer={movie.trailer} douban_link={movie.douban_link} imdb_link={movie.imdb_link} setVendorShow={setVendorShow} watchStatus={watchStatus} setWatchShow={setWatchShow} />
            <PlayListButton marginVertical='ss' show={playOn} onPressMethod={() => setVideoShow(true)} />
            <Intro marginVertical='s' text={movie.intro} />
            <Roles marginVertical='ss' actors={movie.actors} directors={movie.directors} />
            <Photos marginVertical='ss' navigation={navigation} mid={movie.id} />
            <Recomendations marginVertical='s' navigation={navigation} mid={movie.id} />
            <Box><Text style={{ textAlign: 'center' }}>上拉查看评论</Text></Box>
          </Box>
        </FadeView>
      </ScrollView >
      <VendorPopup vendors={movie.vendors} show={vendorShow} setVendorShow={setVendorShow} />
      <WatchPopup status={watchStatus} show={watchShow} mid={movie.id} userTags={movie.user_tags} setWatchShow={setWatchShow} updateStatusMethod={getWatchStatus} />
      <VideoPopup videos={videos} show={videoShow} setVideoShow={setVideoShow} server={serverUrl} player={player} />
    </Box>
  )
};