import React, {useState} from 'react';
import {SafeAreaView, View, StyleSheet, Text, Image, TouchableOpacity} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {FilledButton} from '../components/Button';
import {Heading} from '../components/Heading';
import {IconButton} from '../components/IconButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import { UserContext } from '../context/UserContext'


export function MostradorDespuesServicio({navigation}) {
  const [filePathM, setFilePathM] = useState('FileM');
  const [filePathM3, setFilePathM3] = useState('FileM3');
  const [enviar, setEnviar] = useState(0);
  const user = React.useContext(UserContext);

  launchCamera = (tipo) => {
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
        const source = {uri: response.uri};
        console.log('response', JSON.stringify(JSON.stringify(response)).uri);
        if (tipo == 1) {
          setFilePathM(response.assets[0].uri);
        } else if (tipo == 2) {
          setFilePathM3(response.assets[0].uri);
        }
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
      <View style={styles.container}>
        <Text style={{padding: 20, fontWeight: 'bold'}}>
          Cuarto paso: Tomar capturar con caracteristicas x
        </Text>
        <Text>Tome una foto antes de comenzar a surtir el exibidor</Text>
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
        <Text>Tome una foto antes de comenzar a surtir el exibidor</Text>
        <View style={styles.row}>
          <Text style={{paddingRight: 8}}>Imagen mostrador a 3 metros:</Text>
          <Icon
            style={{paddingLeft: 2}}
            size={20}
            name="camera"
            onPress={() => launchCamera(2)}
          />
          <Image
            resizeMode="cover"
            resizeMethod="scale"
            style={{width: '10%', height: '50%', marginLeft: 20}}
            source={{uri: filePathM3}}></Image>
        </View>

        <View style={styles.row}>
          {/* <FilledButton
            title="Siguiente"
            style={{
              paddingLeft: 10,
              marginVertical: 20,
              alignContent: 'center',
              width: '80%',
            }}
            onPress={
              enviar === 0
                ? () => navigation.navigate('TerminaTienda')
                : () => {
                    //Llamada api para guardar
                  }
            }
          /> */}

          
        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={
            enviar === 0
              ? () => navigation.navigate('TerminaTienda')
              : () => {
                  //Llamada api para guardar
                }
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
    justifyContent:'center',
    borderWidth: 1,
    backgroundColor: 'rgb(27,67,136)',
  },
  btnSubmitText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});
