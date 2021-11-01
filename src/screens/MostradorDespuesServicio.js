import React, {useState, useEffect} from 'react';
import {
  Alert,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {FilledButton} from '../components/Button';
import {Heading} from '../components/Heading';
import {IconButton} from '../components/IconButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {BASE_URL} from '../config';
import {UserContext} from '../context/UserContext';
import {CommonActions} from '@react-navigation/native';
import {EstatusContext} from '../context/EstatusContext';

export function MostradorDespuesServicio({route, navigation}) {
  const [filePathM, setFilePathM] = useState('FileM');
  const [filePathM64, setFilePathM64] = useState();
  const [fileMContentType, setFileMContentType] = useState();

  // const [filePathM364, setFilePathM364] = useState(); 
  // const [filePathM3, setFilePathM3] = useState('FileM3');
  // const [fileM3ContentType, setFileM3ContentType] = useState();

  const ContentType = 'image/jpeg'
  const [enviar, setEnviar] = useState(0);
  const user = React.useContext(UserContext);
  const {idTienda, nombreTienda, uri, base64} = route.params;

  //AuthFlow
  const {estado} = React.useContext(EstatusContext);
  const {authFlow} = React.useContext(EstatusContext);

  launchCamera = (tipo) => {
    let options = {
      maxWidth:1024,
      maxHeight:768,
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
        console.log('response', JSON.stringify(JSON.stringify(response)).uri);
        if (tipo == 1) {
          setFilePathM(response.assets[0].uri);
          setFilePathM64(response.assets[0].base64);
          setFileMContentType(response.assets[0].type);
        } 
      }
    });
  };

  guardarImagen = async () => {
    let img = {
      img: [
        {
          idTipo: 4,
          contenido: filePathM64,
          contentType: fileMContentType,
          UsuarioRegistro: user.IdUsuario,
          IdViaje: estado.IdViaje
        },
        {
          idTipo: 5,
          contenido: base64,
          contentType: ContentType,
          UsuarioRegistro: user.IdUsuario,
          IdViaje: estado.IdViaje

        },
      ],
    };

    try {
      console.log(estado);
      await axios.post(`${BASE_URL}Tiendas/InsertImagenes`, img).then((res) => {
        if (res) {
          authFlow.setEstatus(11, idTienda, user.IdUsuario, estado.IdViaje).then(authFlow.getEstatus(0, user.IdUsuario).then(
            Alert.alert(
              'Listo',
              'Se han guardado las imagenes',
              [
                {
                  text: 'Aceptar',
                  onPress: () =>
                    navigation.navigate('ChecklistTienda', {
                      idTienda,
                      nombreTienda,
                    }),
                },
              ],
            )
          ));
          
   
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Este Este useEffect se detona cuando se modifica el estado del viaje
  useEffect(async () => {
    console.log('SI ESTA RECARGANDO');

    if (estado) {
      //navega a la ultima pantalla en que se encontraba el usuario
      navigation.dispatch(
        CommonActions.navigate({
          name: estado.Modulo,
          params: {idTienda, nombreTienda},
        }),
      );
    }
  }, [estado]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Text style={{color: 'white', paddingHorizontal: 15}}>{user.name}</Text>,
    });
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {/* <Text> idTienda: {idTienda}</Text>
        <Text>nombreTienda: {nombreTienda}</Text> */}
        <View style={styles.header}>
          <Text style={styles.headerText}>{nombreTienda}</Text>
        </View>
        <Text style={{padding: 20, fontWeight: 'bold'}}>
          Cuarto paso: Tomar capturar con las siguientes caracteristicas 
        </Text>
        <Text>Tome una foto despues de surtir el exibidor</Text>
        <View style={styles.row}>
          <Text style={{paddingRight: 8}}>Imagen mostrador:</Text>
          <Icon
            style={{paddingLeft: 2}}
            size={20}
            name="camera"
            onPress={() => launchCamera(1)}
          />
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={{width: '10%', height: '50%', marginLeft: 20}}
            source={{uri: filePathM}}></Image>
        </View>
        {/* <Text>{filePathM}</Text> */}
        <Text>Tome una foto despues de surtir el exibidor</Text>
        <View style={styles.row}>
          <Text style={{paddingRight: 8}}>Imagen mostrador a 3 metros:</Text>
          <Icon
            style={{paddingLeft: 2}}
            size={20}
            name="camera"
            // onPress={() => launchCamera(2)}
            onPress={() => navigation.navigate('PictureScreenScan', {screen: "MostradorDespuesServicio"})}
          />
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={{width: '10%', height: '50%', marginLeft: 20}}
            source={{uri: uri}}></Image>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.btnSubmit}
            onPress={
              () => guardarImagen()
              //enviar === 0
              //  ? () => navigation.navigate('TerminaTienda')
              //  : () => {
              //Llamada api para guardar
            }>
            <Text style={styles.btnSubmitText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    paddingTop: 120,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    paddingVertical:'5%'
  },
  title: {
    paddingBottom: 50,
    color: 'white',
  },
  input: {
    marginVertical: 8,
  },
  button: {
    alignContent: 'center',
    marginVertical: 20,
    width: '100%',
  },

  btnSubmit: {
    width: '90%',
    marginTop: 40,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'rgb(27,67,136)',
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
