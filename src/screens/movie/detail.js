import React, { useState } from 'react';
import { usePageEvent } from 'remax/macro';
import { View } from 'remax/wechat';

import LoadingMask from '../../components/common/LoadingMask';
import NavigationBar from '../../components/common/NavigationBar'
import Backdrop from '../../components/movie/detail/backdrop';
import BlankHeader from '../../components/common/BlankHeader'
import MovieInfo from '../../components/movie/detail/MovieInfo';

import * as api from '../../api/APIUtils'
import { getMovieById } from '../../api/PublicApi'

import styles from './detail.css'


export default () => {
  const [movie, setMovie] = useState(new Object);
  const [loading, setLoading] = useState(true);
  const getRoleCover = (role) => {
    if (role.cover_url) {
      return role.cover_url;
    } else if (role.avatar){
      if(role.avatar.normal){
        return role.avatar.normal;
      }else if(role.avatar.large){
        return role.avatar.large;
      }
    }
    return 'https://s2.loli.net/2022/08/16/W5si62xlkGyBuep.png'
  }

  const formatRoleData = (roles, type) => {
    return roles.map((role) => {
      return {
        id: role.id ? role.id : '-1',
        name: role.name ? role.name : '未知',
        role: type == '导演' ? '导演' : '演员',
        cover: getRoleCover(role),
      }
    });
  }
  const formatMovieData = (current) => ({
    backdrop: (current.extra && current.extra.backdrops) ? current.extra.backdrops[0] : null,
    title: current.title,
    original_title: current.original_title != current.title ? current.original_title : '',
    year: current.year,
    rate: current.rating ? Number(current.rating.value) : 0,
    tags: current.tags,
    intro: current.intro,
    trailer: current.trailer ? current.trailer.video_url : null,
    vendors: current.vendors,
    douban_page: `pages/subject/subject?type=${current.type}&id=${current.id}`,
    imdb_link: (current.extra && current.extra.imdb_id) ? `https://www.imdb.com/title/${current.extra.imdb_id}` : null,
    pubdate: current.pubdate,
    directors: formatRoleData(current.directors, '导演'),
    actors: formatRoleData(current.actors, '演员'),
  })

  const getMovieDetail = async (id) => {
    setLoading(true);
    let data = await api.get(getMovieById(id), {}, 'public');
    let formated_movie = formatMovieData(data)
    setMovie(formated_movie);
    setTimeout(() => {
      setLoading(false);
    }, 200)
  }
  usePageEvent('onLoad', (options) => {
    getMovieDetail(options.id);

  });

  return (
    <View class={styles.detail}>
      <LoadingMask show={loading} />
      <NavigationBar />
      {
        movie.backdrop ? <Backdrop img={movie.backdrop} /> : <BlankHeader title='详情' />
      }
      <MovieInfo info={movie} />
    </View>
  )
};