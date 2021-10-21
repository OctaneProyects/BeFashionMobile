import React, {useState, useEffect} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UserContext} from '../context/UserContext';
import {EstatusContext} from '../context/EstatusContext';
import {CommonActions} from '@react-navigation/native';
import axios from 'axios';
import {BASE_URL} from '../config';

export default function TerminaViaje({route, navigation}) {
  const [isExhibido, setExhibido] = useState(false);
  const [isSurtido, setSurtido] = useState(false);
  const [cantNoFashion, setCantNoFashion] = useState('');
  const [isAlcance, setAlcance] = useState(false);
  const [comentarios, setComentarios] = useState('');
  const user = React.useContext(UserContext);
  const {idTienda, nombreTienda} = route.params;
  //AuthFlow
  const {estado} = React.useContext(EstatusContext);
  const {authFlow} = React.useContext(EstatusContext);

  const terminaTienda = async () => {
    if (cantNoFashion < 0) {
      alert('Cantidad de lentes no fashion invalida');
      console.log(estado);
    } else {
      const form = {
        idVisita: 1,
        idViaje: estado.IdViaje,
        idTienda: idTienda,
        idUsuario: user.IdUsuario,
        isExhibido: isExhibido,
        isSurtido: isSurtido,
        cant: cantNoFashion,
        isAlcance: isAlcance,
        comentarios: comentarios,
        visitada: true,
      };

      try {
        await axios
          .post(`${BASE_URL}Tiendas/InsertaChecklistTienda`, form)
          .then((res) => {
            const result = JSON.parse(res.data);
            console.log(result);
            if (result[0].result == 'okay') {
              authFlow.setEstatus(6, idTienda, user.IdUsuario, estado.IdViaje).then(authFlow.getEstatus(0, user.IdUsuario).then(

                Alert.alert('Listo', 'Se han guardado el checklist', [
                  {
                    text: 'Aceptar',
                    // onPress: () => (
                    //   navigation.navigate('LandingScreen')
                    // ),
                  },
                ])
              ));
   
            }
          });
      } catch (error) {
        alert(error);
      }
    }
  };

  //Este Este useEffect se detona cuando se modifica el estado del viaje
  useEffect(async () => {
    if (estado) {
      //navega a la ultima pantalla en que se encontraba el usuario
      navigation.dispatch(
        CommonActions.navigate({
          name: estado.Modulo,
          // params: {
          //   user: 'jane',
          // },
        }),
      );
    }
  }, [estado]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Text style={{color: 'white'}}>{user.name}</Text>,
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        {/* <Text> idTienda: {idTienda}</Text>
        <Text>nombreTienda: {nombreTienda}</Text> */}
        <View style={styles.header}>
          <Text style={styles.headerText}>{nombreTienda}</Text>
        </View>
        <Text style={{fontStyle: 'italic'}}>
          <Icon
            name="info-circle"
            type="font-awesome-5"
            size={15}
            color="blue"></Icon>{' '}
          Completa el checklist para finalizar esta Visita
        </Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Exh, colocado al alcance publico </Text>
        <CheckBox
          value={isExhibido}
          onValueChange={setExhibido}
          tintColors={{true: 'rgb(27,67,136)'}}
          style={styles.checkbox}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}> No permitido surtir al 100% </Text>
        <CheckBox
          value={isSurtido}
          onValueChange={setSurtido}
          tintColors={{true: 'rgb(27,67,136)'}}
          style={styles.checkbox}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Lentes no fashion en el exh Cantidad </Text>
        <TextInput
          keyboardType="numeric"
          textAlign="center"
          style={styles.ipCantNoFashion}
          placeholder="0"
          value={cantNoFashion.toString()}
          onChangeText={(text) => setCantNoFashion(text)}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Lentes al alcance para el cliente S/N</Text>
        <CheckBox
          value={isAlcance}
          onValueChange={setAlcance}
          tintColors={{true: 'rgb(27,67,136)'}}
          style={styles.checkbox}
        />
      </View>
      <View style={styles.comentsContainer}>
        <Text style={styles.label}>Comentarios:</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={5}
          value={comentarios}
          placeholder="Agregue comentarios"
          onChangeText={(val) => setComentarios(val)}></TextInput>
      </View>
      <View style={styles.btnSubmitContainer}>
        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={() => terminaTienda()}>
          <Text style={styles.btnSubmitText}>Finalizar</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  ipCantNoFashion: {
    borderColor: 'gray',
    borderWidth: 2,
    fontSize: 10,
    height: 35,
  },
});
