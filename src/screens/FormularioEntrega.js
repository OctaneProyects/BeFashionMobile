import React, {useEffect, useState} from 'react';
import {
  AppState,
  Alert,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingViewBase,
} from 'react-native';
import axios from 'axios';
import {BASE_URL} from '../config';
import {Icon} from 'react-native-elements';
import {TextInput} from 'react-native-gesture-handler';
import {UserContext} from '../context/UserContext';
import {EstatusContext} from '../context/EstatusContext';
import {LentesHandler} from '../components/LentesHandler';
import {CommonActions} from '@react-navigation/native';
import {getDeviceDate} from '../hooks/common';
import {Loading} from '../components/Loading'; //agregado fix 11153
export default function Formulario({route, navigation}) {
  // const [cantidad, setCantidad] = useState(0);
  const [articulos, setArticulos] = useState([]);
  const [entregas] = useState([]);
  //AuthFlow
  const {estado} = React.useContext(EstatusContext);
  const {authFlow} = React.useContext(EstatusContext);
  const {idTienda, nombreTienda} = route.params;
  const user = React.useContext(UserContext);

  //hook para deshabilitar boton
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false); //agregado fix 11153

  //asi se envia para POST (server recibe modelo)
  async function insertFormulario(navigation, cant) {
    var fechaDispositivo = getDeviceDate();
    if (cant <= 0) {
      Alert.alert('Verifique datos', 'Ingrese cantidad valida', [
        {text: 'Aceptar'},
      ]);
      return;
    }

    const formulario = {
      idTienda: idTienda, // agregar
      entregas: entregas,
      idViaje: estado.IdViaje, //agregar
      cant: cant,
      idUsuario: user.IdUsuario,
      fechaDispositivo: fechaDispositivo, // agregado para la fecha del dispositivo
      idVisita: estado.Visita,
    };

    console.log(formulario);
    //deshabilitar boton
    setDisabled(true);
    //muestra loader
    setLoading(true); // agregado fix 11153

    const result = await axios.post(
      `${BASE_URL}Tiendas/InsertaFormCapt`,
      formulario,
    );
    console.log('RESULT DATA');
    console.log(result.data);

    var res = JSON.parse(result.data);
    if (res[0].result == 'ok') {
      await authFlow.setEstatus(10, idTienda, user.IdUsuario, idViaje);
      await authFlow.getEstatus(0, user.IdUsuario);
      //habilitar boton
      setDisabled(false);
      //oculta loader
      setLoading(false); // agregado fix 11153
      Alert.alert('Listo', 'Se han registrado correctamente', [
        {
          text: 'Aceptar',
          onPress: () =>
            navigation.navigate('MostradorDespuesServicio', {
              idTienda: idTienda,
              nombreTienda: nombreTienda,
            }),
        },
      ]);
    } else {
      alert('error');
    }
    //habilitar boton
    setDisabled(false);
    //oculta loader
    setLoading(false); // agregado fix 11153
    console.log(result.data);
    return result;
  }

  const handleCant = (id, cant) => {
    if (entregas.length > 0) {
      for (var i = 0; i < entregas.length; i++) {
        if (entregas[i].id == id) {
          entregas[i].cant = cant;
          console.log(`Actualiza: ${JSON.stringify(entregas)}`);

          break;
        }
      }
    } else {
      for (let i = 0; i < articulos.length; i++) {
        entregas.push({id: articulos[i].Id, cant: 0});
      }
      console.log(entregas);
    }
  };

  const GetArticulos = async () => {
    const params = {
      idUsuario: user.IdUsuario,
    };

    try {
      await axios
        .get(`${BASE_URL}Articulos/GetArticulos`, {params})
        .then((res) => {
          const result = res.data;
          let jsonArticulos = JSON.parse(result);

          setArticulos(jsonArticulos);
        });
    } catch (e) {
      alert(`Ocurrio un error ${e}`);
    }
  };

  useEffect(() => {
    entregas.length = 0;
    GetArticulos(idTienda);
    console.log(`Este es el estado: ${estado}`);

    return () => {};
  }, []);

  //Este Este useEffect se detona cuando se modifica el estado del viaje
  useEffect(() => {
    return () => {
      console.log('PANTALLA');
      console.log(estado.Modulo);
      console.log(estado);
      if (estado.Modulo && estado.Modulo != 'FormularioEntrega') {
        //navega a la ultima pantalla en que se encontraba el usuario
        navigation.dispatch(
          CommonActions.navigate({
            name: estado.Modulo,
            params: {idTienda, nombreTienda, idViaje},
          }),
        );
      }
    };
  }, [estado]);

  useEffect(() => {
    console.log(`Entregas: ${JSON.stringify(entregas)}`);
  }, [entregas]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Text style={{color: 'white'}}>{user.name}</Text>,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          {/* <Text> idTienda: {idTienda}</Text> */}
          {/* <Text>nombreTienda: {nombreTienda}</Text> */}
          <Text style={styles.headerText}>{nombreTienda}</Text>
          <Text style={styles.headerText}>Visita número: {estado.Visita}</Text>
        </View>

        <Text style={{padding: 20, fontWeight: 'bold'}}>
          Tercer paso: Deja productos a tienda
        </Text>

        <View style={{alignItems: 'center'}}>
          <Text style={{fontStyle: 'italic'}}>
            <Icon
              name="info-circle"
              type="font-awesome"
              size={15}
              color="blue"></Icon>{' '}
            Captura las cantidades entregadas de cada modelo
          </Text>
        </View>
      </View>

      <View style={styles.articulosContainer}>
        <FlatList
          data={articulos}
          keyExtractor={({id}, index) => id}
          renderItem={({item}) => (
            <LentesHandler
              handleCant={handleCant}
              key={item.id}
              id={item.Id}
              nombre={item.Nombre}></LentesHandler>
          )}></FlatList>
      </View>

      <View style={styles.btnSubmitContainer}>
        <Button
          color="rgb(27,67,136)"
          title="Enviar"
          disabled={disabled}
          onPress={() => insertFormulario(navigation)}
        />
      </View>
      <Loading loading={loading} /> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  articulosContainer: {
    flex: 2,
  },
  headerContainer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
  },
  btnSubmit: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'rgb(27,67,136)',
  },
  btnSubmitContainer: {
    flex: 0.5,
    padding: 20,
    elevation: 0,
  },
  btnSubmitText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});
