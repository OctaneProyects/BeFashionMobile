import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UserContext} from '../context/UserContext';

export default function TerminaViaje({navigation}) {
  const [isSelected1, setSelection1] = useState(false);
  const [isSelected2, setSelection2] = useState(false);
  const [cantNoFashion, setCantNoFashion] = useState('');
  const [isSelected4, setSelection4] = useState(false);
  const [comentarios, setComentarios] = useState('');
  const user = React.useContext(UserContext);

  const terminaTienda = () => {
    if (cantNoFashion >= 0) {
    } else {
      alert('Cantidad de lentes no fahion invalida');
    }
    console.log(isSelected1);
    console.log(isSelected2);
    console.log(cantNoFashion);
    console.log(isSelected4);
    console.log(comentarios);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Text style={{color: 'white'}}>{user.name}</Text>,
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontStyle: 'italic'}}>
          <Icon
            name="info-circle"
            type="font-awesome-5"
            size={15}
            color="blue"></Icon>{' '}
          Completa el checklist para finalizar esta Visita
        </Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Exh, colocado al alcance publico </Text>
        <CheckBox
          value={isSelected1}
          onValueChange={setSelection1}
          tintColors={{ true: 'rgb(27,67,136)' }}
          style={styles.checkbox}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}> No permitido surtir al 100% </Text>
        <CheckBox
          value={isSelected2}
          onValueChange={setSelection2}
          tintColors={{ true: 'rgb(27,67,136)' }}
          style={styles.checkbox}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Lentes no fashion en el exh Cantidad </Text>
        <TextInput
          keyboardType="numeric"
          textAlign="center"
          style={styles.ipCantNoFashion}
          placeholder="0"
          value={cantNoFashion}
          onChangeText={(text) => setCantNoFashion(text)}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Lentes al alcance para el cliente S/N</Text>
        <CheckBox
          value={isSelected4}
          onValueChange={setSelection4}
          tintColors={{ true: 'rgb(27,67,136)' }}
          style={styles.checkbox}
        />
      </View>
      <View style={styles.comentsContainer}>
        <Text style={styles.label}>Comentarios:</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={5}
          value={comentarios}
          onChangeText={(val) => setComentarios(val)}></TextInput>
      </View>
      <View style={styles.btnSubmitContainer}>
        <TouchableOpacity
          style={styles.btnSubmit}
          // onPress={() => terminaTienda()}
          onPress={() => {
            navigation.navigate('Home');
          }}
        >
          <Text style={styles.btnSubmitText}>Finalizar</Text>
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
  ipCantNoFashion: {
    borderColor: 'gray',
    borderWidth: 2,
    fontSize: 10,
    height: 35,
  },
});
