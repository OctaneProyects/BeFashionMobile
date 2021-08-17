import React from 'react'
import { StyleSheet, View } from 'react-native'
import { FilledButton } from '../components/Button'
import { Error } from '../components/Error'
import { Heading } from '../components/Heading'
import { Input } from '../components/Input'
import { TextButton } from '../components/TextButton'
import { AuthContext } from '../context/AuthContext'
import { Loading } from '../components/Loading'
import { UserContext } from '../context/UserContext'

export function LoginScreen({ navigation }) {

  const { login } = React.useContext(AuthContext);
  const user = React.useContext(UserContext);

  const [usr, setUser] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  return (
    <View>
      <Heading style={styles.title}>LOGIN</Heading>
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
        title={'Login'}
        style={styles.loginButton}
        onPress={async () => {
          try {
            setLoading(true);
            await login(usr, pass);
          } catch (e) {
            setError(e.message);
            setLoading(false);
          }
        }}
      />
      <TextButton
        title={'Have u an account? Create one'}
        onPress={() => {
          navigation.navigate('Register');
        }}
      />
      <Loading loading={loading} />
    </View>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 120,
    alignItems: 'center',
    backgroundColor: '#0F212E',
  },
  title: {
    paddingBottom: 50,
    color: 'white'

  },
  input: {
    marginVertical: 8,
  },
  loginButton:
  {
    marginVertical: 20,
  }
})
