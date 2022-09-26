import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';

export default ({ source, style }) => {
  const [paintedHeight, setPaintedHeight] = useState(0);
  const [resultWidth, setResultWidth] = useState(0);

  useEffect(() => {
    let stillMounted = true;
    Image.getSize(source.uri, (realW, realH) => {
      if (!paintedHeight || !stillMounted) return;
      const shrinkRatio = realH / paintedHeight;
      setResultWidth(realW / shrinkRatio);
    });
    return () => (stillMounted = false);
  }, [paintedHeight]);

  return (
    <Image
      style={[{ width: resultWidth }, style, { height: '100%' }]}
      source={source}
      onLayout={(event) => setPaintedHeight(event.nativeEvent.layout.height)}
    />
  );
}