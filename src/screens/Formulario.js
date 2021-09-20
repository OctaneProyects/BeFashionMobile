import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import {BASE_URL} from '../config';
import {Icon} from 'react-native-elements';
import {TextInput} from 'react-native-gesture-handler';
import {UserContext} from '../context/UserContext';
import {LentesHandler} from '../components/LentesHandler';

//asi se envia para POST (server recibe modelo)
async function insertFormulario(navigation, cant) {
  if (cant <= 0) {
    Alert.alert('Verifique datos', 'Ingrese cantidad valida', [
      {text: 'Aceptar'},
    ]);
    return;
  }

  const formulario = {
    idTienda: 26, // agregar
    idViaje: 1, //agregar
    cant: cant, //agregar
    idArticulo: 3, //agregar
    idUsuario: 2000433, //agregar
  };
  const result = await axios.post(
    `${BASE_URL}Sitios/InsertaFormCapt`,
    formulario,
  );
  if (result.data == 'ok') {
    Alert.alert('Listo', 'Se han registrado correctamente', [
      {text: 'Aceptar', onPress: () => navigation.navigate('MostradorDespues')},
    ]);
  } else {
    alert('error');
  }

  console.log(result.data);
  return result;
}

export default function Formulario({route, navigation}) {
  const [cantidad, setCantidad] = useState(0);
  const [cantidad2, setCantidad2] = useState(0);
  const [articulos, setArticulos] = useState([]);
  const {idTienda, nombreTienda} = route.params;

  const user = React.useContext(UserContext);

  function aumentaCant() {
    setCantidad(parseInt(cantidad) + 1);
  }

  const disminuyeCant = () => {
    setCantidad(cantidad - 1);
  };

  function aumentaCant2() {
    setCantidad2(parseInt(cantidad2) + 1);
  }

  const disminuyeCant2 = () => {
    setCantidad2(cantidad2 - 1);
  };

  const handlecantidad = (cant) => {
    setCantidad(cant);
  };

  const GetArticulos = async (idTienda) => {
    const params = {
      idTienda: idTienda, //agregar id usuario REAL
    };

    try {
      await axios
        .get(`${BASE_URL}sitios/GetArticulos`, {params})
        .then((res) => {
          const result = res.data;
          let jsonArticulos = JSON.parse(result);

          setArticulos(jsonArticulos);
          console.log('articulos');
          console.log(jsonArticulos);

          // setIsLoading(false);
        });
    } catch (e) {
      alert(`Ocurrio un error ${e}`);
    }
  };

  useEffect(() => {
    GetArticulos(idTienda);
    return () => {};
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Text style={{color: 'white'}}>{user.name}</Text>,
    });
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{nombreTienda}</Text>
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
      <FlatList
        data={articulos}
        keyExtractor={({id}, index) => id}
        renderItem={({item}) => (
          <LentesHandler nombre={item.Nombre}></LentesHandler>
          // <View style={styles.headerContainer}>
          //   <Text style={styles.header}>{item.Nombre}</Text>
          //   <View
          //     style={{
          //       alignItems: 'center',
          //       justifyContent: 'center',
          //       alignContent: 'center',
          //       flexDirection: 'row',
          //     }}>
          //     <Icon
          //       raised
          //       name="minus"
          //       type="font-awesome"
          //       color="blue"
          //       onPress={() => disminuyeCant()}
          //     />
          //     <TextInput
          //       style={{fontSize: 20, marginHorizontal: 20}}
          //       value={cantidad.toString()}
          //       placeholder="0"
          //       keyboardType="number-pad"
          //       onChangeText={(cant) => setCantidad(cant)}
          //       keyboardType="number-pad"></TextInput>
          //     <Icon
          //       raised
          //       name="plus"
          //       type="font-awesome"
          //       color="blue"
          //       onPress={() => aumentaCant()}
          //     />
          //   </View>
          // </View>
        )}></FlatList>
      {/* <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          flexDirection: 'row',
        }}>
        <Icon
          raised
          name="minus"
          type="font-awesome"
          color="blue"
          onPress={(cant) => disminuyeCant2(cant)}
        />
        <TextInput
          style={{fontSize: 20, marginHorizontal: 20}}
          value={cantidad2.toString()}
          placeholder="0"
          keyboardType="number-pad"
          onChangeText={(cant) => setCantidad2(cant)}></TextInput>
        <Icon
          raised
          name="plus"
          type="font-awesome"
          color="blue"
          onPress={(cant) => aumentaCant2(cant)}
        />
      </View> */}

      <View style={styles.btnSubmitContainer}>
        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={() => insertFormulario(navigation, cantidad)}
          // onPress={() => navigation.navigate('MostradorDespues')}
        >
          <Text style={styles.btnSubmitText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 24,
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
});
