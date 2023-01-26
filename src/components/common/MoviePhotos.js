import React, { useState, useEffect } from 'react';
import { Box, Text } from '../../theme/base';
import ImageView from 'react-native-image-viewing';
import { storage } from '../../utils';
import PosterScrollList from '../../components/common/PosterScrollList'
import PosterWallList from '../../components/common/PosterWallList'
import { PhotoPoster } from '../../components/common/Poster';


const ImageFooter = ({ imageIndex, imagesCount }) => (
  <Box style={{
    height: 64,
    backgroundColor: '#00000077',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <Text style={{
      fontSize: 17,
      color: '#FFF'
    }}>{`${imageIndex + 1} / ${imagesCount}`}</Text>
  </Box>
)

export default ({ navigation, mid, type = 'line', ...rest }) => {
  const [visible, setIsVisible] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [smalls, setSmalls] = useState([]);
  const [larges, setLarges] = useState([]);

  useEffect(() => { getData(); }, [mid,])

  const getData = async () => {
    if (!mid) {
      return
    }
    let data = await storage.load({ key: 'photos', id: mid });
    if (data?.photos?.length > 0) {
      let smallImages = [];
      let largeImages = [];
      let index = 0;
      for (const photo of data.photos) {
        if (photo.image?.is_animated === false && photo.image?.large && photo.image?.small) {
          const photoIndex = index;
          smallImages.push({
            uri: photo.image.small.url,
            onPressMethod: () => {
              setPhotoIndex(photoIndex);
              setIsVisible(true);
            },
          });
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
          {type === 'line' && <PosterScrollList title={'剧照'} posterItems={
            smalls?.slice(0, 10).map((photo, index) => <PhotoPoster marginRight='s' key={index} photo={photo} />)
          } showMore={true} onMorePressMethod={() => {
            navigation.navigate('NoTabScreen', {
              screen: 'PhotoMore',
              params: {
                mid: mid,
              }
            })
          }} />}
          {type === 'wall' && <PosterWallList posterItems={
            smalls?.map((photo, index) => <PhotoPoster marginVertical='s' key={index} photo={photo} />)
          } />}

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