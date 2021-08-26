import React, {useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import axios from 'axios';
import {Icon} from 'react-native-elements';
import {TextInput} from 'react-native-gesture-handler';


//asi se envia para POST (server recibe modelo)
async function insertFormulario(cant) {
  const formulario = {
    idTienda: 26,
    idViaje: 1,
    cant: cant,
    idArticulo: 3,
    idUsuario: 2000433,
  };
  const result = await axios.post(
    'http://localhost:63745/api/Sitios/InsertaFormCapt',
    formulario,
  );
  if (result.data == 'ok') {
    Alert.alert(
      "Listo",
      "Se han registrado correctamente",
      [
        
        { text: "Aceptar", onPress: () => console.log("OK Pressed") }
      ]
    );
  } else {
    alert('error');
  }

  console.log(result.data);
  return result;
}

export default function Formulario({navigation}) {
  const [cantidad, setCantidad] = useState(0);
  const [cantidad2, setCantidad2] = useState(0);

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

  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>oxxo {}</Text>
      </View>
      <View style={{alignItems:'center', }}>
      <Text style={{fontStyle:'italic'}}><Icon name='info-circle' type='font-awesome' size={15} color='blue'></Icon> Captura las cantidades entregadas de cada modelo</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>modelo befashion 1</Text>
        <View
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
            onPress={() => disminuyeCant()}
          />
          <TextInput
            style={{fontSize: 20, marginHorizontal: 20}}
            value={cantidad.toString()}
            placeholder="0"
            keyboardType="number-pad"
            onChangeText={(cant) => setCantidad(cant)}
            keyboardType="number-pad"></TextInput>
          <Icon
            raised
            name="plus"
            type="font-awesome"
            color="blue"
            onPress={() => aumentaCant()}
          />
        </View>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>modelo befashion 2</Text>
      </View>
      <View
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
      </View>

      <View style={styles.btnSubmitContainer}>
        <TouchableOpacity
          style={styles.btnSubmit}
          // onPress={() => insertFormulario(cantidad)}
          onPress={() =>  navigation.navigate('Termina Visita Tienda')}
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
    backgroundColor: 'blue',
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
