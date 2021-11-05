import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CheckBox, Input } from 'react-native-elements';
import { Heading } from '../components/Heading';
import axios from 'axios';
import { BASE_URL } from '../config';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../context/UserContext';
import * as ImagePicker from 'react-native-image-picker';
import { EstatusContext } from '../context/EstatusContext';
import { PermissionsAndroid } from 'react-native';

export function FinalizaViaje({ route, navigation }) {
  const user = React.useContext(UserContext);
  const { estado } = React.useContext(EstatusContext);
  const { authFlow } = React.useContext(EstatusContext);

  //variable id vijae por parametros
  const { idViaje } = route.params;
  // const [idViaje, setIdViaje] = useState(1)
  //const [entMercancia, setEntMerc] = useState(0);
  const [entDevolucion, setEntDev] = useState(0);

  const [totalPz, setTotalPz] = useState(0);
  const [vehiculo, setVehiculo] = useState();
  const [kmInicial, setKmInicial] = useState(0);

  const [kmFinal, setKmFinal] = useState('0');

  const [imagen64, setImagen64] = useState();
  const [contentType, setContentType] = useState();

  const [hrInicial, setHrInicial] = useState('0');
  const [hrFinal, setHrFinal] = useState('');
  const [pzVendidas, setPzVendidas] = useState(0);
  const [pzDanadas, setPzDanadas] = useState('0');
  const [pzDefectuosa, setPzDefectuosa] = useState('0');
  const [visitasDiarias, setVisitasDiarias] = useState(0);
  const [visitasEfectivas, setVisitasEfectivas] = useState(0);
  const [promocion, setPromocion] = useState(0);
  const [cameraAccess, setCameraAccess] = useState(false);

  const insertFinalaViaje = async () => {
    console.log(`entra, KmFinal`, kmFinal);
    if (parseInt(kmFinal) <= 0) {
      Alert.alert('Verifique los datos', 'Agregue un kilometraje final');
      return;
    }
    if (!imagen64) {
      Alert.alert('Verifique los datos', 'Adjunte una imagen del odómetro', [
        { text: 'Aceptar' },
      ]);
      return;
    }

    const viaje = {
      IdViaje: parseInt(idViaje),
      InventarioFinalPzs: parseInt(totalPz),
      KmInicial: parseInt(kmInicial),
      KMFinal: parseInt(kmFinal),
      HoraInicial: hrInicial,
      HoraFinal: hrFinal,
      PzVendidas: parseInt(pzVendidas),
      PzDanadas: parseInt(pzDanadas),
      PzDefectuosasFabrica: parseInt(pzDefectuosa),
      VisitaDiaria: parseInt(visitasDiarias),
      VisitasEfectivas: parseInt(visitasEfectivas),
      imagen64: imagen64,
      contentType: contentType,
      usuarioRegistro: user.IdUsuario,
      // entMercancia: parseInt(entMercancia),
      devolucion: parseInt(entDevolucion),
    };
    console.log(viaje);

    const result = await axios.post(
      `${BASE_URL}viajes/InsertFinalViaje`,
      viaje,
    );
    const res = JSON.parse(result.data);
    if (res[0].MENSAJE == 'ok') {
      authFlow.setEstatus(6, 0, user.IdUsuario, estado.IdViaje).then(
        authFlow.getEstatus(0, user.IdUsuario).then(
          Alert.alert('Listo!', 'Haz terminado tu ruta por hoy', [
            { text: 'Terminar', onPress: () => navigation.navigate('LandingScreen') },
          ])
        ));
    } else {
      alert(result);
    }
    console.log(res);
  };

  const getFinalRuta = async () => {
    console.log('IDVIAJE');
    console.log(idViaje);
    await axios
      .get(`${BASE_URL}viajes/GetFinalizaViaje?viaje=${idViaje}`)
      .then((result) => {
        const res = JSON.parse(result.data)[0];
        console.log(res);
        setTotalPz(res.totalPz);
        setVehiculo(res.vehiculo);
        setKmInicial(res.KmInicial);
        setPzVendidas(res.pzVendidas);
        setPromocion(res.Promociones);
        setHrInicial(res.fechaInicial);
        const currentdate = new Date();
        var datetime =
          currentdate.getDate() +
          '/' +
          (currentdate.getMonth() + 1) +
          '/' +
          currentdate.getFullYear() +
          ' ' +
          currentdate.getHours() +
          ':' +
          currentdate.getMinutes() +
          ':' +
          currentdate.getSeconds();
        setHrFinal(datetime);
      });
  };
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
        setCameraAccess(true);
      } else {
        console.log("Camera permission denied");
        setCameraAccess(false);
      }
    } catch (err) {
      console.warn(err);
      setCameraAccess(false);
    }
  };
  launchCamera = () => {
    if (cameraAccess) {
      let options = {
        maxWidth: 1024,
        maxHeight: 768,
        includeBase64: true,
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      ImagePicker.launchCamera(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
          alert(response.customButton);
        } else {
          const source = { uri: response.uri };
          console.log('response', JSON.stringify(response));

          setImagen64(response.assets[0].base64);
          setContentType(response.assets[0].type);
        }
      });
    } else {
      requestCameraPermission();
    }
  };

  useEffect(() => {
    getFinalRuta();
    requestCameraPermission();
  }, []);
  return (
    <SafeAreaView>
      <View style={{ paddingTop: 10 }}>
        {/* <View style={styles.checkboxContainer}> */}
        {/* entrada de mercancia por vehiculo */}
        {/* <TextInput
                        value={entMercancia}
                        onChangeText={setEntMerc}
                        keyboardType="numeric"
                        style={{ borderWidth: 2, borderColor: 'black', width: 70, height: 35 }}
                    />
                    <Text style={styles.label}>Entrada de mercancia por vehiculo </Text>
                </View> */}
        <View style={styles.checkboxContainer}>
          {/* Devoluciones */}
          <TextInput
            value={entDevolucion}
            onChangeText={setEntDev}
            keyboardType="number-pad"
            style={{
              borderWidth: 2,
              borderColor: 'black',
              width: 70,
              height: 35,
            }}
          />
          <Text style={styles.label}>Entrada por devolucion</Text>
        </View>
      </View>
      <View style={{ paddingLeft: 70, paddingRight: 10, alignContent: 'center' }}>
        <View>
          <Text style={{ padding: 5 }}>{totalPz} Total de piezas en carro</Text>
        </View>
        <View>
          <Text style={{ padding: 5 }}>{vehiculo} No. Vehiculo</Text>
        </View>
        <View>
          <Text style={{ padding: 5 }}>{kmInicial} KM inicial</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TextInput
            placeholder="0"
            onChangeText={setKmFinal}
            keyboardType="numeric"
            style={{ height: 35, borderWidth: 1 }}
          />
          <Text style={{ padding: 5 }}>KM final</Text>

          <Icon
            name="camera"
            size={25}
            color="gray"
            padding={20}
            onPress={() => launchCamera()}
          />
        </View>
        <View>
          <Text style={{ padding: 5 }}>{hrInicial} Hora de salida</Text>
        </View>

        <View>
          <Text style={{ padding: 5 }}>{hrFinal} Hora de llegada</Text>
        </View>

        <View>
          <Text style={{ padding: 5 }}>{pzVendidas} Piezas vendidas</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TextInput
            placeholder="0"
            onChangeText={setPzDanadas}
            keyboardType="numeric"
            style={{ height: 35, borderWidth: 1 }}
          />
          <Text style={{ padding: 5 }}>Piezas dañadas</Text>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <TextInput
            placeholder="0"
            onChangeText={setPzDefectuosa}
            keyboardType="numeric"
            style={{ height: 35, borderWidth: 1 }}
          />
          <Text style={{ padding: 5 }}>Defectuosas de fabrica</Text>
        </View>

        {/* <View>

                    <Text>
                        {visitasDiarias} Visita diaria
                    </Text>
                </View>

                <View>

                    <Text>
                        {visitasEfectivas} Visitas efectivas
                    </Text>
                </View> */}

        <View>
          <Text style={{ padding: 5 }}>{promocion} Promocion</Text>
        </View>
      </View>
      <View style={styles.btnSubmitContainer}>
        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={() => insertFinalaViaje()}>
          <Text style={styles.btnSubmitText}>Terminar mi ruta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    alignContent: 'space-around',
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
});
