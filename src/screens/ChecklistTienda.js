import React, {useState, useEffect} from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  TextComponent,
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
import {getDeviceDate} from '../hooks/common';
import {Loading} from '../components/Loading'; //agregado fix 11153

export default function TerminaViaje({route, navigation}) {
  const [isExhibido, setExhibido] = useState();
  const [isSurtido, setSurtido] = useState();
  const [cantNoFashion, setCantNoFashion] = useState('');
  const [isAlcance, setAlcance] = useState();
  const [comentarios, setComentarios] = useState('');
  const user = React.useContext(UserContext);
  // const {idTienda, nombreTienda} = route.params;
  //AuthFlow
  const {estado} = React.useContext(EstatusContext);
  const {authFlow} = React.useContext(EstatusContext);

  const [openExibido, setOpenExibido] = useState(false);
  const [openAlcance, setOpenAlcance] = useState(false);
  const [openSurtido, setOpenSurtido] = useState(false);

  const {idTienda, nombreTienda, idViaje} = route.params; //agregado fix 11153
  //hook para deshabilitar boton
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false); //agregado fix 11153

  async function terminaTienda() {
    var fechaDispositivo = getDeviceDate();

    if (cantNoFashion < 0) {
      alert('Cantidad de lentes no fashion invalida');
      //console.log(estado);
    } else {
      //deshabilitar boton
      setDisabled(true);
      //muestra loader
      setLoading(true); // agregado fix 11153

      const form = {
        // idVisita: 1,
        idViaje: estado.IdViaje,
        idTienda: estado.IdTienda,
        idUsuario: user.IdUsuario,
        isExhibido: isExhibido,
        isSurtido: isSurtido,
        cant: cantNoFashion,
        isAlcance: isAlcance,
        comentarios: comentarios,
        visitada: true,
        fechaDispositivo: fechaDispositivo, // agregado para fecha del dispositivo
        idVisita: estado.Visita,
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
              idTienda, //estado.IdTienda, //removido fix 11153
              user.IdUsuario,
              idViaje, //estado.IdViaje, //removido fix 11153
            );
            await authFlow.getEstatus(0, user.IdUsuario);
            //habilitar boton
            setDisabled(false);
            //oculta loader
            setLoading(false); // agregado fix 11153
            Alert.alert('Listo', 'Se ha guardado el checklist', [
              {
                text: 'Aceptar',
                onPress: () => navigation.navigate('LandingScreen'),
              },
            ]);
          }
        }
      } catch (error) {
        //habilitar boton
        setDisabled(false);
        //oculta loader
        setLoading(false); // agregado fix 11153
        alert(error);
      }
    }
  }

  //Este Este useEffect se detona cuando se modifica el estado del viaje
  useEffect(() => {
    // return () => {
    //   if (estado) {
    //navega a la ultima pantalla en que se encontraba el usuario
    navigation.dispatch(
      CommonActions.navigate({
        name: estado.Modulo,
        // params: {
        //   user: 'jane',
        // },
      }),
    );
    //   }
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{estado.NombreTienda}</Text>
            <Text style={styles.headerText}>
              Visita número: {estado.Visita}
            </Text>
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
        <Text style={{marginHorizontal: 10, fontWeight: 'bold'}}>
          Exh, colocado al alcance publico
        </Text>
        <View
          style={[
            Platform.OS === 'ios'
              ? {zIndex: 3000, zIndexInverse: 1000}
              : {width: '20%'},
            styles.dropdown,
          ]}>
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
            zIndex={3}
          />
        </View>
        <Text style={{marginHorizontal: 10, fontWeight: 'bold'}}>
          No permitido surtir al 100%
        </Text>
        <View
          style={[
            Platform.OS === 'ios'
              ? {zIndex: 2000, zIndexInverse: 2000}
              : {width: '20%'},
            styles.dropdown,
          ]}>
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
            zIndex={2}
          />
        </View>
        <Text style={{marginHorizontal: 10, fontWeight: 'bold'}}>
          Lentes no fashion en el exh Cantidad
        </Text>
        <View style={{padding: 10}}>
          <TextInput
            keyboardType="numeric"
            //textAlign="center"
            style={styles.ipCantNoFashion}
            placeholder="Lentes no fashion en el exh Cantidad"
            value={cantNoFashion.toString()}
            onChangeText={(text) => setCantNoFashion(text)}
          />
        </View>
        <Text style={{marginHorizontal: 10, fontWeight: 'bold'}}>
          Lentes al alcance para el cliente S/N
        </Text>
        <View
          style={[
            Platform.OS === 'ios'
              ? {zIndex: 1000, zIndexInverse: 3000, margin: 10}
              : {width: '20%'},
            styles.dropdown,
          ]}>
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
            zIndex={2}
          />

          {/* <CheckBox
          value={isAlcance}
          onValueChange={setAlcance}
          tintColors={{ true: 'rgb(27,67,136)' }}
          style={styles.checkbox}
        /> */}
        </View>
        {isExhibido ? (
          <View>
            <Text
              style={{marginHorizontal: 10, fontSize: 16, fontWeight: 'bold'}}>
              Promociones: {estado.Boletos}{' '}
            </Text>
          </View>
        ) : null}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          // style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.comentsContainer}>
              <Text style={styles.label}>Comentarios:</Text>
              <TextInput
                style={styles.textInputMultiLine}
                multiline
                numberOfLines={3}
                maxLength={1000}
                value={comentarios}
                placeholder="Agregue comentarios"
                scrollEnabled={true}
                onChangeText={setComentarios}></TextInput>
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.btnSubmitContainer}>
            <Button
              color="rgb(27,67,136)"
              title="Finalizar"
              disabled={disabled}
              onPress={() => terminaTienda()}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <Loading loading={loading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 50,
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
  textInputMultiLine: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 2,
    fontSize: 15,
    textAlignVertical: 'top',
    placeholderTextColor: 'gray',
    height: 60,
  },
  btnSubmit: {
    marginTop: 40,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'rgb(27,67,136)',
  },
  btnSubmitContainer: {
    margin: 20,
    // elevation: 0,
  },
  btnSubmitText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginVertical: '5%',
  },
  headerText: {
    fontSize: 20,
  },
  dropdown: {
    marginHorizontal: 10,
  },
  ipCantNoFashion: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 2,
    fontSize: 18,
    height: 35,
    paddingVertical: 1,
  },
});
