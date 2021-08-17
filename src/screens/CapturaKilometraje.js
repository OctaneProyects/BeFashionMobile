import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default function CapturaKilometraje({navigation}) {
  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Iniciar Ruta</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.etiqueta}>Ingresa kilometraje inicial</Text>
        <TextInput style={styles.textInput}></TextInput>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.rowCamara}>
          <Text style={styles.etiqueta}>Ingresa kilometraje inicial </Text>

          <TouchableOpacity style={styles.etiqueta}>
            <Icon name="camera" size={25} color="gray" padding={20} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.btnSubmitContainer}>
        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={() => navigation.navigate('Formulario')}>
          <Text style={styles.btnSubmitText}>Iniciar ruta</Text>
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
  inputContainer: {
    paddingVertical: '5%',
    paddingHorizontal: '2.5%',
  },
  textInput: {
    backgroundColor: '#C1C1C1',
  },
  rowCamara: {
    flexDirection: 'row',
  },
  etiqueta: {
    paddingVertical: '2.5%',
    fontSize: 20,
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
