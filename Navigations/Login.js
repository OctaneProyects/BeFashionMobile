import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image } from 'react-native'

const Login = () => {

    const [user, setUser] = useState('')
    const [pass, setPassword] = useState('')

    return (

        <View style={styles.container}>
            <View style={styles.item}>

                <Image source={require('../Images/LogoNombre.jpg')} style={styles.img}></Image>
                <TextInput
                    style={styles.input}
                    placeholder={'Usuario'}
                    value={user}
                    onChangeText={setUser}
                />
                <TextInput
                    style={styles.input}
                    placeholder={'Contraseña '}
                    secureTextEntry={true}
                    value={pass}
                    onChangeText={setPassword}
                />
                <View style={{ width: '100%' }}>
                    <Button
                        title="Inciar sesión"
                    />
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(15,33,46)',
        padding: 40
    },
    item: {
        width: '100%',
        height: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    img: {
        width: '100%',
        height: 90,
        marginBottom: 30,
    },
    input: {
        marginVertical: 10,
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        color: 'black',

    },
    button: {
        width: '100%',
    }
})

export default Login
