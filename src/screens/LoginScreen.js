import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Image, Alert, Text, KeyboardAvoidingView, Keyboard} from 'react-native';
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
    <KeyboardAvoidingView style={{flex:1,backgroundColor: 'rgb(27,67,136)'}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
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
                  //setError(e.message);
                  Alert.alert("Uy, algo salio mal.",
                    "Verifica tus datos y tu conexión a internet",
                    [{ text: 'Aceptar' }])
                  setLoading(false);
                }
              }}
            />
            <Text>
              Version:{AppVersion}
            </Text>
            
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <Loading loading={loading} />
    </KeyboardAvoidingView>
    
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 120,
    alignItems: 'center',
    backgroundColor: 'rgb(27,67,136)',
    // backgroundColor: '#0F212E',
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
    marginVertical: 20,
    backgroundColor: 'white',
    color: 'black',
    borderWidth: 4,
    borderColor: 'black',
  },
  tinyLogo: {
    resizeMode: 'stretch',
    width: '75%',
    height: '15%',
    minHeight: '15%',
    minWidth: '30%',
    marginBottom: '15%',
  },
});
