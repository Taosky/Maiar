import React from 'react';
import { Video } from 'remax/wechat'
import { Popup } from 'annar';

export default (props) => {

  return (
    <Popup
      position='bottom'
      style='background-color:transparent'
      open={props.show}
      onClose={props.onClose}
      closeable
    >
      {props.show &&
        <Video style='width:100%;' enable-play-gesture={true} direction={90} src={props.src} />
      }
    </Popup>

  )
}
