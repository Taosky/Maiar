import React, { useEffect } from "react";
import { WebView } from 'react-native-webview';


const JS_DOUBAN_SUBJECT = `
  addNewStyle('.sub-trademark {display:none !important;}');
  addNewStyle('#TalionNav {display:none !important;}');
  addNewStyle('#celebrities {display:none !important;}');
  addNewStyle('.center {display:none !important;}');
  addNewStyle('.subject-banner {display:none !important;}');
  addNewStyle('.subject-pics {display:none !important;}');
  addNewStyle('.subject-rec {display:none !important;}');
  addNewStyle('.write-review {display:none !important;}');
  addNewStyle('.mark-item {display:none !important;}');
  addNewStyle('.write-comment {display:none !important;}');
  addNewStyle('.open-in-app-fixed-bottom {display:none !important;}');
  addNewStyle('.download-app {display:none !important;}');
  addNewStyle('.sub-vendor {display:none !important;}');
  addNewStyle('.card { margin-top: 10px; }');
  addNewStyle('.cover-count { display:none !important;}');

  `;

const JS_DOUBAN_REVIEW = `
  addNewStyle('#TalionNav {display:none !important;}');
  addNewStyle('.subject-card {display:none !important;}');
  addNewStyle('.tags {display:none !important;}');
  addNewStyle('iframe {display:none !important;}');
  addNewStyle('.interests {display:none !important;}');
  addNewStyle('.types {display:none !important;}');
  addNewStyle('.download-app {display:none !important;}');
  addNewStyle('.oia-readall {display:none !important;}');
  addNewStyle('.hidden-content {display:none !important;}');
  addNewStyle('.read-all {display:none !important;}');
  addNewStyle('.note-content {max-height: none !important; overflow: auto !important;}');
  let adTextEles = document.querySelectorAll("div[style~='center']");
  for (const ele of adTextEles){ele.style.display='none'}
  `;

const JS_IMDB = `
  addNewStyle('#imdbHeader {display:none !important;}');
  addNewStyle('.ipc-split-button {display:none !important;}');
  addNewStyle('.imdb-footer {display:none !important;}');
  addNewStyle('.recently-viewed-items {display:none !important;}');
  addNewStyle('.ipc-title__actions {display:none !important;}');
`;

const INJECTED_JS = `
  function cleanStyle() {
    function addNewStyle(newStyle) {
      let styleElement = document.getElementById('styles_js');
      if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.type = 'text/css';
          styleElement.id = 'styles_js';
          document.getElementsByTagName('head')[0].appendChild(styleElement);
      }
      styleElement.appendChild(document.createTextNode(newStyle));
    }

    if (window.location.href.startsWith('https://m.douban.com/movie/subject/')){
      ${JS_DOUBAN_SUBJECT}
    }
    if  (window.location.href.startsWith('https://m.douban.com/movie/review/')){
      ${JS_DOUBAN_REVIEW}
    }
    if (window.location.href.startsWith('https://m.imdb.com/title/')){
      ${JS_IMDB}
    }
    
  }
  cleanStyle(); 
`;

export default ({ route, navigation }) => {
  const { uri, title } = route.params;
  console.log(uri)
  const displayTabBar = () => {
    const parent = navigation.getParent();
    parent.setOptions({
      tabBarStyle: { display: 'none' },
    });
    navigation.setOptions({
      title: title,
    });

  };
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () =>
      displayTabBar(false)
    );
    return unsubscribe;
  }, [navigation]);
  return (
    <WebView
      source={{ uri: uri }}
      injectedJavaScript={INJECTED_JS}
      onShouldStartLoadWithRequest={(request) => {
        const urlPrefixes = ['https://m.douban.com/', 'https://m.imdb.com/']
        if (request.url !== uri) {
          for (const pre of urlPrefixes) {
            if (request.url.startsWith(pre)) {
              navigation.push('WebView', { uri: request.url, title: request.title });
              return false;
            }
          }
        }
        return true;
      }}
    />
  )
}