import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import {BASE_URL} from '../config';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UserContext} from '../context/UserContext';
import * as ImagePicker from 'react-native-image-picker';
import {EstatusContext} from '../context/EstatusContext';
import {getDeviceDate} from '../hooks/common'

export function FinalizaViajeDirecta({route, navigation}) {
  const contador = 0;

  const user = React.useContext(UserContext);
  const {estado} = React.useContext(EstatusContext);
  const {authFlow} = React.useContext(EstatusContext);

  const forms = route.params;
  const [pendingforms, setPendingForms] = useState(forms.unfinishedForms);
  const [entDevolucion, setEntDev] = useState(0);

  const [totalPz, setTotalPz] = useState(0);
  const [vehiculo, setVehiculo] = useState();
  const [kmInicial, setKmInicial] = useState(0);

  const [kmFinal, setKmFinal] = useState('0');
  const [reload, setReload] = useState(false);

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

  const insertFinalaViaje = async () => {
    var fechaDispositivo = getDeviceDate();
    console.log(`entra, KmFinal`, kmFinal);
    if (parseInt(kmFinal) <= 0) {
      Alert.alert('Verifique los datos', 'Agregue un kilometraje final');
      return;
    }
    if (!imagen64) {
      Alert.alert('Verifique los datos', 'Adjunte una imagen del odómetro', [
        {text: 'Aceptar'},
      ]);
      return;
    }

    const viaje = {
      IdViaje: parseInt(forms.unfinishedForms[contador].Viaje),
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
      fechaDispositivo: fechaDispositivo // agregada fecha del dispositivo
    };
    console.log('viaje');
    console.log(viaje);

    if (forms.unfinishedForms.length > 0) {
      console.log;
      // var pendingAux = forms.unfinishedForms.splice(0, 1);
      forms.unfinishedForms.splice(0, 1);
      // getFinalRuta
      // console.log(pendingAux);
      // setPendingForms(pendingAux);
    }

    const result = await axios.post(
      `${BASE_URL}viajes/InsertFinalViaje`,
      viaje,
    );

    console.log('result');
    console.log(result.data);
    // const res = JSON.parse(result.data);
    // if (res[0].MENSAJE == 'ok') {
    if (result.data == 'ok') {
      Alert.alert('Listo!', 'Haz terminado esta ruta', [
        {
          text: 'Terminar',
          onPress: () => Finalizado(),
        },
      ]);
    } else {
      alert(result);
    }
    // console.log(res);
  };
  function Finalizado() {
    if (forms.unfinishedForms.length > 0) {
      getFinalRuta();
    } else {
      navigation.navigate('SelectionMode');
    }
  }

  const getFinalRuta = async () => {
    console.log('IDVIAJE');
    console.log(forms.unfinishedForms[contador].Viaje);
    await axios
      .get(
        `${BASE_URL}viajes/GetFinalizaViaje?viaje=${forms.unfinishedForms[contador].Viaje}`,
      )
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
  launchCamera = () => {
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
        const source = {uri: response.uri};
        // console.log('response', JSON.stringify(response));

        setImagen64(response.assets[0].base64);
        setContentType(response.assets[0].type);
      }
    });
  };

  useEffect(() => {
    console.log('camvio forms');
    console.log(forms.unfinishedForms);
  }, [pendingforms]);

  useEffect(() => {
    getFinalRuta();
    console.log('pendingforms');
    console.log(pendingforms);

    setPendingForms(pendingforms);
  }, []);
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={[styles.headerText]}>
          Finalización de ruta No terminada
        </Text>
        <Text style={[styles.headerText]}>Ruta: </Text>
        <Text style={{fontSize: 16}}>{forms.unfinishedForms[0].Ruta}</Text>
        <Text style={[styles.headerText]}>Fecha: </Text>
        <Text style={{fontSize: 16}}>
          {forms.unfinishedForms[0].FechaProgramada}
        </Text>
      </View>
      <View style={{marginHorizontal: 10, paddingTop: 10}}>
        <View style={styles.checkboxContainer}>
          {/* Devoluciones */}

          <Text style={styles.label}>Entrada por devolucion:</Text>
          <TextInput
            value={entDevolucion}
            onChangeText={setEntDev}
            keyboardType="number-pad"
            style={{
              borderWidth: 2,
              borderColor: 'black',
              width: 70,
              maxHeight: 40,
            }}
          />
        </View>
      </View>
      <View style={{paddingLeft: 70, paddingRight: 10, alignContent: 'center'}}>
        <View>
          <Text style={{padding: 5}}>Total de piezas en carro: {totalPz} </Text>
        </View>
        <View>
          <Text style={{padding: 5}}>No. Vehiculo: {vehiculo} </Text>
        </View>
        <View>
          <Text style={{padding: 5}}>KM inicial: {kmInicial} </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text style={{padding: 5}}>KM final</Text>
          <Icon
            name="camera"
            size={25}
            color="gray"
            padding={20}
            onPress={() => launchCamera()}
          />
          <TextInput
            placeholder="0"
            placeholderTextColor="black"
            onChangeText={setKmFinal}
            keyboardType="numeric"
            style={{
              height: 35,
              borderWidth: 1,
              minWidth: 20,
              textAlign: 'center',
              marginHorizontal: 10,
            }}
          />
        </View>
        <View>
          <Text style={{padding: 5}}>Hora de salida: {hrInicial}</Text>
        </View>

        <View>
          <Text style={{padding: 5}}>Hora de llegada: {hrFinal} </Text>
        </View>

        <View>
          <Text style={{padding: 5}}>Piezas vendidas: {pzVendidas} </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text style={{padding: 5}}>Piezas dañadas</Text>
          <TextInput
            placeholder="0"
            placeholderTextColor="black"
            onChangeText={setPzDanadas}
            keyboardType="numeric"
            style={{
              height: 35,
              borderWidth: 1,
              minWidth: 20,
              textAlign: 'center',
              marginHorizontal: 10,
            }}
          />
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text style={{padding: 5}}>Defectuosas de fabrica</Text>
          <TextInput
            placeholder="0"
            placeholderTextColor="black"
            onChangeText={setPzDefectuosa}
            keyboardType="numeric"
            style={{
              height: 35,
              borderWidth: 1,
              minWidth: 20,
              textAlign: 'center',
              marginHorizontal: 10,
            }}
          />
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
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
  },
});
