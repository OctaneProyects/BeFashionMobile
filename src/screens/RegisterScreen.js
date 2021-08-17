import React from 'react'
import { StyleSheet, View } from 'react-native'
import { FilledButton } from '../components/Button'
import { Error } from '../components/Error'
import { Heading } from '../components/Heading'
import { IconButton } from '../components/IconButton'
import { Input } from '../components/Input'
import { Loading } from '../components/Loading'
import { AuthContext } from '../context/AuthContext'

export function RegisterScreen({ navigation }) {

    const { register } = React.useContext(AuthContext)
    const [user, setUser] = React.useState('');
    const [pass, setPass] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    return (

        <View style={styles.container}>
            <IconButton style={styles.closeIcon} name={'log-out'} onPress={() => {
                navigation.pop();
            }}
            />

            <Heading style={styles.title}>Register</Heading>
            <Error error={error} />
            <Input
                placeholder={'Usuario'}
                style={styles.input}
                value={user}
                onChangeText={setUser}
            />
            <Input
                placeholder={'Contraseña'}
                style={styles.input}
                value={pass}
                onChangeText={setPass}
                secureTextEntry
            />
            <FilledButton
                title={'Registrarse'}
                style={styles.loginButton}
                onPress={async () => {

                    try {
                        setLoading(true);
                        await register(user, pass);
                        navigation.pop();

                    } catch (e) {

                        setError(e.message);
                        setLoading(false);

                    }
                }}
            />
            <Loading loading={loading} />
        </View>
    )

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
    },
    closeIcon: {
        position: 'absolute',
        top: 20,
        right: 32,
    }
})
