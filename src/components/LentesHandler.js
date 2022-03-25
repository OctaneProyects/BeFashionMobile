import React, { useState, useEffect } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';

export function LentesHandler(props) {
  const [cantidad, setCantidad] = useState('');
  const { handleCant } = props;

  function aumentaCant() {
    if (cantidad == '' || isNaN(cantidad)) {
      setCantidad(1);
    }
    else{
    setCantidad(parseInt(cantidad) + 1);
    }
  }

  const disminuyeCant = () => {
    if (cantidad == '' || isNaN(cantidad)) {
      setCantidad(-1);
    }
    else{
    setCantidad(cantidad - 1);
    }
  };

  useEffect(() => {
    // handleCant(props.id, cantidad);

  }, [])

  useEffect(() => {
    handleCant(props.id, cantidad);
  }, [cantidad]);

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.header}>{props.nombre}</Text>
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
          style={{ fontSize: 16, marginHorizontal: 20 }}
          value={cantidad.toString()}
          placeholder="0"
          keyboardType="number-pad"
          onChangeText={(cant) => setCantidad(cant)}></TextInput>
        <Icon
          raised
          name="plus"
          type="font-awesome"
          color="blue"
          onPress={(cant) => aumentaCant(cant)}
        />
      </View>
    </View>
  );
}

LentesHandler.propTypes = {
  id: PropTypes.number,
  nombre: PropTypes.string,
  cant: PropTypes.number,
  handleCant: PropTypes.func.isRequired,
};

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
