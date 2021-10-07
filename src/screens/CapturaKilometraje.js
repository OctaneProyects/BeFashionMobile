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
import { BASE_URL } from '../config';
import * as ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Alert } from 'react-native';
import { UserContext } from '../context/UserContext';
import { ScrollView } from 'react-native-gesture-handler';
import {EstatusContext} from '../context/EstatusContext'




export default function CapturaKilometraje({navigation}) {
  const {iniciar} = React.useContext(AuthContext);
  const user = React.useContext(UserContext);

  const [km, setkm] = useState(0);
  const [imagen, setImagen] = useState();
  const [imagen64, setImagen64] = useState();
  const [IdUsuario, setIdUsuario] = useState(user.IdUsuario);
  const [IdRuta, setIdRuta] = useState(null);
  const [IdVehiculo, setIdVehiculo] = useState(user.idvehiculo);
  const [IdEstatus, setIdEstatus] = useState(null);
  const {authFlow} = React.useContext(EstatusContext);



  //asi se envia para POST (server recibe modelo)
async function insertkm(km, imagen64, idvehiculo, IdUsuario, navigation) {


  //valida que se ingrese km
  if (!km) {
    Alert.alert(
      "Verifique los datos",
      "Agregue un kilometraje inicial",
      [
        { text: "Aceptar",onPress:() => (authFlow.setEstatus(6,26,1,20),navigation.navigate('LandingScreen'))}
      ]
    );
    return;
  }
  //valida que se adjunte imagen
  if (!imagen64) {
    Alert.alert(
      "Verifique los datos",
      "Adjunte una imagen del odómetro",
      [
        { text: "Aceptar" }
      ]
    );
    return;
  }

    const viaje = {
      IdRuta: 1, //agregar
      IdVehiculo: idvehiculo, 
      IdUsuario: IdUsuario, 
      KmInicial: km,
      IdEstatus: 1, //agregar
      Imagen: imagen64,
    };
    console.log(viaje);

    const result = await axios.post(
      `${BASE_URL}vehiculos/InsertaKmInicial`,
      viaje,
    );
    if (result.data == 'ok') {
      Alert.alert(
        "Listo",
        "Se han registrado correctamente",
        [
  
          { text: "Continuar", onPress:() => navigation.navigate('Home') }
        ]
      );
    } else {
      alert('error');
    }
    console.log(result.data);

    return result;


}



  launchCamera = () => {
    let options = {
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
        fileName: 'imagenmuestra'
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
        const source = response.assets[0].uri;
        const base64 = response.assets[0].base64;
        // console.log(JSON.stringify(response.assets[0].base64));
        // console.log(JSON.stringify(response.assets[0].uri));
        setImagen64(base64);
        setImagen(source);
      }
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Text style={{color: 'white'}}>{user.name}</Text>,
    });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView style={{height:'100%'}}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Iniciar Ruta</Text>
        <Text>Placas: </Text><Text style={styles.placasText}>{user.vehiculo}</Text>
      </View>
      <Text style={{paddingHorizontal: 20, fontWeight: 'bold'}}>
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
            style={{justifyContent: 'center', width: 100, height: 100}}
            source={{uri: imagen}}></Image>
        </View>
      </View>
      <View style={styles.btnSubmitContainer}>
        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={() => {
            // navigation.navigate('Home');
            insertkm(km, imagen64,IdVehiculo, IdUsuario, navigation);
          }}>
          <Text style={styles.btnSubmitText}>Enviar</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
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
    color: 'blue'
  }
});
