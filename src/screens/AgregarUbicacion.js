import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config';
import {
  AppState,
  View,
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
  StatusBar,
  Button,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation, { watchPosition } from 'react-native-geolocation-service';
import { Input } from '../components/Input';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import { EstatusContext } from '../context/EstatusContext';
import { useFocusEffect } from '@react-navigation/core';
import { getDeviceDate } from '../hooks/common';
import { globalStyles } from '../styles/styles';
import { Loading } from '../components/Loading';
import { ScrollView } from 'react-native-gesture-handler';

// v1.4.4 maps
export function AgregarUbicacion({ navigation }) {
  const [latitudActual, setLatitud] = useState(0);
  const [longitudActual, setLongitud] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [clienteNom, setClienteNom] = useState('');
  const [nombreTienda, setnombreTienda] = useState('');
  const [cr, setCR] = useState('a');
  const [sucursales, setSucursales] = useState([]);
  const [sucursal, setSucursal] = useState(null);
  const user = React.useContext(UserContext);
  const [openCli, setOpenCli] = useState(false);
  const [openSuc, setOpenSuc] = useState(false);
  const { authFlow } = React.useContext(EstatusContext);
  const { estado } = React.useContext(EstatusContext);
  const [loading, setLoading] = useState(false);

  //disabled de button
  const [disabled, setDisabled] = useState(false);

  const [location, setLocation] = useState({
    latitude: 32.65,
    longitude: -115.39,
    latitudeDelta: 3,
    longitudeDelta: 3,
  });

  const _mapView = React.createRef();

  useEffect(() => {
    const _watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitud(latitude);
        setLongitud(longitude);
        setLocation({ latitude: latitude, longitude: longitude, latitudeDelta: 0.001, longitudeDelta: 0.001 });
      },
      (error) => {
        console.log(`Error al iniciar el watch: ${error}`);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
      },
    );
    return () => {
      Geolocation.clearWatch(_watchId);
    };
  }, []);

  //UseEffect para cuando renderisa
  useEffect(async () => {
    handleLocationPermission();
    authFlow.getEstatus(0, user.IdUsuario);
    await GetClientes();
    await GetSucursales(); // obtiene las sedes de befashion
    //await getClientes(3);
  }, []);

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

  const GetClientes = async () => {
    try {
      await axios.get(`${BASE_URL}clientes/GetClientes`, {}).then((res) => {
        const result = res.data;
        let jsonClientes = JSON.parse(result);
        setClientes(
          jsonClientes.map((cli) => {
            return { label: cli.Nombre, value: cli.Id };
          }),
        );
      });
    } catch (e) {
      alert(`Ocurrio un error ${e}`);
    }
  };
  const GetSucursales = async () => {
    try {
      await axios
        .get(
          `${BASE_URL}sucursales/GetSucursales?opc=4&usr=${user.IdUsuario}`,
          {},
        )
        .then((res) => {
          const result = res.data;
          let jsonSucursal = JSON.parse(result);

          setSucursales(
            jsonSucursal.map((suc) => {
              return { label: suc.Nombre, value: suc.Id };
            }),
          );
          console.log('Sucursales');
          console.log(jsonSucursal);
          // setIsLoading(false);
        });
    } catch (e) {
      alert(`Ocurrio un error ${e}`);
    }
  };

  const insertTienda = async () => {
    //obtener fecha del dispositivo
    var fechaDispositivo = getDeviceDate();
    if (
      cliente == null ||
      sucursal == null ||
      nombreTienda == '' ||
      sucursal == null
    ) {
      Alert.alert(
        'Verifique datos',
        'Verifique que todos los campos contengan datos validos',
        [{ text: 'Aceptar' }],
      );
      return;
    }
    try {
      //deshabilitar al boton
      setDisabled(true);
      await axios
        .post(
          `${BASE_URL}Tiendas/InsertTienda?Nombre=${nombreTienda}&ClaveTienda=${cr}&IdCliente=${cliente}&Latitud=${latitudActual}&Longitud=${longitudActual}&UsuarioRegistro=${user.IdUsuario
          }&IdSucursal=${sucursal}&IdRuta=${estado.Ruta}&Orden=${estado.PasoActual + 1
          }&fechaDispositivo=${fechaDispositivo}`,
          {},
        )
        .then((res) => {
          const result = res.data;
          let jsonTiendaResult = JSON.parse(result);
          setDisabled(false);
          Alert.alert('Listo', 'Se han registrado correctamente', [
            {
              text: 'Aceptar',
              onPress: () => {
                navigation.navigate('LandingScreen');
              },
            },
          ]);
          console.log(jsonTiendaResult);
        });
    } catch (e) {
      console.log(e);
      console.log(`API liga`);
      console.log(`${BASE_URL}Tiendas/InsertTienda`);
      alert(`Ocurrio un error ${e}`);
      //habilitar boton
      setDisabled(false);
    }
  };

  useEffect(() => {
    setClienteNom(
      clientes.filter((c) => c.value == cliente).map((c) => c.label)[0],
    );
  }, [cliente]);

  useEffect(() => {
    console.log('nueva locación: ', location);
    //_mapView.current.animateToRegion(region);
    return () => {
      console.log('Locación actualizada');
    };
  }, [location]);
  return (
    <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView nestedScrollEnabled={true} contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.container} >
            <View
              style={
                (styles.rowView, Platform.OS === 'ios' ? { zIndex: 300 } : {})
              }>
              <DropDownPicker
                placeholder="Selecciona un cliente"
                value={cliente}
                open={openCli}
                dropDownDirection="AUTO"
                maxHeight={100}
                //searchable={true}
                items={clientes}
                setItems={setClientes}
                setOpen={setOpenCli}
                setValue={(value) => {
                  setCliente(value);
                }}
                zIndex={300}></DropDownPicker>
            </View>
            <View style={styles.rowView}>
              <Input
                style={{ borderWidth: 1.3 }}
                placeholder="Nombre"
                onChangeText={setnombreTienda}
              />
            </View>
            <View style={styles.rowView}>
              <Input
                style={{ borderWidth: 1.3 }}
                placeholder="CR"
                onChangeText={setCR}
              />
            </View>
            <View
              style={
                (styles.rowView,
                  Platform.OS === 'ios' ? { zIndex: 100 } : {})
              }>
              <DropDownPicker
                placeholder="Selecciona un sucursal"
                value={sucursal}
                open={openSuc}
                items={sucursales}
                maxHeight={100}
                setOpen={setOpenSuc}
                setValue={setSucursal}
                setItems={setSucursales}
                dropDownDirection="TOP"
                zIndex={100}></DropDownPicker>
            </View>
            <View style={styles.btnSubmitContainer}>
              <Button
                color="rgb(27,67,136)"
                title="Agregar"
                disabled={disabled}
                onPress={() => insertTienda()}
              />
            </View>
            <View style={(styles.containermap)}>
              <StatusBar barStyle="dark-content" />
              {location ? (
                <MapView
                  ref={_mapView}
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={location}
                  showsUserLocation={true}
                  followUserLocation={true}
                  showsMyLocationButton={true}
                />
              ) : null}
            </View>
            <View style={styles.rowView}>
              <Text>
                Latitud: {latitudActual} , Longitud: {longitudActual}
              </Text>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </ScrollView>
      <Loading loading={loading} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    height:'100%'
  },
  container: {
    alignItems: 'center',
    margin: 10,
    // backgroundColor: '#0F212E',
  },
  /*container: {
    flex: 1,
    margin: 10,
  },*/
  comentsContainer: {
    paddingHorizontal: '7%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignContent: 'flex-end',
    justifyContent: 'space-around',
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
    width: 250,
  },
  textInput: {
    backgroundColor: 'white',
  },
  btnSubmit: {
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'rgb(27,67,136)',

  },
  btnSubmitContainer: {
    width: '100%',
    //marginTop: '30%',
    paddingVertical: 10,
  },
  btnSubmitText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  rowView: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  containermap: {
    marginVertical: 8,
    minHeight: '25%',
    maxHeight: '30%',
    width: '100%',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContainer: {
    minHeight: '20%',
    maxHeight: '70%',
    paddingVertical: '2%',
  }
});
