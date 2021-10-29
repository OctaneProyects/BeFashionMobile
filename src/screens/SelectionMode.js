import React, {useState, useContext} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {FilledButton} from '../components/Button';
import {Error} from '../components/Error';
import {Heading} from '../components/Heading';
import {Input} from '../components/Input';
import {TextButton} from '../components/TextButton';
import {AuthContext} from '../context/AuthContext';
import {Loading} from '../components/Loading';
import {UserContext} from '../context/UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

export function SelectionMode({navigation}) {
  const user = React.useContext(UserContext);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Text style={{color: 'white'}}>{user.name}</Text>,
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('addSite')}>
          <Text style={styles.btnText}>
            Agregar tienda{' '}
            <Icon name="map-marker" size={25} color="gray" padding={20} />
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('CapturaKilometraje');
          }}>
          <Text style={styles.btnText}>
            Iniciar viaje{' '}
            <Icon name="car" size={25} color="gray" padding={50} />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 120,
    alignItems: 'center',
    backgroundColor: 'rgb(27,67,136)',
    justifyContent: 'center',
    // backgroundColor: '#0F212E',
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    height: '30%',
    borderRadius: 10,
  },
  btnText: {
    fontSize: 16,
  },
});
