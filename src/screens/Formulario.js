import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {TextInput} from 'react-native-gesture-handler';

export default function Formulario({navigation}) {
  const [cantidad, setCantidad] = useState(0);

  async function  aumentaCant ()  {
    console.log('antes:'+cantidad);

   await  setCantidad(parseInt(cantidad) + 1);
    console.log('ahora:'+cantidad);
  };
  const disminuyeCant = () => {
    console.log('antes:' +cantidad);

    setCantidad(cantidad - 1);

    console.log('ahora:'+cantidad);
  };

  const handlecantidad=(cant)=>{
      setCantidad(cant)
  }
  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>oxxo {}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>modelo befashion 1 {cantidad}</Text>
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
          <TextInput placeholder="0" value={cantidad.toString()} onChangeText={(cant)=> setCantidad(cant)} keyboardType="number-pad"></TextInput>
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
        <Text style={styles.header}>modelo befashion 2 {}</Text>
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
          onPress={() => console.log('hello')}
        />
        <TextInput
          style={{fontSize: 20}}
          placeholder="0"
          keyboardType="number-pad"></TextInput>
        <Icon
          raised
          name="plus"
          type="font-awesome"
          color="blue"
          onPress={() => console.log('hello')}
        />
      </View>

      <View style={styles.btnSubmitContainer}>
        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={() => navigation.navigate('TerminaViaje')}>
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
    fontSize: 28,
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
