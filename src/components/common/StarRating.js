import React from "react";

function Star({ marked, starId }) {
  return (
    <Text star-id={starId} style={{ color: "#ff9933" }} role="button">
      {marked ? "\u2605" : "\u2606"}
    </Text>
  );
}


export default (props) => {
  const rating = (typeof props.rating == "number" && props.rating !== -1) ? props.rating : 0
  return (
    <div
    >
      {/* 创建5个组件 */}
      {Array.from({ length: 5 }, (v, i) => (
        <Star
          starId={i + 1}
          key={`star_${i + 1} `}
          marked={rating >= i + 1}
        />
      ))}
    </div>
  );
}