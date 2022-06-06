import 'react-native-gesture-handler'; // 얘는 무조건 최상단에 있어야 함
import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import AppNavigator from './src/navigations/AppNavigator';
import FlashMessage from 'react-native-flash-message';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <FlashMessage position="top" />
    </Provider>
  );
};
export default App;
