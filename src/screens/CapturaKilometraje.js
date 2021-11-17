import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../config';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Alert } from 'react-native';
import { UserContext } from '../context/UserContext';
import { ScrollView } from 'react-native-gesture-handler';
import { EstatusContext } from '../context/EstatusContext';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Loading } from '../components/Loading';

export default function CapturaKilometraje({ route, navigation }) {
  const user = React.useContext(UserContext);
  const [ruta, setRuta] = useState([]);
  const [km, setkm] = useState(0);
  const [imagen, setImagen] = useState();
  // const [contentType, setContentType] = useState();
  const [imagen64, setImagen64] = useState();
  const [IdUsuario, setIdUsuario] = useState(user.IdUsuario);
  const [IdRuta, setIdRuta] = useState(null);
  const [IdVehiculo, setIdVehiculo] = useState(user.idvehiculo);
  const [IdEstatus, setIdEstatus] = useState(null);
  const { estado } = React.useContext(EstatusContext);
  const { authFlow } = React.useContext(EstatusContext);
  const [loading, setLoading] = useState(false);

  const { logout } = React.useContext(AuthContext);

  var objImg = {
    uri: '',
    base64: '',
    contentType: 'img/jpeg'
  }

  console.log('route.params')
  console.log(route)
  if (route.params) {
    objImg.uri = route.params.uri,
      objImg.base64 = route.params.base64
  }

  //asi se envia para POST (server recibe modelo)
  async function insertkm(km, imagen64, idvehiculo, IdUsuario, navigation) {
    //valida que se ingrese km
    if (!km) {
      Alert.alert('Verifique los datos', 'Agregue un kilometraje inicial', [
        {
          text: 'Aceptar',
        },
      ]);
      return;
    }
    //valida que se adjunte imagen
    if (objImg.base64 == '') {
      Alert.alert('Verifique los datos', 'Adjunte una imagen del odómetro', [
        { text: 'Aceptar' },
      ]);
      return;
    }

    const viaje = {
      IdRuta: ruta.Id, //agregar
      IdVehiculo: idvehiculo,
      IdUsuario: IdUsuario,
      KmInicial: km,
      IdEstatus: 1, //agregar
      Imagen: objImg.base64,
      contentType: objImg.contentType,
    };
    // console.log(ruta.Id);
    try {
      const res = await axios.post(`${BASE_URL}vehiculos/InsertaViaje`, viaje);
      if (res) {
        const result = JSON.parse(res.data);
        console.log('resultado de insertar viaje', res.data);
        if (result[0].result == 'OK') {
          await authFlow.setEstatus(6, result[0].IdTienda, user.IdUsuario, result[0].IdViaje);
          await authFlow.getEstatus(0, user.IdUsuario);
          Alert.alert('Listo', 'Se ha iniciado correctamente', [
            {
              text: 'Continuar',
              onPress: () => navigation.navigate('LandingScreen', { IdViaje: result[0].IdViaje, }),
            },
          ]);
        } else {
          Alert.alert('Aviso', `${res.data}`, [
            {
              text: 'Aceptar',
              // onPress: () => navigation.navigate('LandingScreen'),
            },
          ]);
        }
      }
    } catch (error) {
      console.log('Error al insertar el viaje.');
      alert(error);
    }
  }

  //fucnion para regresar las tiendas
  const GetRuta = async () => {
    const params = {
      opc: 3,
      idUsuario: user.IdUsuario,
    };

    try {
      await axios
        .get(`${BASE_URL}rutas/GetRutaUsuario`, { params })
        .then((res) => {
          const result = res.data;
          let jsonRuta = JSON.parse(result);
          if (jsonRuta[0] != null) {
            setRuta(jsonRuta[0]);
            console.log('ruta');
            console.log(jsonRuta);
            console.log('Ruta obj');
            console.log(ruta);
          } else {
            Alert.alert(
              'Aviso',
              'No tienes ruta asignada el día de hoy, contacta a un administrador',
              [
                {
                  text: 'Aceptar',
                  onPress: () => navigation.goBack(),
                },
              ],
            );
          }
        });
    } catch (e) {
      alert(`Ocurrio un error ${e}`);
    }
  };

  useEffect(async () => {
    console.log('Validando permisos de ubicacion');
    handleLocationPermission();
    console.log('GetRuta');
    
    await GetRuta();
    authFlow.getEstatus(1, user.IdUsuario);

    return () => { };
  }, []);

  useEffect(() => {
    setLoading(true);
    console.log(estado)
    if (estado.result == 'true') {
      authFlow.getEstatus(0, user.IdUsuario).then(() => {
        setLoading(false);
        //navega a la ultima pantalla en que se enc ontraba el usuario
        Alert.alert('Aviso', `Su usuario tiene un viaje activo ${estado.IdViaje}`, [
          {
            text: 'Continuar',
            onPress: () => (navigation.navigate('LandingScreen', { IdViaje: estado.IdViaje }))
          },]);
      });
    }
  }, [estado]);

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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Text style={{ color: 'white', paddingHorizontal: 15 }}>{user.name}</Text>,
    });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView style={{ height: '100%' }}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Iniciar Ruta</Text>
          <Text>Placas: </Text>
          <Text style={styles.placasText}>{user.vehiculo}</Text>
          <Text>Articulos:</Text>
          <Text style={styles.placasText}>{user.articulos}</Text>
        </View>
        <Text style={{ paddingHorizontal: 20, fontWeight: 'bold' }}>
          Primer paso: Captura kilometraje inicial
        </Text>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontStyle: 'italic' }}>
            <Icon name="info-circle" size={15} color="blue"></Icon> Captura los
            Siguientes datos antes de iniciar tu ruta
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.etiqueta}>Ingresa kilometraje inicial</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={(text) => setkm(text)}></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.rowCamara}>
            <Text style={styles.etiqueta}>Adjunta Imagen</Text>
            <TouchableOpacity style={styles.etiqueta}>
              <Icon
                name="camera"
                size={25}
                color="gray"
                padding={20}
                // onPress={() => launchCamera()}
                onPress={() => navigation.navigate('CameraScreen', { screen: 'CapturaKilometraje' })}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={{ fontStyle: 'italic', fontSize: 11 }}>
              toma una foto del odómetro de tu vehiculo
            </Text>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image
              resizeMode="cover"
              resizeMethod="scale"
              style={{ justifyContent: 'center', width: 100, height: 100 }}
              source={{ uri: objImg.uri }}></Image>
          </View>
        </View>
        <View style={styles.btnSubmitContainer}>
          <TouchableOpacity
            style={styles.btnSubmit}
            onPress={() => {
              // navigation.navigate('Home');
              insertkm(km, imagen64, IdVehiculo, IdUsuario, navigation);
            }}>
            <Text style={styles.btnSubmitText}>Iniciar Viaje</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Loading loading={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  header: {
    fontSize: 28,
  },
  inputContainer: {
    paddingVertical: '5%',
    paddingHorizontal: '2.5%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
  },
  rowCamara: {
    flexDirection: 'row',
  },
  etiqueta: {
    paddingVertical: '2.5%',
    fontSize: 20,
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
  placasText: {
    fontSize: 14,
    color: 'blue',
  },
});
