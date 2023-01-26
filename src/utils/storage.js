import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../api/APIUtils'
import { timestampIntervalToTomorrow, timestampIntervalToSunday } from './others';
import {
  getMovieHotGaia,
  getMovieShowing,
  getTvHot,
  getTvVarietyShow,
  getMovieById,
  getMovieRatingById,
  getMovieRecommendationsById,
  getMoviePhotosById,
  getCelebrityById,
  getRankMovies
} from '../api/PublicApi'

const storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 2000,

  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,

  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: null,

  // 读写时在内存中缓存数据。默认启用。
  enableCache: true,

  sync: {
    async hot(params) {
      const apiDict = {
        movieHotGaia: getMovieHotGaia(),
        movieShowing: getMovieShowing(),
        tvHot: getTvHot(),
        tvVarietyShow: getTvVarietyShow(),
      }
      const { id } = params;
      const data = await api.get(apiDict[id], {}, 'movie');
      console.log(`hot ${id} sync resp...`);

      if (data && !data.code) {
        storage.save({
          key: 'hot',
          id: id,
          data: data,
          expires: timestampIntervalToTomorrow(),
        });
        return data;
      } else {
        // 出错时抛出异常
        throw new Error(`error syncing hot ${id}`);
      }
    },
    async movie(params) {
      const { id } = params;
      const data = await api.get(getMovieById(id), {}, 'movie');
      console.log(`movie ${id} sync resp...`);

      if (data && !data.code) {
        storage.save({
          key: 'movie',
          id: id,
          data: data,
        });
        return data;
      } else if (data.code === 404) {
        console.log(`syncing movie ${id} not found`);
        return data;
      } else {
        // 出错时抛出异常
        throw new Error(`error syncing movie ${id}`);
      }
    },
    async photos(params) {
      const { id } = params;
      const data = await api.get(getMoviePhotosById(id), {}, 'movieExtra');
      console.log(`photos ${id} sync resp...`);

      if (data && !data.code) {
        storage.save({
          key: 'photos',
          id: id,
          data: data,
        });
        return data;
      } else if (data.code === 404) {
        console.log(`syncing photos ${id} not found`);
        return data;
      } else {
        // 出错时抛出异常
        throw new Error(`error syncing photos ${id}`);
      }
    },
    async rating(params) {
      const { id } = params;
      const data = await api.get(getMovieRatingById(id), {}, 'movieExtra');
      console.log(`rating ${id} sync resp...`);

      if (data && !data.code) {
        storage.save({
          key: 'rating',
          id: id,
          data: data,
        });
        return data;
      } else if (data.code === 404) {
        console.log(`syncing rating ${id} not found`);
        return data;
      } else {
        // 出错时抛出异常
        throw new Error(`error syncing rating ${id}`);
      }
    },
    async recommendations(params) {
      const { id } = params;
      const data = await api.get(getMovieRecommendationsById(id), {}, 'movieExtra');
      console.log(`recommendations ${id} sync resp...`);

      if (data && !data.code) {
        storage.save({
          key: 'recommendations',
          id: id,
          data: data,
        });
        return data;
      } else if (data.code === 404) {
        console.log(`syncing recommendations ${id} not found`);
        return data;
      } else {
        // 出错时抛出异常
        throw new Error(`error syncing recommendations ${id}`);
      }
    },
    async celebrity(params) {
      const { id } = params;
      const data = await api.get(getCelebrityById(id), {}, 'celebrity');
      console.log(`celebrity ${id} sync resp...`);

      if (data && !data.code) {
        storage.save({
          key: 'celebrity',
          id: id,
          data: data,
        });
        return data;
      } else if (data.code === 404) {
        console.log(`syncing celebrity ${id} not found`);
        return data;
      } else {
        // 出错时抛出异常
        throw new Error(`error syncing celebrity ${id}`);
      }
    },
    async rank(params) {
      const { id, syncParams: { page, limit } } = params;
      const type_ = id.replace(/-/g, '_').replace(/\+\d+/, '');
      const data = await api.get(getRankMovies(type_, page, limit), {}, 'rank');
      console.log(`rank ${id} sync resp...`);

      if (data && !data.code) {
        storage.save({
          key: 'rank',
          id: id,
          data: data,
          expires: timestampIntervalToSunday(),
        });
        return data;
      } else if (data.code === 404) {
        console.log(`syncing rank ${id} not found`);
        return data;
      } else {
        // 出错时抛出异常
        throw new Error(`error syncing rank ${id}`);
      }
    },
  }
});

export default storage;