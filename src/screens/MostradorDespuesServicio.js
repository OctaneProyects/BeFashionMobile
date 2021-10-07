import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { FilledButton } from '../components/Button';
import { Heading } from '../components/Heading';
import { IconButton } from '../components/IconButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { BASE_URL } from '../config';
import { UserContext } from '../context/UserContext'


export function MostradorDespuesServicio({ navigation }) {
  const [filePathM, setFilePathM] = useState('FileM');
  const [filePathM3, setFilePathM3] = useState('FileM3');
  const [filePathM64, setFilePathM64] = useState();
  const [filePathM364, setFilePathM364] = useState();
  const [fileMContentType, setFileMContentType] = useState();
  const [fileM3ContentType, setFileM3ContentType] = useState();
  const [enviar, setEnviar] = useState(0);
  const user = React.useContext(UserContext);

  launchCamera = (tipo) => {
    let options = {
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

  guardarImagen = async () => {
    let img = {
      img: [{
        idTipo: 4,
        contenido: filePathM64,
        contentType: fileMContentType,
        UsuarioRegistro: 0
      },
      {
        idTipo: 5,
        contenido: filePathM364,
        contentType: fileM3ContentType,
        UsuarioRegistro: 0
      }]
    }




    console.log(`aqui llega pariente: ${BASE_URL}Tiendas/InsertImagenes`, img)
    try {
      await axios
        .post(`${BASE_URL}Tiendas/InsertImagenes`
          , img
        )
        .then((res) => {
          const result = res.data;
          let jsonMostradorResulto = JSON.parse(result);




          console.log('Resultado');
          console.log(jsonMostradorResulto)
          navigation.navigate('TerminaTienda')
          // setIsLoading(false);
        });
    } catch (error) {
      console.log(`valio verga pariente`, error)
    }
  };

  guardarImagenes = () => {

    for (let i = 0; i < 2; i++) {
      const element = array[i];

    }
  }


  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Text style={{ color: 'white' }}>{user.name}</Text>,
    });
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={{ padding: 20, fontWeight: 'bold' }}>
          Cuarto paso: Tomar capturar con caracteristicas x
        </Text>
        <Text>Tome una foto antes de comenzar a surtir el exibidor</Text>
        <View style={styles.row}>
          <Text style={{ paddingRight: 8 }}>Imagen mostrador:</Text>
          <Icon
            style={{ paddingLeft: 2 }}
            size={20}
            name="camera"
            onPress={() => launchCamera(1)}
          />
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={{ width: '10%', height: '50%', marginLeft: 20 }}
            source={{ uri: filePathM }}></Image>
        </View>
        <Text>{filePathM}</Text>
        <Text>Tome una foto antes de comenzar a surtir el exibidor</Text>
        <View style={styles.row}>
          <Text style={{ paddingRight: 8 }}>Imagen mostrador a 3 metros:</Text>
          <Icon
            style={{ paddingLeft: 2 }}
            size={20}
            name="camera"
            onPress={() => launchCamera(2)}
          />
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={{ width: '10%', height: '50%', marginLeft: 20 }}
            source={{ uri: filePathM3 }}></Image>
        </View>

        <View style={styles.row}>

          <TouchableOpacity
            style={styles.btnSubmit}
            onPress={() => guardarImagen()
              //enviar === 0
              //  ? () => navigation.navigate('TerminaTienda')
              //  : () => {
              //Llamada api para guardar

            }>
            <Text style={styles.btnSubmitText}>Siguiente</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView >
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
});
