import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {TextInput} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {UserContext} from '../context/UserContext';
import axios from 'axios';
import {BASE_URL} from '../config';

export default function TerminaViaje({navigation}) {
  const [idTienda, setIdTienda] = useState(1);
  const [idUsuario, setIdUsuario] = useState(1);

  const [isExhibido, setExhibido] = useState(false);
  const [isSurtido, setSurtido] = useState(false);
  const [cantNoFashion, setCantNoFashion] = useState('');
  const [isAlcance, setAlcance] = useState(false);
  const [comentarios, setComentarios] = useState('');
  const user = React.useContext(UserContext);

  const terminaTienda = () => {
    if (cantNoFashion == 0) {
    } else {
      alert('Cantidad de lentes no fashion invalida');
    }

    const form = {
      idVisita: 1,
      idTienda: idTienda,
      idUsuario: user.IdUsuario,
      isExhibido: isExhibido,
      isSurtido: isSurtido,
      cant: cantNoFashion,
      isAlcance: isAlcance,
      comentarios: comentarios,
    };

    try {
      const res = axios.post(`${BASE_URL}Sitios/InsertaChecklistSitio`, form);
      console.log(JSON.stringify(user));
    } catch (error) {
      alert(error);
    }

    console.log(JSON.stringify(form));
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
          value={isExhibido}
          onValueChange={setExhibido}
          tintColors={{true: 'rgb(27,67,136)'}}
          style={styles.checkbox}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}> No permitido surtir al 100% </Text>
        <CheckBox
          value={isSurtido}
          onValueChange={setSurtido}
          tintColors={{true: 'rgb(27,67,136)'}}
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
          value={cantNoFashion.toString()}
          onChangeText={(text) => setCantNoFashion(text)}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Lentes al alcance para el cliente S/N</Text>
        <CheckBox
          value={isAlcance}
          onValueChange={setAlcance}
          tintColors={{true: 'rgb(27,67,136)'}}
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
          placeholder="Agregue comentarios"
          onChangeText={(val) => setComentarios(val)}></TextInput>
      </View>
      <View style={styles.btnSubmitContainer}>
        <TouchableOpacity
          style={styles.btnSubmit}
          onPress={() => terminaTienda()}>
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
