import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Image, Alert, Text, KeyboardAvoidingView, Keyboard } from 'react-native';
import { FilledButton } from '../components/Button';
import { Error } from '../components/Error';
import { Input } from '../components/Input';
import { AuthContext } from '../context/AuthContext';
import { Loading } from '../components/Loading';
import { AppVersion } from '../config';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

export function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  // const user = React.useContext(UserContext);

  const [usr, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback style={styles.touchable} onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <SafeAreaView style={styles.container}>
            {/* <Heading style={styles.title}>BeFashion</Heading> */}
            <Image
              style={styles.tinyLogo}
              source={require('../../Images/BEFASHION_LOGO.png')}></Image>
            <Error error={error} />
            <Input
              style={styles.input}
              placeholder={'Usuario'}
              value={usr}
              onChangeText={setUser}
            />
            <Input
              style={styles.input}
              placeholder={'Password'}
              secureTextEntry
              value={pass}
              onChangeText={setPass}
            />
            <FilledButton
              title={'Iniciar Sesión'}
              style={styles.loginButton}
              onPress={async () => {
                try {
                  setLoading(true);
                  await login(usr, pass);
                } catch (e) {
                  console.log(e);
                  Alert.alert("Uy, algo salio mal.",
                    "Verifica tus datos y tu conexión a internet",
                    [{ text: 'Aceptar' }])
                  setLoading(false);
                }
              }}
            />
          </SafeAreaView>
        </ScrollView>
        <Text style={styles.versionText}>
          {AppVersion}
        </Text>
      </TouchableWithoutFeedback>
      <Loading loading={loading} />
    </KeyboardAvoidingView>

  );
}
const styles = StyleSheet.create({
  touchable: {
    height: '100%',
  },
  scrollContainer: {
    //flex:1,
    flexGrow: 1,
    //backgroundColor:'red',
    justifyContent: 'space-around',
    padding:32
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: 'rgb(27,67,136)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 32,
  },
  title: {
    paddingBottom: 50,
    color: 'white',
  },
  input: {
    marginVertical: 8,
    backgroundColor: 'rgb(201,202,206)',
  },
  loginButton: {
    marginTop:8,
    marginBottom: 50,
    backgroundColor: 'white',
    color: 'black',
    borderWidth: 4,
    borderColor: 'black',
  },
  tinyLogo: {
    resizeMode: 'stretch',
    width: '75%',
    height: '15%',
    maxHeight:'25%',
    marginBottom: 15,
  },
  versionText: {
    fontStyle: 'italic',
    textTransform: 'uppercase',
    fontWeight: '200',
    color: '#FFF',
    textAlign: 'right',
    justifyContent: 'flex-end',
    margin:32,

  }
});
