import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { HeaderIconButton } from '../components/HeaderIconButton';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext'

export function LandingScreen({ navigation }) {

    const { logout } = React.useContext(AuthContext);
    const user = React.useContext(UserContext);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderIconButton
                    name={'log-out'}
                    onPress={() => {
                        logout();
                    }}
                />
            ),
        });
    }, [navigation, logout]);


    return (
        <View style={styles.container}>
            <Text>Welcome to landing</Text>
            <Text>{user.name}</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});