import React, {useState, useEffect, useContext} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {FilledButton} from '../components/Button';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UserContext} from '../context/UserContext';
import axios from 'axios';
import {BASE_URL} from '../config';
import {EstatusContext} from '../context/EstatusContext';
import {CommonActions} from '@react-navigation/native';
import {getDeviceDate} from '../hooks/common';
import {ScrollView} from 'react-native-gesture-handler';
import {Loading} from '../components/Loading'; //agregado fix 11153

export function MostradorAntesServicio({route, navigation}) {
  const [filePath, setFilePath] = useState(null);
  const [file64, setFile64] = useState();
  const [contentType, setContentType] = useState('');
  const [enviar, setEnviar] = useState(0);
  //AuthFlow
  const {estado} = React.useContext(EstatusContext);
  const {authFlow} = React.useContext(EstatusContext);
  const {idTienda, nombreTienda, idViaje} = route.params;
  const user = React.useContext(UserContext);
  //hook para deshabilitar boton
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false); //agregado fix 11153

  const launchCamera = () => {
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
        console.log(
          'response de launch camera >>>>>>>>>>>>>>>',
          JSON.stringify(response),
        );
        setFilePath(response.assets[0].uri);
        setFile64(response.assets[0].base64);
        setContentType(response.assets[0].type);
      }
    });
  };

  const guardarImagen = async () => {
    var fechaDispositivo = getDeviceDate();
    let img = {
      idTipo: 3,
      contenido: file64,
      contentType: contentType,
      UsuarioRegistro: user.IdUsuario,
      idViaje: estado.IdViaje,
      idTienda: estado.IdTienda,
      fechaDispositivo: fechaDispositivo, //agregado para fecha del dispositivo
    };

    try {
      //deshabilitar boton
      setDisabled(true);
      //mostrar loader
      setLoading(true); // agregado fix 11153

      const res = await axios.post(`${BASE_URL}Tiendas/InsertImagen`, img);
      if (res) {
        const result = res.data;
        let jsonMostradorResulto = JSON.parse(result);
        console.log(res);
        // await authFlow.setEstatus(9, idTienda, user.IdUsuario, estado.IdViaje); // removido fix 1153
        await authFlow.setEstatus(9, idTienda, user.IdUsuario, idViaje); //agregado fix 1153
        authFlow.getEstatus(0, user.IdUsuario);
        setIsLoading(false);
        //habilitar boton
        setDisabled(false);
        //muestra loader
        setLoading(true); // agregado fix 11153

        Alert.alert('Listo', 'Se ha guardado la imagen', [
          {
            text: 'Aceptar',
            onPress: () => {
              navigation.navigate('FormularioEntrega', {
                idTienda: idTienda,
                nombreTienda: nombreTienda,
                idViaje: idViaje, //agregado fix 11153
              });
            },
            // onPress: ()=> (console.log('ESTAD0'), console.log(idViaje),  console.log(estado.IdViaje))
          },
        ]);
      }
    } catch (error) {
      //habilitar boton
      setDisabled(false);
      //oculta loader
      setLoading(false); // agregado fix 11153
      console.log(`Ocurrio un error`, error);
    }
  };

  //Este Este useEffect se detona cuando se modifica el estado del viaje
  useEffect(() => {
    console.log('PANTALLA');
    console.log(estado);
    //navega a la ultima pantalla en que se encontraba el usuario
    navigation.dispatch(
      CommonActions.navigate({
        name: estado.Modulo,
        params: {
          idTienda,
          nombreTienda,
          idViaje, //agregado fix 11153
        },
      }),
    );
  }, [estado]);
  useEffect(() => {
    authFlow.getEstatus(0, user.IdUsuario);
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={{color: 'white', paddingHorizontal: 15}}>{user.name}</Text>
      ),
    });
  }, []);
  return (
    <SafeAreaView>
      <Loading loading={loading} />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{nombreTienda}</Text>
          </View>
          <Text style={{padding: 20, fontWeight: 'bold'}}>
            Segundo paso: Al llegar a la tienda tomar foto con caracteristicas
          </Text>
          <Text>Tome una foto antes de comenzar a surtir el exibidor</Text>
          <View style={styles.row}>
            <Text style={{paddingRight: 8}}>Imagen mostrador:</Text>
            <Icon
              name="camera"
              size={25}
              color="gray"
              padding={20}
              onPress={() => launchCamera()}
            />
          </View>
          <View style={styles.row}>
            <Image
              resizeMode="cover"
              resizeMethod="scale"
              style={{justifyContent: 'center', width: 100, height: 100}}
              source={{uri: filePath}}></Image>
          </View>
        </View>
        <View style={{paddingHorizontal: 20}}>
          <Button
            color="rgb(27,67,136)"
            title="Enviar"
            disabled={disabled}
            onPress={() => guardarImagen()}
          />
          {/* 
        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={() => guardarImagen()}>
          <Text style={styles.btnSubmitText}>Enviar</Text>
        </TouchableOpacity> */}
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
    justifyContent: 'center',
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
