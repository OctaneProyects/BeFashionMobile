import React, {useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UserContext} from '../context/UserContext';
import {EstatusContext} from '../context/EstatusContext';
import {CommonActions} from '@react-navigation/native';
import axios from 'axios';
import {BASE_URL} from '../config';
import DropDownPicker from 'react-native-dropdown-picker';

export default function TerminaViaje({route, navigation}) {
  const [isExhibido, setExhibido] = useState();
  const [isSurtido, setSurtido] = useState();
  const [cantNoFashion, setCantNoFashion] = useState('');
  const [isAlcance, setAlcance] = useState();
  const [comentarios, setComentarios] = useState('');
  const user = React.useContext(UserContext);
  const {idTienda, nombreTienda} = route.params;
  //AuthFlow
  const {estado} = React.useContext(EstatusContext);
  const {authFlow} = React.useContext(EstatusContext);

  const [openExibido, setOpenExibido] = useState(false);
  const [openAlcance, setOpenAlcance] = useState(false);
  const [openSurtido, setOpenSurtido] = useState(false);

  async function terminaTienda() {
    if (cantNoFashion < 0) {
      alert('Cantidad de lentes no fashion invalida');
      //console.log(estado);
    } else {
      const form = {
        // idVisita: 1,
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
        let res = await axios.post(
          `${BASE_URL}Tiendas/InsertaChecklistTienda`,
          form,
        );
        if (res) {
          const result = JSON.parse(res.data);
          console.log(result);
          if (result[0].result == 'okay') {
            await authFlow.setEstatus(
              6,
              idTienda,
              user.IdUsuario,
              estado.IdViaje,
            );
            await authFlow.getEstatus(0, user.IdUsuario);
            Alert.alert('Listo', 'Se ha guardado el checklist', [
              {
                text: 'Aceptar',
                onPress: () => navigation.navigate('LandingScreen'),
              },
            ]);
          }
        }
      } catch (error) {
        alert(error);
      }
    }
  }

  //Este Este useEffect se detona cuando se modifica el estado del viaje
  useEffect(() => {
    return () => {
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
    };
  }, [estado]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text style={{color: 'white', paddingHorizontal: 15}}>{user.name}</Text>
      ),
    });
  }, []);

  return (
    <ScrollView estedScrollEnabled={true} style={styles.container}>
      <View style={{alignItems: 'center', padding: 10}}>
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
      <Text style={{marginHorizontal: 10}}>
        Exh, colocado al alcance publico
      </Text>
      <View
        style={
          Platform.OS === 'ios' ? {zIndex: 300, padding: 10} : {width: '20%'}
        }>
        <DropDownPicker
          placeholder="---"
          value={isExhibido}
          open={openExibido}
          setOpen={setOpenExibido}
          setValue={setExhibido}
          listMode="SCROLLVIEW"
          items={[
            {label: 'Si', value: true},
            {label: 'No', value: false},
          ]}
          zIndex={300}
        />
      </View>

      <Text style={{marginHorizontal: 10}}>No permitido surtir al 100%</Text>
      <View
        style={
          Platform.OS === 'ios' ? {zIndex: 250, padding: 10} : {width: '20%'}
        }>
        <DropDownPicker
          placeholder="---"
          value={isSurtido}
          setValue={setSurtido}
          open={openSurtido}
          setOpen={setOpenSurtido}
          position="relative"
          listMode="SCROLLVIEW"
          items={[
            {label: 'Si', value: true},
            {label: 'No', value: false},
          ]}
          zIndex={250}
        />
      </View>

      <Text style={{marginHorizontal: 10}}>
        Lentes no fashion en el exh Cantidad
      </Text>
      <View style={{padding: 10}}>
        <TextInput
          keyboardType="numeric"
          //textAlign="center"
          style={styles.ipCantNoFashion}
          placeholder="Lentes no fashion en el exh Cantidad"
          value={cantNoFashion.toString()}
          onChangeText={text => setCantNoFashion(text)}
        />
      </View>
      <Text style={{marginHorizontal: 10}}>
        Lentes al alcance para el cliente S/N
      </Text>
      <View
        style={
          Platform.OS === 'ios' ? {zIndex: 200, margin: 10} : {width: '20%'}
        }>
        <DropDownPicker
          placeholder="---"
          value={isAlcance}
          setValue={setAlcance}
          open={openAlcance}
          setOpen={setOpenAlcance}
          listMode="SCROLLVIEW"
          items={[
            {label: 'Si', value: true},
            {label: 'No', value: false},
          ]}
          zIndex={200}
        />

        {/* <CheckBox
          value={isAlcance}
          onValueChange={setAlcance}

          tintColors={{ true: 'rgb(27,67,136)' }}
          style={styles.checkbox}
        /> */}
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.comentsContainer}>
            <Text style={styles.label}>Comentarios:</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={5}
              value={comentarios}
              placeholder="Agregue comentarios"
              placeholderTextColor="#000"
              onChangeText={setComentarios}></TextInput>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={styles.btnSubmitContainer}>
        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={() => terminaTienda()}>
          <Text style={styles.btnSubmitText}>Finalizar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    alignContent: 'space-around',
  },
  comentsContainer: {
    paddingHorizontal: 10,
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
    marginVertical: 10,
    width: 250,
  },
  textInput: {
    backgroundColor: 'white',

    borderColor: 'gray',
    borderWidth: 2,
    fontSize: 15,
    height: 40,
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
    fontSize: 18,
    height: 35,
  },
});
