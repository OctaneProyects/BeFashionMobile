import React, {useState, useEffect} from 'react';
import {BASE_URL} from '../config';
import {View, SafeAreaView, StyleSheet, Text, Alert} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {Input} from '../components/Input';
import axios from 'axios';
import {UserContext} from '../context/UserContext';
import {TouchableOpacity} from 'react-native-gesture-handler';
import { AuthContext } from '../context/AuthContext';
import { EstatusContext } from '../context/EstatusContext';


export function AgregarUbicacion({navigation}) {
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

  //UseEffect para cuando renderisa
  useEffect(async () => {
    //setIsLoading(true); //cargando
    // setStepCant();
    handleLocationPermission();
    authFlow.getEstatus(0, user.IdUsuario);
    await getLocation();
    await GetClientes();
    await GetSucursales(); // obtiene las sedes de befashion
    //await getClientes(3);
                        
    console.log('SI LLEGA PARIENTE');
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

  //obtiene ubicacion actual del dispositivo fisico
  async function getLocation() {
    console.log(`GETLOCATION`);
    await new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          console.log(`${latitude}`);
          console.log(`${longitude}`);
          setLatitud(latitude);
          setLongitud(longitude);

          console.log(`latitud: ${latitude} y longitud: ${longitude}`);
          // console.log(`location: ${location.latitude}`);
          return resolve();
        },
        error => {
          console.log('valio nepe');
          return reject(error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  }
  const GetClientes = async () => {
    try {
      await axios.get(`${BASE_URL}clientes/GetClientes`, {}).then(res => {
        const result = res.data;
        let jsonClientes = JSON.parse(result);

        setClientes(
          jsonClientes.map(cli => {
            return {label: cli.Nombre, value: cli.Id};
          }),
        );
        //console.log('clientes');
        //console.log(jsonClientes);

        // setIsLoading(false);
      });
    } catch (e) {
      alert(`Ocurrio un error ${e}`);
    }
  };

  const GetSucursales = async () => {
    try {
      await axios
        .get(`${BASE_URL}sucursales/GetSucursales?opc=3`, {})
        .then(res => {
          const result = res.data;
          let jsonSucursal = JSON.parse(result);

          setSucursales(
            jsonSucursal.map(suc => {
              return {label: suc.Nombre, value: suc.Id};
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
    await getLocation();
    if (cliente == null || sucursal == null || nombreTienda == '') {
      Alert.alert(
        'Verifique datos',
        'Verifique que todos los campos contengan datos validos',
        [{text: 'Aceptar'}],
      );
      return;
    }
    try {
      await axios.post(`${BASE_URL}Tiendas/InsertTienda?Nombre=${nombreTienda}&ClaveTienda=${cr}&IdCliente=${cliente}&Latitud=${latitudActual}&Longitud=${longitudActual}&UsuarioRegistro=${user.IdUsuario}&IdSucursal=${sucursal}&IdRuta=${estado.Ruta}&Orden=${estado.PasoActual+1}`,{},)
        .then(res => {
          const result = res.data;
          let jsonTiendaResult = JSON.parse(result);
          Alert.alert('Listo', 'Se han registrado correctamente', [
            {
              text: 'Aceptar',
            },
          ]);
          console.log(jsonTiendaResult);
        });
    } catch (e) {
      console.log(e);
      console.log(`API liga`);
      console.log(`${BASE_URL}Tiendas/InsertTienda`);
      alert(`Ocurrio un error ${e}`);
    }
  };
  useEffect(() => {
    setClienteNom(
      clientes.filter(c => c.value == cliente).map(c => c.label)[0],
    );
  }, [cliente]);
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={(styles.rowView, (Platform.OS === 'ios' ? {zIndex: 300} :{}))}>
          <DropDownPicker
            placeholder="Selecciona un cliente"
            value={cliente}
            open={openCli}
            //searchable={true}
            items={clientes}
            setItems={setClientes}
            setOpen={setOpenCli}
            setValue={value => {
              setCliente(value);
            }}
            zIndex={300}></DropDownPicker>
        </View>
        <View style={styles.rowView}>
          <Input
            style={{borderWidth: 1.3}}
            placeholder="Nombre"
            onChangeText={setnombreTienda}
          />
        </View>
        <>
          {clienteNom == 'Oxxo' ? (
            <View style={styles.rowView}>
              <Input
                style={{borderWidth: 1.3}}
                placeholder="CR"
                onChangeText={setCR}
              />
            </View>
          ) : (
            <></>
          )}
        </>

        <View style={(styles.rowView,  (Platform.OS === 'ios' ? {zIndex: 200,paddingTop:8} :{}))}>
          <DropDownPicker
            placeholder="Selecciona un sucursal"
            value={sucursal}
            open={openSuc}
            items={sucursales}
            setOpen={setOpenSuc}
            setValue={setSucursal}
            setItems={setSucursales}
            zIndex={100}></DropDownPicker>
        </View>
        <View style={(styles.rowView, {paddingTop: 20})}>
          <Text>Latitud: {latitudActual}</Text>
          <Text>Longitud: {longitudActual}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={() => insertTienda()}>
          <Text style={styles.btnSubmitText}>Agregar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
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
    marginTop: 40,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'rgb(27,67,136)',
  },
  btnSubmitContainer: {
    padding: 20,
  },
  btnSubmitText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  rowView: {
    flexDirection: 'row',
    paddingTop: 8,
  },
});
