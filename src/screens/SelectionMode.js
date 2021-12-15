import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { UserContext } from '../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useIsFocused } from '@react-navigation/native';

export function SelectionMode({ navigation }) {
  const isFocused = useIsFocused();
  const user = React.useContext(UserContext);
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
  const requestCameraPermission = async () => {
    let permissionCheck = '';
    try {
      if (Platform.OS === 'ios') {
        permissionCheck = await check(PERMISSIONS.IOS.CAMERA);

        if (permissionCheck === RESULTS.DENIED) {
          const permissionRequest = await request(
            PERMISSIONS.IOS.CAMERA,
          );
          permissionRequest === RESULTS.GRANTED
            ? console.warn('Camera permission granted.')
            : console.warn('Camera perrmission denied.');
        }
      }
      if (Platform.OS === 'android') {
        permissionCheck = await check(PERMISSIONS.ANDROID.CAMERA);
        if (permissionCheck === RESULTS.DENIED) {
          const permissionRequest = await request(
            PERMISSIONS.ANDROID.CAMERA,
          );
          permissionRequest === RESULTS.GRANTED
            ? console.warn('Camera permission granted.')
            : console.warn('Camera perrmission denied.');
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    if (isFocused === true) {
      console.log('Validando permisos de camara');
      requestCameraPermission();
      console.log('Validando permisos de ubicacion');
      handleLocationPermission();
      
    }
    return () => { 
      console.log('SelectionMode');
    };
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Text style={{ color: 'white', paddingHorizontal: 15 }}>{user.name}</Text>,
    });
  }, []);
 
  return (
    <View style={styles.container}>
      {/*<View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('addSite')}>
          <Text style={styles.btnText}>
            Agregar tienda{' '}
            <Icon name="map-marker" size={25} color="gray" padding={20} />
          </Text>
        </TouchableOpacity>
      </View>*/}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('CapturaKilometraje');
          }}>
          <Text style={styles.btnText}>
            Iniciar viaje{' '}
            <Icon name="car" size={25} color="gray" padding={50} />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 120,
    alignItems: 'center',
    backgroundColor: 'rgb(27,67,136)',
    justifyContent: 'center',
    // backgroundColor: '#0F212E',
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    height: '30%',
    borderRadius: 10,
  },
  btnText: {
    fontSize: 16,
  },
});
