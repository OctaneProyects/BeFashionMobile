import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import { UserContext } from '../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { BASE_URL } from '../config';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useIsFocused } from '@react-navigation/native';


export function SelectionMode({ navigation }) {
  const isFocused = useIsFocused();
  const user = React.useContext(UserContext);
  const [havePendingTrips, setPendingTrips] = useState(true);
  const [unstartedTrips, setUnstartedTrips] = useState([]);
  const [unfinishedTrips, setUnfinishedTrips] = useState([]);

  useEffect(async () => {
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
    async function getPendingTrips(opc, usr) {
      try {
        let params = {
          opc: opc,
          usr: usr
        };
        axios.get(`${BASE_URL}viajes/GetViajesPendientes`,
          { params },
        ).then((result) => {
          let res = JSON.parse(result.data);
          switch (opc) {
            case 1:
              setUnstartedTrips(res);
              break;
            case 2:
              setUnfinishedTrips(res);
              break;
          }
          return res;
        });
      }
      catch (e) {
        console.log(`Ocurrio un error ${e}`);
        return '';
      }
    }
    if (isFocused === true) {
      console.log('Validando permisos de camara');
      await requestCameraPermission();
      console.log('Validando permisos de ubicacion');
      await handleLocationPermission();
      //await getPendingTrips(1, user.Usuario);
      await getPendingTrips(2, user.Usuario);

    }

    return () => {
      console.log('SelectionMode');
    };
  }, []);
  useEffect(() => {
    function ShowUnstartedMessage() {
      if (Array.isArray(unstartedTrips) && unstartedTrips.length > 0) {
        Alert.alert(
          'Tienes viajes sin realizar',
          `No realizaste ${unstartedTrips.length} ${unstartedTrips.length > 1 ? 'viajes' : 'viaje'}. Haz click en aceptar para marcarlos como no realizados y continuar.`,
          [
            {
              text: 'Aceptar',
              onPress: () => { closeUnstartedTrips() }
            },
            {
              text: 'Mas información',
              onPress: () => displayMoreInfo()
            }
          ]);
      }
    }
    function displayMoreInfo() {
      Alert.alert(
        'Lista de las rutas no realizadas',
        //'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for lorem ipsum will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
        `${unstartedTrips.map((t) => { return `Fecha: ${t.FechaProgramada} - Ruta: ${t.Ruta}.\r\n` })}`,
        [{
          text: 'Volver',
          onPress: () => { ShowUnstartedMessage() }
        }]
      );

    }
    function closeUnstartedTrips() {
      try {
        let form = {
          usr: user.Usuario
        }
        axios.post(
          `${BASE_URL}viajes/InsertViajesNoRealizados?usr=${user.Usuario}`,
          {},
        ).then((result) => {
          let res = result.data;
          if (res && res[0].RES === 'success') {
            setUnstartedTrips([]);
            Alert.alert(res[0].TITLE, res[0].MENSAJE, []);
          }
          return res;
        }
        );
      }
      catch (e) {
        Alert.alert('Error', 'Ocurrio un error al intentar cerrar los viajes no realizados, revise tu conexión a internet e intenta nuevamente.');
        console.log(`ERROR EN closeUnstartedTrips. detalles: ${e}`);
        return 'error';
      }


    }
    ShowUnstartedMessage();
    return () => {
      console.log('Concluyendo el useEffect de los viajes sin empezar');
    }
  }, [unstartedTrips]);
  useEffect(() => {
    function ShowUnfinishedMessage() {
      if (Array.isArray(unfinishedTrips) && unfinishedTrips.length > 0) {
        Alert.alert(
          'Tienes viajes sin terminar',
          `No terminaste ${unfinishedTrips.length} ${unfinishedTrips.length > 1 ? 'viajes' : 'viaje'}. Haz click en aceptar para cerrar este viaje.`,
          [
            {
              text: 'Aceptar',
              onPress: () => { 
                //console.log('cerrando viaje')
                navigation.navigate('FinalizarRuta', {
                  idViaje: unfinishedTrips[0].Viaje,
                });
              }
            }
          ]);
      }
    }
   
    ShowUnfinishedMessage();
  }, [unfinishedTrips]);


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
