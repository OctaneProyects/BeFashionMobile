import React, {useState} from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
import {Icon} from 'react-native-elements';
import {TextInput} from 'react-native-gesture-handler';

export  function LentesHandler({nombre}) {
  const [cantidad, setCantidad] = useState(0);
  
  function aumentaCant() {
    setCantidad(parseInt(cantidad) + 1);
  }

  const disminuyeCant = () => {
    setCantidad(cantidad - 1);
  }

  const handlecantidad = (cant) => {
    setCantidad(cant);
  };

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.header}>{nombre}</Text>
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
  });
  