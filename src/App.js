import React, { useState, useEffect } from 'react';
import { Appearance } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme, darkTheme } from './theme/custom';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/home'
import ExploreScreen from './screens/explore'
import MeScreen from './screens/me'
import MovieDetailScreen from './screens/movie/detail'
import SearchResultScreen from './screens/search/result'
import WebViewScreen from './screens/webview/index'
import CelebrityDetailScreen from './screens/celebrity/detail'
import RankDetailScreen from './screens/explore/rankDetail'
import SettingScreen from './screens/me/setting'
import { getSetting, } from './utils';



Icon.loadFont()
const colorTheme = Appearance.getColorScheme();
const SettingContext = React.createContext({});


const App = () => {
  const [darkMode, setDarkMode] = useState(colorTheme === 'dark' ? true : false);
  // to resolve a problem that appearance colorScheme change when app in background.
  let themeChanging = false;
  Appearance.addChangeListener(() => {
    if (!themeChanging) {
      themeChanging = true;
      setTimeout(() => {
        const colorScheme = Appearance.getColorScheme();
        if (colorScheme === 'dark' && !darkMode) {
          setDarkMode(true);
        } else if (colorScheme === 'light' && darkMode) {
          setDarkMode(false);
        }
        themeChanging = false;
      }, 1000)
    }

  });

  const [setting, setSetting] = useState({});

  const updateSetting = async () => {
    let curSetting = setting;
    const serverSetting = await getSetting('serversetting');
    curSetting['server'] = serverSetting;
    setSetting(curSetting);
  }

  const TabStack = createBottomTabNavigator();
  const Tabs = () => {
    const navigation = useNavigation();
    useEffect(() => {
      navigation?.addListener('focus', () => {
        updateSetting();
      });
    }, []);
    return (
      <TabStack.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === '首页') {
              iconName = focused ? 'ios-home-sharp' : 'ios-home-outline';
            } else if (route.name === '发现') {
              iconName = focused ? 'ios-rocket' : 'ios-rocket-outline';
            } else if (route.name === '我的') {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
        <TabStack.Screen name="首页"
          options={{
            title: '首页',
            headerShown: true
          }}
          component={HomeScreen} />
        <TabStack.Screen name="发现"
          options={{
            title: '发现',
            headerShown: true
          }}
          component={ExploreScreen} />
        <TabStack.Screen name="我的"
          options={{
            title: '我的',
            headerShown: true
          }}
          component={MeScreen} />
      </TabStack.Navigator>
    )
  }

  const NoTabStack = createNativeStackNavigator();
  const NoTabs = () => {
    return (
      <NoTabStack.Navigator>
        <NoTabStack.Screen name="MovieDetail"
          options={{
            headerShown: true,
            headerTransparent: true,
            headerBackTitle: '',
            title: '',
          }}
          component={MovieDetailScreen} />
        <NoTabStack.Screen name="CelebrityDetail"
          options={{
            title: '影人详情',
            headerBackTitle: '',
            headerShown: true
          }}
          component={CelebrityDetailScreen} />
        <NoTabStack.Screen name="SearchResult"
          options={{
            title: '搜索结果'
          }}
          component={SearchResultScreen} />
        <NoTabStack.Screen name="RankDetail"
          options={{
            title: '',
            headerBackTitle: '',
          }}
          component={RankDetailScreen} />
        <NoTabStack.Screen name="WebView"
          component={WebViewScreen} />
        <NoTabStack.Screen name="Setting"
          options={{
            title: '设置'
          }}
          component={SettingScreen} />
      </NoTabStack.Navigator>

    )
  }

  const MainStack = createNativeStackNavigator();

  return (
    <SettingContext.Provider value={setting}>
      <NavigationContainer
        theme={darkMode ? darkTheme : theme}>
        <MainStack.Navigator>
          <MainStack.Screen options={{
            headerShown: false,
          }} name="TabScreen" component={Tabs} />
          <MainStack.Screen options={{
            headerShown: false,
            headerTransparent: true,
            headerBackTitle: '',
            title: ''
          }} name="NoTabScreen" component={NoTabs} />
        </MainStack.Navigator>
      </NavigationContainer>
    </SettingContext.Provider>
  );
};

export default App;
export {
  SettingContext,
}
