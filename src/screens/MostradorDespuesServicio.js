import React, {useState, useEffect} from 'react';
import {
  Alert,
  Button,
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
import {getDeviceDate} from '../hooks/common';
import { ScrollView } from 'react-native-gesture-handler';

export function MostradorDespuesServicio({route, navigation}) {
  const [filePathM, setFilePathM] = useState('FileM');
  const [filePathM64, setFilePathM64] = useState();
  const [fileMContentType, setFileMContentType] = useState();

  const [filePathM364, setFilePathM364] = useState();
  const [filePathM3, setFilePathM3] = useState('FileM3');
  const [fileM3ContentType, setFileM3ContentType] = useState();

  const ContentType = 'image/jpeg';
  const [enviar, setEnviar] = useState(0);
  const user = React.useContext(UserContext);
  // const {idTienda, nombreTienda, uri, base64} = route.params;

  //AuthFlow
  const {estado} = React.useContext(EstatusContext);
  const {authFlow} = React.useContext(EstatusContext);

  //hook para deshabilitar boton
  const [disabled, setDisabled] = useState(false);

  launchCamera = (tipo) => {
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
        console.log('response', JSON.stringify(JSON.stringify(response)).uri);
        if (tipo == 1) {
          setFilePathM(response.assets[0].uri);
          setFilePathM64(response.assets[0].base64);
          setFileMContentType(response.assets[0].type);
        } else if (tipo == 2) {
          setFilePathM3(response.assets[0].uri);
          setFilePathM364(response.assets[0].base64);
          setFileM3ContentType(response.assets[0].type);
        }


      }
    });
  };

  async function guardarImagen() {
    var fechaDispositivo = getDeviceDate();
    let img = {
      img: [
        {
          idTipo: 4,
          contenido: filePathM64,
          contentType: fileMContentType,
          UsuarioRegistro: user.IdUsuario,
          IdViaje: estado.IdViaje,
          idTienda: estado.IdTienda,
          fechaDispositivo: fechaDispositivo, //agregado para fecha del dispositivo
          idVisita: estado.Visita,
        },
        {
          idTipo: 5,
          // contenido: base64,
          // contentType: ContentType,
          contenido: filePathM364,
          contentType: fileM3ContentType,
          UsuarioRegistro: user.IdUsuario,
          IdViaje: estado.IdViaje,
          idTienda: estado.IdTienda,
          fechaDispositivo: fechaDispositivo, //agregado para fecha del dispositivo
          idVisita: estado.Visita,
        },
      ],
    };

    try {
      console.log(estado);
      //deshabilitar boton
      setDisabled(true);
      const res = await axios.post(`${BASE_URL}Tiendas/InsertImagenes`, img);
      if (res) {
        await authFlow.setEstatus(11, estado.IdTienda, user.IdUsuario, estado.IdViaje);
        authFlow.getEstatus(0, user.IdUsuario);
        //habilitar boton
        setDisabled(false);
        Alert.alert('Listo', 'Se han guardado las imagenes', [
          {
            text: 'Aceptar',
            onPress: () =>
              navigation.navigate('ChecklistTienda', {
                idTienda: estado.IdTienda,
                nombreTienda: estado.NombreTienda,
              }),
          },
        ]);
      }
    } catch (error) {
      console.log(error);
      //habilitar boton
      setDisabled(false);
    }
    //habilitar boton
    setDisabled(false);
  }

  //Este Este useEffect se detona cuando se modifica el estado del viaje
  useEffect(() => {
    // if (estado) {
      //navega a la ultima pantalla en que se encontraba el usuario
      navigation.dispatch(
        CommonActions.navigate({
          name: estado.Modulo,
          // params: {idTienda, nombreTienda},
        }),
      );
    // }
    // return () => {
    //   console.log('SI ESTA RECARGANDO');
    // };
  }, [estado]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={{color: 'white', paddingHorizontal: 15}}>{user.name}</Text>
      ),
    });
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{estado.NombreTienda}</Text>
          <Text style={styles.headerText}>Visita número: {estado.Visita}</Text>
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
            onPress={() => launchCamera(2)}
            //onPress={() =>
            //  navigation.navigate('PictureScreenScan', {
            //    screen: 'MostradorDespuesServicio',
            //  })
            //}
          />
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={{width: '10%', height: '50%', marginLeft: 20}}
            source={{uri: filePathM3}}></Image>
        </View>
      </View>
      <View style={{paddingHorizontal: 20}}>
        <Button
          color="rgb(27,67,136)"
          title="Siguiente"
          disabled={disabled}
          onPress={() => guardarImagen()}
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    paddingVertical: '5%',
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
