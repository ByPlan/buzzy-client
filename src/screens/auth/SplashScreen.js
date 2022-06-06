import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import {loadUserData, logout} from '../../redux/slices/auth';
import {findByUser} from '../../redux/slices/user';

const SplashScreen = ({navigation}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserData())
      .unwrap()
      .then(res => {
        setTimeout(() => {
          if (res.user.accessToken) {
            dispatch(findByUser(res.user.user.id))
              .unwrap()
              .then(data => {
                console.log('data in SplashScreen.js: ' + JSON.stringify(data));
                if (data.groupArray.length >= 0) {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'GardenTabs',
                      },
                    ],
                  });
                }
                // else {
                //   navigation.reset({
                //     index: 0,
                //     routes: [{ name: "Login" }],
                //   });
                // }
              })
              .catch(err => {
                console.log('here!');
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                });
              });
          } else {
            console.log('userData not found2');
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          }
        }, 300); //setTimeout 빼도 됨.
      })
      .catch(err => {
        console.log('SplashScreen gotcha!' + err);
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
      });
  }, [dispatch]);

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#000',
      }}>
      <>
        <Text
          style={{
            fontSize: 60,
            color: '#fff',
            fontFamily: 'Fraunces-Bold',
          }}>
          Buzzy
        </Text>
        <Text style={{color: '#fff'}}>함께 가꾸는 우리들만의 정원</Text>
      </>
    </View>
  );
};

export default SplashScreen;
