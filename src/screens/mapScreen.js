import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {getDistance, getPreciseDistance} from 'geolib';

const mapScreen = ({route, navigation}) => {
  const [location, setLocation] = useState(null);
  const {idTienda, nombreTienda, latitud, longitud } = route.params;

  const handleLocationPermission = async () => {
    let permissionCheck = '';
    if (Platform.OS === 'ios') {
      permissionCheck = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (permissionCheck === RESULTS.DENIED) {
        const permissionRequest = await request(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );
        permissionRequest === RESULTS.GRANTED
          ? console.warn('Location permission granted.')
          : console.warn('Location perrmission denied.');
      }
    }

    if (Platform.OS === 'android') {
      permissionCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      if (permissionCheck === RESULTS.DENIED) {
        const permissionRequest = await request(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
        permissionRequest === RESULTS.GRANTED
          ? console.warn('Location permission granted.')
          : console.warn('Location perrmission denied.');
      }
    }
  };

  useEffect(() => {
    handleLocationPermission();
  }, []);

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});

        console.log(`latitud: ${latitude} y longitud: ${longitude}`);
        console.log(`location: ${location.latitude}`);
      },
      (error) => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };
  const calculateDistance = (lat, long) => {
    getLocation();
      console.log('tienda')
      console.log(`${latitud} y  ${longitud}`)
      console.log('actual')
      console.log(`${lat} y  ${long}`)
    var dis = getDistance(
      {latitude: lat , longitude: long},
      {latitude:latitud, longitude: longitud},
    );
    alert(
      `Distance\n\n${dis} Meter\n`
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" />
          {location && (
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0121,
              }}
              showsUserLocation={true}
            />
          )}
        </SafeAreaView>
      </View>
      <View style={{flex: 1, margin: 10}}>
        <Button title="touch"
        onPress={()=>calculateDistance(location.latitude,location.longitude)}
        >press</Button>

        <View>
          {/* <Text>latitude actual {location.latitude}</Text> */}
          {/* <Text>longitud actual {location.longitude}</Text> */}
          <Text>latitude tienda {latitud}</Text>
          <Text>longitud tienda {longitud}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default mapScreen;
