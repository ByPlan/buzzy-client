import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  StatusBar,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import axios from 'axios';
import MyLocationButton from '../../../components/map-buttons/MyLocationButton.js';
import AddMarkerButton from '../../../components/map-buttons/AddMarkerButton.js';
import SearchButton from '../../../components/map-buttons/SearchButton.js';
// import * as Location from "expo-location";
import MapViewDirections from 'react-native-maps-directions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useSelector} from 'react-redux';

const Map = ({navigation}) => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 36.35948,
    longitude: 127.37895,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
  });
  const [placeName, setPlaceName] = useState('');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

  const {isLoggedIn} = useSelector(state => state.auth);

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied");
  //       return;
  //     }
  //     let initLocation = await Location.getCurrentPositionAsync({});
  //     setLocation(initLocation);
  //   })();
  // }, []);

  const searchTest = async () => {
    const apiKey = '0d354750cc5df9c00497abcd507c89d5';
    const coord = await axios.get(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${placeName}`,
      {
        headers: {Authorization: `KakaoAK ${apiKey}`},
      },
    );
    const searchLocation = coord.data.documents[0];
    const xCoord = searchLocation.x;
    const yCoord = searchLocation.y;

    setPlaceName(placeName);

    setIsSearchSubmitted(true);

    setMapRegion({
      ...mapRegion,
      latitude: Number(yCoord),
      longitude: Number(xCoord),
    });
  };

  const myLocation = newLocation => {
    let newLatitude = newLocation.coords.latitude;
    let newLongitude = newLocation.coords.longitude;
    setMapRegion({
      ...mapRegion,
      latitude: newLatitude,
      longitude: newLongitude,
    });
  };

  const [pathDestination, setPathDestination] = useState({});
  const [isPathActivated, setIsPathActivated] = useState(false);

  const pathFind = destination => {
    let desLat = destination.latitude;
    let desLng = destination.longitude;

    setPathDestination({
      ...pathDestination,
      latitude: desLat,
      longitude: desLng,
    });

    setIsPathActivated(true);
  };

  useEffect(() => {
    if (!isLoggedIn)
      return navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
  }, [isLoggedIn]);

  const customStyle = [
    {
      elementType: 'geometry',
      stylers: [
        {
          color: '#242f3e',
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#746855',
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#242f3e',
        },
      ],
    },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [
        {
          color: '#263c3f',
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#6b9a76',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        {
          color: '#38414e',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#212a37',
        },
      ],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#9ca5b3',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#746855',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#1f2835',
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#f3d19c',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [
        {
          color: '#2f3948',
        },
      ],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#d59563',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#17263c',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [
        {
          color: '#515c6d',
        },
      ],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [
        {
          color: '#17263c',
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View>
        <StatusBar />
        <MapView
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          loadingEnabled={true}
          showsBuildings={true}
          customMapStyle={customStyle}>
          {!isSearchSubmitted ? null : (
            <Marker
              coordinate={mapRegion}
              title={placeName}
              description="우리 여기서 일해요"
              onPress={e => {
                pathFind(e.nativeEvent.coordinate);
              }}
            />
          )}
          {!isPathActivated ? null : (
            <MapViewDirections
              origin={{
                latitude: 37.47656223234824,
                latitudeDelta: 0.003,
                longitude: 126.98155858357366,
                longitudeDelta: 0.003,
              }}
              destination={{
                latitude: 37.4755845620958,
                latitudeDelta: 0.003,
                longitude: 126.987966657679,
                longitudeDelta: 0.003,
              }}
              apikey={'AIzaSyCrUq-EHAwdB_IAqhUFYqhuEeY7dX9amb4'}
              mode={'TRANSIT'}
              strokeWidth={3}
              strokeColor="hotpink"
            />
          )}
        </MapView>
        <TextInput
          onChangeText={searchName => setPlaceName(searchName)}
          onSubmitEditing={() => searchTest()}
          placeholder={'검색할 장소를 입력하세요'}
          style={styles.searchInputBox}
        />
        <SearchButton navigation={navigation} />
        <AddMarkerButton />
        <MyLocationButton updateLocation={myLocation} />

        <View
          style={{
            height: '100%',
            width: 20,
            zIndex: 2,
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0)',
          }}
        />
      </View>
    </View>
  );
};
export default Map;

const {height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: wp(100),
    height: height - 80,
    zIndex: -1,
  },
  searchInputBox: {
    position: 'absolute',
    zIndex: 2,
    justifyContent: 'center',
    backgroundColor: 'white',
    width: 200,
    height: 44,
    top: 20,
    left: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
  panelHeader: {
    height: 120,
    backgroundColor: '#b197fc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    position: 'absolute',
    top: -24,
    right: 24,
    backgroundColor: '#FFDB58',
    width: 48,
    height: 48,
    padding: 8,
    borderRadius: 24,
    zIndex: 1,
  },
  heart: {
    position: 'absolute',
    top: 7.5,
    right: 6,
  },
  dragHandler: {
    alignSelf: 'stretch',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc',
  },
});
