import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {TextInput} from 'react-native-gesture-handler';

export default function TerminaViaje({navigation}) {
  const [isSelected1, setSelection1] = useState(false);
  const [isSelected2, setSelection2] = useState(false);
  const [isSelected3, setSelection3] = useState(false);
  const [isSelected4, setSelection4] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Exh, colocado al alcance publico </Text>
        <CheckBox
          value={isSelected1}
          onValueChange={setSelection1}
          style={styles.checkbox}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}> No permitido surtir al 100% </Text>
        <CheckBox
          value={isSelected2}
          onValueChange={setSelection2}
          style={styles.checkbox}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Lentes no fashion en el exh Cantidad </Text>
        <CheckBox
          value={isSelected3}
          onValueChange={setSelection3}
          style={styles.checkbox}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Lentes al alcance para el cliente S/N</Text>
        <CheckBox
          value={isSelected4}
          onValueChange={setSelection4}
          style={styles.checkbox}
        />
      </View>
      <View style={styles.comentsContainer}>
        <Text style={styles.label}>Comentarios:</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={5}></TextInput>
      </View>
      <View style={styles.btnSubmitContainer}>
        <TouchableOpacity style={styles.btnSubmit}>
          <Text style={styles.btnSubmitText}>Siguiente</Text>
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
