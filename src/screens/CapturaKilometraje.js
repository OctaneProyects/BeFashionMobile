import React, {useState} from 'react';
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
import {AuthContext} from '../context/AuthContext';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Alert } from 'react-native';

//asi se envia para POST (server recibe modelo)
async function insertkm(km, imagen) {

  if (!km) {
    Alert.alert(
      "Verifique los datos",
      "Agregue un kilometraje inicial",
      [

        { text: "Aceptar",}
      ]
    );
    return;
  }
  if (!imagen) {
    Alert.alert(
      "Verifique los datos",
      "Adjunte una imagen del odómetro",
      [

        { text: "Aceptar",}
      ]
    );
    return;
  }


    const viaje = {
      IdRuta: 2, //agregar
      IdVehiculo: 2, //agregar
      IdUsuario: 3, // agregar
      KmInicial: km,
      IdEstatus: 1, //agregar
      Imagen: imagen,
    };
    console.log(viaje);

    const result = await axios.post(
      'http://localhost:63745/api/vehiculos/InsertaKmInicial',
      viaje,
    );
    if (result.data == 'okay') {
      Alert.alert('agregado')
    } else {
      alert('error');
    }
    console.log(result.data);

    return result;


}

export default function CapturaKilometraje({navigation}) {
  // const {iniciar} = React.useContext(UserContext);
  const {iniciar} = React.useContext(AuthContext);

  const [km, setkm] = useState(0);
  const [imagen, setImagen] = useState();
  const [IdRuta, setIdRuta] = useState(null);
  const [IdVehiculo, setIdVehiculo] = useState(null);
  const [IdEstatus, setIdEstatus] = useState(null);

  launchCamera = () => {
    let options = {
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
        // const source = {uri: response.uri};
        console.log('response', JSON.stringify(response));
        const source = response.assets[0].uri;

        console.log(JSON.stringify(response.assets[0].uri));
        setImagen(source);
      }
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Iniciar Ruta</Text>
      </View>
      <Text style={{padding: 20, fontWeight: 'bold'}}>
        Primer paso: Captura kilometraje inicial
      </Text>

      <View style={{alignItems: 'center'}}>
        <Text style={{fontStyle: 'italic'}}>
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
              onPress={() => launchCamera()}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{fontStyle: 'italic', fontSize: 11}}>
            toma una foto del odometro de tu vehiculo
          </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={{justifyContent: 'center', width: 150, height: 150}}
            source={{uri: imagen}}></Image>
        </View>
      </View>
      <View style={styles.btnSubmitContainer}>
        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={() => {
            // navigation.navigate('Home');
            insertkm(km, imagen);
          }}>
          <Text style={styles.btnSubmitText}>Iniciar viaje</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#C1C1C1',
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
    backgroundColor: 'blue',
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
